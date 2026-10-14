export const ROOT_ONLY_ROUTES = ['/internal', '/login', '/ai-context', '/factory/tour', '/register', '/404'];

export function isRootOnlyRoute(pathWithoutLang: string): boolean {
  return ROOT_ONLY_ROUTES.some((p) => pathWithoutLang === p || pathWithoutLang.startsWith(p + '/'));
}
