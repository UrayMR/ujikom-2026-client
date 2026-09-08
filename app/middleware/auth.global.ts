export default defineNuxtRouteMiddleware(async (to) => {
  const { user, fetchUser } = useAuth()

  const publicRoutes = [
    '/login'
  ]

  if (!user.value) {
    await fetchUser()
  }

  if (to.path === '/login' && user.value) {
    return navigateTo('/dashboard')
  }

  if (publicRoutes.includes(to.path)) {
    return
  }

  if (!user.value) {
    return navigateTo('/login')
  }
})
