import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import Immutable from 'immutable';

import reducers from './reducers';

import StationsChooser from './components/stations_chooser';
import WhichStation from './components/which_station';

const useDevtools = process.env.NODE_ENV !== 'production' && typeof window.devToolsExtension === 'function';
const createStoreWithMiddleware = compose(
  applyMiddleware(thunk),
  useDevtools
    ? window.devToolsExtension({
        serialize: {
          immutable: Immutable,
        },
      })
    : f => f
)(createStore);

ReactDOM.render(
  <Provider store={createStoreWithMiddleware(reducers)}>
    <BrowserRouter>
      <Switch>
        <Route exact path="/" component={StationsChooser} />
        <Route path="/whichstation/:choices/:direction/:target" component={WhichStation} />
      </Switch>
    </BrowserRouter>
  </Provider>
  , document.querySelector('.container'));
