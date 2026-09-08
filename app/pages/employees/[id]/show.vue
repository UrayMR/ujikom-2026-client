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
  birthDate: new Date(),
  gender: 'male',
  salary: 0
})

const formMode = ref<'show' | 'edit'>('show')

function resetForm() {
  if (employee.value) {
    form.name = employee.value.name
    form.email = employee.value.email
    form.phoneNumber = employee.value.phoneNumber
    form.address = employee.value.address
    form.birthDate = employee.value.birthDate instanceof Date
      ? employee.value.birthDate
      : new Date(employee.value.birthDate)
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

async function deleteEmployee() {
  if (!employeeId.value) return

  await useFetchForm(`/employees/${employeeId.value}`, {
    method: 'DELETE'
  })

  toast.add({
    title: 'Employee deleted',
    description: 'Employee has been removed successfully.'
  })

  await navigateTo('/employees')
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
        @update:form="(value: Partial<Employee>) => {
          if (typeof value.name === 'string') form.name = value.name
          if (typeof value.email === 'string') form.email = value.email
          if (typeof value.phoneNumber === 'string') form.phoneNumber = value.phoneNumber
          if (typeof value.address === 'string') form.address = value.address
          if (value.birthDate instanceof Date) form.birthDate = value.birthDate
          if (value.gender === 'male' || value.gender === 'female') form.gender = value.gender
          if (typeof value.salary === 'number') form.salary = value.salary
        }"
        @reset="resetForm"
        @cancel="() => navigateTo('/employees')"
        @delete="deleteEmployee"
        @submit="onUpdateSubmit"
      />
    </template>
  </UDashboardPanel>
</template>
