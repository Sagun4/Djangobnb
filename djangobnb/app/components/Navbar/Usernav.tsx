'use client';
import {useState} from "react";
import MenuLink from "./Menulink";
import LogoutButton from "../LogoutButton";
import useLoginModal from "@/app/hooks/useLoginModal";
import useSignupModal from "@/app/hooks/useSignupModal";
import { useRouter } from "next/navigation";

interface UserNavProps {
    userId?: string | null;
}

const UserNav: React.FC<UserNavProps> = ({ userId }) => {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const loginModal = useLoginModal();
  const signupModal = useSignupModal();
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
      <span className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-200 text-gray-500">
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
            d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z"
          />
        </svg>
      </span>
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
          <MenuLink label="My properties"  onClick={() => { setIsOpen(false); router.push('/myproperties'); }} />
          <MenuLink label="My reservations"  onClick={() => { setIsOpen(false); router.push('/myreservations'); }} />
          <LogoutButton />
          </>
        )}
      </div>
    )}
    </div>
  );
}

export default UserNav;