// @flow

import { List, Record } from 'immutable';

import { Station } from '../types'
import type { State } from '../types';
import type { Action } from '../actions';

import { GET_CHOICES } from '../actions';

const initialState: State = Record({
  choices: List(),
  direction: 'to',
  target: Station({}),
})();

export default function(state: State = initialState, action: Action) {
    console.log(state, action);
  switch (action.type) {
  case GET_CHOICES:
    return state.merge(action.payload);
  default:
    return state;
  }
}
