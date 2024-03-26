import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setTheme } from '../store/reducers/appReducer';
import Toaster from './common/Toaster';
import TopBar from './app/TopBar';
import { RootState } from '../store/store';
import RoutesSwitch from '../router/Router';

const App = () => {
  const dipatch = useDispatch()
  const darkTheme = useSelector((state: RootState) => state.app.isDarkTheme);
  const [toggleSidebar, setToggleSidebar] = useState(false);
  
  
  useEffect(() => {
    const isDarkTheme = localStorage.getItem('isDarkTheme') === 'true';

    const theme = !isDarkTheme ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', theme);
    dipatch(setTheme(isDarkTheme))
  }, [dipatch])

  return (
    <div id='app' className={`${darkTheme ? 'dark' : 'light'}-theme app select-none`}>
      <TopBar toggleSidebar={toggleSidebar} setToggleSidebar={setToggleSidebar} />
      <div style={{ maxHeight: 'calc(100dvh - 4em)', overflowY: 'auto' }}>
        <RoutesSwitch />
      </div>
      <Toaster />
    </div>
  );
}

export default App;
