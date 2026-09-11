<script setup lang="ts">
import type { Employee } from '~/types'

const props = defineProps<{
  employees: Employee[]
  loading: boolean
}>()

const educationLevels = [
  'Tidak/Belum Pernah',
  'SD',
  'SMP',
  'SMA/SMK',
  'D1/D2/D3',
  'S1/D4',
  'S2',
  'S3'
]

const educationDistribution = computed(() => {
  return educationLevels
    .map(label => ({
      label,
      value: props.employees.filter(
        employee => employee.education === label
      ).length
    }))
    .filter(item => item.value > 0)
})

const maxValue = computed(() =>
  Math.max(
    ...educationDistribution.value.map(item => item.value),
    1
  )
)
</script>

<template>
  <UCard>
    <template #header>
      <div>
        <h2 class="font-semibold text-highlighted">
          Pendidikan Terakhir
        </h2>

        <p class="mt-1 text-sm text-muted">
          Distribusi tingkat pendidikan pegawai
        </p>
      </div>
    </template>

    <div
      v-if="loading"
      class="space-y-5"
    >
      <div
        v-for="i in 5"
        :key="i"
      >
        <USkeleton class="mb-2 h-4 w-24" />
        <USkeleton class="h-2 w-full" />
      </div>
    </div>

    <div
      v-else-if="educationDistribution.length"
      class="space-y-5"
    >
      <div
        v-for="item in educationDistribution"
        :key="item.label"
      >
        <div class="mb-2 flex items-center justify-between gap-4">
          <span class="text-sm font-medium text-highlighted">
            {{ item.label }}
          </span>

          <span class="shrink-0 text-xs text-muted">
            {{ item.value }} pegawai
          </span>
        </div>

        <div class="h-2 overflow-hidden rounded-full bg-muted">
          <div
            class="h-full rounded-full bg-primary/80 transition-all duration-500"
            :style="{
              width: `${(item.value / maxValue) * 100}%`
            }"
          />
        </div>
      </div>
    </div>

    <div
      v-else
      class="py-12 text-center"
    >
      <UIcon
        name="i-lucide-graduation-cap"
        class="mx-auto size-8 text-dimmed"
      />

      <p class="mt-3 text-sm text-muted">
        Data pendidikan belum tersedia.
      </p>
    </div>
  </UCard>
</template>
