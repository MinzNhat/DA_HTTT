import { SpecialOfferProductrOperation } from '@/api_lib/SpecialOffer_Product';
import React, { useEffect, useState } from 'react';

const SpcOfferList: React.FC = ({ productID }: { productID: string }) => {
    const [specialOffers, setSpecialOffers] = useState<string[]>([]);
    const spcOfferProduct = new SpecialOfferProductrOperation();
    // const fetchSpecialOffers = async () => {
    //     try {
    //         const offers = await getSpecialOffers();
    //         setSpecialOffers(offers);
    //     } catch (error) {
    //         console.error('Failed to fetch special offers', error);
    //     }
    // };
    // useEffect(() => {


    //     fetchSpecialOffers();
    // }, []);

    return (
        <div>

        </div>
    );
};

export default SpcOfferList;