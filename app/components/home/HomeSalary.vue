<script setup lang="ts">
import {
  VisDonut,
  VisSingleContainer
} from '@unovis/vue'

import type { Employee } from '~/types'

const props = defineProps<{
  employees: Employee[]
  loading: boolean
}>()

const salaryRanges = [
  {
    label: '< Rp3 jt',
    min: 0,
    max: 2_999_999
  },
  {
    label: 'Rp3–5 jt',
    min: 3_000_000,
    max: 4_999_999
  },
  {
    label: 'Rp5–7 jt',
    min: 5_000_000,
    max: 6_999_999
  },
  {
    label: 'Rp7–10 jt',
    min: 7_000_000,
    max: 9_999_999
  },
  {
    label: 'Rp10–15 jt',
    min: 10_000_000,
    max: 14_999_999
  },
  {
    label: 'Rp15 jt+',
    min: 15_000_000,
    max: Infinity
  }
]

const salaryDistribution = computed(() =>
  salaryRanges
    .map(range => ({
      label: range.label,
      value: props.employees.filter(
        employee =>
          employee.salary >= range.min
          && employee.salary <= range.max
      ).length
    }))
    .filter(item => item.value > 0)
)

const totalPayroll = computed(() =>
  props.employees.reduce(
    (total, employee) => total + employee.salary,
    0
  )
)

const totalEmployees = computed(() =>
  props.employees.length
)

const averageSalary = computed(() =>
  props.employees.length
    ? totalPayroll.value / props.employees.length
    : 0
)

const lowestSalary = computed(() => {
  if (!props.employees.length) {
    return 0
  }

  return Math.min(
    ...props.employees.map(employee => employee.salary)
  )
})

const highestSalary = computed(() => {
  if (!props.employees.length) {
    return 0
  }

  return Math.max(
    ...props.employees.map(employee => employee.salary)
  )
})

const salaryColors = [
  '#10B981',
  '#3B82F6',
  '#F59E0B',
  '#8B5CF6',
  '#EF4444',
  '#64748B'
]

const value = (item: { value: number }) =>
  item.value

const color = (
  _item: { value: number },
  index: number
) => salaryColors[index % salaryColors.length]

function formatCurrency(value: number) {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0
  }).format(value)
}
</script>

<template>
  <UCard>
    <template #header>
      <div>
        <h3 class="text-sm font-semibold text-highlighted">
          Distribusi Gaji
        </h3>

        <p class="mt-1 text-sm text-muted">
          Jumlah pegawai berdasarkan rentang gaji
        </p>
      </div>
    </template>

    <!-- Loading -->
    <div
      v-if="loading"
      class="space-y-6"
    >
      <div class="flex items-center justify-center">
        <USkeleton class="size-56 rounded-full" />
      </div>

      <div class="grid grid-cols-2 gap-4">
        <USkeleton class="h-20" />
        <USkeleton class="h-20" />
        <USkeleton class="h-20" />
        <USkeleton class="h-20" />
      </div>
    </div>

    <template v-else>
      <!-- Chart -->
      <div
        v-if="salaryDistribution.length"
        class="grid grid-cols-1 items-center gap-8 sm:grid-cols-[280px_1fr]"
      >
        <!-- Pie chart -->
        <div class="flex justify-center">
          <VisSingleContainer
            :data="salaryDistribution"
            :height="250"
            :width="250"
          >
            <VisDonut
              :value="value"
              :color="color"
              :arc-width="0"
              :pad-angle="0.015"
            />
          </VisSingleContainer>
        </div>

        <!-- Legend -->
        <div class="space-y-5">
          <div
            v-for="(item, index) in salaryDistribution"
            :key="item.label"
            class="flex items-center justify-between gap-4"
          >
            <div class="flex items-center gap-3">
              <span
                class="size-2.5 shrink-0 rounded-full"
                :style="{
                  backgroundColor:
                    salaryColors[index % salaryColors.length]
                }"
              />

              <span class="text-sm text-muted">
                {{ item.label }}
              </span>
            </div>

            <span class="text-sm font-medium text-highlighted">
              {{ item.value }}
              <span class="font-normal text-muted">
                pegawai
              </span>
            </span>
          </div>
        </div>
      </div>

      <!-- Empty -->
      <div
        v-else
        class="py-16 text-center text-sm text-muted"
      >
        Belum ada data gaji.
      </div>

      <!-- Salary Summary -->
      <div
        v-if="salaryDistribution.length"
        class="mt-6 grid grid-cols-2 border-t border-default"
      >
        <!-- Total Payroll -->
        <div
          class="border-b border-r border-default py-5 pr-5"
        >
          <p class="text-xs text-muted">
            Total Payroll
          </p>

          <p class="mt-1 text-lg font-semibold text-highlighted">
            {{ formatCurrency(totalPayroll) }}
          </p>

          <p class="mt-1 text-xs text-muted">
            {{ totalEmployees }} pegawai
          </p>
        </div>

        <!-- Average Salary -->
        <div
          class="border-b border-default py-5 pl-5"
        >
          <p class="text-xs text-muted">
            Rata-rata Gaji
          </p>

          <p class="mt-1 text-lg font-semibold text-highlighted">
            {{ formatCurrency(averageSalary) }}
          </p>

          <p class="mt-1 text-xs text-muted">
            Per pegawai
          </p>
        </div>

        <!-- Lowest Salary -->
        <div
          class="border-r border-default py-5 pr-5"
        >
          <p class="text-xs text-muted">
            Gaji Terendah
          </p>

          <p class="mt-1 text-lg font-semibold text-highlighted">
            {{ formatCurrency(lowestSalary) }}
          </p>

          <p class="mt-1 text-xs text-muted">
            Batas minimum
          </p>
        </div>

        <!-- Highest Salary -->
        <div
          class="py-5 pl-5"
        >
          <p class="text-xs text-muted">
            Gaji Tertinggi
          </p>

          <p class="mt-1 text-lg font-semibold text-highlighted">
            {{ formatCurrency(highestSalary) }}
          </p>

          <p class="mt-1 text-xs text-muted">
            Batas maksimum
          </p>
        </div>
      </div>
    </template>
  </UCard>
</template>
