<script setup lang="ts">
import type { FormSubmitEvent } from '@nuxt/ui'
import { loginSchema, type LoginSchema } from '~/schemas/auth/login.schema'

const form = useTemplateRef('form')
const state = reactive<LoginSchema>({ email: '', password: '' })
const loading = ref(false)
const { login } = useAuth()
const { apply: applyFormErrors } = useFormErrors()

async function submit(event: FormSubmitEvent<LoginSchema>) {
  if (loading.value) return loading.value = true

  try {
    await login(event.data.email, event.data.password)
    await navigateTo('/dashboard')
  } catch (error) {
    applyFormErrors(form.value!, error)
  } finally { loading.value = false }
}
</script>

<template>
  <UCard>
    <UForm
      ref="form"
      class="space-y-5"
      :schema="loginSchema"
      :state="state"
      @submit="submit"
    >
      <UFormField label="Email" name="email" required>
        <UInput
          v-model="state.email"
          type="email"
          placeholder="Your email address"
          class="w-full"
          autocomplete="email"
        />
      </UFormField>

      <UFormField label="Password" name="password" required>
        <UInput
          v-model="state.password"
          type="password"
          placeholder="Your password"
          class="w-full"
          autocomplete="current-password"
        />
      </UFormField>

      <UButton
        type="submit"
        block
        :loading="loading"
        :disabled="loading"
      >
        Sign in
      </UButton>
    </UForm>
  </UCard>
</template>
