export const ROOT_ONLY_ROUTES = [
  '/internal',
  '/login',
  '/ai-context',
  '/factory/tour',
  '/register',
  '/404',
  // EN-only utility pages with no localized variants — hreflang alternates and
  // language-switcher links for them would be dead URLs.
  '/products/specs',
  '/products/compare',
  '/request-quotation',
  '/ai-answer-center',
];

export function isRootOnlyRoute(pathWithoutLang: string): boolean {
  return ROOT_ONLY_ROUTES.some((p) => pathWithoutLang === p || pathWithoutLang.startsWith(p + '/'));
}
