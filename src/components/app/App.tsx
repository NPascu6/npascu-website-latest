import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setTheme } from "../../store/reducers/appReducer";
import Toaster from "../common/Toaster";
import TopBar from "./TopBar";
import { RootState } from "../../store/store";
import RoutesSwitch from "../../router/Router";
import SideBar from "./SideBar";
import InstallPWAButton from "./InstallPWAButton";

const App = () => {
  const dispatch = useDispatch();
  const darkTheme = useSelector((state: RootState) => state.app.isDarkTheme);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleSidebarClose = () => setIsSidebarOpen(false);
  const handleSidebarOpen = () => setIsSidebarOpen(true);

  useEffect(() => {
    const isDarkTheme = localStorage.getItem("isDarkTheme") === "true";
    const theme = !isDarkTheme ? "dark" : "light";
    document.documentElement.setAttribute("data-theme", theme);
    dispatch(setTheme(isDarkTheme));
  }, [dispatch]);

  return (
    <div
      id="app"
      className={`${darkTheme ? "dark" : "light"}-theme app select-none`}
    >
      <TopBar />
      <SideBar
        isOpen={isSidebarOpen}
        onClose={handleSidebarClose}
        onOpen={handleSidebarOpen}
      />
      <div
        style={{
          maxHeight: "calc(100dvh - 2.8em)",
          overflowY: "auto",
          width: "100%",
        }}
      >
        <RoutesSwitch />
      </div>
      <Toaster />
      <InstallPWAButton />
    </div>
  );
};

export default App;
