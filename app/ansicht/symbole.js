/* Symbole auf einem 24er-Raster, Strich 2, runde Enden – eine Familie fuer die ganze App. */
const PFADE = {
  zurueck: '<path d="M15 5l-7 7 7 7"/>',
  start: '<path d="M8 5.5v13l10.5-6.5z" fill="currentColor"/>',
  pause: '<path d="M8 5v14M16 5v14"/>',
  schleife: '<path d="M4.5 11a7.5 7.5 0 0 1 13-4.6L20 9M20 4v5h-5"/><path d="M19.5 13a7.5 7.5 0 0 1-13 4.6L4 15M4 20v-5h5"/>',
  feuer: '<path d="M12 3c.8 3.2 5 5.4 5 10.3a5 5 0 0 1-10 0c0-2.2 1-3.7 2.2-4.8.4 2.1 1.4 3.2 2.9 3.4-1.4-2.9-1-5.9-.1-8.9z"/>',
  minus: '<path d="M6 12h12"/>',
  plus: '<path d="M6 12h12M12 6v12"/>',
  ab: '<path d="M12 4v15M6.5 13.5L12 19l5.5-5.5"/>',
  auf: '<path d="M12 20V5M6.5 10.5L12 5l5.5 5.5"/>',
  chunk: '<path d="M7 7l10 10M17 7L7 17"/>',
  pausenschlag: '<circle cx="12" cy="12" r="1.8" fill="currentColor" stroke="none"/>',
};

export function symbol(name, beschriftung = "") {
  const rolle = beschriftung ? `role="img" aria-label="${beschriftung}"` : 'aria-hidden="true"';
  return `<svg class="symbol" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" ${rolle}>${PFADE[name]}</svg>`;
}
