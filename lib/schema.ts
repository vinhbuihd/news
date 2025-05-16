import * as z from "zod";

export const changePwFormSchema = z.object({
  currentPassword: z
    .string()
    .min(6, { message: "Password must be at least 6 characters" }),
  newPassword: z
    .string()
    .min(6, { message: "Password must be at least 6 characters" }),
  confirmNewPassword: z
    .string()
    .min(6, { message: "Password must be at least 6 characters" }),
});
