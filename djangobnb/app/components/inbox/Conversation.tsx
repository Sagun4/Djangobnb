'use client';

import { useRouter } from "next/navigation";
import { ConversationType } from "@/app/inbox/page";
import Image from "next/image";
import { formatImageUrl } from "@/app/services/apiService";

import UserAvatar from "../UserAvatar";

interface ConversationProps {
    conversation: ConversationType;
    userId: string;
}

const Conversation: React.FC<ConversationProps> = ({
    conversation,
    userId
}) => {
    const router = useRouter();
    const otherUser = conversation.users.find((user) => user.id != userId)

    return (
        <div 
            onClick={() => router.push(`/inbox/${conversation.id}/`)}
            className="px-6 py-4 cursor-pointer border border-gray-300 rounded-xl flex items-center space-x-4 hover:shadow-md transition"
        >
            <UserAvatar
                avatarUrl={otherUser?.avatar_url}
                name={otherUser?.name}
                sizeClass="w-12 h-12"
                textClass="text-base"
            />
            <div className="flex-1">
                <p className="font-bold text-lg text-gray-800">{otherUser?.name}</p>
                <p className="text-airbnb hover:text-airbnb-hover text-sm font-semibold mt-1 transition-colors">
                    Go to conversation
                </p>
            </div>
        </div>
    )
}

export default Conversation;