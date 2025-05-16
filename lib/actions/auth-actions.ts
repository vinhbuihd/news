"use server"

import { db } from "@/lib/db"
import { hash } from "bcrypt"
import * as z from "zod"

const registerSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(6),
})

export async function registerUser(values: z.infer<typeof registerSchema>) {
  const validatedFields = registerSchema.safeParse(values)

  if (!validatedFields.success) {
    return { error: "Invalid fields" }
  }

  const { name, email, password } = validatedFields.data

  // Check if user already exists
  const existingUser = await db.user.findUnique({
    where: {
      email,
    },
  })

  if (existingUser) {
    return { error: "Email already in use" }
  }

  // Hash password
  const hashedPassword = await hash(password, 10)

  // Create user
  try {
    await db.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: "USER",
      },
    })

    return { success: true }
  } catch (error) {
    return { error: "Failed to create user" }
  }
}
