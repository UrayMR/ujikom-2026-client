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
  const toast = useToast()

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
      toast.add({
        title: 'Forbidden',
        description: 'You do not have permission to access this resource.',
        color: 'error'
      })
    } else if (status === 404) {
      toast.add({
        title: 'Not Found',
        description: 'Requested resource not found.',
        color: 'error'
      })
    } else if (status && status >= 500) {
      toast.add({
        title: 'Server Error',
        description: 'An unexpected error occured. Please try again later.',
        color: 'error'
      })
    } else {
      toast.add({
        title: 'Request failed',
        description: 'An unexpected error occurred. Please try again.',
        color: 'error'
      })
    }

    throw error
  }
}
