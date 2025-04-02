import React from "react";
import {useDispatch, useSelector} from "react-redux";
import {setTheme} from "../../store/reducers/appReducer";
import {RootState} from "../../store/store";
import ToggleSvgDark from "../../assets/icons/ToggleSvgDark";
import ToggleSvgLight from "../../assets/icons/ToggleSvgLight";
import DownloadCVButton from "../common/DownloadCVButton";
import LanguageSelector from "./LanguageSelector";

const TopBar = () => {
    const isDarkTheme = useSelector((state: RootState) => state.app.isDarkTheme);
    const dispatch = useDispatch();

    const changeTheme = () => {
        const newTheme = !isDarkTheme ? "true" : "false";
        document.documentElement.setAttribute("data-theme", newTheme);
        dispatch(setTheme(!isDarkTheme));
        localStorage.setItem("isDarkTheme", newTheme);
    };

    return (
        <div id="top-bar" data-testid="top-bar-test" className="top-bar">
            <div className="flex justify-between w-full">
                <DownloadCVButton/>
                <div className="top-bar-section w-full mr-3">
                    <LanguageSelector/>
                    <button name="toggle-theme" onClick={changeTheme}>
                        {isDarkTheme ? <ToggleSvgLight/> : <ToggleSvgDark/>}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default TopBar;
