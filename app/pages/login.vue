<script setup lang="ts">
definePageMeta({
  layout: 'auth'
})
</script>

<template>
  <div class="w-full max-w-md">
    <div class="mb-8 text-center">
      <h1 class="text-3xl font-bold">
        Welcome Back!
      </h1>

      <p class="mt-2 text-muted">
        Sign in to your account
      </p>
    </div>

    <AuthLoginForm />
  </div>
</template>
