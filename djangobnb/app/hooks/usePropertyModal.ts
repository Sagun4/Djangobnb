import {create} from "zustand";
//asasas

interface AddPropertyModalStore {
    isOpen: boolean;
    onOpen: () => void;
    onClose: () => void;
}

const useAddPropertyModal = create<AddPropertyModalStore>((set) => ({
    isOpen: false,
    onOpen: () => set({isOpen: true}),
    onClose: () => set({isOpen: false})
}))

export default useAddPropertyModal;