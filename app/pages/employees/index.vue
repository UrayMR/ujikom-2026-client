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

const dataTableRef = ref()
const singleDeleteOpen = ref(false)
const employeeToDelete = ref<Employee | null>(null)
const singleDeleteLoading = ref(false)

async function handleDeleted() {
  if (dataTableRef.value) {
    dataTableRef.value.rowSelection = {}
  }
  await refresh()
}

function copyEmployeeId(employee: Employee) {
  navigator.clipboard.writeText(employee.id.toString())

  toast.add({
    title: 'Copied to clipboard',
    description: 'Employee ID copied to clipboard'
  })
}

function viewEmployee(employee: Employee) {
  navigateTo(`/employees/${employee.id}/show`)
}

function confirmDeleteEmployee(employee: Employee) {
  employeeToDelete.value = employee
  singleDeleteOpen.value = true
}

async function executeSingleDelete() {
  if (!employeeToDelete.value) return

  singleDeleteLoading.value = true

  try {
    await useFetchForm(`/employees/${employeeToDelete.value.id}`, {
      method: 'DELETE'
    })

    toast.add({
      title: 'Employee deleted',
      description: `${employeeToDelete.value.name} has been deleted.`
    })

    singleDeleteOpen.value = false
    await handleDeleted()
  } finally {
    singleDeleteLoading.value = false
    employeeToDelete.value = null
  }
}

const columns = createEmployeeColumns({
  onCopy: copyEmployeeId,
  onView: viewEmployee,
  onDelete: confirmDeleteEmployee
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
        ref="dataTableRef"
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
            @deleted="handleDeleted"
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

      <UModal
        v-model:open="singleDeleteOpen"
        :title="`Delete employee ${employeeToDelete?.name ?? ''}`"
        description="Are you sure, this action cannot be undone."
      >
        <template #body>
          <div class="flex justify-end gap-2">
            <UButton
              label="Cancel"
              color="neutral"
              variant="subtle"
              :disabled="singleDeleteLoading"
              @click="singleDeleteOpen = false"
            />
            <UButton
              label="Delete"
              color="error"
              variant="solid"
              :loading="singleDeleteLoading"
              @click="executeSingleDelete"
            />
          </div>
        </template>
      </UModal>
    </template>
  </UDashboardPanel>
</template>
