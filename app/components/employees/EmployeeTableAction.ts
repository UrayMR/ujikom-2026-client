import type { DropdownMenuItem } from '@nuxt/ui'
import type { Row } from '@tanstack/table-core'
import type { Employee } from '~/types'

export function getRowItems(
  actions: {
    onCopy: (employee: Employee) => void
    onView: (employee: Employee) => void
    onDelete: (employee: Employee) => void
  },
  row: Row<Employee>
): DropdownMenuItem[] {
  return [
    {
      type: 'label',
      label: 'Actions'
    } as const,

    {
      label: 'Copy employee ID',
      icon: 'i-lucide-copy',
      onSelect() {
        actions.onCopy(row.original)
      }
    },

    {
      type: 'separator'
    } as const,

    {
      label: 'View employee details',
      icon: 'i-lucide-list',
      onSelect() {
        actions.onView(row.original)
      }
    },

    {
      type: 'separator'
    } as const,

    {
      label: 'Delete employee',
      icon: 'i-lucide-trash',
      color: 'error',
      onSelect() {
        actions.onDelete(row.original)
      }
    }
  ] satisfies DropdownMenuItem[]
}
