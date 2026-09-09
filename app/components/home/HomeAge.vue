<script setup lang="ts">
import { differenceInYears } from 'date-fns'
import type { Employee } from '~/types'

const props = defineProps<{
  employees: Employee[]
  loading: boolean
}>()

const ageGroups = [
  { label: '< 25', min: 0, max: 24 },
  { label: '25–29', min: 25, max: 29 },
  { label: '30–34', min: 30, max: 34 },
  { label: '35–39', min: 35, max: 39 },
  { label: '40–49', min: 40, max: 49 },
  { label: '50+', min: 50, max: Infinity }
]

const ages = computed(() =>
  props.employees.map(employee =>
    differenceInYears(
      new Date(),
      new Date(employee.birthDate)
    )
  )
)

const ageDistribution = computed(() =>
  ageGroups.map(group => ({
    label: group.label,
    value: ages.value.filter(
      age =>
        age >= group.min
        && age <= group.max
    ).length
  }))
)

const maxValue = computed(() =>
  Math.max(
    ...ageDistribution.value.map(item => item.value),
    1
  )
)
</script>

<template>
  <UCard>
    <template #header>
      <div class="flex items-center justify-between">
        <div>
          <h2 class="font-semibold text-highlighted">
            Distribusi Usia Pegawai
          </h2>

          <p class="mt-1 text-sm text-muted">
            Jumlah pegawai berdasarkan kelompok usia
          </p>
        </div>
      </div>
    </template>

    <div
      v-if="loading"
      class="flex h-64 items-end gap-4"
    >
      <USkeleton
        v-for="i in 6"
        :key="i"
        class="h-32 flex-1"
      />
    </div>

    <div
      v-else-if="ages.length"
      class="space-y-5"
    >
      <div
        class="flex h-56 items-end gap-3 border-b border-default px-2"
      >
        <div
          v-for="item in ageDistribution"
          :key="item.label"
          class="flex h-full flex-1 flex-col justify-end"
        >
          <div class="flex h-full items-end justify-center">
            <div
              class="group relative w-full max-w-16 rounded-t-md bg-primary/75 transition-all duration-500 hover:bg-primary"
              :style="{
                height: `${
                  item.value
                    ? Math.max(
                      (item.value / maxValue) * 100,
                      4
                    )
                    : 1
                }%`
              }"
            >
              <span
                class="absolute -top-6 left-1/2 -translate-x-1/2 text-xs font-semibold text-highlighted"
              >
                {{ item.value }}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div class="flex gap-3 px-2">
        <div
          v-for="item in ageDistribution"
          :key="item.label"
          class="flex-1 text-center"
        >
          <p class="text-xs font-medium text-highlighted">
            {{ item.label }}
          </p>
        </div>
      </div>
    </div>

    <div
      v-else
      class="flex h-64 flex-col items-center justify-center text-center"
    >
      <UIcon
        name="i-lucide-chart-no-axes-column"
        class="size-8 text-dimmed"
      />

      <p class="mt-3 text-sm text-muted">
        Data usia belum tersedia.
      </p>
    </div>
  </UCard>
</template>
