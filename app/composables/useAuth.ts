interface AuthUser {
  id: string
  name: string
  email: string
  role: string
}

interface ApiResponse<T> {
  success: boolean
  code: number
  message: string
  data: T
}

export function useAuth() {
  const config = useRuntimeConfig()

  const user = useState<AuthUser | null>(
    'auth:user',
    () => null
  )

  const isAuthenticated = computed(
    () => user.value !== null
  )

  async function login(
    email: string,
    password: string
  ) {
    const response = await $fetch<ApiResponse<AuthUser>>(
      '/auth/login',
      {
        baseURL: config.public.apiBaseUrl,
        method: 'POST',
        credentials: 'include',
        body: {
          email,
          password
        }
      }
    )

    user.value = response.data

    return response
  }

  async function fetchUser() {
    try {
      const response = await $fetch<ApiResponse<AuthUser>>(
        '/auth/me',
        {
          baseURL: config.public.apiBaseUrl,
          method: 'GET',
          credentials: 'include'
        }
      )

      user.value = response.data

      return response.data
    } catch {
      user.value = null
      return null
    }
  }

  async function logout() {
    try {
      await $fetch<ApiResponse<null>>(
        '/auth/logout',
        {
          baseURL: config.public.apiBaseUrl,
          method: 'POST',
          credentials: 'include'
        }
      )
    } finally {
      user.value = null
    }
  }

  return {
    user,
    isAuthenticated,
    login,
    fetchUser,
    logout
  }
}
