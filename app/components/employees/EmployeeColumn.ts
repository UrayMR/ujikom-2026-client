import type { TableColumn } from '@nuxt/ui'
import type { Employee } from '~/types'
import { getRowItems } from './EmployeeTableAction'
import { UButton, UCheckbox, UDropdownMenu } from '#components'

export function createEmployeeColumns(
  actions: {
    onCopy: (employee: Employee) => void
    onView: (employee: Employee) => void
    onDelete: (employee: Employee) => void
  }
): TableColumn<Employee>[] {
  return [
    {
      id: 'select',

      header: ({ table }) =>
        h(UCheckbox, {
          'modelValue':
            table.getIsSomePageRowsSelected()
              ? 'indeterminate'
              : table.getIsAllPageRowsSelected(),

          'onUpdate:modelValue': (value: unknown) => {
            table.toggleAllPageRowsSelected(
              !!(value as boolean | 'indeterminate')
            )
          },

          'ariaLabel': 'Select all'
        }),

      cell: ({ row }) =>
        h(UCheckbox, {
          'modelValue': row.getIsSelected(),

          'onUpdate:modelValue': (value: unknown) => {
            row.toggleSelected(!!(value as boolean | 'indeterminate'))
          },

          'ariaLabel': 'Select row'
        })
    },

    {
      accessorKey: 'id',
      header: 'ID'
    },

    {
      accessorKey: 'name',

      header: ({ column }) => {
        const isSorted = column.getIsSorted()

        return h(UButton, {
          color: 'neutral',
          variant: 'ghost',
          label: 'Name',

          icon: isSorted
            ? isSorted === 'asc'
              ? 'i-lucide-arrow-up-narrow-wide'
              : 'i-lucide-arrow-down-wide-narrow'
            : 'i-lucide-arrow-up-down',

          class: '-mx-2.5',

          onClick: () => {
            column.toggleSorting(
              column.getIsSorted() === 'asc'
            )
          }
        })
      }
    },

    {
      accessorKey: 'createdAt',
      header: 'Created At',

      cell: ({ row }) =>
        new Date(
          row.original.createdAt
        ).toLocaleString()
    },

    {
      accessorKey: 'updatedAt',
      header: 'Updated At',

      cell: ({ row }) =>
        new Date(
          row.original.updatedAt
        ).toLocaleString()
    },

    {
      id: 'actions',
      cell: ({ row }) => {
        return h(
          'div',
          { class: 'text-right' },
          h(
            UDropdownMenu,
            {
              content: {
                align: 'end'
              },
              items: getRowItems(actions, row)
            },
            () =>
              h(UButton, {
                icon: 'i-lucide-ellipsis-vertical',
                color: 'neutral',
                variant: 'ghost',
                class: 'ml-auto'
              })
          )
        )
      }
    }
  ]
}
