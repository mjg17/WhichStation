// @flow

import { List } from 'immutable';

import { Station, StationChoice } from '../types';
import type { State, StationT, StationChoiceT } from '../types';

import axios from 'axios';
import ACCESS_TOKEN from '../../access_token';

export const GET_CHOICES = 'GET_CHOICES';
export const GET_CHOICES_SUCCESS = 'GET_CHOICES_SUCCESS';
export const GET_CHOICE_DATA = 'GET_CHOICE_DATA';
export const GET_CHOICE_DATA_SUCCESS = 'GET_CHOICE_DATA_SUCCESS';

type ActionType =
  | 'GET_CHOICES'
  | 'GET_CHOICES_SUCCESS'
  | 'GET_CHOICE_DATA'
  | 'GET_CHOICE_DATA_SUCCESS'
  ;
export type Action = {| type: ActionType, payload: any |};

type RootState = {
  construction: State,
};
type GetState = () => RootState;
type PromiseAction = Promise<Action>;
// eslint-disable-next-line no-use-before-define                                                                                                                                                                    
type ThunkAction = (dispatch: Dispatch, getState: GetState) => any;
type Dispatch = (action: Action | ThunkAction | PromiseAction | Array<Action>) => any;

const parseChoices = (choices: string): List<StationChoiceT> => {
  const stationStrings = choices.split('--');
  const stations = stationStrings.map(s => {
    let crsCode = '', travelMinutes = 0;
    const result = s.match(/^(\w+)-(\d+)$/);
    if (result)
      [ , crsCode, travelMinutes ] = result;
    return StationChoice({ crsCode, travelMinutes: Number(travelMinutes) });
  });
  return List(stations);
}

const buildQueryString = (choice: StationChoiceT, direction: string, target: StationT): string => {
  direction = direction.toLowerCase();
  if (direction === 'to')
    return `/fastest/${choice.crsCode}/to/${target.crsCode}`;
  else if (direction === 'from')
    return `/fastest/${target.crsCode}/to/${choice.crsCode}`;
  throw new Error(`Unsupported direction '${direction}'`)
}

const decodeFastestResponse = (data: Object, target: StationT) => {
  const unavailable = { available: false, details: data };
  if (!data.areServicesAvailable) return unavailable;
  const service = data.departures[0].service;
  if (!service) return unavailable;
  const targetCrs = target.crsCode.toUpperCase();
  const targetDetails = service.subsequentCallingPoints[0].callingPoint.find(cp => cp.crs.toUpperCase() === targetCrs);
  if (!targetDetails) return unavailable;
  return { available: true, eta: targetDetails.st, details: targetDetails };
}

const ROOT_URL = 'https://huxley.apphb.com';
console.log('ACCESS_TOKEN', ACCESS_TOKEN);

const getFastest = (dispatch: Dispatch, index, choice: StationChoiceT, direction: string, target: StationT) => {
  dispatch({ type: GET_CHOICE_DATA, payload: { index } });
  const queryString = buildQueryString(choice, direction, target);
  return axios.get(`${ROOT_URL}${queryString}?expand=true&accessToken=${ACCESS_TOKEN}`)
    .then(request => dispatch({
      type: GET_CHOICE_DATA_SUCCESS,
      payload: { index, result: decodeFastestResponse(request.data, target) }, 
    }))
}

export function getDepartures(choices: string, direction: string, target: string) {
  const stationChoices = parseChoices(choices);
  const stationTarget = Station({crsCode: target});
  return (dispatch: Dispatch) => {
    dispatch({
        type: GET_CHOICES,
        payload: { choices: stationChoices, direction, target: stationTarget },
    });
    Promise.all(
      stationChoices.map((choice, index) => getFastest(dispatch, index, choice, direction, stationTarget))
    ).then(
        () => dispatch({type: GET_CHOICES_SUCCESS, payload: {} })
      );
  };
}
