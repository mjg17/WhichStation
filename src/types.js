// @flow

import { Record } from 'immutable';
import type { List, RecordOf, RecordFactory } from 'immutable';

export type StationProps = {|
    crsCode: string,
    stationName: string,
|};
export type StationT = RecordOf<StationProps>;

export const Station: RecordFactory<StationProps> = Record({
  crsCode: '',
  stationName: '',
}, 'Station');

export type StationChoiceProps = {|
  ...StationProps,
  travelMinutes: number,
  loading: boolean,
  available: boolean,
  arr: string,
  dep: string,
  sta: string,
  std: string,
|};
export type StationChoiceT = RecordOf<StationChoiceProps>;

export const StationChoice: RecordFactory<StationChoiceProps> = Record({
  crsCode: '',
  stationName: '',
  travelMinutes: 0,
  loading: false,
  available: false,
  arr: '',
  dep: '',
  sta: '',
  std: '',
}, 'StationChoice');

export type State = RecordOf<{
    choices: List<StationChoiceT>,
    direction: string,
    target: StationT,
    loading: boolean,
}>;
