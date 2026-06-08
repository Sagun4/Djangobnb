'use client';

import { useRouter } from "next/navigation";
import { ConversationType } from "@/app/inbox/page";
import Image from "next/image";
import { formatImageUrl } from "@/app/services/apiService";

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
            onClick={() => router.push(`/inbox/${conversation.id}`)}
            className="px-6 py-4 cursor-pointer border border-gray-300 rounded-xl flex items-center space-x-4 hover:shadow-md transition"
        >
            <div className="w-12 h-12 relative rounded-full overflow-hidden bg-gray-200 shrink-0">
                <Image
                    fill
                    src={formatImageUrl(otherUser?.avatar_url) || '/uploads/avatars/placeholder.png'}
                    alt={otherUser?.name || 'User avatar'}
                    className="object-cover"
                    unoptimized
                />
            </div>
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