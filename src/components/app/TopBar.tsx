import React from "react";
import {useDispatch, useSelector} from "react-redux";
import {setTheme, ThemeType} from "../../store/reducers/appReducer";
import {RootState} from "../../store/store";
import ToggleSvgDark from "../../assets/icons/ToggleSvgDark";
import ToggleSvgLight from "../../assets/icons/ToggleSvgLight";
import DownloadCVButton from "../common/DownloadCVButton";
import LanguageSelector from "./LanguageSelector";
import { Link, useLocation } from "react-router-dom";
import {useTranslation} from "react-i18next";

const TopBar = () => {
    const theme = useSelector((state: RootState) => state.app.theme);
    const isDarkTheme = useSelector((state: RootState) => state.app.isDarkTheme);
    const {t} = useTranslation();
    const dispatch = useDispatch();
    const location = useLocation();

    const changeTheme = () => {
        const themeOrder: ThemeType[] = ['dark', 'light', 'blue'];
        const currentIndex = themeOrder.indexOf(theme);
        const nextTheme = themeOrder[(currentIndex + 1) % themeOrder.length];
        document.documentElement.setAttribute('data-theme', nextTheme);
        dispatch(setTheme(nextTheme));
        localStorage.setItem('theme', nextTheme);
    };

    return (
        <div id="top-bar" data-testid="top-bar-test" className="top-bar flex justify-between items-center w-full">
            <div className="flex items-center gap-2">
                <DownloadCVButton/>
                {location.pathname === "/contact" ? (
                    <Link
                        to="/"
                        className="inline-flex items-center px-2 py-1 bg-green-800 text-white hover:bg-green-900 border border-gray-600 transition-colors duration-300 ease-in-out"
                    >
                        {t('navigation.back')}
                    </Link>
                ) : (
                    <Link
                        to="/contact"
                        className="inline-flex items-center px-2 py-1 bg-green-800 text-white hover:bg-green-900 border border-gray-600 transition-colors duration-300 ease-in-out"
                    >
                        {t('navigation.contact')}
                    </Link>
                )}
            </div>
            <div className="flex items-center gap-2">
                <LanguageSelector/>
                <button
                    name="toggle-theme"
                    aria-label="Toggle theme"
                    onClick={changeTheme}
                    className="p-1"
                >
                    {isDarkTheme ? <ToggleSvgLight/> : <ToggleSvgDark/>}
                </button>
            </div>
        </div>
    );
};

export default TopBar;
