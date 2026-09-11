export function useServerCookieHeader() {
  if (import.meta.server) {
    return useRequestHeaders(['cookie'])
  }
  return {}
}
