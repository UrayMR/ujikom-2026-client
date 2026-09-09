<script setup lang="ts">
import type { Employee } from '~/types'
import type { FormSubmitEvent } from '@nuxt/ui'
import type { EmployeeSchema } from '~/schemas/employee/employee.schema'

const toast = useToast()

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

const submitting = ref(false)

async function onSubmit(event: FormSubmitEvent<EmployeeSchema>) {
  submitting.value = true

  try {
    await useFetchForm('/employees', {
      method: 'POST',
      body: event.data
    })

    toast.add({
      title: 'Employee created',
      description: 'New employee has been added successfully.'
    })

    await navigateTo('/employees')
  } finally {
    submitting.value = false
  }
}
</script>

<template>
  <UDashboardPanel id="employee-create">
    <template #header>
      <UDashboardNavbar title="Create Employee">
        <template #leading>
          <UDashboardSidebarCollapse />
        </template>
      </UDashboardNavbar>
    </template>

    <template #body>
      <EmployeesForm
        :form="form"
        title="Create Employee"
        subtitle="Fill in the employee details below."
        submit-label="Save Employee"
        :loading="submitting"
        mode="create"
        @update:form="(value: Partial<Employee>) => Object.assign(form, value)"
        @submit="onSubmit"
        @cancel="() => navigateTo('/employees')"
      />
    </template>
  </UDashboardPanel>
</template>
