export function cleanLocalizedText(value: unknown): string {
  return String(value ?? '')
    .replace(/<[^>]*>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

export function localizePageTitle(page: any, fallback: string): string {
  return cleanLocalizedText(page?.hero?.title || page?.title || page?.pageTitle) || fallback;
}

export function localizePageDescription(page: any, fallback: string): string {
  return cleanLocalizedText(page?.hero?.subtitle || page?.subtitle || page?.description) || fallback;
}
