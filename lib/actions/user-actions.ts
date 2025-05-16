"use server"

import { db } from "@/lib/db"
import { hash } from "bcrypt"
import { revalidatePath } from "next/cache"
import * as z from "zod"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { redirect } from "next/navigation"

const userSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(6),
  role: z.enum(["USER", "ADMIN"]),
})

export async function createUser(values: z.infer<typeof userSchema>) {
  const session = await getServerSession(authOptions)

  if (!session || session.user.role !== "ADMIN") {
    redirect("/")
  }

  const validatedFields = userSchema.safeParse(values)

  if (!validatedFields.success) {
    return { error: "Invalid fields" }
  }

  const { name, email, password, role } = validatedFields.data

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
        role,
      },
    })

    revalidatePath("/admin")
    return { success: true }
  } catch (error) {
    return { error: "Failed to create user" }
  }
}

export async function deleteUser(userId: string) {
  const session = await getServerSession(authOptions)

  if (!session || session.user.role !== "ADMIN") {
    redirect("/")
  }

  try {
    await db.user.delete({
      where: {
        id: userId,
      },
    })

    revalidatePath("/admin")
    return { success: true }
  } catch (error) {
    return { error: "Failed to delete user" }
  }
}
