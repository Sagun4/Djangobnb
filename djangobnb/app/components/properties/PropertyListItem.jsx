import Image from "next/image";

export default function Page() {
    return (
        <div className="p-4 cursor-pointer">
            <div className="relative overflow-hidden aspect-square rounded-xl bg-gray-200">
            <Image
                fill
                src="/beach1.jpg"
                alt="Beach Property"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                className="hover:scale-110 transition-transform duration-300 object-cover"
            />
            </div>
            <div className="mt-2">
                <h3 className="text-lg font-semibold">Beachfront Paradise</h3>
                <p className="text-sm text-gray-600">Miami, FL</p>
                <p className="text-sm font-medium mt-1">$250/night</p>
            </div>
        </div>
    );
}