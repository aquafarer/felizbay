import { defineMiddleware } from 'astro:middleware';
import { languages, defaultLang } from '~/i18n/config';

export const onRequest = defineMiddleware(async (context, next) => {
  const url = context.url.pathname;

  const pathLang = url.split('/')[1]?.split('?')[0] || '';
  const hasLangPrefix = pathLang in languages;

  const lang = hasLangPrefix ? pathLang : defaultLang;
  context.locals.lang = lang;
  context.locals.locale = lang;
  context.locals.isEN = lang === 'en';

  return next();
});
