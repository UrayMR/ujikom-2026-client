import { z } from 'zod'

export const employeeSchema = z.object({
  name: z
    .string()
    .min(1, 'Name is required')
    .max(100, 'Name must be at most 100 characters long'),

  email: z
    .email('Please enter a valid email address')
    .min(1, 'Email is required'),

  phoneNumber: z
    .string()
    .min(1, 'Phone number is required')
    .max(15, 'Phone number must be at most 15 characters long'),

  address: z
    .string()
    .min(1, 'Address is required')
    .max(200, 'Address must be at most 200 characters long'),

  birthDate: z.date({
    message: 'Please select a date'
  }),

  gender: z.enum(['male', 'female'], {
    message: 'Please select a gender'
  }),

  salary: z.number('Please input salary').positive()
})

export type EmployeeSchema = z.output<typeof employeeSchema>
