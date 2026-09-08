<script setup lang="ts">
import type { ApiResponse, Employee } from '~/types'

const route = useRoute()
const toast = useToast()

const employeeId = computed(() => String(route.params.id ?? ''))

const { data: response, status, refresh } = await useFetchData<ApiResponse<Employee>>(
  `/employees/${employeeId.value}`
)
const employee = computed(() => response.value?.data ?? null)

const form = reactive({
  name: employee.value?.name ?? '',
  email: employee.value?.email ?? '',
  phoneNumber: employee.value?.phoneNumber ?? '',
  address: employee.value?.address ?? '',
  birthDate: employee.value?.birthDate ?? new Date(),
  gender: employee.value?.gender ?? 'male',
  salary: employee.value?.salary ?? 0
})

const formMode = ref<'show' | 'edit'>('show')

function resetForm() {
  if (employee.value) {
    form.name = employee.value.name
  }
}

watch(employee, (val) => {
  if (val) resetForm()
}, { immediate: true })

async function onUpdateSubmit() {
  if (!employeeId.value) return

  await useFetchForm(`/employees/${employeeId.value}`, {
    method: 'PATCH',
    body: {
      name: form.name
    }
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
          if (typeof value.name === 'string') {
            form.name = value.name
          }
        }"
        @reset="resetForm"
        @cancel="() => navigateTo('/employees')"
        @delete="deleteEmployee"
        @submit="onUpdateSubmit"
      />
    </template>
  </UDashboardPanel>
</template>
