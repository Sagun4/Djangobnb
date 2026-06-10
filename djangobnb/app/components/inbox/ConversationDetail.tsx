'use client';

import { useEffect, useState, useRef } from "react";
import CustomButton from "../forms/CustomButton";
import { ConversationType } from "@/app/inbox/page";
import useWebSocket, {ReadyState} from "react-use-websocket";
import { MessageType } from "@/app/inbox/[id]/page";
import { UserType } from "@/app/inbox/page";
import Image from "next/image";
import { formatImageUrl } from "@/app/services/apiService";
import UserAvatar from "../UserAvatar";

interface ConversationDetailProps {
    token: string;
    userId: string;
    conversation: ConversationType;
    messages: MessageType[];
}

const ConversationDetail: React.FC<ConversationDetailProps> = ({
    userId,
    token,
    messages,
    conversation
}) => {
    const messagesDiv = useRef<HTMLDivElement>(null);
    const [newMessage, setNewMessage] = useState('');
    const myUser = conversation.users?.find((user) => user.id == userId)
    const otherUser = conversation.users?.find((user) => user.id != userId)
    const [realtimeMessages, setRealtimeMessages] = useState<MessageType[]>([]);

    const { sendJsonMessage, lastJsonMessage, readyState } = useWebSocket(`${(process.env.NEXT_PUBLIC_API_HOST || 'http://127.0.0.1:8000').replace(/^http/, 'ws')}/ws/${conversation.id}/?token=${token}`, {
        share: false,
        shouldReconnect: () => true,
      },
    )

    useEffect(() => {
        console.log("Connection state changed", readyState);
    }, [readyState]);

    useEffect(() => {
        if (lastJsonMessage && typeof lastJsonMessage === 'object' && 'name' in lastJsonMessage && 'body' in lastJsonMessage) {
            const sent_by_id = (lastJsonMessage as any).sent_by_id as string;
            const sent_by_name = (lastJsonMessage as any).sent_by_name as string;
            const sent_by_avatar_url = (lastJsonMessage as any).sent_by_avatar_url as string | null;

            const isMyMessage = sent_by_id === userId;
            const sender: UserType = {
                id: sent_by_id || (isMyMessage ? userId : (otherUser?.id || '')),
                name: sent_by_name || (isMyMessage ? (myUser?.name || '') : (otherUser?.name || '')),
                avatar_url: sent_by_avatar_url || (isMyMessage ? (myUser?.avatar_url || '') : (otherUser?.avatar_url || ''))
            };

            const message: MessageType = {
                id: '',
                name: sender.name,
                body: lastJsonMessage.body as string,
                sent_to: isMyMessage ? (otherUser as UserType) : (myUser as UserType),
                created_by: sender,
                conversationId: conversation.id
            }

            setRealtimeMessages((realtimeMessages) => [...realtimeMessages, message]);
        }
    }, [lastJsonMessage]);

    useEffect(() => {
        const timer = setTimeout(() => {
            scrollToBottom();
        }, 50);
        return () => clearTimeout(timer);
    }, [messages, realtimeMessages]);

    const sendMessage = async () => {
        console.log('sendMessage'),

        sendJsonMessage({
            event: 'chat_message',
            data: {
                body: newMessage,
                name: myUser?.name,
                sent_to_id: otherUser?.id,
                conversation_id: conversation.id
            }
        });

        setNewMessage('');
    }

    const scrollToBottom = () => {
        if (messagesDiv.current) {
            messagesDiv.current.scrollTop = messagesDiv.current.scrollHeight;
        }
    }

    const renderMessage = (message: MessageType, key: string) => {
        const isMyMessage = message.created_by.id === userId;
        return (
            <div
                key={key}
                className={`flex items-end space-x-2 w-[80%] ${isMyMessage ? 'ml-[20%] justify-end space-x-reverse' : ''}`}
            >
                {!isMyMessage && (
                    <UserAvatar
                        avatarUrl={message.created_by.avatar_url}
                        name={message.created_by.name}
                        sizeClass="w-8 h-8"
                        textClass="text-xs"
                    />
                )}
                <div className={`py-2.5 px-4 rounded-2xl text-gray-800 ${isMyMessage ? 'bg-blue-200 rounded-br-none' : 'bg-gray-200 rounded-bl-none'}`}>
                    <p className="font-bold text-xs text-gray-500 mb-1">{message.created_by.name}</p>
                    <p>{message.body}</p>
                </div>
            </div>
        )
    }

    return (
        <>
            <div 
                ref={messagesDiv}
                className="h-[500px] overflow-y-auto pr-2 flex flex-col space-y-4"
            >
                {messages.map((message, index) => renderMessage(message, `hist_${index}`))}
                {realtimeMessages.map((message, index) => renderMessage(message, `rt_${index}`))}
            </div>

            <div className="mt-4 py-4 px-6 flex border border-gray-300 space-x-4 rounded-xl">
                <input
                    type="text"
                    placeholder="Type your message..."
                    className="w-full p-2 bg-gray-200 rounded-xl"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                />

                <CustomButton 
                    label='Send'
                    onClick={sendMessage}
                    className="w-25"
                />
            </div>
        </>
    )
}

export default ConversationDetail;