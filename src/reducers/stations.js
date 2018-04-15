// @flow

import { List, Record } from 'immutable';

import { Station } from '../types'
import type { State } from '../types';
import type { Action } from '../actions';

import { GET_CHOICES, GET_CHOICE_DATA, GET_CHOICE_DATA_SUCCESS, GET_CHOICES_SUCCESS } from '../actions';
import { compareHHMM } from '../utils/date';

const initialState: State = Record({
  choices: List(),
  direction: 'to',
  target: Station({}),
  loading: false,
})();

export default function(state: State = initialState, action: Action) {
    console.log(state, action);
  switch (action.type) {
  case GET_CHOICES:
    return state.set('loading', true).merge(action.payload);
  case GET_CHOICE_DATA: {
    const { index } = action.payload;
    return state.setIn(['choices', index, 'loading'], true);
  }
  case GET_CHOICE_DATA_SUCCESS: {
    const { index, result } = action.payload;
    return state.updateIn(
      ['choices', index],
      c => c.set('loading', false).merge(result)
    );
  }
  case GET_CHOICES_SUCCESS: {
    // sort choices by arrival time
    return state
      .set('loading', false)
      .update('choices', c => c.sort(bestDeparture));
  }
  default:
    return state;
  }
}

const bestDeparture = (a, b) => {
  // First compare availability - having a departure is better than not having one!
  if (!a.available && !b.available)
    return 0;
  if (!b.available)
    return -1;
  if (!a.available)
    return 1;
  return compareHHMM(a.arr, b.arr);
}
