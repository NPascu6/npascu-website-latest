interface FilterAscendingProps {
  filterActive: string;
  hover: string;
  colId: string;
  setHover: (hover: string) => void;
  onSortRequested: (sort: "desc" | "asc" | undefined, colId: string) => void;
}

const FilterAscending = ({
  filterActive,
  hover,
  colId,
  setHover,
  onSortRequested,
}: FilterAscendingProps) => {
  return (
    <button
      onMouseEnter={() => setHover("asc")}
      onMouseLeave={() => setHover("")}
      className="icon-container"
      onClick={() => onSortRequested("asc", colId)}
      onTouchEnd={() => onSortRequested("asc", colId)}
    >
      <i
        className={`icon ag-theme-alpine ${
          filterActive !== "asc" && hover !== "asc"
            ? "ag-icon-asc"
            : "ag-icon-asc-active"
        }`}
      ></i>
      <span style={{ fontSize: "12px" }}>A-Z/1-9</span>
    </button>
  );
};

export default FilterAscending;
