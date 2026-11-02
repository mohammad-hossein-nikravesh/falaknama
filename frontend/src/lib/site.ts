// Falaknama's public facts in one place. Leave a contact empty to hide it.
export const site = {
  name: 'فلک‌نما',
  url: 'https://falaknama.ir',
  email: 'info@falaknama.ir',
  telegram: 'falaknama',
  // PLACEHOLDER: replace with the admin's real number before launch (international, no +).
  whatsapp: '989000000000',
};

const persianDate = new Intl.DateTimeFormat('fa-IR-u-ca-persian', {
  timeZone: 'Asia/Tehran',
  day: 'numeric',
  month: 'long',
  year: 'numeric',
});
const persianDayMonth = new Intl.DateTimeFormat('fa-IR-u-ca-persian', {
  timeZone: 'Asia/Tehran',
  day: 'numeric',
  month: 'long',
});

/** "۸ آبان ۱۴۰۵" */
export const toJalali = (iso: string | Date) =>
  persianDate.format(new Date(iso));

/** "۱۸ آبان تا ۸ آذر ۱۴۰۵", or a single date when there is no end. */
export function jalaliRange(start: string, end?: string | null) {
  if (!end || new Date(end).toDateString() === new Date(start).toDateString())
    return toJalali(start);
  return `${persianDayMonth.format(new Date(start))} تا ${toJalali(end)}`;
}

export const jalaliYear = () =>
  new Intl.DateTimeFormat('fa-IR-u-ca-persian', { year: 'numeric' }).format(
    new Date(),
  );

export const faNumber = (n: number) => n.toLocaleString('fa-IR');
