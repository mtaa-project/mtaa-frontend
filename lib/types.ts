import { z } from "zod"

export type RegisterFormData = {
  username: string
  firstname: string
  lastname: string
  phone_number: string | null
  email: string
}

export const userSchema = z.object({
  userName: z.string(),
  firstname: z.string(),
  lastname: z.string(),
  phoneNumber: z.string().nullable(),
  email: z.string().email("Invalid email address"),
})

export const schemaLoginUser = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string(),
})

export type FormLoginUser = z.infer<typeof schemaLoginUser>

export const schemaRegisterUser = z
  .object({
    userName: z.string().nonempty("Username is required"),
    firstname: z.string().nonempty("First name is required"),
    lastname: z.string().nonempty("Last name is required"),
    phoneNumber: z.string().nullable(),
    email: z.string().email("Invalid email address"),
    password: z.string().nonempty("Password is required"),
    confirmPassword: z.string().nonempty("Confirm password is required"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Password mismatch",
    path: ["confirmPassword"],
  })

export type FormRegisterUser = z.infer<typeof schemaRegisterUser>
