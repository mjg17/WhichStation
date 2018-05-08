// @flow

import { List } from 'immutable';

import { Station, StationChoice } from '../types';
import type { State, StationT, StationChoiceT } from '../types';

import huxley from '../apis/huxley';

import { fromHHMM, addMins, compareHHMM, hhmmWithOffsetMins } from '../utils/date';

export const GET_CHOICES = 'GET_CHOICES';
export const GET_CHOICES_SUCCESS = 'GET_CHOICES_SUCCESS';
export const GET_CHOICE_DATA = 'GET_CHOICE_DATA';
export const GET_CHOICE_DATA_SUCCESS = 'GET_CHOICE_DATA_SUCCESS';
export const GET_CRS = 'GET_CRS';

type ActionType =
  | 'GET_CHOICES'
  | 'GET_CHOICES_SUCCESS'
  | 'GET_CHOICE_DATA'
  | 'GET_CHOICE_DATA_SUCCESS'
  | 'GET_CRS'
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


const departAfter = (std, offsetMins) => {
  const cutoff = addMins(null, offsetMins);
  const dep = fromHHMM(std);
  return (dep.getTime() >= cutoff.getTime());
}

const arrivalTime = (a, b) => compareHHMM(a.sta, b.sta);

const decodeDepartureResponse = (data: Object, directionDetails: Object) => {
  const unavailable = { available: false, details: data };
  const trainServices = huxley.trainServices(data);
  if (!trainServices) return unavailable;
  const services = trainServices
    .filter(s => departAfter(s.std, directionDetails.fromOffset))
    .map(s => {
      const dest = huxley.findDestinationDetails(s, directionDetails.destCrs);
      const sta = dest.st;
      const dep = hhmmWithOffsetMins(s.std, -directionDetails.fromOffset);
      const arr = hhmmWithOffsetMins(sta, directionDetails.destOffset);
      return { arr, dep, std: s.std, sta: dest.st, service: s };
     })
    .sort(arrivalTime);
  if (!services.length) return unavailable;
  const service = services[0];
  return { available: true, ...service };
}

const handleDirection = (choice: StationChoiceT, direction: string, target: StationT) => {
  direction = direction.toLowerCase();
  if (direction === 'to')
    return { fromCrs: choice.crsCode, fromOffset: choice.travelMinutes, destCrs: target.crsCode, destOffset: 0 };
  else if (direction === 'from')
    return { fromCrs: target.crsCode, fromOffset: 0, destCrs: choice.crsCode, destOffset: choice.travelMinutes };
  throw new Error(`Unsupported direction '${direction}'`)
}

const getBestDeparture = (dispatch: Dispatch, index, choice: StationChoiceT, direction: string, target: StationT) => {
  dispatch({ type: GET_CHOICE_DATA, payload: { index } });
  const directionDetails = handleDirection(choice, direction, target);
  return dispatch(expandCRS(choice.crsCode))
    .then(stationName => huxley.getDepartures(directionDetails.fromCrs, directionDetails.destCrs))
    .then(request => dispatch({
      type: GET_CHOICE_DATA_SUCCESS,
      payload: { index, result: decodeDepartureResponse(request.data, directionDetails) },
    }))
}

export function getDepartures(choices: string, direction: string, target: string) {
  const stationChoices = parseChoices(choices);
  let stationTarget = Station({crsCode: target});
  return (dispatch: Dispatch) => {
    dispatch(expandCRS(stationTarget.crsCode))
      .then(stationName => {
        stationTarget = stationTarget.set('stationName', stationName);
        dispatch({
            type: GET_CHOICES,
            payload: { choices: stationChoices, direction, target: stationTarget },
        });
        Promise.all(
          stationChoices.map((choice, index) => getBestDeparture(dispatch, index, choice, direction, stationTarget))
        ).then(
            () => dispatch({type: GET_CHOICES_SUCCESS, payload: {} })
          );
      });
  };
}

export function expandCRS(crsCode: string) {
  return (dispatch: Dispatch) => {
    crsCode = crsCode.toUpperCase();
    return huxley.getStationByCRS(crsCode)
      .then(stationDetails => {
        console.log('Got station', stationDetails);
        dispatch({
          type: GET_CRS,
          payload: { ...stationDetails },
        });
        return stationDetails.stationName;
      });
  }
}