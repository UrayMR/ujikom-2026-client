import type { FetchOptions } from 'ofetch'

type FetchDataOptions = Omit<
  FetchOptions,
  'method'
>

export const useFetchData = <T>(
  url: string,
  options: FetchDataOptions = {}
) => {
  const config = useRuntimeConfig()
  const cookieHeader = useServerCookieHeader()
  const { show } = useAlert()

  return useFetch<T>(url, {
    ...options,

    baseURL: config.public.apiBaseUrl,
    credentials: 'include',

    headers: {
      ...cookieHeader,
      ...options.headers
    },

    onResponseError({ response }) {
      const status = response.status

      if (status === 401) {
        const { user } = useAuth()

        user.value = null
      }

      if (status === 403) {
        show(
          'You do not have permission to access this resource.',
          'error'
        )
      }

      if (status === 404) {
        show(
          'Requested resource not found.',
          'error'
        )
      }

      if (status === 500) {
        show(
          'Server error. Please try again later.',
          'error'
        )
      }
    }
  })
}
