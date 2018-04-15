// @flow

const ONE_DAY_MS = 24*60*60*1000;

// expects to handle times in the future
export function fromHHMM(hhmm: string): Date {
  const result = hhmm.match(/^(\d{2}):(\d{2})$/);
  if (!result) throw new Error('Could not parse HH:MM string');
  const [ , h, m ] = result;
  const now = new Date();
  const date = new Date();
  date.setHours(Number(h));
  date.setMinutes(Number(m));
  if (date < now) {
      const ms = date.getTime() + ONE_DAY_MS;
      return new Date(ms);
  }
  else
    return date;
}

const twoDigits = n => (n < 10 ? `0${n}` : `${n}`);

export function toHHMM(date: Date): string {
    const h = twoDigits(date.getHours());
    const m = twoDigits(date.getMinutes());
    return `${h}:${m}`;
}

export function isAfterHHMM(a: string, b: string): boolean {
    return (fromHHMM(a) > fromHHMM(b));
}

export function addMins(date: ?Date, mins: number): Date {
    if (!date) date = new Date();
    return new Date(date.getTime() + mins * 60 * 1000);
}

export function compareHHMM(a: string, b: string): number {
    const [ an, bn ] = [ a, b ].map(s => fromHHMM(s).getTime());
    return an - bn;
}

export function hhmmWithOffsetMins(t: string, mins: number): string {
    return toHHMM(addMins(fromHHMM(t), mins));
}

if (0) {
  // Poor man's testing
  console.log(fromHHMM('00:30').toString());
  console.log(fromHHMM('10:30').toString());
  console.log(toHHMM(fromHHMM('12:34')));
  console.log(addMins(null, 15).toString());
  console.log('00:30 after 10:30', isAfterHHMM('00:30', '10:30'));
  console.log('09:30 after 10:30', isAfterHHMM('09:30', '10:30'));
  console.log(compareHHMM('11:20', '12:20'));
}
