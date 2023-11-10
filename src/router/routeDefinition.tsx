//import DemoApiIcon from "../assets/icons/DemoApiIcon";
import Info from "../assets/icons/Info";
import MainIcon from "../assets/icons/MainIcon";
import TicTacToeIcon from "../assets/icons/TicTacToe";
import GamesIcon from "../assets/icons/GamesIcon";
import { RouteDefinition } from "../models/common/common";
import AboutPage from "../pages/AboutPage";
import MainPage from "../pages/MainPage";
import GamePage from "../pages/game/TicTacToeGame";
import GamesCardPage from "../pages/game/GamesContainer";

export const routeDefinition: RouteDefinition[] = [
    {
        path: '/',
        exact: true,
        title: 'Main',
        icon: <MainIcon />,
        element: <MainPage />,
    },
    {
        path: '/about',
        exact: true,
        title: 'About',
        icon: <Info />,
        element: <AboutPage />,
    },
    {
        path: '/games/*',
        exact: true,
        title: 'Demo Games',
        icon: <GamesIcon />,
        element: <GamesCardPage />,
        routes: [
            {
                path: 'tic-tac-toe', // Removed '/games/' from the child path
                exact: true,
                title: 'Tic Tac Toe',
                icon: <TicTacToeIcon />,
                element: <GamePage />,
            },
        ],
    },
];




