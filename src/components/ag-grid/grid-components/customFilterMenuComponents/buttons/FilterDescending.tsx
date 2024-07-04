interface FilterDescendingProps {
  filterActive: string;
  hover: string;
  colId: string;
  setHover: (hover: string) => void;
  onSortRequested: (sort: "desc" | "asc" | undefined, colId: string) => void;
}

const FilterDescending = ({
  filterActive,
  hover,
  colId,
  setHover,
  onSortRequested,
}: FilterDescendingProps) => {
  return (
    <button
      className="icon-container"
      onMouseEnter={() => setHover("desc")}
      onMouseLeave={() => setHover("")}
      onClick={() => onSortRequested("desc", colId)}
      onTouchEnd={() => onSortRequested("desc", colId)}
    >
      <i
        className={`icon ag-theme-alpine ${
          filterActive !== "desc" && hover !== "desc"
            ? "ag-icon-desc"
            : "ag-icon-desc-active"
        }`}
      ></i>
      <span style={{ fontSize: "12px" }}>Z-A/9-1</span>
    </button>
  );
};

export default FilterDescending;
