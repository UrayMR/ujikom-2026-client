<script setup lang="ts">
</script>

<template>
  <UDashboardPanel id="users">
    <template #header>
      <UDashboardNavbar title="Users">
        <template #leading>
          <UDashboardSidebarCollapse />
        </template>
      </UDashboardNavbar>
    </template>

    <template #body>
      <div class="flex flex-col gap-6 p-4">
        <div class="rounded-xl border border-default bg-default/50 p-6">
          <h2 class="text-lg font-semibold text-highlighted">
            User management
          </h2>
          <p class="mt-2 text-sm text-muted">
            Daftar user dan akses akan ditampilkan di sini.
          </p>
        </div>
      </div>
    </template>
  </UDashboardPanel>
</template>
