import { z } from "zod"

const requiredNum = (msg: string) =>
  z.union([z.number(), z.nan(), z.undefined()])
    .refine((v) => v !== undefined && !isNaN(v as number), msg)
    .transform((v) => v as number)

const requiredString = (msg: string) =>
  z.string().min(1, msg)

export const postAdSchema = z.object({
  category_id: z.number().min(1, "Category is required"),
  subcategory_id: z.number().min(1, "Subcategory is required"),
  title: z.string().min(1, "Title is required").max(255, "Title too long"),
  brand_id: z.number().optional(),
  condition: z.union([z.number(), z.nan(), z.undefined()])
    .refine((v) => v !== undefined && !isNaN(v as number), "Condition is required")
    .transform((v) => v as number)
    .refine((v) => v >= 1, "Condition must be at least 1")
    .refine((v) => v <= 10, "Condition must be at most 10"),
  description: z.string().optional(),
  price: requiredNum("Price is required")
    .refine((v) => v >= 0, "Price must be positive"),
  negotiable: z.boolean(),
  address: z.string().min(1, "Address is required").max(255, "Address too long"),
  lat: requiredString("Location is required"),
  lng: requiredString("Location is required"),
  usage: z.string().min(1, "Usage is required").max(50),
  mileage: z.union([z.number(), z.nan(), z.undefined()])
    .transform((v) => (v === undefined || isNaN(v as number) ? undefined : (v as number)))
    .refine((v) => v === undefined || v >= 0, "Mileage must be positive")
    .optional(),
  mileage_unit: z.string().max(50).optional(),
  manufacturing_year: requiredNum("Manufacturing year is required")
    .refine((v) => v >= 1950, "Year must be after 1950")
    .refine((v) => v <= 2050, "Year must be before 2050"),
  final_drive_system: z.string().max(50).optional(),
  wheels: z.string().max(20).optional(),
  engine_size: z.string().max(50).optional(),
  warranty: z.string().min(1, "Warranty is required").max(20),
  seller_type: z.string().min(1, "Seller type is required").max(50),
  images: z
    .array(
      z.instanceof(File)
        .refine((f) => ["image/png", "image/jpeg", "image/jpg"].includes(f.type), "PNG, JPG, or JPEG only")
        .refine((f) => f.size <= 2 * 1024 * 1024, "Max size 2MB")
    )
    .min(1, "At least one image is required")
    .max(5, "Max 5 images"),
})

export type PostAdFormData = z.infer<typeof postAdSchema>