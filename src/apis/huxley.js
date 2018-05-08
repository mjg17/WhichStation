// @flow

import axios from 'axios';
import ACCESS_TOKEN from '../../access_token';

const ROOT_URL = 'https://huxley.apphb.com';

const buildDeparturesString = (fromCrs: string, direction: string, destCrs: string): string => {
  return `/departures/${fromCrs}/${direction}/${destCrs}`;
}

export function getDepartures(fromCrs: string, destCrs: string) {
  const queryString = buildDeparturesString(fromCrs, 'to', destCrs);
  return axios.get(`${ROOT_URL}${queryString}?expand=true&accessToken=${ACCESS_TOKEN}`)
}

export function trainServices(data: Object): ?Array<Object> {
  if (!data.areServicesAvailable) return null;
  if (!data.trainServices) return null;
  return data.trainServices;
}

export function findDestinationDetails(service: Object, destCrs: string): Object {
  destCrs = destCrs.toUpperCase();
  const callingPoints = service.subsequentCallingPoints[0].callingPoint;
  const result = callingPoints.find(cp => cp.crs.toUpperCase() === destCrs);
  if (!result) throw new Error('destCrs not found in callingPoints');
  return result;
}

let getCrs;
let crsTable;
function getCrsTable(): Object {
  if (crsTable)
    return Promise.resolve(crsTable);
  if (!getCrs)
    getCrs = axios.get(`${ROOT_URL}/crs?accessToken=${ACCESS_TOKEN}`);
  return getCrs.then(r => {
    if (crsTable) // check again here since we may be doubled-up on the original axios.get
      return crsTable;
    crsTable = r.data.reduce((map, station) => {
      map[station.crsCode] = station;
      return map;
    }, {});
    console.log('crsTable', crsTable);
    return crsTable;
  });
}

export function getStationByCRS(crsCode: string): Object {
  console.log('getStationByCRS request for', crsCode);
  return getCrsTable()
    .then(crsTable => crsTable[crsCode]);
}

export default { getDepartures, trainServices, findDestinationDetails, getStationByCRS };
