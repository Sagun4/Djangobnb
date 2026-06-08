'use client';

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { getAccessToken } from "@/app/lib/actions";

interface NotificationListenerProps {
    userId: string | null;
}

interface NotificationData {
    type: 'chat' | 'booking';
    title: string;
    body: string;
    conversationId?: string;
    propertyId?: string;
}

const NotificationListener: React.FC<NotificationListenerProps> = ({ userId }) => {
    const pathname = usePathname();
    const router = useRouter();
    const [notification, setNotification] = useState<NotificationData | null>(null);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        if (!userId) return;

        let socket: WebSocket | null = null;
        let active = true;

        const connectNotificationWS = async () => {
            try {
                const token = await getAccessToken();
                if (!token || !active) return;

                const host = (process.env.NEXT_PUBLIC_API_HOST || 'http://127.0.0.1:8000').replace(/^http/, 'ws');
                const wsUrl = `${host}/ws/notifications/?token=${token}`;

                socket = new WebSocket(wsUrl);

                socket.onmessage = (event) => {
                    try {
                        const data = JSON.parse(event.data);
                        console.log("Global Notification received:", data);

                        if (data.type === 'chat_notification') {
                            const { conversation_id, body, name } = data;

                            // Only show alert if the user is NOT currently inside this specific chat room
                            if (pathname !== `/inbox/${conversation_id}/` && pathname !== `/inbox/${conversation_id}`) {
                                setNotification({
                                    type: 'chat',
                                    title: `New message from ${name}`,
                                    body: body,
                                    conversationId: conversation_id
                                });
                                setIsVisible(true);
                            }
                        } else if (data.type === 'booking_notification') {
                            const { property_id, property_title, guest_name } = data;

                            setNotification({
                                type: 'booking',
                                title: `Property Booked!`,
                                body: `${guest_name} just booked your property "${property_title}"`,
                                propertyId: property_id
                            });
                            setIsVisible(true);
                        }
                    } catch (err) {
                        console.error("Error parsing global notification:", err);
                    }
                };

                socket.onclose = () => {
                    if (active) {
                        setTimeout(connectNotificationWS, 5000);
                    }
                };

                socket.onerror = (err) => {
                    console.error("Notification WebSocket error:", err);
                };

            } catch (err) {
                console.error("Failed to connect notification WebSocket:", err);
            }
        };

        connectNotificationWS();

        return () => {
            active = false;
            if (socket) {
                socket.close();
            }
        };
    }, [userId, pathname]);

    useEffect(() => {
        if (isVisible) {
            const timer = setTimeout(() => {
                setIsVisible(false);
            }, 5000); // auto dismiss after 5s like booking banner
            return () => clearTimeout(timer);
        }
    }, [isVisible]);

    const dismiss = () => {
        setIsVisible(false);
    };

    if (!isVisible || !notification) return null;

    if (notification.type === 'booking') {
        return (
            <div 
                onClick={() => {
                    setIsVisible(false);
                    router.push('/myproperties/');
                }}
                className="mb-6 p-4 bg-emerald-500 text-white rounded-xl flex items-center justify-between shadow-md transition-all duration-300 animate-in fade-in slide-in-from-top-4 cursor-pointer hover:bg-emerald-600"
            >
                <div className="flex items-center space-x-3">
                    <svg className="w-6 h-6 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span className="font-semibold">{notification.body}</span>
                </div>
                <button 
                    onClick={(e) => {
                        e.stopPropagation(); // Avoid navigating when dismiss is clicked
                        dismiss();
                    }} 
                    className="hover:bg-emerald-600 p-1.5 rounded-lg transition-colors cursor-pointer shrink-0"
                    aria-label="Dismiss message"
                >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
            </div>
        );
    }

    return (
        <div 
            onClick={() => {
                setIsVisible(false);
                if (notification.conversationId) {
                    router.push(`/inbox/${notification.conversationId}/`);
                }
            }}
            className="fixed top-32 right-6 z-50 max-w-sm w-full bg-emerald-500 text-white p-4 rounded-xl flex items-start justify-between shadow-xl transition-all duration-300 animate-in fade-in slide-in-from-top-4 cursor-pointer hover:bg-emerald-600"
        >
            <div className="flex items-start space-x-3 pr-2">
                <svg className="w-6 h-6 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
                <div className="flex flex-col">
                    <span className="font-bold text-sm">{notification.title}</span>
                    <span className="text-xs opacity-90 line-clamp-2 mt-1">{notification.body}</span>
                </div>
            </div>
            <button 
                onClick={(e) => {
                    e.stopPropagation(); // Avoid navigating when dismiss is clicked
                    dismiss();
                }} 
                className="hover:bg-emerald-700 p-1 rounded-lg transition-colors cursor-pointer shrink-0"
                aria-label="Dismiss message"
            >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
            </button>
        </div>
    );
};

export default NotificationListener;
