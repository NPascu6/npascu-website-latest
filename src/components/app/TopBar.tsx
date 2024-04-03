import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setTheme } from '../../store/reducers/appReducer';
import { RootState } from '../../store/store';
import ToggleSvgDark from '../../assets/icons/ToggleSvgDark';
import ToggleSvgLight from '../../assets/icons/ToggleSvgLight';
import UserIcon from '../../assets/icons/UserIcon';
import Favicon32 from '../../assets/favicon-32x32.png';
import CommonDialog from '../common/CommonDialog';
import LoginForm from '../auth/LoginForm';

interface TopBarProps {
    toggleSidebar: boolean;
    setToggleSidebar: (toggle: boolean) => void;

}

const TopBar = ({ toggleSidebar, setToggleSidebar }: TopBarProps) => {
    const isDarkTheme = useSelector((state: RootState) => state.app.isDarkTheme);
    const dispatch = useDispatch();
    const [showLogin, setShowLogin] = useState(false);

    const changeTheme = () => {
        const newTheme = !isDarkTheme ? 'true' : 'false';
        document.documentElement.setAttribute('data-theme', newTheme);
        dispatch(setTheme(!isDarkTheme));
        localStorage.setItem('isDarkTheme', newTheme);
    };

    return (
        <div id="top-bar" data-testid="top-bar-test" className="top-bar">
            <div className='w-full'>
                <div className="">
                    <img
                        height={16}
                        width={16}
                        className="favicon"
                        src={Favicon32}
                        alt="favicon"
                    />
                </div>
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
