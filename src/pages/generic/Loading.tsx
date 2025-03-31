const Loading = () => {
    return (
        <div
            style={{height: "calc(100vh - 6em)"}}
            className="flex justify-center items-center"
            role="status"
            aria-label="Loading..."
        >
            <div className="w-12 h-12 border-4 border-green-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
    );
};

export default Loading;