import { z } from "zod"

// Zod v4: use z.coerce for string→number conversion
const coerceNum = (msg: string) =>
  z.coerce
    .number({ error: msg })

export const postAdSchema = z.object({
  category_id: z.coerce.number().min(1, "Category is required"),
  subcategory_id: z.coerce.number().min(1, "Subcategory is required"),
  title: z.string().min(1, "Title is required").max(255, "Title too long"),
  brand_id: z.coerce.number().optional(),

  condition: z.coerce
    .number({ error: "Condition is required" })
    .min(1, "Condition must be at least 1")
    .max(10, "Condition must be at most 10"),

  description: z.string().optional(),

  price: z.coerce
    .number({ error: "Price is required" })
    .min(0, "Price must be positive"),

  negotiable: z.boolean(),
  address: z.string().min(1, "Address is required").max(255, "Address too long"),
  lat: z.string().min(1, "Location is required"),
  lng: z.string().min(1, "Location is required"),
  usage: z.string().min(1, "Usage is required").max(50),

  mileage: z.coerce.number().min(0, "Mileage must be positive").optional(),
  mileage_unit: z.string().max(50).optional(),

  manufacturing_year: z.coerce
    .number({ error: "Manufacturing year is required" })
    .min(1950, "Year must be after 1950")
    .max(2050, "Year must be before 2050"),

  final_drive_system: z.string().max(50).optional(),
  wheels: z.string().max(20).optional(),
  engine_size: z.string().max(50).optional(),
  warranty: z.string().min(1, "Warranty is required").max(20),
  seller_type: z.string().min(1, "Seller type is required").max(50),

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
    .min(1, "At least one image is required")
    .max(5, "Max 5 images"),
})

export type PostAdFormData = z.infer<typeof postAdSchema>