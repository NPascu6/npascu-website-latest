import React, { useEffect, useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setTheme } from "../../store/reducers/appReducer";
import { RootState } from "../../store/store";
import { useSwipeable } from "react-swipeable";

import Toaster from "../common/Toaster";
import TopBar from "./TopBar";
import SideBar from "./SideBar";
import InstallPWAButton from "./InstallPWAButton";
import RoutesSwitch from "../../router/Router";
import BottomBar from "./BottomBar";

const App: React.FC = () => {
  const dispatch = useDispatch();
  const darkTheme = useSelector((state: RootState) => state.app.isDarkTheme);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const closeSidebar = useCallback(() => {
    setIsDrawerOpen(false);
  }, []);

  const openSidebar = useCallback(() => {
    setIsDrawerOpen(true);
  }, []);

  // Global swipe handler for the entire app
  const swipeHandlers = useSwipeable({
    onSwipedLeft: closeSidebar,
    onSwipedRight: openSidebar,
    trackMouse: true,
    preventScrollOnSwipe: true,
  });

  // Load theme from localStorage once
  useEffect(() => {
    const savedTheme = localStorage.getItem("isDarkTheme") === "true";
    if (savedTheme !== darkTheme) {
      dispatch(setTheme(savedTheme));
    }
    document.documentElement.setAttribute(
      "data-theme",
      savedTheme ? "dark" : "light"
    );
  }, [dispatch, darkTheme]);

  return (
    <div
      id="app"
      {...swipeHandlers} // Attach swipe gestures to the whole app
      className={`${darkTheme ? "dark" : "light"}-theme app select-none`}
    >
      <TopBar />

      {/* Sidebar */}
      <SideBar isDrawerOpen={isDrawerOpen} closeSidebar={closeSidebar} />

      {/* Main Content */}
      <main className="main-content">
        <RoutesSwitch />
      </main>
      <BottomBar />

      {/* Toaster Notifications */}
      <Toaster />

      {/* PWA Install Button */}
      <InstallPWAButton />
    </div>
  );
};

export default App;
