<script setup lang="ts" generic="T extends Record<string, any>">
import type { TableColumn } from '@nuxt/ui'
import {
  getPaginationRowModel,
  type Table
} from '@tanstack/table-core'
import { upperFirst } from 'scule'

const props = withDefaults(
  defineProps<{
    data: T[]
    columns: TableColumn<T>[]
    loading?: boolean
    searchColumn?: string
    searchPlaceholder?: string
    pageSize?: number
  }>(),
  {
    loading: false,
    searchColumn: 'name',
    searchPlaceholder: 'Filter names...',
    pageSize: 10
  }
)

const UButton = resolveComponent('UButton')
const UDropdownMenu = resolveComponent('UDropdownMenu')

const table = useTemplateRef<{
  tableApi: Table<T>
}>('table')

const columnFilters = ref([
  {
    id: props.searchColumn,
    value: ''
  }
])

const columnVisibility = ref()
const rowSelection = ref({})

defineExpose({
  rowSelection
})

const pagination = ref({
  pageIndex: 0,
  pageSize: props.pageSize
})

const search = computed({
  get(): string {
    return (
      table.value?.tableApi
        ?.getColumn(props.searchColumn)
        ?.getFilterValue() as string || ''
    )
  },

  set(value: string) {
    table.value?.tableApi
      ?.getColumn(props.searchColumn)
      ?.setFilterValue(
        value || undefined
      )
  }
})

const visibleColumns = computed(() => {
  const columns
    = table.value?.tableApi?.getAllColumns() ?? []

  return columns
    .filter(column => column.getCanHide())
    .map(column => ({
      label: upperFirst(column.id),
      type: 'checkbox' as const,
      checked: column.getIsVisible(),

      onUpdateChecked(checked: boolean) {
        table.value?.tableApi
          ?.getColumn(column.id)
          ?.toggleVisibility(checked)
      },

      onSelect(event?: Event) {
        event?.preventDefault()
      }
    }))
})

const selectedRows = computed(() => {
  return (
    table.value?.tableApi
      ?.getFilteredSelectedRowModel()
      .rows ?? []
  )
})

const filteredRowsCount = computed(() => {
  return (
    table.value?.tableApi
      ?.getFilteredRowModel()
      .rows.length ?? 0
  )
})

const currentPage = computed(() => {
  return (
    table.value?.tableApi
      ?.getState()
      .pagination.pageIndex ?? 0
  ) + 1
})

const currentPageSize = computed(() => {
  return (
    table.value?.tableApi
      ?.getState()
      .pagination.pageSize ?? props.pageSize
  )
})
</script>

<template>
  <div class="flex flex-col gap-4 h-full">
    <!-- Header -->
    <div
      class="flex flex-wrap items-center justify-between gap-1.5"
    >
      <UInput
        v-model="search"
        class="max-w-sm"
        icon="i-lucide-search"
        :placeholder="searchPlaceholder"
      />

      <div
        class="flex flex-wrap items-center gap-1.5"
      >
        <slot
          name="actions"
          :selected-rows="selectedRows"
        />

        <UDropdownMenu
          :items="visibleColumns"
          :content="{
            align: 'end'
          }"
        >
          <UButton
            label="Display"
            color="neutral"
            variant="outline"
            trailing-icon="i-lucide-settings-2"
          />
        </UDropdownMenu>
      </div>
    </div>

    <!-- Table -->
    <UTable
      ref="table"
      v-model:column-filters="columnFilters"
      v-model:column-visibility="columnVisibility"
      v-model:row-selection="rowSelection"
      v-model:pagination="pagination"
      :pagination-options="{
        getPaginationRowModel: getPaginationRowModel()
      }"
      class="shrink-0"
      :data="data"
      :columns="columns"
      :loading="loading"
      :ui="{
        base: 'table-fixed border-separate border-spacing-0',
        thead: '[&>tr]:bg-elevated/50 [&>tr]:after:content-none',
        tbody: '[&>tr]:last:[&>td]:border-b-0',
        th: 'py-2 first:rounded-l-lg last:rounded-r-lg border-y border-default first:border-l last:border-r',
        td: 'border-b border-default',
        separator: 'h-0'
      }"
    />

    <!-- Footer -->
    <div
      class="flex items-center justify-between gap-3 border-t border-default pt-4 mt-auto"
    >
      <div class="text-sm text-muted">
        {{ selectedRows.length }}
        of
        {{ filteredRowsCount }}
        row(s) selected.
      </div>

      <div class="flex items-center gap-1.5">
        <UPagination
          :default-page="currentPage"
          :items-per-page="currentPageSize"
          :total="filteredRowsCount"
          @update:page="
            (page: number) =>
              table?.tableApi?.setPageIndex(page - 1)
          "
        />
      </div>
    </div>
  </div>
</template>
