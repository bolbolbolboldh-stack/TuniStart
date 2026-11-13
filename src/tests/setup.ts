import '@testing-library/jest-dom/vitest'

// jsdom does not implement scrolling or matchMedia.
if (typeof window !== 'undefined') window.scrollTo = (() => {}) as typeof window.scrollTo
if (typeof window !== 'undefined' && !window.matchMedia) {
  window.matchMedia = ((q: string) => ({ matches: false, media: q, onchange: null, addEventListener() {}, removeEventListener() {}, addListener() {}, removeListener() {}, dispatchEvent: () => false })) as unknown as typeof window.matchMedia
}
