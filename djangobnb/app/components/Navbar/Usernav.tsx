'use client';
import { useState, useEffect } from "react";
import MenuLink from "./Menulink";
import LogoutButton from "../LogoutButton";
import useLoginModal from "@/app/hooks/useLoginModal";
import useSignupModal from "@/app/hooks/useSignupModal";
import useProfileModal from "@/app/hooks/useProfileModal";
import { useRouter } from "next/navigation";
import Image from "next/image";
import apiService, { formatImageUrl } from "@/app/services/apiService";

import UserAvatar from "../UserAvatar";

interface UserNavProps {
    userId?: string | null;
}

const UserNav: React.FC<UserNavProps> = ({ userId }) => {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [userName, setUserName] = useState<string>('');
  const loginModal = useLoginModal();
  const signupModal = useSignupModal();
  const profileModal = useProfileModal();

  useEffect(() => {
    const fetchUserAvatar = async () => {
      if (userId) {
        try {
          const response = await apiService.get('/api/auth/me/');
          if (response) {
            setAvatarUrl(response.avatar_url || null);
            setUserName(response.name || '');
          }
        } catch (e) {
          console.log('Error fetching user avatar in nav', e);
        }
      }
    };
    fetchUserAvatar();
  }, [userId]);
  return (
    <div className="relative">
    <button
      onClick={() => setIsOpen(!isOpen)}
      type="button"
      aria-label="Open user menu"
      className="cursor-pointer flex items-center gap-2 rounded-full border px-3 py-2 text-gray-600 hover:shadow-md transition duration-300"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke="currentColor"
        className="h-5 w-5"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
        />
      </svg>
      <UserAvatar
        avatarUrl={avatarUrl}
        name={userName}
        sizeClass="w-8 h-8"
        textClass="text-sm"
      />
    </button>
    {isOpen && (
      <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-xl shadow-md py-2 border flex flex-col cursor-pointer">
        {!userId ? (
          <>
            <MenuLink label="Login" onClick={() => { setIsOpen(false); loginModal.onOpen(); }} />
            <MenuLink label="Sign Up" onClick={() => { setIsOpen(false); signupModal.onOpen(); }} />
          </>
        ) : (
          <>
          <MenuLink label="My properties"  onClick={() => { setIsOpen(false); router.push('/myproperties/'); }} />
          <MenuLink label="My reservations"  onClick={() => { setIsOpen(false); router.push('/myreservations/'); }} />
          <MenuLink label="My favorites"  onClick={() => { setIsOpen(false); router.push('/myfavourites/'); }} />
          <MenuLink label ="Inbox" onClick={() => { setIsOpen(false); router.push('/inbox/'); }} />
          <MenuLink label="Edit profile"  onClick={() => { setIsOpen(false); profileModal.onOpen(); }} />
          <LogoutButton />
          </>
        )}
      </div>
    )}
    </div>
  );
}

export default UserNav;