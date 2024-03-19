import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setTheme } from '../../store/reducers/appReducer';
import { RootState } from '../../store/store';
import ToggleSvgDark from '../../assets/icons/ToggleSvgDark';
import ToggleSvgLight from '../../assets/icons/ToggleSvgLight';
import UserIcon from '../../assets/icons/UserIcon';
import Favicon32 from '../../assets/favicon-32x32.png';
import Sidebar from './SideBar';
import CommonDialog from '../common/CommonDialog';
import LoginForm from '../auth/LoginForm';

const TopBar = () => {
    const isDarkTheme = useSelector((state: RootState) => state.app.isDarkTheme);
    const dispatch = useDispatch();
    const [toggleSidebar, setToggleSidebar] = useState(false);
    const [showLogin, setShowLogin] = useState(false);

    const changeTheme = () => {
        const newTheme = !isDarkTheme ? 'true' : 'false';
        document.documentElement.setAttribute('data-theme', newTheme);
        dispatch(setTheme(!isDarkTheme));
        localStorage.setItem('isDarkTheme', newTheme);
    };

    return (
        <div id="top-bar" className="top-bar">
            <div className='w-full'>
                {toggleSidebar && (
                    <Sidebar toggle={toggleSidebar} setToggle={setToggleSidebar} />
                )}
                <div className="ml-2">
                    <img
                        className="favicon"
                        src={Favicon32}
                        alt="favicon"
                        onClick={() => setToggleSidebar(!toggleSidebar)}
                    />
                </div>
                <div
                    className={`sidebar-toggle-overlay ${toggleSidebar ? 'expanded' : 'collapsed'}`}
                    onClick={() => setToggleSidebar(!toggleSidebar)}
                ></div>
            </div>

            <div className="top-bar-section w-full">
                <button style={{ margin: 4 }} onClick={() => setShowLogin(true)}>
                    <UserIcon />
                </button>
                <button onClick={changeTheme}>
                    {isDarkTheme ? <ToggleSvgLight /> : <ToggleSvgDark />}
                </button>
            </div>
            {showLogin && (
                <CommonDialog title="Login" onClose={() => setShowLogin(false)}>
                    <LoginForm />
                </CommonDialog>
            )}
        </div>
    );
};

export default TopBar;
