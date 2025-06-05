import React, {lazy, Suspense, useCallback, useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {setTheme, ThemeType} from "./store/reducers/appReducer";
import {RootState} from "./store/store";
import {useSwipeable} from "react-swipeable";
import Loading from "./pages/generic/Loading";
import {useLocation} from "react-router-dom";
import './i18n';

const TopBar = lazy(() => import("./components/app/TopBar"));
const SideBar = lazy(() => import("./components/app/SideBar"));
const InstallPWAButton = lazy(() => import("./components/app/InstallPWAButton"));
const RoutesSwitch = lazy(() => import("./router/Router"));
const BottomBar = lazy(() => import("./components/app/BottomBar"));
const Toaster = lazy(() => import("./components/common/Toaster"));

const App: React.FC = () => {
    const dispatch = useDispatch();
    const theme = useSelector((state: RootState) => state.app.theme);
    const darkTheme = useSelector((state: RootState) => state.app.isDarkTheme);
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const location = useLocation();
    const closeSidebar = useCallback(() => {
        setIsDrawerOpen(false);
    }, []);

    const openSidebar = useCallback(() => {
        if (location.pathname.includes("/snake")) return;
        else setIsDrawerOpen(true);
    }, [location.pathname]);

    const swipeHandlers = useSwipeable({
        onSwipedLeft: closeSidebar,
        onSwipedRight: openSidebar,
        trackMouse: true,
        preventScrollOnSwipe: true, // Prevent scrolling while swiping
        delta: 10, // Reduce sensitivity (prevents accidental swipes)
    });

    useEffect(() => {
        document.body.style.overflow = isDrawerOpen ? "hidden" : "";
    }, [isDrawerOpen]);

    // Load theme from localStorage, defaulting to dark mode if no value is saved
    useEffect(() => {
        let savedTheme = 'dark' as ThemeType;
        const savedThemeStr = localStorage.getItem('theme');
        if (savedThemeStr) {
            savedTheme = savedThemeStr as ThemeType;
        } else {
            const oldThemeStr = localStorage.getItem('isDarkTheme');
            const oldTheme = oldThemeStr === null ? true : oldThemeStr === 'true';
            savedTheme = oldTheme ? 'dark' : 'light';
        }
        if (savedTheme !== theme) {
            dispatch(setTheme(savedTheme));
        }
        document.documentElement.setAttribute('data-theme', savedTheme);
    }, [dispatch, theme]);

    return (
        <div
            id="app"
            {...swipeHandlers} // Attach swipe gestures
            className={`${theme}-theme app select-none`}
            style={{touchAction: "none"}} // Prevent system gestures like back swipe
        >
            {/* Top Bar */}
            <Suspense fallback={<Loading/>}>
                <TopBar/>
            </Suspense>

            {/* Sidebar */}
            <Suspense fallback={<Loading/>}>
                <SideBar isDrawerOpen={isDrawerOpen} closeSidebar={closeSidebar}/>
            </Suspense>

            {/* Main Content */}
            <main className="main-content">
                <Suspense fallback={<Loading/>}>
                    <RoutesSwitch/>
                </Suspense>
            </main>

            {/* Bottom Bar */}
            <Suspense fallback={<Loading/>}>
                <BottomBar/>
            </Suspense>

            {/* Toaster Notifications */}
            <Suspense fallback={<Loading/>}>
                <Toaster/>
            </Suspense>

            {/* PWA Install Button */}
            <Suspense fallback={<Loading/>}>
                <InstallPWAButton/>
            </Suspense>
        </div>
    );
};

export default App;
