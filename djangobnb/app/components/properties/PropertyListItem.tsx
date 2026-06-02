import Image from "next/image";
import type { PropertyType } from "./PropertyList";

interface PropertyProps {
    property: PropertyType;
}

const PropertyListItem = ({ property }: PropertyProps) => {
    const imageSrc = property.image_url
        ? property.image_url.startsWith("http")
            ? property.image_url
            : `http://localhost:8000${property.image_url}`
        : null;

    return (
        <div className="p-4 cursor-pointer">
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
            </div>
            <div className="mt-2">
                <h3 className="text-lg font-semibold">{property.title}</h3>
                <p className="text-sm font-medium mt-1">${property.price_per_night}/night</p>
            </div>
        </div>
    );
};
export default PropertyListItem;