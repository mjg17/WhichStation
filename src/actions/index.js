// @flow

import type { RecordOf, RecordFactory } from 'immutable';
import { List, Record } from 'immutable';

export const GET_DEPARTURES = 'GET_DEPARTURES';

type StationProps = {|
    crsCode: string,
    stationName: string,
|};

type StationChoiceProps = {|
  ...StationProps,
  travelMinutes: number,
|};

type StationChoice = RecordOf<StationChoiceProps>;
const makeStationChoice: RecordFactory<StationChoiceProps> = Record({crsCode: '', stationName: '', travelMinutes: 0}, 'StationChoice');

const parseChoices = (choices: string): List<StationChoice> => {
  const stationStrings = choices.split('--');
  const stations = stationStrings.map(s => {
    let crsCode = '', travelMinutes = 0;
    const result = s.match(/^(\w+)-(\d+)$/);
    if (result)
      [ , crsCode, travelMinutes ] = result;
    return makeStationChoice({ crsCode, travelMinutes: Number(travelMinutes) });
  });
  return List(stations);
}

export function getDepartures(choices: string, direction: string, target: string) {
  const stationChoices = parseChoices(choices);
  return {
    type: GET_DEPARTURES,
    payload: { stationChoices, direction, target },
  };
}
