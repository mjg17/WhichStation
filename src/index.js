import React, { Fragment } from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
import { BrowserRouter, Route, Switch, Redirect } from 'react-router-dom';
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
    <Fragment>
      <h1>Which station should I use?</h1>
      <BrowserRouter>
        <Switch>
          <Route exact path="/stationchooser" component={StationsChooser} />
          <Route path="/whichstation/:choices/:direction/:target" component={WhichStation} />
          <Route path="/" render={props => <Redirect to="/stationchooser" />} />
        </Switch>
      </BrowserRouter>
      <a href="http://www.nationalrail.co.uk/100296.aspx"><img src="https://huxley.unop.uk/NRE_Powered_logo.png" alt="powered by National Rail Enquiries" /></a>
      &nbsp;
      and
      <a href="https://huxley.apphb.com/"><img src="https://huxley.apphb.com/huxley.png" alt="Huxley" title="Huxley" /></a>
    </Fragment>
  </Provider>
  , document.querySelector('.container'));
