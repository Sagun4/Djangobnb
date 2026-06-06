import Image from "next/image";

import ContactButton from "@/app/components/ContactButton";
import PropertyList from "@/app/components/properties/PropertyList";
import apiService from "@/app/services/apiService";
import { getUserId } from "@/app/lib/actions";

const LandlordDetailPage = async ({ params }: { params: Promise<{ id: string }>}) => {
    const resolvedParams = await params;
    const landlord = await apiService.get(`/api/auth/${resolvedParams.id}`)
    const userId = await getUserId();

    return (
        <main className="max-w-375 mx-auto px-6 pb-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <aside className="col-span-1 mb-4">
                    <div className="flex flex-col items-center p-6 rounded-xl border border-gray-300 shadow-xl">
                        {landlord.avatar_url ? (
                            <div className="w-[200px] h-[200px] relative rounded-full overflow-hidden">
                                <Image
                                    src={landlord.avatar_url}
                                    fill
                                    alt="Landlord avatar"
                                    className="object-cover"
                                />
                            </div>
                        ) : (
                            <div className="w-[200px] h-[200px] rounded-full bg-gray-200 flex items-center justify-center text-gray-500 text-6xl">
                                {landlord.name?.charAt(0)?.toUpperCase() || '?'}
                            </div>
                        )}

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