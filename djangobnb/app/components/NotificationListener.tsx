'use client';

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { getAccessToken } from "@/app/lib/actions";

interface NotificationListenerProps {
    userId: string | null;
}

const NotificationListener: React.FC<NotificationListenerProps> = ({ userId }) => {
    const pathname = usePathname();

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
                                alert(`New message from ${name}:\n\n"${body}"`);
                            }
                        }
                    } catch (err) {
                        console.error("Error parsing global notification:", err);
                    }
                };

                socket.onclose = () => {
                    // Reconnect after 5 seconds if still active
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

    return null;
};

export default NotificationListener;
