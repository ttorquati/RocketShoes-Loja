import React from 'react';
import { Router } from 'react-router-dom';
import { Provider } from 'react-redux';
import { ToastContainer } from 'react-toastify';

import './config/ReactotronConfig';

import store from './store/index';

import Routes from './routes';

import Header from './components/Header/Header';

import GlobalStyle from './styles/global';

import history from './services/history';

function App() {
  return (
    <div className="App">
      <Provider store={store}>
        <Router history={history}>
          <Header />
          <Routes />
          <GlobalStyle />
          <ToastContainer autoClose={4000} />
        </Router>
      </Provider>
    </div>
  );
}

export default App;
