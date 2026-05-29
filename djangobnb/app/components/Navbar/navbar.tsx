import Link from "next/link";
import Image from "next/image";
import SearchFilters from "./Searchfilters";
import UserNav from "./Usernav";
import AddProperty from "./AddProperty";
export default function Navbar() {
    return (
    <nav className="w-full fixed top-0 left-0 py-6 border-b bg-white z-10"> 
     <div className="max-w-375 mx-auto px-4">
        <div className="flex items-center justify-between">
            <Link href="/" >
               <Image src="/airnest.png" alt="Logo" width={100} height={100} loading="eager" className="object-contain" />
            </Link>
         <SearchFilters />
         <div className="flex items-center space-x-4">
           <AddProperty />
            <UserNav />

        </div>   

        </div>
        </div>
    </nav>
    );
}