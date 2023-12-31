import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import './styles/App.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { Provider } from 'react-redux';
import { HashRouter } from 'react-router-dom';
import store from './store/store';
import './styles/darkTheme.css';
import './styles/lightTheme.css';
import './styles/snake.css';
import './styles/sliderStyles.css';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <Provider store={store}>
    <HashRouter>
      <App />
    </HashRouter>
  </Provider>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
