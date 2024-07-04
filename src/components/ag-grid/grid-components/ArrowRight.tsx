const ArrowRight = ({ style }) => {
  const { height, width, ...rest } = style || {
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
        d="M5.5 2.5L11.5 8L5.5 13.5"
        stroke="gray"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export default ArrowRight;
