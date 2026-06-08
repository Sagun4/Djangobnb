'use client';

import Modal from "./Modal";
import { useState, useEffect } from "react";
import { useRouter } from 'next/navigation';
import useProfileModal from "@/app/hooks/useProfileModal";
import CustomButton from "../forms/CustomButton";
import apiService, { formatImageUrl } from "@/app/services/apiService";
import Image from "next/image";

const ProfileModal = () => {
    const router = useRouter();
    const profileModal = useProfileModal();
    const [name, setName] = useState('');
    const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
    const [avatarFile, setAvatarFile] = useState<File | null>(null);
    const [errors, setErrors] = useState<string[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchUserData = async () => {
            if (profileModal.isOpen) {
                try {
                    const response = await apiService.get('/api/auth/me/');
                    if (response) {
                        setName(response.name || '');
                        setAvatarUrl(response.avatar_url || null);
                    }
                } catch (e) {
                    console.log('Error fetching user profile', e);
                }
            }
        };
        fetchUserData();
    }, [profileModal.isOpen]);

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            const file = e.target.files[0];
            setAvatarFile(file);
            setAvatarUrl(URL.createObjectURL(file));
        }
    };

    const submitProfile = async () => {
        setLoading(true);
        setErrors([]);

        const formData = new FormData();
        formData.append('name', name);
        if (avatarFile) {
            formData.append('avatar', avatarFile);
        }

        try {
            const response = await apiService.post('/api/auth/me/', formData);

            if (response && response.id) {
                profileModal.onClose();
                // Hard reload to refresh user menu avatar across the site
                window.location.reload();
            } else {
                setErrors(['Failed to update profile. Please check the inputs.']);
            }
        } catch (e) {
            setErrors(['Connection error. Please try again.']);
        } finally {
            setLoading(false);
        }
    };

    const content = (
        <>
            <form 
                action={submitProfile}
                className="space-y-4"
            >
                <div className="flex flex-col space-y-2">
                    <label className="font-semibold text-gray-700">Display Name</label>
                    <input 
                        value={name} 
                        onChange={(e) => setName(e.target.value)} 
                        placeholder="Your display name" 
                        type="text" 
                        className="w-full h-13.5 px-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500" 
                        required
                    />
                </div>

                <div className="flex flex-col space-y-2">
                    <label className="font-semibold text-gray-700">Profile Picture</label>
                    
                    <div className="flex items-center space-x-4">
                        <div className="w-20 h-20 relative rounded-full overflow-hidden bg-gray-100 border">
                            {avatarUrl ? (
                                <Image
                                    fill
                                    src={formatImageUrl(avatarUrl) || '/uploads/avatars/placeholder.png'}
                                    unoptimized
                                    alt="Avatar preview"
                                    className="object-cover w-full h-full"
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">
                                    No Image
                                </div>
                            )}
                        </div>

                        <div className="py-2 px-4 bg-gray-600 text-white rounded-xl cursor-pointer hover:bg-gray-700 transition">
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleImageChange}
                                className="hidden"
                                id="avatar-input"
                            />
                            <label htmlFor="avatar-input" className="cursor-pointer text-sm font-semibold">
                                Upload Photo
                            </label>
                        </div>
                    </div>
                </div>
            
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
                    label={loading ? "Saving..." : "Save Changes"}
                    onClick={submitProfile}
                />
            </form>
        </>
    )

    return (
        <Modal
            isOpen={profileModal.isOpen}
            close={profileModal.onClose}
            label="Edit Profile"
            content={content}
        />
    )
}

export default ProfileModal;
