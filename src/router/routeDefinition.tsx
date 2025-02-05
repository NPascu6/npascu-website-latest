import { RouteDefinition } from "../models/common/common";
import AboutPage from "../pages/AboutPage";
import MainPage from "../pages/MainPage";
import DynamicComponentsContainerPage from "../pages/DynamicComponentsContainerPage";
import GamesCardPage from "../pages/GamesContainer";

export const routeDefinition: RouteDefinition[] = [
  {
    path: "*",
    exact: true,
    element: <MainPage />,
  },
  {
    path: "/games/*",
    exact: true,
    element: <GamesCardPage />,
  },
  {
    path: "/dynamic-components",
    exact: true,
    element: <DynamicComponentsContainerPage />,
  },

  {
    path: "/about",
    exact: true,
    element: <AboutPage />,
  },
];
