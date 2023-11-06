import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setTheme } from './store/reducers/appReducer';
import { RoutesSwitch } from './router/Router';
import Toaster from './components/common/Toaster';
import TopBar from './components/TopBar';
import { RootState } from './store/store';



function App() {
  const dipatch = useDispatch()
  const darkTheme = useSelector((state: RootState) => state.app.isDarkTheme);

  useEffect(() => {
    const isDarkTheme = localStorage.getItem('isDarkTheme') === 'true';

    const theme = !isDarkTheme ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', theme);
    dipatch(setTheme(isDarkTheme))
  }, [dipatch])

  return (
    <div id='app' className={`${darkTheme ? 'dark' : 'light'}-theme app select-none`}>
      <TopBar />
      <div style={{ maxHeight: 'calc(100dvh - 3.8em)', overflowY: 'auto' }}>
        <RoutesSwitch />
      </div>
      <Toaster />
    </div>
  );
}

export default App;
