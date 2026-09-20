import { z } from "zod";

export const updateProfileSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(2, "O nome deve ter pelo menos 2 caracteres"),

    email: z
      .email("Informe um e-mail válido"),

    currentPassword: z
      .string()
      .min(1, "Informe sua senha atual")
      .optional(),

    newPassword: z
      .string()
      .min(6, "A nova senha deve ter pelo menos 6 caracteres")
      .optional(),

    confirmNewPassword: z
      .string()
      .min(1, "Confirme a nova senha")
      .optional(),
  })
  .superRefine((data, ctx) => {
    const changingPassword =
      data.currentPassword !== undefined ||
      data.newPassword !== undefined ||
      data.confirmNewPassword !== undefined;

    if (!changingPassword) {
      return;
    }

    if (!data.currentPassword) {
      ctx.addIssue({
        code: "custom",
        path: ["currentPassword"],
        message: "Informe sua senha atual",
      });
    }

    if (!data.newPassword) {
      ctx.addIssue({
        code: "custom",
        path: ["newPassword"],
        message: "Informe a nova senha",
      });
    }

    if (!data.confirmNewPassword) {
      ctx.addIssue({
        code: "custom",
        path: ["confirmNewPassword"],
        message: "Confirme a nova senha",
      });
    }

    if (
      data.newPassword &&
      data.confirmNewPassword &&
      data.newPassword !== data.confirmNewPassword
    ) {
      ctx.addIssue({
        code: "custom",
        path: ["confirmNewPassword"],
        message: "As senhas não coincidem",
      });
    }
  });

export type UpdateProfileDTO =
  z.infer<typeof updateProfileSchema>;
