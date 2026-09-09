<script setup lang="ts">
import type { ApiResponse, Employee } from '~/types'

const {
  data: response,
  status,
  refresh
} = await useFetchData<ApiResponse<Employee[]>>('/employees')

const employees = computed(
  () => response.value?.data ?? []
)

const loading = computed(
  () => status.value === 'pending'
)

async function handleRefresh() {
  await refresh()
}
</script>

<template>
  <UDashboardPanel id="dashboard">
    <template #header>
      <UDashboardNavbar title="Dashboard">
        <template #leading>
          <UDashboardSidebarCollapse />
        </template>

        <template #right>
          <UButton
            icon="i-lucide-refresh-cw"
            color="neutral"
            variant="ghost"
            :label="loading ? 'Loading...' : 'Refresh'"
            :loading="loading"
            aria-label="Refresh dashboard"
            @click="handleRefresh"
          />
        </template>
      </UDashboardNavbar>
    </template>

    <template #body>
      <div class="space-y-6">
        <HomeStats
          :employees="employees"
          :loading="loading"
        />

        <div class="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <HomeEducation
            :employees="employees"
            :loading="loading"
          />

          <HomeSalary
            :employees="employees"
            :loading="loading"
          />
        </div>

        <HomeAge
          :employees="employees"
          :loading="loading"
        />
      </div>
    </template>
  </UDashboardPanel>
</template>
