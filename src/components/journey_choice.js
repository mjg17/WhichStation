// @flow

import React from 'react';
import type { StationChoiceT } from '../types';

type Props = {
  choice: StationChoiceT,
  direction: string,
  highlight: boolean,
};

export default function JouneyChoice(props: Props) {
  const { choice, direction, highlight } = props;
  const revDirection = direction === 'from' ? 'to' : 'from';
  if (!choice.available)
    return (<em>Not available {revDirection} {choice.crsCode}</em>);
  const contents = (direction === 'to')
    ? `${revDirection} ${choice.crsCode} at ${choice.std} (leave by ${choice.dep}), to arrive at ${choice.sta}`
    : `${revDirection} ${choice.crsCode} leaving at ${choice.std}, to arrive at ${choice.sta} (reaching your destination at ${choice.arr})`;
  return (
    <span>{ highlight ? <mark>{contents}</mark> : contents }</span>
  );
}
