<script setup lang="ts">
import { createEmployeeColumns } from '~/components/employees/EmployeeColumn'
import type {
  ApiResponse,
  Employee
} from '~/types'

const UButton = resolveComponent('UButton')
const toast = useToast()

const {
  data: response,
  status,
  refresh
} = await useFetchData<
  ApiResponse<Employee[]>
>('/employees')

const employees = computed(
  () => response.value?.data ?? []
)

function copyEmployeeId(employee: Employee) {
  navigator.clipboard.writeText(employee.id.toString())

  toast.add({
    title: 'Copied to clipboard',
    description: 'Employee ID copied to clipboard'
  })
}

function viewEmployee(employee: Employee) {
  navigateTo(`/employees/show/${employee.id}`)

  console.log('View employee:', employee)
}

async function deleteEmployee(employee: Employee) {
  await useFetchForm(`/employees/${employee.id}`, {
    method: 'DELETE'
  })

  toast.add({
    title: 'Employee deleted',
    description: `${employee.name} has been deleted.`
  })
}

const columns = createEmployeeColumns({
  onCopy: copyEmployeeId,
  onView: viewEmployee,
  onDelete: deleteEmployee
})
</script>

<template>
  <UDashboardPanel id="employees">
    <template #header>
      <UDashboardNavbar title="Employees">
        <template #leading>
          <UDashboardSidebarCollapse />
        </template>

        <template #right>
          <UButton
            label="Add Employee"
            color="primary"
            variant="solid"
            icon="i-lucide-plus"
            @click="navigateTo('/employees/create')"
          />
        </template>
      </UDashboardNavbar>
    </template>

    <template #body>
      <DataTable
        :data="employees"
        :columns="columns"
        :loading="status === 'pending'"
        search-column="name"
        search-placeholder="Filter names..."
      >
        <template #actions="{ selectedRows }">
          <EmployeesDeleteModal
            :count="selectedRows.length"
            :selected-ids="selectedRows.map((row: any) => row.original.id)"
            @deleted="refresh()"
          >
            <UButton
              v-if="selectedRows.length"
              label="Delete"
              color="error"
              variant="subtle"
              icon="i-lucide-trash"
            >
              <template #trailing>
                <UKbd>
                  {{ selectedRows.length }}
                </UKbd>
              </template>
            </UButton>
          </EmployeesDeleteModal>
        </template>
      </DataTable>
    </template>
  </UDashboardPanel>
</template>
