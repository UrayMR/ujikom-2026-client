<script setup lang="ts">
const route = useRoute()
const toast = useToast()

const employeeId = computed(() => String(route.params.id ?? ''))

const form = reactive({
  name: ''
})

const { data: response, status } = await useFetchData(`/employees/${employeeId.value}`)
console.log('Employee data:', response)
const employee = computed(() => response?.value?.data ?? null)

watch(
  () => employee.value,
  (value) => {
    if (value) {
      Object.assign(form, value)
    }
  },
  { immediate: true }
)

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
        :form="form"
        title="Employee Detail"
        subtitle="Employee profile information."
        mode="show"
        @cancel="() => navigateTo('/employees')"
        @delete="deleteEmployee"
      />
    </template>
  </UDashboardPanel>
</template>
