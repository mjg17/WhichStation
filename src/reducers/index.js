import { combineReducers } from 'redux';

import StationsReducer from './stations';

const rootReducer = combineReducers({
  stations: StationsReducer,
});

export default rootReducer;
