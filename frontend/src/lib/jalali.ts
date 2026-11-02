import { jalaaliMonthLength, toGregorian, toJalaali } from 'jalaali-js';

export const jalaliMonths = [
  'فروردین',
  'اردیبهشت',
  'خرداد',
  'تیر',
  'مرداد',
  'شهریور',
  'مهر',
  'آبان',
  'آذر',
  'دی',
  'بهمن',
  'اسفند',
];

export interface JalaliDate {
  jy: number;
  jm: number;
  jd: number;
}

/** A stored date (ISO) in the Tehran calendar day it falls on. */
export function isoToJalali(iso: string): JalaliDate {
  const [y, m, d] = new Date(iso)
    .toLocaleDateString('en-CA', { timeZone: 'Asia/Tehran' })
    .split('-')
    .map(Number) as [number, number, number];
  return toJalaali(y, m, d);
}

/** The Jalali day as a plain `YYYY-MM-DD` Gregorian date, which the API stores as that day's UTC midnight. */
export function jalaliToIso({ jy, jm, jd }: JalaliDate): string {
  const { gy, gm, gd } = toGregorian(jy, jm, jd);
  return `${gy}-${String(gm).padStart(2, '0')}-${String(gd).padStart(2, '0')}`;
}

export const monthLength = jalaaliMonthLength;

export const todayJalali = () => isoToJalali(new Date().toISOString());
