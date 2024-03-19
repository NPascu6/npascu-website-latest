//import DemoApiIcon from "../assets/icons/DemoApiIcon";
import Info from "../assets/icons/Info";
import MainIcon from "../assets/icons/MainIcon";
import TicTacToeIcon from "../assets/icons/TicTacToe";
import SnakeIcon from "../assets/icons/Snake";
import GamesIcon from "../assets/icons/GamesIcon";
import { RouteDefinition } from "../models/common/common";
import AboutPage from "../pages/AboutPage";
import MainPage from "../pages/MainPage";
import GamePage from "../pages/game/TicTacToeGame";
import GamesCardPage from "../pages/game/GamesContainer";
import SnakeGame from "../pages/game/SnakeGame";
//import BrickOutGame from "../pages/game/BrickoutGame";

export const routeDefinition: RouteDefinition[] = [
    {
        path: '/',
        exact: true,
        title: 'Main',
        icon: <MainIcon />,
        element: <MainPage />,
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
            {
                path: 'snake', // Removed '/games/' from the child path
                exact: true,
                title: 'Snake',
                icon: <SnakeIcon />,
                element: <SnakeGame />,
            },
            // {
            //     path: 'brick-out', // Removed '/games/' from the child path
            //     exact: true,
            //     title: 'Brick Out',
            //     icon: <SnakeIcon />,
            //     element: <BrickOutGame />,
            // }
        ],
    },

    {
        path: '/about',
        exact: true,
        title: 'About',
        icon: <Info />,
        element: <AboutPage />,
    },
];




