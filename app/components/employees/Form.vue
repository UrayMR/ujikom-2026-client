<script setup lang="ts">
import type { Employee } from '~/types'

const props = withDefaults(defineProps<{
  form: Partial<Employee>
  loading?: boolean
  title?: string
  subtitle?: string
  mode?: 'create' | 'edit' | 'show'
}>(), {
  loading: false,
  title: 'Employee',
  subtitle: '',
  mode: 'create'
})

const emit = defineEmits<{
  'submit': []
  'cancel': []
  'delete': []
  'reset': []
  'update:form': [value: Partial<Employee>]
  'update:mode': [value: 'create' | 'edit' | 'show']
}>()

const isReadOnly = computed(() => props.mode === 'show')

const submitLabel = computed(() => {
  switch (props.mode) {
    case 'create':
      return 'Save Employee'
    case 'edit':
      return 'Update Employee'
    default:
      return 'Submit'
  }
})

const onCancel = () => {
  if (props.mode === 'edit') {
    emit('reset')
    emit('update:mode', 'show')
    return
  }

  emit('cancel')
}

function updateField(field: keyof Employee, value: string) {
  emit('update:form', {
    ...props.form,
    [field]: value
  })
}

function toggleEditMode() {
  if (props.mode === 'show') {
    emit('update:mode', 'edit')
  }
}
</script>

<template>
  <div class="mx-auto w-full p-4 md:p-6">
    <div class="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
      <div>
        <h1 class="mt-1 text-2xl font-semibold text-highlighted">
          {{ title }}
        </h1>
        <p v-if="subtitle" class="mt-1 text-sm text-muted">
          {{ subtitle }}
        </p>
      </div>

      <UButton
        label="Back"
        color="neutral"
        variant="ghost"
        icon="i-lucide-arrow-left"
        @click="emit('cancel')"
      />
    </div>

    <div class="grid gap-6 lg:grid-cols-[1.6fr_0.9fr]">
      <div class="rounded-2xl border border-default bg-default/40 p-5 sm:p-6">
        <UForm :state="form" class="space-y-5" @submit="emit('submit')">
          <div class="grid gap-5 md:grid-cols-1">
            <UFormField label="Name" name="name">
              <UInput
                :model-value="form.name ?? ''"
                :disabled="isReadOnly"
                placeholder="John Doe"
                class="w-full"
                @update:model-value="(value: string) => updateField('name', value)"
              />
            </UFormField>
          </div>

          <div class="pt-2 flex justify-end">
            <div v-if="mode !== 'show'" class="flex gap-2">
              <UButton
                label="Cancel"
                color="neutral"
                variant="subtle"
                @click="onCancel"
              />
              <UButton
                :label="submitLabel"
                type="submit"
                color="primary"
                :loading="loading"
              />
            </div>

            <div v-else>
              <UButton
                label="Edit"
                color="primary"
                variant="subtle"
                @click="toggleEditMode"
              />
            </div>
          </div>
        </UForm>
      </div>

      <div class="rounded-2xl border border-default bg-elevated/30 p-5 sm:p-6">
        <p class="text-xs font-medium uppercase tracking-[0.2em] text-muted">
          Quick summary
        </p>

        <div class="mt-4 space-y-4">
          <div>
            <p class="text-xs uppercase text-muted">
              Name
            </p>
            <p class="mt-1 text-base font-medium text-highlighted">
              {{ form.name || 'Not provided' }}
            </p>
          </div>
        </div>

        <div class="mt-6 flex gap-2">
          <UButton
            label="Delete"
            color="error"
            variant="soft"
            icon="i-lucide-trash"
            :disabled="mode !== 'show'"
            @click="emit('delete')"
          />
        </div>
      </div>
    </div>
  </div>
</template>
