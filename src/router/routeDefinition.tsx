//import DemoApiIcon from "../assets/icons/DemoApiIcon";
import Info from "../assets/icons/Info";
import MainIcon from "../assets/icons/MainIcon";
import { RouteDefinition } from "../models/common/common";
import AboutPage from "../pages/AboutPage";
import MainPage from "../pages/MainPage";
import GamePage from "../pages/game/GamePage";

export const routeDefinition: RouteDefinition[] = [
    {
        path: '/',
        component: <MainPage />,
        exact: true,
        title: 'Main',
        icon: <MainIcon />
    },
    // {
    //     path: '/demo-api',
    //     component: <DemoApiPage />,
    //     exact: true,
    //     title: 'Demo Api',
    //     icon: <DemoApiIcon />
    // },
    {
        path: '/about',
        component: <AboutPage />,
        exact: true,
        title: 'About',
        icon: <Info />
    },
    {
        path: '/game',
        component: <GamePage />,
        exact: true,
        title: 'Demo Game',
        icon: <Info />
    }
]