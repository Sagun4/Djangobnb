import Image from "next/image";
import apiService, { formatImageUrl } from "../services/apiService";
import Link from "next/link";
import { getUserId } from "../lib/actions";

const MyReservationsPage = async () => {
    const userId = await getUserId();

    if (!userId) {
        return (
            <main className="max-w-375 mx-auto px-6 py-12">
                <p>You need to be authenticated...</p>
            </main>
        )
    }

    const response = await apiService.get('/api/auth/myreservations/')
    const reservations = Array.isArray(response) ? response : (response.data || []);

    return (
        <main className="max-w-375 mx-auto px-6 pb-6">
            <h1 className="my-6 text-2xl">My reservations</h1>

            <div className="space-y-4">
                {reservations.map((reservation: any) => {
                    const imageSrc = formatImageUrl(reservation.property.image_url) || '/beach1.jpg';
                    return (              
                        <div key={reservation.id} className="p-5 grid grid-cols-1 md:grid-cols-4 gap-4 shadow-md border border-gray-300 rounded-xl">
                            <div className="col-span-1">
                                <div className="relative overflow-hidden aspect-square rounded-xl">
                                    <Image
                                        fill
                                        src={imageSrc}
                                        unoptimized
                                        className="hover:scale-110 object-cover transition h-full w-full"
                                        alt="Beach house"
                                    />
                                </div>
                            </div>

                            <div className="col-span-1 md:col-span-3">
                                <h2 className="mb-4 text-xl">{reservation.property.title}</h2>

                                <p className="mb-2"><strong>Check in date:</strong> {reservation.start_date}</p>
                                <p className="mb-2"><strong>Check out date:</strong> {reservation.end_date}</p>

                                <p className="mb-2"><strong>Number of nights:</strong> {reservation.number_of_nights}</p>
                                <p className="mb-2"><strong>Total price:</strong> ${reservation.total_price}</p>

                                <Link 
                                    href={`/properties/${reservation.property.id}`}
                                    className="mt-6 inline-block cursor-pointer py-4 px-6 bg-airbnb text-white rounded-xl"
                                >
                                    Go to property
                                </Link>
                            </div>
                        </div>
                    )
                })}
            </div>
        </main>
    )
}

export default MyReservationsPage;