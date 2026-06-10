import React from "react";
import Image from "next/image";
import { formatImageUrl } from "@/app/services/apiService";

interface UserAvatarProps {
    avatarUrl?: string | null;
    name?: string | null;
    sizeClass?: string; // e.g. "w-8 h-8", "w-12 h-12", "w-20 h-20"
    textClass?: string; // e.g. "text-xs", "text-sm", "text-lg", "text-6xl"
}

const getAvatarColor = (name: string) => {
    const colors = [
        "bg-rose-500",
        "bg-emerald-500",
        "bg-indigo-500",
        "bg-amber-500",
        "bg-sky-500",
        "bg-violet-500",
        "bg-teal-500",
    ];
    if (!name) return colors[0];
    const charCodeSum = name.split("").reduce((sum, char) => sum + char.charCodeAt(0), 0);
    return colors[charCodeSum % colors.length];
};

const UserAvatar: React.FC<UserAvatarProps> = ({
    avatarUrl,
    name,
    sizeClass = "w-8 h-8",
    textClass = "text-xs",
}) => {
    const cleanName = name || "";
    const initial = cleanName ? cleanName.charAt(0).toUpperCase() : "?";
    const bgClass = getAvatarColor(cleanName);

    if (avatarUrl) {
        return (
            <div className={`${sizeClass} relative rounded-full overflow-hidden border bg-gray-100 shrink-0`}>
                <Image
                    fill
                    src={formatImageUrl(avatarUrl) || ""}
                    alt={cleanName || "User avatar"}
                    unoptimized
                    className="object-cover w-full h-full"
                />
            </div>
        );
    }

    return (
        <div className={`${sizeClass} flex items-center justify-center rounded-full ${bgClass} text-white font-bold ${textClass} border border-white shrink-0`}>
            {initial}
        </div>
    );
};

export default UserAvatar;
