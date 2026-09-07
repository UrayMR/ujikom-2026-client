<script setup lang="ts">
const state = reactive({
  email: '',
  password: ''
})

function submit() {
  console.log(state)
}
</script>

<template>
  <UCard>
    <form class="space-y-5" @submit.prevent="submit">
      <UFormField label="Email" name="email">
        <UInput
          v-model="state.email"
          type="email"
          placeholder="you@example.com"
          class="w-full"
        />
      </UFormField>

      <UFormField label="Password" name="password">
        <UInput
          v-model="state.password"
          type="password"
          placeholder="••••••••"
          class="w-full"
        />
      </UFormField>

      <UButton type="submit" block>
        Sign in
      </UButton>
    </form>
  </UCard>
</template>
