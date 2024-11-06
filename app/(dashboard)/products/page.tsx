
import { Metadata } from "next";
import ProductsMain from "./components/MainPage";

export const metadata: Metadata = {
    title: 'HCMUT | Product',
}

const ProductPage = () => {
    return (
        <div className="w-full h-full">
            <ProductsMain />
        </div>
    );
};

export default ProductPage;