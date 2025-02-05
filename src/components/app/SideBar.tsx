import React, { lazy, Suspense } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../store/store";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

interface SideBarProps {
  isDrawerOpen: boolean;
  closeSidebar: () => void;
}

const SideBar: React.FC<SideBarProps> = ({ isDrawerOpen, closeSidebar }) => {
  const isDarkTheme = useSelector((state: RootState) => state.app.isDarkTheme);

  return (
    <AnimatePresence>
      {isDrawerOpen && (
        <>
          {/* Overlay */}
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-50 z-40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeSidebar}
          />

          {/* Sidebar */}
          <motion.div
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className={`fixed top-0 left-0 h-full w-42 z-50 shadow-xl ${
              isDarkTheme ? "bg-gray-900 text-white" : "bg-white text-black"
            }`}
          >
            {/* Sidebar Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-600">
              <h2 className="text-2xl font-bold">Menu</h2>
              <button
                onClick={closeSidebar}
                className="p-2 rounded-md hover:bg-gray-700 transition"
              >
                <X size={24} />
              </button>
            </div>

            {/* Navigation Links */}
            <nav className="mt-4">
              <ul className="space-y-4 px-4">
                <li>
                  <Link
                    to="/"
                    className="flex items-center text-lg hover:text-blue-400 transition"
                    onClick={closeSidebar}
                  >
                    🏠 Home
                  </Link>
                </li>
                <li>
                  <Link
                    to="/games"
                    className="flex items-center text-lg hover:text-blue-400 transition"
                    onClick={closeSidebar}
                  >
                    🚀 Games
                  </Link>
                </li>
                <li>
                  <Link
                    to="/dynamic-components"
                    className="flex items-center text-lg hover:text-blue-400 transition"
                    onClick={closeSidebar}
                  >
                    ⚙️ Dynamic components
                  </Link>
                </li>
                <li>
                  <Link
                    to="/about"
                    className="flex items-center text-lg hover:text-blue-400 transition"
                    onClick={closeSidebar}
                  >
                    ℹ️ About Me
                  </Link>
                </li>
              </ul>
            </nav>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default SideBar;
