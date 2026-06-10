import Image from "next/image";

import ContactButton from "@/app/components/ContactButton";
import PropertyList from "@/app/components/properties/PropertyList";
import apiService, { formatImageUrl } from "@/app/services/apiService";
import { getUserId } from "@/app/lib/actions";
import UserAvatar from "@/app/components/UserAvatar";

const LandlordDetailPage = async ({ params }: { params: Promise<{ id: string }>}) => {
    const resolvedParams = await params;
    const landlord = await apiService.get(`/api/auth/${resolvedParams.id}`)
    const userId = await getUserId();

    return (
        <main className="max-w-[1500px] mx-auto px-6 pb-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <aside className="col-span-1 mb-4">
                    <div className="flex flex-col items-center p-6 rounded-xl border border-gray-300 shadow-xl">
                        <UserAvatar
                            avatarUrl={landlord.avatar_url}
                            name={landlord.name}
                            sizeClass="w-[200px] h-[200px]"
                            textClass="text-6xl"
                        />

                        <h1 className="mt-6 text-2xl">{landlord.name}</h1>

                        {userId != resolvedParams.id && (
                            <ContactButton
                            userId={userId}
                            landlordId={resolvedParams.id}
                            />
                        )}
                    </div>
                </aside>

                <div className="col-span-1 md:col-span-3 pl-0 md:pl-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <PropertyList 
                            landlord_id={resolvedParams.id}
                        />
                    </div>
                </div>
            </div>
        </main>
    )
}

export default LandlordDetailPage;