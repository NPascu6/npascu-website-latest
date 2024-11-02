const ArrowLeft = ({style}: any) => {
    const {height, width, ...rest} = style || {
        height: "16px",
        width: "16px",
    };

    return (
        <svg
            style={style}
            width={width}
            height={height}
            viewBox="0 0 16 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
        >
            <path
                d="M10.5 13.5L4.5 8L10.5 2.5"
                stroke="gray"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    );
};

export default ArrowLeft;
