'use client';

import loginModal from "@/app/hooks/useLoginModal";
import Image from "next/image";
import Modal from "./Modal";
import {useState} from "react";
import CustomButton from "../forms/CustomButton";
import useAddPropertyModal from "@/app/hooks/usePropertyModal";
import Categories from  "../addproperty/Categories";
import  SelectCountry ,{SelectCountryValue} from "../forms/SelectCountry";
import apiService from "@/app/services/apiService";
import {useRouter} from "next/navigation";

const AddPropertyModal = () => {
 const addPropertyModal = useAddPropertyModal();
 const [currentStep, setCurrentStep] = useState(1);
 const [dataTitle, setDataTitle] = useState("");
 const [errors, setErrors] = useState<string[]>([]);
 const [dataDescription, setDataDescription] = useState("");
 const [dataCategory, setDataCategory] = useState("");
const [dataPrice, setDataPrice] = useState('');
 const [dataBedrooms, setDataBedrooms] = useState('');
const [dataBathrooms, setDataBathrooms] = useState('');
const [dataGuests, setDataGuests] = useState('');
const [dataCountry, setDataCountry] = useState<SelectCountryValue>();
const [dataImage, setDataImage] = useState<File | null>(null);
const router = useRouter();

const setCategory = (category: string) => {
    setDataCategory(category);
}
const setImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
        setDataImage(e.target.files[0]);
    }
}

const submitForm = async () => {

    console.log('Submitting form with data:');
if(
    dataCategory &&
    dataTitle &&
    dataDescription &&
    dataPrice &&
    dataCountry &&
    dataImage
) {
    const formData = new FormData();
    formData.append('title', dataTitle);
    formData.append('description', dataDescription);
    formData.append('category', dataCategory);
    formData.append('price_per_night', dataPrice);
    formData.append('bedrooms', dataBedrooms);
    formData.append('bathrooms', dataBathrooms);
    formData.append('guests', dataGuests);
    formData.append('country', dataCountry.label);
    formData.append('country_code', dataCountry.value);
    formData.append('images', dataImage);

    const response = await apiService.post('/api/properties/create/', formData );

    if(response.success) {
        console.log('Property created successfully:', response.data);
        router.push('/');
        addPropertyModal.onClose();
    } else {
        console.log('Error creating property:', response);
        
        const tmpErrors: string[] = Object.entries(response).map(([key, error]: [string, any]) => {
            if (Array.isArray(error)) {
                return `${key}: ${error.join(' ')}`;
            }
            if (typeof error === 'object' && error !== null) {
                return `${key}: ${JSON.stringify(error)}`;
            }
            return String(error);
        });
        setErrors(tmpErrors);
    }
}
}
 
 const content = (
<>
{currentStep === 1 ? (
    <>
<h2 className="text-xl font-bold mb-4">Choose Category</h2>
<Categories 
    dataCategory={dataCategory} 
    setCategory={(category) => setCategory(category)} 
/>
<CustomButton
label="Next"
onClick={() => {
    setCurrentStep(2);
    // Navigate to the property listing page or open another modal for property details
}}
/>
</>
): currentStep === 2 ? (
<>

<h2 className="text-xl font-bold mb-4">Describe Your Property</h2>
 <div className='pt-3 pb-6 space-y-4'>
  
                        <div className='flex flex-col space-y-4 mb-4'>
                            <label>Title</label>
                            <input
                                type="text"
                                value={dataTitle}
                                onChange={(e) => setDataTitle(e.target.value)}
                                className='w-full p-4 border border-gray-600 rounded-xl'
                            />
                        </div>

                        <div className='flex flex-col space-y-2'>
                            <label>Description</label>
                            <textarea
                                value={dataDescription}
                                onChange={(e) => setDataDescription(e.target.value)}
                                className='w-full h-50 p-4 border border-gray-600 rounded-xl'
                            ></textarea>
                        </div>

</div>

<CustomButton className="mb-2 bg-black hover:bg-gray-800"
label="Previous"
onClick={() => {
    setCurrentStep(1);
    // Navigate to the property listing page or open another modal for property details
}}
/>

<CustomButton
label="Next"
onClick={() => {
    setCurrentStep(3);
    // Navigate to the property listing page or open another modal for property details
}}
/>

</>
) :currentStep === 3 ? (
<>
                    <h2 className='mb-6 text-2xl'>Details</h2>

                    <div className='pt-3 pb-6 space-y-4'>
                        <div className='flex flex-col space-y-2'>
                            <label>Price per night</label>
                            <input
                                type="number"
                                value={dataPrice}
                                onChange={(e) => setDataPrice(e.target.value)}
                                className='w-full p-4 border border-gray-600 rounded-xl'
                            />
                        </div>

                        <div className='flex flex-col space-y-2'>
                            <label>Bedrooms</label>
                            <input
                                type="number"
                                value={dataBedrooms}
                                onChange={(e) => setDataBedrooms(e.target.value)}
                                className='w-full p-4 border border-gray-600 rounded-xl'
                            />
                        </div>

                        <div className='flex flex-col space-y-2'>
                            <label>Bathrooms</label>
                            <input
                                type="number"
                                value={dataBathrooms}
                                onChange={(e) => setDataBathrooms(e.target.value)}
                                className='w-full p-4 border border-gray-600 rounded-xl'
                            />
                        </div>

                        <div className='flex flex-col space-y-2'>
                            <label>Maximum number of guests</label>
                            <input
                                type="number"
                                value={dataGuests}
                                onChange={(e) => setDataGuests(e.target.value)}
                                className='w-full p-4 border border-gray-600 rounded-xl'
                            />
                        </div>
                    </div>

                    <CustomButton
                        label='Previous'
                        className='mb-2 bg-black hover:bg-gray-800'
                        onClick={() => setCurrentStep(2)}
                    />

                    <CustomButton
                        label='Next'
                        onClick={() => setCurrentStep(4)}
                    />
                </>
) : currentStep === 4 ? (

     <>
                    <h2 className='mb-6 text-2xl'>Location</h2>

                    <div className='pt-3 pb-6 space-y-4'>
                        <SelectCountry 
                            value={dataCountry}
                            onChange={(value) => setDataCountry(value as SelectCountryValue)}
                        />
                    </div>

                    <CustomButton
                        label='Previous'
                        className='mb-2 bg-black hover:bg-gray-800'
                        onClick={() => setCurrentStep(3)}
                    />

                    <CustomButton
                        label='Next'
                        onClick={() => setCurrentStep(5)}
                    />
                </>
            ) : (
                <>
                    <h2 className='mb-6 text-2xl'>Image</h2>

                    <div className='pt-3 pb-6 space-y-4'>
                        <div className='py-4 px-6 bg-gray-600 text-white rounded-xl'>
                            <input
                                type="file"
                                accept='image/*'
                                onChange={setImage}
                            />
                        </div>

                        {dataImage && (
                            <div className='w-50 h-37.5 relative'>
                                <Image
                                    fill
                                    alt="Uploaded image"
                                    src={URL.createObjectURL(dataImage)}
                                    className='w-full h-full object-cover rounded-xl'
                                />
                            </div>
                        )}
                    </div>

                    {errors.map((error, index) => {
                        return (
                            <div
                                key={index}
                                className='p-5 mb-4 bg-airbnb text-white rounded-xl opacity-80'
                            >
                                {error}
                            </div>
                        )
                    })}

                    <CustomButton
                        label='Previous'
                        className='mb-2 bg-black hover:bg-gray-800'
                        onClick={() => setCurrentStep(4)}
                    />

                    <CustomButton
                        label='Submit'
                        onClick={submitForm}
                    />
                </>
            )}
        </>
    

 )

 return (
    <>
    <Modal 
        isOpen={addPropertyModal.isOpen}
        close={addPropertyModal.onClose}
        label="Add New Property"
        content={content}
    />
    </>
 )
}
export default AddPropertyModal;
