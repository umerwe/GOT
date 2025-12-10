import { z } from "zod"

export const messageSchema = z
  .object({
    message: z.string().optional(),
    images: z
      .custom<FileList | File[]>()
      .optional()
      .refine((files) => {
        if (!files || files.length === 0) return true
        const validTypes = ["image/png", "image/jpeg"]
        return Array.from(files).every((file) => validTypes.includes(file.type))
      }, "Only PNG or JPEG images are allowed")
      .refine((files) => {
        if (!files || files.length === 0) return true
        return files.length <= 6
      }, "Maximum 6 images allowed")
      .refine((files) => {
        if (!files || files.length === 0) return true
        return Array.from(files).every((file) => file.size <= 5 * 1024 * 1024)
      }, "Each image must be less than 5MB"),
  })
  .refine(
    (data) =>
      data.message?.trim() || (data.images && data.images.length > 0),
    {
      message: "Please enter a message or select images to send",
      path: ["message"],
    },
  )

export type MessageFormData = z.infer<typeof messageSchema>
