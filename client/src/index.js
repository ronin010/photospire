import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import {createStore, applyMiddleware} from "redux";
import {Provider} from "react-redux";
import rootReducer from "./reducers/index";
import thunk from 'redux-thunk'; 
import {compose} from "redux";

const store = createStore(
  rootReducer, compose(applyMiddleware(thunk), window.devToolsExtension ? window.devToolsExtension() : f => f)
  );

ReactDOM.render(
  <Provider store={store}>
    <App />
    </Provider>,
  document.getElementById('root')
);


reportWebVitals();
