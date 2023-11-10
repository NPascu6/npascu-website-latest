
import React from 'react';
import ToggleSvgDark from '../assets/icons/ToggleSvgDark';
import ToggleSvgLight from '../assets/icons/ToggleSvgLight';
import UserIcon from '../assets/icons/UserIcon';
import Favicon32 from '../assets/favicon-32x32.png';
import { RootState } from '../store/store';
import { useDispatch, useSelector } from 'react-redux';
import { setTheme } from '../store/reducers/appReducer';
import Sidebar from './common/SideBar';
import CommonDialog from './common/CommonDialog';
import LoginForm from './LoginForm';

const TopBar = () => {
    const isDarkTheme = useSelector((state: RootState) => state.app.isDarkTheme);
    const dipatch = useDispatch()
    const [toggleSiderbar, setToggleSidebar] = React.useState<boolean>(false);
    const [showLogin, setShowLogin] = React.useState<boolean>(false);

    const changeTheme = () => {
        const theme = isDarkTheme ? 'dark' : 'light';
        document.documentElement.setAttribute('data-theme', theme);
        dipatch(setTheme(!isDarkTheme))
        localStorage.setItem('isDarkTheme', !isDarkTheme ? 'true' : 'false');
    }

    const handleToggleSidebar = (isOpen: boolean) => {
        setToggleSidebar(isOpen);
    }


    return <div id={'top-bar'} className='flex flex-row md:flex-row md:items-center p-2'>
        <Sidebar toggle={toggleSiderbar} setToggle={handleToggleSidebar} />
        <div className='flex flex-grow justify-start items-center'>
            <img className='w-8 h-8 md:w-10 md:h-10 mr-3' src={Favicon32} alt="favicon" onClick={() => handleToggleSidebar(!toggleSiderbar)} />
            <div className='text-sm md:text-xl font-semibold'>
                Welcome to my website 🌞
            </div>
        </div>
        <div className='flex justify-center items-center'>
            <button className='mr-2' onClick={() => setShowLogin(true)}>
                <UserIcon />
            </button></div>
        <div className='flex justify-end items-center'>
            <button onClick={changeTheme}>
                {!isDarkTheme ?
                    <div>
                        <ToggleSvgDark />
                    </div>
                    : <div>
                        <ToggleSvgLight />
                    </div>}
            </button>
        </div>
        {showLogin && <CommonDialog title='Login' onClose={() => { setShowLogin(false) }}>
            <LoginForm />
        </CommonDialog>}
    </div>
}

export default TopBar;