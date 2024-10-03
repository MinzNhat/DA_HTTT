import LoadingUI from "@/components/loading";

export default function CustomLoadingElement() {
    return (
        <div className="w-full h-full min-h-96 flex justify-center place-items-center">
            <LoadingUI />
        </div>
    );
}