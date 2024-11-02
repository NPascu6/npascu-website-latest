import React, {useEffect, useState} from "react";
import {useSelector} from "react-redux";
import {RootState} from "../../store/store";
import {Link} from "react-router-dom";
import {useSwipeable} from "react-swipeable";

interface SideBarProps {
    isOpen: boolean;
    onClose: () => void;
    onOpen: () => void;
}

const SideBar: React.FC<SideBarProps> = ({isOpen, onClose, onOpen}) => {
    const isDarkTheme = useSelector((state: RootState) => state.app.isDarkTheme);
    const [isDrawerOpen, setIsDrawerOpen] = useState(isOpen);

    const handlers = useSwipeable({
        onSwipedLeft: () => setIsDrawerOpen(false),
        onSwipedRight: () => setIsDrawerOpen(true),
    });

    useEffect(() => {
        setIsDrawerOpen(isOpen);
    }, [isOpen]);

    useEffect(() => {
        if (isDrawerOpen) {
            onOpen();
        } else {
            onClose();
        }
    }, [isDrawerOpen, onClose, onOpen]);

    return (
        <div
            {...handlers}
            className={`fixed top-0 left-0 h-full transition-transform transform ${
                isDrawerOpen ? "translate-x-0" : "-translate-x-full"
            } ${isDarkTheme ? "bg-gray-800 text-white" : "bg-white text-black"} shadow-lg w-64`}
        >
            <div className="p-4">
                <h2 className="text-2xl font-bold">SideBar</h2>
                <nav className="mt-4">
                    <ul>
                        <li className="mb-2">
                            <Link to="/" className="hover:underline">
                                Home
                            </Link>
                        </li>
                        <li className="mb-2">
                            <Link to="/about" className="hover:underline">
                                About
                            </Link>
                        </li>
                        <li className="mb-2">
                            <Link to="/contact" className="hover:underline">
                                Contact
                            </Link>
                        </li>
                    </ul>
                </nav>
            </div>
        </div>
    );
};

export default SideBar;