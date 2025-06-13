import ReactDOM from "react-dom/client";
import "./assets/styles/index.css";
import "./assets/styles/App.css";
import App from "./App";
import {Provider} from "react-redux";
import {BrowserRouter} from "react-router-dom";
import store from "./store/store";
import "./assets/styles/darkTheme.css";
import "./assets/styles/lightTheme.css";
import "./assets/styles/blueTheme.css";
import "./assets/styles/snake.css";
import "./assets/styles/topBar.css";

const root = ReactDOM.createRoot(
    document.getElementById("root") as HTMLElement
);

root.render(
    <Provider store={store}>
        <BrowserRouter>
            <App/>
        </BrowserRouter>
    </Provider>
);
