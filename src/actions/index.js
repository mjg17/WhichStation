// @flow

import { List } from 'immutable';

import { Station, StationChoice } from '../types';
import type { StationChoiceT } from '../types';

export const GET_DEPARTURES = 'GET_DEPARTURES';

type ActionType = 'GET_DEPARTURES';
export type Action = {| type: ActionType, payload: any |};

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

export function getDepartures(choices: string, direction: string, target: string) {
  const stationChoices = parseChoices(choices);
  const stationTarget = Station({crsCode: target});
  return {
    type: GET_DEPARTURES,
    payload: { choices: stationChoices, direction, target: stationTarget },
  };
}
