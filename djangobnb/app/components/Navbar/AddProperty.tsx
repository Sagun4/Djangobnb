'use client';
import useAddPropertyModal from "@/app/hooks/usePropertyModal";
import useLoginModal from "@/app/hooks/useLoginModal";


interface AddPropertyProps {
userId ?: string| null;

}

const AddPropertyButton: React.FC<AddPropertyProps> = ({ userId }) => {
    const loginModal = useLoginModal();
    const addPropertyModal = useAddPropertyModal();
    const airbnbYourHome = () => {
        if (!userId) {
            return loginModal.onOpen();
        }else {
            return addPropertyModal.onOpen();
        }
        
    };
    return (
    <>
    <div 
     onClick={airbnbYourHome}
     className="p-3 text-sm font-semibold rounded-full hover:bg-gray-100 cursor-pointer transition duration-300">
        <p>List your property</p>

    </div>
    </>
    );
}
export default AddPropertyButton;