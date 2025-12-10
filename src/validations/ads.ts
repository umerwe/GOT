import { z } from "zod"

export const postAdSchema = z.object({
  category_id: z.number().min(1, "Category is required"),
  subcategory_id: z.number().min(1, "Subcategory is required"),
  title: z.string().min(1, "Title is required"),
  brand_id: z.number().min(1, "Brand is required"),
  condition: z
    .string()
    .min(1, "Condition is required")
    .refine((val) => {
      const num = Number.parseInt(val)
      return !isNaN(num) && num >= 1 && num <= 10
    }, "Condition must be a number between 1 and 10"),
  description: z.string().min(1, "Description is required"),
  price: z
    .string()
    .min(1, "Price is required")
    .refine((val) => {
      const num = Number.parseInt(val)
      return !isNaN(num) && num > 0
    }, "Price must be a valid positive number"),
  negotiable: z.boolean(),
  address: z.string().min(1, "Address is required"),
  lat: z
    .string()
    .min(1, "Latitude is required")
    .refine((val) => {
      const num = Number.parseFloat(val)
      return !isNaN(num) && num >= -90 && num <= 90
    }, "Invalid latitude"),
  lng: z
    .string()
    .min(1, "Longitude is required")
    .refine((val) => {
      const num = Number.parseFloat(val)
      return !isNaN(num) && num >= -180 && num <= 180
    }, "Invalid longitude"),
  usage: z.enum(["once_new", "rarely", "weekly", "primary"]),
  mileage: z
    .string()
    .min(1, "Mileage is required")
    .refine((val) => {
      const num = Number.parseInt(val)
      return !isNaN(num) && num >= 0
    }, "Mileage must be a valid positive number"),
  mileage_unit: z.enum(["kms", "hours"]),
  manufacturing_year: z
    .string()
    .min(1, "Manufacturing year is required")
    .refine((val) => {
      const currentYear = new Date().getFullYear()
      const num = Number.parseInt(val)
      return !isNaN(num) && num >= 1900 && num <= currentYear + 1
    }, "Manufacturing year must be a valid year"),
  final_drive_system: z.enum(["belt", "chain", "shaft", "does_not_apply"]),
  wheels: z.enum(["2_wheels", "3_wheels", "4_wheels"]),
  engine_size: z.enum(["lt_250cc", "250_499cc", "500_599cc", "600_749cc", "750_999cc", "gte_1000cc", "does_not_apply"]),
  warranty: z.enum(["yes", "no", "does_not_apply"]),
  seller_type: z.enum(["owner", "dealer", "certified"]),
  images: z
    .array(
      z
        .instanceof(File)
        .refine((file) => file.type.startsWith("image/"), "Only image files (JPG, PNG, GIF, etc.) are allowed")
        .refine((file) => file.size <= 5 * 1024 * 1024, "Image size must be less than 5MB"),
    )
    .min(1, "At least one image is required")
    .max(5, "Maximum 5 images are allowed"),
})

export type PostAdFormData = z.infer<typeof postAdSchema>;