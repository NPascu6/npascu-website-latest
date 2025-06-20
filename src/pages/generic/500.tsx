import LazyImage from "../../components/common/LazyImage";

const InternalServerError = () => {
    return (
        <div className="flex flex-col items-center justify-center h-screen">
            <h1 className="text-4xl font-bold text-red-500 mb-4">
                500 - Server Error
            </h1>
            <p className="text-lg text-gray-600">
                Oops! Something went wrong on our server. Please try again later.
            </p>
            <LazyImage
                src="/500-image.png"
                alt="500 Illustration"
                className="mt-8 max-w-xs"
                width="256"
                height="256"
            />
        </div>
    );
};

export default InternalServerError;
