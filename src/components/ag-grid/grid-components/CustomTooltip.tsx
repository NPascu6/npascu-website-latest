import React, {useMemo} from "react";
import {ITooltipParams} from "ag-grid-community";

const CustomTooltip = (props: ITooltipParams & { color: string }) => {
    const data = useMemo(
        () =>
            props && props.rowIndex && props.api
                ? props.api.getDisplayedRowAtIndex(props?.rowIndex)
                    ? props.api.getDisplayedRowAtIndex(props?.rowIndex)?.data
                    : null
                : null,
        [props]
    );

    return (
        <div className="tooltip" data-testid="custom-tooltip">
            {data &&
                Object.keys(data).map((key) => {
                    return (
                        <div
                            key={key}
                            style={{
                                display: "flex",
                                padding: "0.5em",
                                backgroundColor: "white",
                                flexDirection: "row",
                            }}
                        >
              <span>
                {key}:{data[key]}
              </span>
                        </div>
                    );
                })}
        </div>
    );
};

export default CustomTooltip;
