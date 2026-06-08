import Image from "next/image";
import type { PropertyType } from "./PropertyList";
import { useRouter } from "next/navigation";
import FavoriteButton from "../FavoriteButton";
import { formatImageUrl } from "@/app/services/apiService";

interface PropertyProps {
    property: PropertyType;
    markFavorite: (is_favourited: boolean) => void;
    isLandlordView?: boolean;
}

const PropertyListItem = ({ property, markFavorite, isLandlordView }: PropertyProps) => {
    const imageSrc = formatImageUrl(property.image_url);
    const router = useRouter();
    return (
        <div className="p-4 cursor-pointer"
            onClick={() => router.push(`/properties/${property.id}`)}
        >

            <div className="relative overflow-hidden aspect-square rounded-xl bg-gray-200">
            {imageSrc ? (
                <Image
                    fill
                    src={imageSrc}
                    unoptimized
                    alt={property.title}
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="hover:scale-110 transition-transform duration-300 object-cover"
                />
            ) : null}

            {isLandlordView && property.is_booked && (
                <div className="absolute top-3 left-3 z-10 bg-emerald-500 text-white text-[10px] font-bold px-2.5 py-1 rounded-md uppercase tracking-wider shadow-md">
                    Booked
                </div>
            )}

              {markFavorite && (
                    <FavoriteButton
                        id={property.id}
                        is_favorite={property.is_favorite}
                        markFavorite={(is_favourited) => markFavorite(is_favourited)}
                    />
                )}
            </div>
            <div className="mt-2">
                <h3 className="text-lg font-semibold">{property.title}</h3>
                <p className="text-sm font-medium mt-1">${property.price_per_night}/night</p>
            </div>
        </div>
    );
};
export default PropertyListItem;