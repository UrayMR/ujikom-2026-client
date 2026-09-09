<script setup lang="ts">
import { getAge } from '~/helpers/getAge'
import type { Employee } from '~/types'

const props = defineProps<{
  employees: Employee[]
  loading: boolean
}>()

const totalEmployees = computed(() =>
  props.employees.length
)

const ages = computed(() =>
  props.employees
    .map(employee => getAge(employee.birthDate))
    .filter(
      (age): age is number =>
        age !== null && age >= 0
    )
)

const averageAge = computed(() => {
  if (!ages.value.length) {
    return null
  }

  const total = ages.value.reduce(
    (sum, age) => sum + age,
    0
  )

  return Math.round(
    total / ages.value.length
  )
})

const maleCount = computed(() =>
  props.employees.filter(
    employee => employee.gender === 'male'
  ).length
)

const femaleCount = computed(() =>
  props.employees.filter(
    employee => employee.gender === 'female'
  ).length
)

const malePercentage = computed(() =>
  totalEmployees.value
    ? Math.round(
        (maleCount.value / totalEmployees.value) * 100
      )
    : 0
)

const femalePercentage = computed(() =>
  totalEmployees.value
    ? Math.round(
        (femaleCount.value / totalEmployees.value) * 100
      )
    : 0
)
</script>

<template>
  <div class="grid grid-cols-1 gap-4 sm:grid-cols-3">
    <!-- Total employees -->
    <UCard>
      <div class="flex items-start justify-between">
        <div>
          <p class="text-sm text-muted">
            Total Pegawai
          </p>

          <USkeleton
            v-if="loading"
            class="mt-2 h-9 w-20"
          />

          <p
            v-else
            class="mt-2 text-3xl font-semibold tracking-tight text-highlighted"
          >
            {{ totalEmployees }}
          </p>
        </div>

        <div class="flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
          <UIcon
            name="i-lucide-users"
            class="size-5"
          />
        </div>
      </div>
    </UCard>

    <!-- Average age -->
    <UCard>
      <div class="flex items-start justify-between">
        <div>
          <p class="text-sm text-muted">
            Rata-rata Usia
          </p>

          <USkeleton
            v-if="loading"
            class="mt-2 h-9 w-24"
          />

          <div
            v-else
            class="mt-2 flex items-baseline gap-1"
          >
            <span class="text-3xl font-semibold tracking-tight text-highlighted">
              {{ averageAge }}
            </span>

            <span class="text-sm text-muted">
              tahun
            </span>
          </div>
        </div>

        <div class="flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
          <UIcon
            name="i-lucide-calendar-days"
            class="size-5"
          />
        </div>
      </div>
    </UCard>

    <!-- Gender -->

    <UCard>
      <div class="flex items-start justify-between">
        <div>
          <p class="text-sm text-muted">
            Komposisi Gender
          </p>

          <USkeleton
            v-if="loading"
            class="mt-3 h-8 w-28"
          />

          <div
            v-else
            class="mt-2 flex items-baseline gap-5"
          >
            <div>
              <div class="flex items-baseline gap-1">
                <span class="text-2xl font-semibold text-highlighted">
                  {{ maleCount }}
                </span>

                <span class="text-sm text-muted">
                  ({{ malePercentage }}%)
                </span>
              </div>

              <p class="text-xs text-muted">
                Laki-laki
              </p>
            </div>

            <div>
              <div class="flex items-baseline gap-1">
                <span class="text-2xl font-semibold text-highlighted">
                  {{ femaleCount }}
                </span>

                <span class="text-sm text-muted">
                  ({{ femalePercentage }}%)
                </span>
              </div>

              <p class="text-xs text-muted">
                Perempuan
              </p>
            </div>
          </div>
        </div>

        <div class="flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
          <UIcon
            name="i-lucide-venus-and-mars"
            class="size-5"
          />
        </div>
      </div>
    </UCard>
  </div>
</template>
