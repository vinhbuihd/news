"use server";

import { db } from "@/lib/db";
import { hash, compare } from "bcrypt";
import { getServerSession } from "next-auth";
import * as z from "zod";
import { authOptions } from "../auth";
import { changePwFormSchema } from "../schema";

export async function changePw(values: z.infer<typeof changePwFormSchema>) {
  console.info({ values });
  const validatedFields = changePwFormSchema.safeParse(values);
  const session = await getServerSession(authOptions);
  if (!session?.user.email) {
    return { error: "Invalid user email" };
  }

  console.info({ validatedFields });

  if (!validatedFields.success) {
    return { error: "Invalid fields" };
  }

  const { currentPassword, newPassword } = validatedFields.data;

  const user = await db.user.findUnique({
    where: { email: session.user.email },
  });

  if (!user?.id || !user?.password) {
    return { error: "Invalid user" };
  }

  console.info({ currentPassword });
  console.info("uy", user.password);
  const hashedNewPassword = await hash(newPassword, 10);

  const isMatch = await compare(currentPassword, user.password);
  console.info({ isMatch });
  if (!isMatch) {
    return { error: "Mật khẩu hiện tại không đúng" };
  }

  // Hash password
  // Create user
  try {
    await db.user.update({
      where: { id: user.id },
      data: { password: hashedNewPassword },
    });

    return { success: true };
  } catch (error) {
    return { error: "Failed to create user" };
  }
}
