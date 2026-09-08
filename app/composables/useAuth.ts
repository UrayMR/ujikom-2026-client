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
    const response
      = await useFetchForm<ApiResponse<AuthUser>>(
        '/auth/login',
        {
          method: 'POST',
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
      const response = await useFetchForm<ApiResponse<AuthUser>>(
        '/auth/me',
        {
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
      await useFetchForm<ApiResponse<null>>(
        '/auth/logout',
        {
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
