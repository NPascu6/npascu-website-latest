import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setTheme } from './store/reducers/appReducer';
import { AppDispatch, RootState } from './store/store';
import { RoutesSwitch } from './router/Routes';
import Toaster from './components/common/Toaster';
import TopBar from './components/TopBar';
import { fetchGithubUserProfile } from './store/thunks/appThunk';

function App() {
  const dipatch = useDispatch()
  const isDarkTheme = useSelector((state: RootState) => state.app.isDarkTheme);
  const { githubProfile } = useSelector((state: RootState) => state.app);
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    if (githubProfile) return
    dispatch(fetchGithubUserProfile());
  }, [dispatch, githubProfile]);

  useEffect(() => {
    const isDarkTheme = localStorage.getItem('isDarkTheme') === 'true';
    const theme = isDarkTheme ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', theme);
    dipatch(setTheme(isDarkTheme))
  }, [dipatch])

  return (
    <div id='app' className={`${isDarkTheme ? 'dark' : 'light'}-theme app select-none`}>
      <TopBar />
      <div style={{ maxHeight: 'calc(100vh - 3.8em)', overflowY: 'auto' }}>
        <RoutesSwitch />
      </div>
      <Toaster />
    </div>
  );
}

export default App;
