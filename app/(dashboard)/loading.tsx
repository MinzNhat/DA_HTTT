'use client'
import Card from "@/components/card";
import LoadingUI from "@/components/loading";
export default function CustomLoadingElement() {
    return (
        <div className="w-full h-full flex justify-center place-items-center">
            <LoadingUI />
        </div>

    );
}