<script setup lang="ts">
import type { Employee } from '~/types'
import { employeeSchema, type EmployeeSchema } from '~/schemas/employee/employee.schema'
import type { FormSubmitEvent } from '@nuxt/ui'
import { formatBirthDate } from '~/helpers/formatBirthDate'

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
  'submit': [event: FormSubmitEvent<EmployeeSchema>]
  'cancel': []
  'delete': []
  'reset': []
  'update:form': [value: Partial<Employee>]
  'update:mode': [value: 'create' | 'edit' | 'show']
}>()

const isReadOnly = computed(() => props.mode === 'show')

const genderOptions = [
  { label: 'Male', value: 'male' },
  { label: 'Female', value: 'female' },
  { label: 'Other', value: 'other' }
]

const educationOptions = [
  { label: 'Tidak/Belum Pernah', value: 'Tidak/Belum Pernah' },
  { label: 'SD', value: 'SD' },
  { label: 'SMP', value: 'SMP' },
  { label: 'SMA/SMK', value: 'SMA/SMK' },
  { label: 'D1/D2/D3', value: 'D1/D2/D3' },
  { label: 'S1/D4', value: 'S1/D4' },
  { label: 'S2', value: 'S2' },
  { label: 'S3', value: 'S3' }
]

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

function onSubmit(event: FormSubmitEvent<EmployeeSchema>) {
  emit('submit', event)
}

function updateField<K extends keyof Employee>(field: K, value: Employee[K]) {
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
        <UForm
          :schema="employeeSchema"
          :state="form"
          class="space-y-5"
          @submit="onSubmit"
        >
          <div class="grid gap-5 md:grid-cols-2">
            <UFormField label="Name" name="name" class="md:col-span-2">
              <UInput
                :model-value="form.name ?? ''"
                :disabled="isReadOnly"
                placeholder="John Doe"
                class="w-full"
                @update:model-value="(value: string) => updateField('name', value)"
              />
            </UFormField>

            <UFormField label="Email" name="email">
              <UInput
                :model-value="form.email ?? ''"
                :disabled="isReadOnly"
                type="email"
                placeholder="john.doe@example.com"
                class="w-full"
                @update:model-value="(value: string) => updateField('email', value)"
              />
            </UFormField>

            <UFormField label="Phone Number" name="phoneNumber">
              <UInput
                :model-value="form.phoneNumber ?? ''"
                :disabled="isReadOnly"
                placeholder="+62 812 3456 7890"
                class="w-full"
                @update:model-value="(value: string) => updateField('phoneNumber', value)"
              />
            </UFormField>

            <UFormField label="Gender" name="gender">
              <USelect
                :model-value="form.gender ?? 'male'"
                :disabled="isReadOnly"
                :items="genderOptions"
                class="w-full"
                @update:model-value="(value: any) => updateField('gender', value)"
              />
            </UFormField>

            <UFormField label="Birth Date" name="birthDate">
              <UInput
                :model-value="form.birthDate ? new Date(form.birthDate).toISOString().split('T')[0] : ''"
                :disabled="isReadOnly"
                type="date"
                class="w-full"
                @update:model-value="(value: string) => updateField('birthDate', value)"
              />
            </UFormField>

            <UFormField label="Education" name="education">
              <USelect
                :model-value="form.education ?? 'SMA/SMK'"
                :disabled="isReadOnly"
                :items="educationOptions"
                class="w-full"
                @update:model-value="(value: any) => updateField('education', value)"
              />
            </UFormField>

            <UFormField label="Salary" name="salary">
              <UInput
                :model-value="form.salary?.toString() ?? '0'"
                :disabled="isReadOnly"
                type="number"
                placeholder="0"
                class="w-full"
                @update:model-value="(value: string) => updateField('salary', Number(value))"
              />
            </UFormField>

            <UFormField label="Address" name="address" class="md:col-span-2">
              <UTextarea
                :model-value="form.address ?? ''"
                :disabled="isReadOnly"
                placeholder="Enter full address..."
                class="w-full"
                @update:model-value="(value: string) => updateField('address', value)"
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

      <div class="rounded-2xl border border-default bg-elevated/30 p-5 sm:p-6 space-y-4">
        <p class="text-xs font-medium uppercase tracking-[0.2em] text-muted">
          Quick summary
        </p>

        <div class="space-y-4">
          <div>
            <p class="text-xs uppercase text-muted">
              Name
            </p>
            <p class="mt-1 text-base font-medium text-highlighted">
              {{ form.name || '-' }}
            </p>
          </div>
          <div>
            <p class="text-xs uppercase text-muted">
              Email
            </p>
            <p class="mt-1 text-base font-medium text-highlighted">
              {{ form.email || '-' }}
            </p>
          </div>
          <div>
            <p class="text-xs uppercase text-muted">
              Phone Number
            </p>
            <p class="mt-1 text-base font-medium text-highlighted">
              {{ form.phoneNumber || '-' }}
            </p>
          </div>
          <div>
            <p class="text-xs uppercase text-muted">
              Education
            </p>
            <p class="mt-1 text-base font-medium text-highlighted">
              {{ form.education || '-' }}
            </p>
          </div>
          <div>
            <p class="text-xs uppercase text-muted">
              Gender
            </p>
            <p class="mt-1 text-base font-medium text-highlighted capitalize">
              {{ form.gender || '-' }}
            </p>
          </div>
          <div>
            <p class="text-xs uppercase text-muted">
              Birth Date
            </p>
            <p class="mt-1 text-base font-medium text-highlighted">
              {{ form.birthDate ? formatBirthDate(form.birthDate) : '-' }}
            </p>
          </div>
          <div>
            <p class="text-xs uppercase text-muted">
              Salary
            </p>
            <p class="mt-1 text-base font-medium text-highlighted">
              {{ form.salary !== undefined ? new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(form.salary) : '-' }}
            </p>
          </div>
          <div>
            <p class="text-xs uppercase text-muted">
              Address
            </p>
            <p class="mt-1 text-base font-medium text-highlighted whitespace-pre-line">
              {{ form.address || '-' }}
            </p>
          </div>
        </div>

        <div v-if="mode !== 'create'" class="mt-6 flex gap-2">
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
