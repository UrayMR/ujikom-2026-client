import type { FetchOptions } from 'ofetch'

type HttpMethod
  = | 'GET'
    | 'POST'
    | 'PUT'
    | 'PATCH'
    | 'DELETE'

type FetchFormOptions = Omit<
  FetchOptions,
  'method'
> & {
  method?: HttpMethod
}

export const useFetchForm = async <T>(
  url: string,
  options: FetchFormOptions = {}
) => {
  const config = useRuntimeConfig()
  const cookieHeader = useServerCookieHeader()
  const { show } = useAlert()

  const isMultipart = options.body instanceof FormData

  const headers = new Headers(options.headers)

  if (cookieHeader.cookie) {
    headers.set('cookie', cookieHeader.cookie)
  }

  headers.set('Accept', 'application/json')

  if (!isMultipart && !headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json')
  }

  try {
    return await $fetch<T>(url, {
      ...options,
      baseURL: config.public.apiBaseUrl,
      credentials: 'include',
      headers
    })
  } catch (error: unknown) {
    const status = (
      error as { response?: { status?: number } }
    ).response?.status

    if (status === 403) {
      show('You do not have permission to access this resource.', 'error')
    } else if (status === 404) {
      show('Requested resource not found.', 'error')
    } else if (status === 500) {
      show('Server error. Please try again later.', 'error')
    }

    throw error
  }
}
