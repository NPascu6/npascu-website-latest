import React, {useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {setTheme} from "../../store/reducers/appReducer";
import {RootState} from "../../store/store";
import ToggleSvgDark from "../../assets/icons/ToggleSvgDark";
import ToggleSvgLight from "../../assets/icons/ToggleSvgLight";
import CommonDialog from "../common/CommonDialog";
import LoginForm from "../auth/LoginForm";
import DownloadIcon from "../../assets/icons/DownloadIcon";

const TopBar = () => {
    const isDarkTheme = useSelector((state: RootState) => state.app.isDarkTheme);
    const dispatch = useDispatch();
    const [showLogin, setShowLogin] = useState(false);

    const changeTheme = () => {
        const newTheme = !isDarkTheme ? "true" : "false";
        document.documentElement.setAttribute("data-theme", newTheme);
        dispatch(setTheme(!isDarkTheme));
        localStorage.setItem("isDarkTheme", newTheme);
    };

    return (
        <div id="top-bar" data-testid="top-bar-test" className="top-bar">
            <div className="w-full mt-1">
                <div style={{width: "10em", marginLeft: "0.3em"}}>
                    <a
                        href="./PascuNorbertresumeEN.pdf"
                        download="PascuNorbertresumeEN.pdf"
                        rel="noopener noreferrer"
                        className="ml-0.5 pl-1 text-center flex justify-between items-center border border-gray-600 bg-green-500 text-white hover:bg-green-700 transition-colors duration-300 ease-in-out"
                    >
                        Download CV
                        <span className="flex items-center justify-center">
              <DownloadIcon className="text-white"/>
            </span>
                    </a>
                </div>
            </div>

            <div className="top-bar-section w-full mr-3">
                <button name="toggle-theme" onClick={changeTheme}>
                    {isDarkTheme ? <ToggleSvgLight/> : <ToggleSvgDark/>}
                </button>
            </div>
            {showLogin && (
                <CommonDialog title="Login" onClose={() => setShowLogin(false)}>
                    <LoginForm/>
                </CommonDialog>
            )}
        </div>
    );
};

export default TopBar;
