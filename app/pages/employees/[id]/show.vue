<script setup lang="ts">
import type { ApiResponse, Employee } from '~/types'
import type { FormSubmitEvent } from '@nuxt/ui'
import type { EmployeeSchema } from '~/schemas/employee/employee.schema'

const route = useRoute()
const toast = useToast()

const employeeId = computed(() => String(route.params.id ?? ''))

const { data: response, status, refresh } = await useFetchData<ApiResponse<Employee>>(
  `/employees/${employeeId.value}`
)
const employee = computed(() => response.value?.data ?? null)

const form = reactive<EmployeeSchema>({
  name: '',
  email: '',
  phoneNumber: '',
  address: '',
  education: 'SMA/SMK',
  birthDate: '',
  gender: 'male',
  salary: 0
})

const formMode = ref<'show' | 'edit'>('show')

const deleteModalOpen = ref(false)
const deleteLoading = ref(false)

function resetForm() {
  if (employee.value) {
    form.name = employee.value.name
    form.email = employee.value.email
    form.phoneNumber = employee.value.phoneNumber
    form.address = employee.value.address
    form.birthDate = employee.value.birthDate
    form.gender = employee.value.gender
    form.salary = employee.value.salary
  }
}

watch(employee, (val) => {
  if (val) resetForm()
}, { immediate: true })

async function onUpdateSubmit(event: FormSubmitEvent<EmployeeSchema>) {
  if (!employeeId.value) return

  await useFetchForm(`/employees/${employeeId.value}`, {
    method: 'PATCH',
    body: event.data
  })

  toast.add({
    title: 'Employee updated',
    description: 'Employee data has been updated successfully.'
  })

  formMode.value = 'show'

  await refresh()
}

function confirmDelete() {
  deleteModalOpen.value = true
}

async function executeDelete() {
  if (!employeeId.value) return

  deleteLoading.value = true

  try {
    await useFetchForm(`/employees/${employeeId.value}`, {
      method: 'DELETE'
    })

    toast.add({
      title: 'Employee deleted',
      description: `${employee.value?.name ?? ''} has been removed successfully.`
    })

    deleteModalOpen.value = false
    await navigateTo('/employees')
  } finally {
    deleteLoading.value = false
  }
}
</script>

<template>
  <UDashboardPanel id="employee-show">
    <template #header>
      <UDashboardNavbar title="Employee Detail">
        <template #leading>
          <UDashboardSidebarCollapse />
        </template>
      </UDashboardNavbar>
    </template>

    <template #body>
      <div v-if="status === 'pending'" class="p-4 text-sm text-muted">
        Loading employee...
      </div>

      <div v-else-if="!employee" class="p-4 text-sm text-muted">
        Employee not found.
      </div>

      <EmployeesForm
        v-else
        v-model:mode="formMode"
        :form="form"
        title="Employee Detail"
        subtitle="Employee profile information."
        @update:form="(value: Partial<EmployeeSchema>) => Object.assign(form, value)"
        @reset="resetForm"
        @cancel="() => navigateTo('/employees')"
        @delete="confirmDelete"
        @submit="onUpdateSubmit"
      />

      <UModal
        v-model:open="deleteModalOpen"
        :title="`Delete employee ${employee?.name ?? ''}`"
        description="Are you sure, this action cannot be undone."
      >
        <template #body>
          <div class="flex justify-end gap-2">
            <UButton
              label="Cancel"
              color="neutral"
              variant="subtle"
              :disabled="deleteLoading"
              @click="deleteModalOpen = false"
            />
            <UButton
              label="Delete"
              color="error"
              variant="solid"
              :loading="deleteLoading"
              @click="executeDelete"
            />
          </div>
        </template>
      </UModal>
    </template>
  </UDashboardPanel>
</template>
