'use client';

import { useRouter } from "next/navigation";

import { resetAuthCookies } from '../lib/actions';

import MenuLink from "./Navbar/Menulink";

const LogoutButton: React.FC = () => {
    const router = useRouter();

    const submitLogout = async () => {
        await resetAuthCookies();

        router.refresh();
        router.push('/');
    }

    return (
        <MenuLink
            label="Log out"
            onClick={submitLogout}
        />
    )
}

export default LogoutButton;
