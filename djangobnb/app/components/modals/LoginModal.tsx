'use client';

import Modal from "./Modal";

import { useState } from "react";
import { useRouter } from 'next/navigation';
import useLoginModal from "@/app/hooks/useLoginModal";
import CustomButton from "../forms/CustomButton";
import { handleLogin } from "@/app/lib/actions";
import apiService from "@/app/services/apiService";

const LoginModal = () => {
    const router = useRouter()
    const loginModal = useLoginModal()
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errors, setErrors] = useState<string[]>([]);

    const submitLogin = async () => {
        const formData = {
            email: email,
            password: password
        }

        try {
            const response = await apiService.postWithoutToken('/api/auth/login/', JSON.stringify(formData))

            if (response.access) {
                await handleLogin(response.user.pk, response.access, response.refresh);

                loginModal.onClose();

                window.location.href = '/';
            } else {
                const nonErrorKeys = ['key', 'access', 'refresh', 'user'];
                const tempErrors: string[] = Object.entries(response || {})
                    .filter(([key]) => !nonErrorKeys.includes(key))
                    .map(([, error]: [string, any]) => {
                        if (Array.isArray(error)) {
                            return error.join(' ');
                        }
                        return String(error);
                    });

                if (tempErrors.length > 0) {
                    setErrors(tempErrors);
                } else {
                    setErrors(['Login failed. Please try again.']);
                }
            }
        } catch (e) {
            setErrors(['Connection error. Please try again.']);
        }
    }

    const content = (
        <>
            <form 
                action={submitLogin}
                className="space-y-4"
            >
                <input onChange={(e) => setEmail(e.target.value)} placeholder="Your e-mail address" type="email" className="w-full h-13.5 px-4 border border-gray-300 rounded-xl" />

                <input onChange={(e) => setPassword(e.target.value)} placeholder="Your password" type="password" className="w-full h-13.5 px-4 border border-gray-300 rounded-xl" />
            
                {errors.map((error, index) => {
                    return (
                        <div 
                            key={`error_${index}`}
                            className="p-5 bg-airbnb text-white rounded-xl opacity-80"
                        >
                            {error}
                        </div>
                    )
                })}

                <CustomButton
                    label="Submit"
                    onClick={submitLogin}
                />
            </form>
        </>
    )

    return (
        <Modal
            isOpen={loginModal.isOpen}
            close={loginModal.onClose}
            label="Log in"
            content={content}
        />
    )
}

export default LoginModal;