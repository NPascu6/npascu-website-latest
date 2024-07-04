import React, { useEffect, useImperativeHandle, useState } from "react";
import { IDoesFilterPassParams, IFilterParams } from "ag-grid-community";
import { dateTimeValueFormatter } from "./helpers";
import { checkIsDate } from "./customFilterMenuComponents/util";
import FilterAscending from "./customFilterMenuComponents/buttons/FilterAscending";
import FilterDescending from "./customFilterMenuComponents/buttons/FilterDescending";

const CustomFilterMenu = React.forwardRef((props: IFilterParams, ref: any) => {
  const [filterText, setFilterText] = useState<string | undefined>(undefined);
  const [filtered, setFiltered] = useState<any[]>(["All"]);
  const [colId, setColId] = useState<string>("");
  const [filterActive, setFilterActive] = useState<string>("All");
  const [hover, setHover] = useState<string>("");
  const [filterValues, setFilterValues] = useState<string[]>(["All"]);
  const [localItems, setLocalItems] = useState<any[]>([]);

  // expose AG Grid Filter Lifecycle callbacks
  useImperativeHandle(ref, () => ({
    doesFilterPass(params: IDoesFilterPassParams) {
      const { api, colDef, column, context } = props;
      const { node } = params;

      // make sure each word passes separately, ie search for firstname, lastname
      let passed = true;
      if (!filterText) {
        return passed;
      }

      filterText
        .toLowerCase()
        .split(" ")
        .forEach((filterWord) => {
          const value = props.valueGetter({
            api,
            colDef,
            column,
            context,
            data: node.data,
            getValue: (field) => node.data[field],
            node,
          });

          if (value.toString().toLowerCase().indexOf(filterWord) < 0) {
            passed = false;
          }
        });

      return passed;
    },

    isFilterActive() {
      return filterText != null && filterText !== "";
    },

    getModel() {
      if (!this.isFilterActive()) {
        return null;
      } else {
        return { value: filterText };
      }
    },

    setModel(model: any) {
      setFilterText(model == null ? null : model.value);
    },
  }));

  const handleFilterChange = (evt: any, checked: boolean) => {
    props.filterChangedCallback();

    if (!filterValues.includes("All") && evt.currentTarget.value === "All") {
      setFilterValues(["All"]);
      setFiltered(["All"]);
      props.api.setFilterModel(null);
    } else {
      const newFilterValues = checked
        ? [...filterValues, evt.currentTarget.value]
        : filterValues.filter(
            (filterValue) => filterValue !== evt.currentTarget.value
          );
      setFilterValues(
        newFilterValues.filter((filterValue) => filterValue !== "All")
      );
      setFiltered(
        newFilterValues.filter((filterValue) => filterValue !== "All")
      );
      applyQuickFilter(newFilterValues);
    }
  };

  const applyQuickFilter = (filterValues: string[]) => {
    const quickFilterText = filterValues.includes("All")
      ? ""
      : filterValues.join(" ");
    props.api.setFilterModel({
      [colId]: {
        filterType: "text",
        type: "contains",
        filter: quickFilterText,
      },
    });
  };

  const onSortRequested = (
    order: "desc" | "asc" | undefined,
    newColId: string
  ) => {
    props.api.applyColumnState({
      state: [{ colId: newColId, sort: order }],
      applyOrder: true,
    });
    setFilterActive(order ?? "");
  };

  const onChange = (event: any) => {
    setFilterText(event.target.value);
  };

  const handleClearFilter = () => {
    props.api.applyColumnState({
      state: [{ colId: colId, sort: undefined }],
      applyOrder: true,
    });
    setFiltered([]);
    setFilterValues([]);
    setFilterActive("");
    setFilterText("");
    setHover("");
    props.api.setFilterModel(null);
    props.api.forEachNode(function (node) {
      node.setSelected(false);
    });
  };

  useEffect(() => {
    if (filterValues?.length === 0 && localItems?.length > 0) {
      props.api.setFilterModel(null);
    }
  }, [filterValues, localItems, props.api]);

  useEffect(() => {
    if (filterText) {
      setFiltered([filterText]);
      applyQuickFilter([filterText]);
    } else {
      setFiltered([]);
      props.api.setFilterModel(null);
    }
  }, [filterText, props.api]);

  useEffect(() => {
    if (props.colDef?.field) {
      setColId(props.colDef?.field);
    }
  }, [props.colDef.field]);

  useEffect(() => {
    const tempItems: Array<any> = [];
    if (colId) {
      props.api.forEachNode(function (node) {
        const tempItem = { ...node.data };
        tempItems.push(tempItem);
      });
      setLocalItems(tempItems);
    }
  }, [props.api, colId]);

  const key: string | undefined = props?.colDef?.field;

  return (
    <div data-testid={"custom-ag-filter-menu"}>
      <div>
        <FilterAscending
          filterActive={filterActive}
          hover={hover}
          colId={colId}
          setHover={setHover}
          onSortRequested={onSortRequested}
        />
        <FilterDescending
          filterActive={filterActive}
          hover={hover}
          colId={colId}
          setHover={setHover}
          onSortRequested={onSortRequested}
        />
      </div>
      <div>
        <div>
          <input
            value={filterText ?? ""}
            onChange={onChange}
            placeholder="Search a value..."
          />
        </div>
      </div>
      <div>
        <div>
          <div>
            <input
              type="checkbox"
              checked={filterValues.includes("All")}
              value={"All"}
              onChange={(e) => handleFilterChange(e, e.target.checked)}
            />
            {"All"}
          </div>
          {props?.colDef?.field !== undefined &&
            localItems
              ?.filter(
                (obj, index) =>
                  key &&
                  localItems.findIndex((item) => item[key] === obj[key]) ===
                    index
              )
              .map((item: any, index) => (
                <div key={index}>
                  <input
                    type="checkbox"
                    checked={filterValues.includes(item[colId])}
                    value={item[colId]}
                    onChange={(e) => handleFilterChange(e, e.target.checked)}
                  />
                  {checkIsDate(item[colId])
                    ? dateTimeValueFormatter({ value: item[colId] })
                    : item[colId]}
                </div>
              ))}
        </div>
      </div>
      <div>
        <button
          id="filter-menu-button"
          disabled={!filterActive && filtered?.length === 0}
          onClick={handleClearFilter}
        >
          Clear Filter
        </button>
      </div>
    </div>
  );
});

export default CustomFilterMenu;
