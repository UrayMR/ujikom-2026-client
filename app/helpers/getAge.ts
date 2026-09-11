import { differenceInYears, parseISO } from 'date-fns'

export function getAge(birthDate: string) {
  const date = parseISO(birthDate)

  if (Number.isNaN(date.getTime())) {
    return null
  }

  return differenceInYears(
    new Date(),
    date
  )
}
