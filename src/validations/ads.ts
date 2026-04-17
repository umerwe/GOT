import { z } from "zod"

export const postAdSchema = z.object({
  category_id: z.coerce.number().min(1, "Category is required"),
  subcategory_id: z.coerce.number().optional(),
  title: z.string().min(1, "Title is required").max(255, "Title too long"),
  brand_id: z.coerce.number().optional(),

  condition: z.coerce
    .number({ error: "Condition is required" })
    .min(1, "Condition must be at least 1")
    .max(10, "Condition must be at most 10"),

  description: z.string().optional(),

  price: z.coerce
    .number({ error: "Price is required" })
    .min(1, "Price must be positive")
    .max(999999, "Price too long"),

  negotiable: z.boolean(),
  address: z.string().min(1, "Address is required").max(255, "Address too long"),
  lat: z.string().min(1, "Location is required"),
  lng: z.string().min(1, "Location is required"),
  usage: z.string().max(50).optional(),

  mileage: z.number().min(0, "Mileage must be positive").optional(),
  mileage_unit: z.string().max(50).optional(),

  manufacturing_year: z.coerce
    .number({ error: "Manufacturing year is required" })
    .min(1950, "Year must be after 1950")
    .max(2050, "Year must be before 2050"),

  final_drive_system: z.string().max(50).optional(),
  wheels: z.string().max(20).optional(),
  engine_size: z.string().max(50).optional(),
  warranty: z.string().max(20).optional(),
  seller_type: z.string().max(50).optional(),

  images: z
    .array(
      z
        .instanceof(File)
        .refine(
          (f) => ["image/png", "image/jpeg", "image/jpg"].includes(f.type),
          "PNG, JPG, or JPEG only"
        )
        .refine((f) => f.size <= 2 * 1024 * 1024, "Max size 2MB")
    )
})

export type PostAdFormData = z.infer<typeof postAdSchema>