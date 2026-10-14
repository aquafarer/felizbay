// @ts-nocheck - content is provided at build time by per-page generated modules
// (src/i18n/generated/pages/<page>.ts) via setPageContentData(), and at runtime
// by middleware (loadDataJson). Keeping this a plain cache avoids bundling the
// multi-MB data into a single chunk (which breaks the prerender build).
import { getUiForLang } from './generated/ui-all';

const cache: Record<string, any> = {};

export function setPageContentData(data: Record<string, any>) {
  Object.assign(cache, data);
}

export function getPageContent(lang: string, page: string = 'home'): any {
  return cache[`${lang}/${page}`] || cache[`en/${page}`] || {};
}

let _currentLang = 'en';
export function setLang(lang: string) {
  _currentLang = lang || 'en';
}

export function getUi(): any {
  return getUiForLang(_currentLang);
}
