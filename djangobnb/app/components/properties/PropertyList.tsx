"use client";
import { useEffect, useState } from "react";
import apiService from "../../services/apiService";
import PropertyListItem from "./PropertyListItem";
export type PropertyType = {
    id: string;
    title: string;
    price_per_night: number;
    image_url: string | null;
    is_favourited: boolean;

}

interface PropertyListProps {
    landlord_id?: string;
    favorites?: boolean| null;
}


const PropertyList : React.FC<PropertyListProps> = ({ landlord_id, favorites }) => {
    const [properties, setProperties] = useState<PropertyType[]>([]);
    
    const markFavorite = (id: string, is_favourited: boolean) => {
        const tmpProperties = properties.map((property: PropertyType) => {
            if (property.id == id) {
                property.is_favourited = is_favourited

                if (is_favourited) {
                    console.log('added to list of favorited propreties')
                } else {
                    console.log('removed from list')
                }
            }

            return property;
        })

        setProperties(tmpProperties);
    }

    const getProperties = async () => {
        let url = '/api/properties/';
        if (landlord_id) {
            url += `?landlord_id=${landlord_id}`;
        }else if (favorites) {
            url += `?favorites=true`;
        }
      const  tmpProperties = await apiService.get(url);
        setProperties(tmpProperties.data.map((property: PropertyType) => {
            
            if (tmpProperties.favourites.includes(property.id)) {
                property.is_favourited = true;
            } else {
                property.is_favourited = false;
            }
            return property;
        }));

    };
   
    useEffect(() => {
        getProperties();

},[]);

    return (
        <>
        {properties.map((property) => (
            <PropertyListItem
            key={property.id}
            property={property}
            markFavorite={(is_favourited: boolean) => markFavorite(property.id, is_favourited)}
            />
        ))}
        </>
    )
}
export default PropertyList;