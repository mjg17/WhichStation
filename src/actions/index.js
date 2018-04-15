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
    return `/departures/${choice.crsCode}/to/${target.crsCode}`;
  else if (direction === 'from')
    return `/departures/${target.crsCode}/to/${choice.crsCode}`;
  throw new Error(`Unsupported direction '${direction}'`)
}

const departAfter = (s, offset) => true; // WRITE ME
const findDestinationDetails = (s, crsCode) => s.subsequentCallingPoints[0].callingPoint.find(cp => cp.crs.toUpperCase() === crsCode);
const arrivalTime = (a, b) => ( a.sta < b.sta ); // COPE WITH MIDNIGHT

const decodeDepartureResponse = (data: Object, departureOffset: number, arrivalOffset: number, targetCrs: string) => {
  const unavailable = { available: false, details: data };
  if (!data.areServicesAvailable) return unavailable;
  if (!data.trainServices) return unavailable;
  targetCrs = targetCrs.toUpperCase();
  const services = data.trainServices
    .filter(s => departAfter(s, departureOffset))
    .map(s => {
      const dest = findDestinationDetails(s, targetCrs);
      return { std: s.std, sta: dest.st, service: s }; // HANDLE arrivalOffset
     })
    .sort(arrivalTime);
  if (!services.length) return unavailable;
  const service = services[0];
  return { available: true, ...service };
}

const ROOT_URL = 'https://huxley.apphb.com';
console.log('ACCESS_TOKEN', ACCESS_TOKEN);

const getBestDeparture = (dispatch: Dispatch, index, choice: StationChoiceT, direction: string, target: StationT) => {
  dispatch({ type: GET_CHOICE_DATA, payload: { index } });
  const queryString = buildQueryString(choice, direction, target);
  return axios.get(`${ROOT_URL}${queryString}?expand=true&accessToken=${ACCESS_TOKEN}`)
    .then(request => dispatch({
      type: GET_CHOICE_DATA_SUCCESS,
      payload: { index, result: decodeDepartureResponse(request.data, choice.travelMinutes, 0, target.crsCode) },
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
      stationChoices.map((choice, index) => getBestDeparture(dispatch, index, choice, direction, stationTarget))
    ).then(
        () => dispatch({type: GET_CHOICES_SUCCESS, payload: {} })
      );
  };
}
