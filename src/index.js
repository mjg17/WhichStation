import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import { BrowserRouter, Route, Switch } from 'react-router-dom';

import reducers from './reducers';

import StationsChooser from './components/stations_chooser';
import WhichStation from './components/which_station';

const createStoreWithMiddleware = applyMiddleware()(createStore);

ReactDOM.render(
  <Provider store={createStoreWithMiddleware(reducers, window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__())}>
    <BrowserRouter>
      <Switch>
        <Route exact path="/" component={StationsChooser} />
        <Route path="/whichstation/:choices/:direction/:target" component={WhichStation} />
      </Switch>
    </BrowserRouter>
  </Provider>
  , document.querySelector('.container'));
