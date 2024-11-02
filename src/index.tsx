import ReactDOM from "react-dom/client";
import "./styles/index.css";
import "./styles/App.css";
import App from "./components/App";
import {Provider} from "react-redux";
import {HashRouter} from "react-router-dom";
import store from "./store/store";
import "./styles/darkTheme.css";
import "./styles/lightTheme.css";
import "./styles/snake.css";
import "./styles/topBar.css";

const root = ReactDOM.createRoot(
    document.getElementById("root") as HTMLElement
);

root.render(
    <Provider store={store}>
        <HashRouter>
            <App/>
        </HashRouter>
    </Provider>
);
