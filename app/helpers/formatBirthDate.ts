import { format, parseISO } from 'date-fns'

export function formatBirthDate(birthDate?: string) {
  if (!birthDate) {
    return '-'
  }

  return format(
    parseISO(birthDate),
    'dd MMMM yyyy'
  )
}
