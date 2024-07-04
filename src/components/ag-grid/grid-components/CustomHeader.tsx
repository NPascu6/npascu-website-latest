import { GridApi } from "ag-grid-community";
import React, { useEffect, useRef, useState } from "react";

const CustomHeader = (props: {
  showColumnMenu: (arg0: null) => void;
  column: {
    colDef: any;
    aggFunc: any;
    isSortAscending: () => any;
    isSortDescending: () => any;
    addEventListener: (arg0: string, arg1: () => void) => void;
  };
  setSort: (arg0: string, arg1: boolean) => void;
  api: GridApi | undefined;
  enableMenu: any;
  menuIcon: any;
  headerStyle: React.CSSProperties | undefined;
  sortAscendingIcon: any;
  sortDescendingIcon: any;
  enableSorting: any;
  showHeaderFilterIcon: any;
  filters: any;
  showCancelFilterIcon: boolean;
  displayName: any;
}) => {
  const [ascSort, setAscSort] = useState("inactive");
  const [descSort, setDescSort] = useState("inactive");
  const refButton = useRef(null);
  const [hover, setHover] = useState(false);
  let menu: any;
  let sort: any;

  const onMenuClicked = () => {
    props.showColumnMenu(refButton.current);
  };

  const onSortChanged = () => {
    setAscSort(props.column.isSortAscending() ? "active" : "inactive");
    setDescSort(props.column.isSortDescending() ? "active" : "inactive");
  };

  const onSortRequested = (
    order: string,
    event: React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>
  ) => {
    props.setSort(order, event.shiftKey);
  };

  const getClass = () => {
    if (hover) {
      return "ag-theme-alpine ag-icon-aggregation";
    }
    if (props.column.aggFunc) {
      return "ag-theme-alpine ag-icon-aggregation-active";
    }
    if (props.column.isSortAscending()) {
      return "ag-theme-alpine ag-icon-asc-active-header";
    }
    if (props.column.isSortDescending()) {
      return "ag-theme-alpine ag-icon-desc-active-header";
    }
    return "ag-theme-alpine ag-icon-aggregation";
  };

  useEffect(() => {
    props.column.addEventListener("sortChanged", onSortChanged);
    onSortChanged();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  menu = (
    <div
      ref={refButton}
      className="icon-container"
      onClick={() => onMenuClicked()}
    >
      <i className={`icon ${getClass()}`}></i>
    </div>
  );

  if (props.enableSorting) {
    sort = props?.filters &&
      props?.api &&
      (ascSort !== "inactive" ||
        descSort !== "inactive" ||
        Object.keys(props?.filters)[0]) &&
      props.showCancelFilterIcon && (
        <div
          className="icon-container"
          onClick={(event) =>
            Object.keys(props?.filters)[0] && props.api
              ? props.api.setFilterModel(null)
              : onSortRequested("inactive", event)
          }
          onTouchEnd={(event) =>
            Object.keys(props?.filters)[0] && props.api
              ? props.api.setFilterModel(null)
              : onSortRequested("inactive", event)
          }
        >
          <i className="icon ag-theme-alpine ag-icon-cancel"></i>
        </div>
      );
  }

  return (
    <div data-testid="custom-header">
      {props.filters ? (
        <div
          className="custom-header-container"
          onClick={onMenuClicked}
          onMouseEnter={() => setHover(true)}
          onMouseLeave={() => setHover(false)}
        >
          {props.showHeaderFilterIcon && (
            <div className="customHeaderLabel">{props?.displayName}</div>
          )}
          {props.showHeaderFilterIcon && (
            <div className="custom-header-container-child-container">
              {sort}
              {menu}
            </div>
          )}
        </div>
      ) : null}
    </div>
  );
};

export default CustomHeader;
