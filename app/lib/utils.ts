export const MONTH_ALIASES: Record<string, string> = {
  JAN: 'JANUARY',
  FEB: 'FEBRUARY',
  MAR: 'MARCH',
  MARCH: 'MARCH',
  APR: 'APRIL',
  APRIL: 'APRIL',
  MAY: 'MAY',
  JUN: 'JUNE',
  JUNE: 'JUNE',
  JUL: 'JULY',
  JULY: 'JULY',
  AUG: 'AUGUST',
  SEP: 'SEPTEMBER',
  SEPT: 'SEPTEMBER',
  OCT: 'OCTOBER',
  NOV: 'NOVEMBER',
  DEC: 'DECEMBER',
};

export const MONTH_KEYS = Object.keys(MONTH_ALIASES).sort(
  (a, b) => b.length - a.length
);

export const FULL_MONTHS = [
  'JANUARY',
  'FEBRUARY',
  'MARCH',
  'APRIL',
  'MAY',
  'JUNE',
  'JULY',
  'AUGUST',
  'SEPTEMBER',
  'OCTOBER',
  'NOVEMBER',
  'DECEMBER',
];

export function cleanImageUrl(url: string): string {
  if (!url) return '';
  const match = url.match(/^(.*?\.(jpe?g|png|gif|webp|bmp|tiff?|svg|avif))/i);
  return match ? match[1] : url;
}

export function detectMonth(str?: string): string | null {
  const s = (str || '').toUpperCase().trim();
  for (const key of MONTH_KEYS) {
    if (s.startsWith(key)) return MONTH_ALIASES[key];
  }
  return null;
}

export function getSessionKey(photo: {
  event?: string;
  desc?: string;
  date?: string;
}): string {
  if (photo.date && photo.date.trim() !== '') {
    const cleanDate = photo.date.toUpperCase().trim();
    if (cleanDate !== 'UNKNOWN' && cleanDate !== 'NONE') {
      return cleanDate;
    }
  }

  const src = (photo.event || photo.desc || '').toUpperCase().trim();
  const dateMatch = src.match(
    /^(JANUARY|FEBRUARY|MARCH|APRIL|MAY|JUNE|JULY|AUGUST|SEPTEMBER|OCTOBER|NOVEMBER|DECEMBER|JAN|FEB|MAR|APR|JUN|JUL|AUG|SEP|SEPT|OCT|NOV|DEC)\s*\d{1,2}/i
  );

  if (dateMatch) return dateMatch[0].toUpperCase();
  if (src.includes(':')) return src.split(':')[0].trim().toUpperCase();
  return src.split(' ')[0].toUpperCase() || 'UNKNOWN';
}

export function generatePhotoId(
  eraId: string,
  photog?: string,
  date?: string,
  index: number = 1
): string {
  const cleanEra = (eraId || 'era').toLowerCase().replace(/[^a-z0-9]+/g, '-');
  const cleanPhotog = (photog || 'unknown').toLowerCase().replace(/[^a-z0-9]+/g, '-');
  const cleanDate = (date || 'nodate').toLowerCase().replace(/[^a-z0-9]+/g, '-');
  
  return `era/${cleanEra}/${cleanPhotog}/${cleanDate}/${index}`;
}