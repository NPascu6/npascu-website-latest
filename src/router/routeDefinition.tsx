import DemoApiIcon from "../assets/icons/DemoApiIcon";
import Info from "../assets/icons/Info";
import MainIcon from "../assets/icons/MainIcon";
import { RouteDefinition } from "../models/common/common";
import AboutPage from "../pages/AboutPage";
import DemoApiPage from "../pages/DemoApiPage";
import MainPage from "../pages/MainPage";

export const routeDefinition: RouteDefinition[] = [
    {
        path: '/',
        component: <MainPage />,
        exact: true,
        title: 'Main Page',
        icon: <MainIcon />
    },
    {
        path: '/about',
        component:  <AboutPage />,
        exact: true,
        title: 'About Page',
        icon: <Info />
    },
    {
        path: '/demo-api',
        component: <DemoApiPage />,
        exact: true,
        title: 'Demo Api Page',
        icon: <DemoApiIcon />
    }
]