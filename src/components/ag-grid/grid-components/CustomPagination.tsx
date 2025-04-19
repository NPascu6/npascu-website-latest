import React, {useCallback} from "react";
import ArrowLeft from "./ArrowLeft";
import ArrowRight from "./ArrowRight";
import {useSelector} from "react-redux";
import {RootState} from "../../../store/store";

export function setLastButtonDisabled(disabled: boolean) {
    (document.querySelector("#btLast") as any).disabled = disabled;
}

interface CustomPaginationProps {
    divRef: any;
    pageSize: number;
    currentPage: number;
    totalPages: number;
    lastPageFound: boolean;
    setPaginationPageSize: (pageSize: number) => void;
}

const CustomPagination = (props: CustomPaginationProps) => {
    const isDarkTheme = useSelector((state: RootState) => state.app.isDarkTheme);
    const onBtFirst = useCallback(() => {
        props?.divRef?.current?.api?.paginationGoToFirstPage();
    }, [props]);

    const onBtLast = useCallback(() => {
        props?.divRef?.current?.api?.paginationGoToLastPage();
    }, [props.divRef]);

    const onBtNext = useCallback(() => {
        props?.divRef?.current?.api?.paginationGoToNextPage();
    }, [props.divRef]);

    const onBtPrevious = useCallback(() => {
        props?.divRef?.current?.api?.paginationGoToPreviousPage();
    }, [props.divRef]);

    const handleChange = (event: any) => {
        props.setPaginationPageSize(event.target.value as number);
    };
    const borderColor = "rgba(228, 219, 233, 0.25)";

    return (
        <div
            data-testid="custom-pagination"
            style={{justifyContent: "space-evenly", alignItems: "center"}}
            className="flex flex-row items-center justify-center"
        >
            <div className="flex flex-row items-center">
                <span>Entries per page:</span>
                <select
                    id="page-size"
                    value={props.pageSize}
                    onChange={handleChange}
                    style={{
                        border: `1px solid ${borderColor}`,
                        borderRadius: "4px",
                        padding: "0.1em",
                        marginTop: "0.5em",
                    }}
                >
                    {[5, 10, 20, 50].map((pageSize) => (
                        <option key={pageSize} value={pageSize}>
                            {pageSize}
                        </option>
                    ))}
                </select>
            </div>
            <div
                className="flex flex-row"
                style={{
                    color: isDarkTheme ? "white" : "black",
                    marginTop: "8px",
                    justifyItems: "center",
                    alignItems: "center",
                }}
            >
                <div>
                    <button onClick={onBtFirst} className="flex flex-row">
                        <ArrowLeft style={{height: "12px"}}/>
                        <ArrowLeft style={{height: "12px", marginLeft: "-0.5em"}}/>
                    </button>
                </div>
                <div>
                    <button onClick={onBtPrevious}>
                        <ArrowLeft style={{height: "12px", marginRight: "0.5em"}}/>
                    </button>
                </div>
                <div>
          <span>
            {props?.currentPage} - {props?.totalPages} of {props?.totalPages}
          </span>
                </div>
                <div>
          <span onClick={onBtNext}>
            <ArrowRight style={{height: "12px", marginLeft: "0.5em"}}/>
          </span>
                </div>
                <div>
                    <button onClick={onBtLast} className="flex flex-row">
                        <ArrowRight style={{height: "12px"}}/>
                        <ArrowRight style={{height: "12px", marginLeft: "-0.5em"}}/>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CustomPagination;
