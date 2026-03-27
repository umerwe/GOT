"use client"

import type React from "react"
import { useState, useCallback, useMemo } from "react"
import { useForm, Resolver } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Upload, X } from "lucide-react"
import Image from "next/image"
import { SelectField } from "@/components/ui/select-field"
import { Input } from "@/components/ui/input"
import { ConfigData } from "@/types/config"
import { postAdSchema, type PostAdFormData } from "@/validations/ads"
import { LocationInput } from "../ui/location"
import { useGetConfig } from "@/hooks/useConfig"

interface Category {
  id: number
  title: string
  type?: string
  child?: Category[]
}

interface Brand {
  id: number
  title: string
}

interface AdFormProps {
  categories: Category[]
  isCategoriesLoading: boolean
  brandsData: Brand[]
  isBrandsLoading: boolean
  addProduct: (data: FormData, options: { onSuccess: () => void }) => void
  isPending: boolean
}

const NON_ACCESSORIES_FIELDS = [
  "mileage", "mileage_unit", "final_drive_system", "wheels", "engine_size", "brand_id"
] as const

type NonAccessoriesField = typeof NON_ACCESSORIES_FIELDS[number]

export function AdForm({
  categories,
  isCategoriesLoading,
  brandsData,
  isBrandsLoading,
  addProduct,
  isPending,
}: AdFormProps) {
  const { data } = useGetConfig()
  const configData = data as ConfigData

  const [selectedCategoryId, setSelectedCategoryId] = useState<number>(0)
  const [selectedCategoryType, setSelectedCategoryType] = useState<string>("")
  const [uploadedImages, setUploadedImages] = useState<{ file: File; preview: string }[]>([])
  const [guidelinesChecked, setGuidelinesChecked] = useState(false)

  const isAccessories = selectedCategoryType === "accessories"

  const subcategories = useMemo(() => {
    if (!selectedCategoryId || !categories) return []
    const selectedCategory = categories.find((cat) => cat.id === selectedCategoryId)
    return selectedCategory?.child || []
  }, [selectedCategoryId, categories])

  const form = useForm<PostAdFormData>({
    resolver: zodResolver(postAdSchema) as Resolver<PostAdFormData>,
    defaultValues: {
      category_id: 0,
      subcategory_id: 0,
      title: "",
      brand_id: undefined,
      condition: undefined,
      description: "",
      price: undefined,
      negotiable: false,
      address: "",
      lat: undefined,
      lng: undefined,
      usage: "",
      mileage: undefined,
      mileage_unit: "",
      manufacturing_year: undefined,
      final_drive_system: "",
      wheels: "",
      engine_size: "",
      warranty: "",
      seller_type: "",
      images: [],
    },
  })

  const { register, handleSubmit, formState: { errors }, setValue, reset, setError, watch } = form

  const handleCategoryChange = (categoryId: number) => {
    const category = categories.find((c) => c.id === categoryId)
    const newType = category?.type || ""

    setSelectedCategoryId(categoryId)
    setSelectedCategoryType(newType)
    setValue("category_id", categoryId, { shouldValidate: true })
    setValue("subcategory_id", 0)

    if (newType === "accessories") {
      NON_ACCESSORIES_FIELDS.forEach((field: NonAccessoriesField) => {
        setValue(field, undefined as never)
      })
    }
  }

  const handleImageUpload = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    if (!files) return

    const validFiles = Array.from(files)
    const remainingSlots = 5 - uploadedImages.length

    if (validFiles.length > remainingSlots) {
      setError("images", { type: "manual", message: `Limit reached. You can only add ${remainingSlots} more.` })
      validFiles.splice(remainingSlots)
    }

    const filteredFiles = validFiles.filter((file) => {
      const isValidSize = file.size <= 2 * 1024 * 1024
      const isValidType = ["image/png", "image/jpeg", "image/jpg"].includes(file.type)
      if (!isValidSize) setError("images", { type: "manual", message: `"${file.name}" is over 2MB.` })
      if (!isValidType) setError("images", { type: "manual", message: `"${file.name}" is not PNG, JPG, or JPEG.` })
      return isValidSize && isValidType
    })

    if (filteredFiles.length === 0) {
      event.target.value = ""
      return
    }

    const newImages = filteredFiles.map((file) => ({ file, preview: URL.createObjectURL(file) }))
    const updatedImages = [...uploadedImages, ...newImages]
    setUploadedImages(updatedImages)
    setValue("images", updatedImages.map((img) => img.file), { shouldValidate: true })
    event.target.value = ""
  }, [uploadedImages, setValue, setError])

  const removeImage = useCallback((index: number) => {
    setUploadedImages((prev) => {
      const newImages = prev.filter((_, i) => i !== index)
      setValue("images", newImages.map((img) => img.file), { shouldValidate: true })
      return newImages
    })
  }, [setValue])

  const onSubmit = async (data: PostAdFormData) => {
    const formDataToSend = new FormData()

    Object.entries(data).forEach(([key, value]) => {
      if (key === "images") return
      // Skip non-accessories fields if category is accessories
      if (isAccessories && (NON_ACCESSORIES_FIELDS as readonly string[]).includes(key)) return
      if (value !== undefined && value !== "" && value !== null) {
        formDataToSend.append(key, String(value))
      }
    })

    // Always send negotiable as 0/1
    formDataToSend.set("negotiable", data.negotiable ? "1" : "0")

    data.images.forEach((image, index) => {
      formDataToSend.append(`product_images[${index}]`, image)
    })

    await addProduct(formDataToSend, {
      onSuccess: () => {
        reset()
        setUploadedImages([])
        setGuidelinesChecked(false)
        setSelectedCategoryId(0)
        setSelectedCategoryType("")
      },
    })
  }

  return (
    <form onSubmit={handleSubmit(onSubmit, (errs) => console.log(errs))} className="space-y-8">
      {/* Photos Section */}
      <div>
        <h4 className="text-[16px] mb-[2.5px]">Photos</h4>
        <div className="border-2 border-gray-300 p-8 text-center bg-gray-50/50">
          <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-black mb-2">Drag & drop images here</p>
          <input type="file" accept=".png,.jpg,.jpeg" multiple onChange={handleImageUpload} className="hidden" id="image-upload" disabled={isPending} />
          <label htmlFor="image-upload">
            <Button type="button" variant="outline" className="mt-4 rounded-none" onClick={() => document.getElementById("image-upload")?.click()} disabled={isPending}>
              Upload Images
            </Button>
          </label>
        </div>
        {errors.images && <p className="text-red-500 text-sm mt-2 font-medium">{errors.images.message}</p>}
        <p className="text-[11px] text-gray-500 mt-2">Supported formats: PNG, JPG, JPEG (Max 2MB)</p>
        <div className="flex space-x-2 mt-[12px]">
          {Array.from({ length: 5 }).map((_, index) => (
            <div key={index} className="w-[58px] h-[58px] bg-gray-50 border-[2px] border-[#EAEEF5] flex items-center justify-center overflow-hidden relative">
              {index < uploadedImages.length && (
                <>
                  <Image src={uploadedImages[index].preview} alt="Thumb" fill className="object-cover" />
                  <Button type="button" variant="ghost" size="icon" className="absolute -top-1 -right-1 h-5 w-5 bg-white shadow-sm" onClick={() => removeImage(index)} disabled={isPending}>
                    <X className="h-3 w-3 text-red-500" />
                  </Button>
                </>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Product Details */}
      <div>
        <h2 className="text-[20px] font-semibold mb-[13.5px]">Product Details</h2>
        <div className="space-y-[16.5px]">
          <Input id="title" label="Title" {...register("title")} error={errors.title?.message} disabled={isPending} />

          {!isAccessories && (
            <SelectField
              id="brand_id"
              label="Brand"
              options={brandsData.map((brand) => ({ value: brand.id, label: brand.title }))}
              {...register("brand_id", { setValueAs: (v) => v === "" ? undefined : Number(v) })}
              value={watch("brand_id") ?? ""}
              disabled={isBrandsLoading || isPending}
              error={errors.brand_id?.message}
            />
          )}

          <SelectField
            id="category_id"
            label="Category"
            options={categories.map((cat) => ({ value: cat.id, label: cat.title }))}
            value={selectedCategoryId || ""}
            onChange={(e) => handleCategoryChange(Number(e.target.value))}
            disabled={isCategoriesLoading || isPending}
            error={errors.category_id?.message}
          />

          <SelectField
            id="subcategory_id"
            label="SubCategory"
            options={subcategories.map((sub) => ({ value: sub.id, label: sub.title }))}
            {...register("subcategory_id", { setValueAs: (v) => v === "" ? 0 : Number(v) })}
            value={watch("subcategory_id") || ""}
            disabled={!selectedCategoryId || subcategories.length === 0 || isPending}
            error={errors.subcategory_id?.message}
          />

          <SelectField
            id="condition"
            label="Condition (1-10)"
            options={Array.from({ length: 10 }, (_, i) => ({ value: i + 1, label: String(i + 1) }))}
            {...register("condition", { setValueAs: (v) => v === "" ? undefined : Number(v) })}
            value={watch("condition") ?? ""}
            disabled={isPending}
            error={errors.condition?.message}
          />

          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea id="description" className="min-h-[120px] mt-1" {...register("description")} disabled={isPending} />
            {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description.message}</p>}
          </div>

          <SelectField
            id="usage"
            label="Usage"
            options={configData?.product_options?.usage?.map((o) => ({ value: o.id, label: o.title })) || []}
            {...register("usage")}
            value={watch("usage") || ""}
            disabled={isPending}
            error={errors.usage?.message}
          />

          {!isAccessories && (
            <>
              <Input
                id="mileage"
                type="number"
                label="Mileage"
                min={0}
                {...register("mileage", { valueAsNumber: true })}
                error={errors.mileage?.message}
                disabled={isPending}
              />
              <SelectField
                id="mileage_unit"
                label="Mileage Unit"
                options={configData?.product_options?.mileage_unit?.map((o) => ({ value: o.id, label: o.title })) || []}
                {...register("mileage_unit")}
                value={watch("mileage_unit") || ""}
                disabled={isPending}
                error={errors.mileage_unit?.message}
              />
            </>
          )}

          <Input
            id="manufacturing_year"
            type="number"
            label="Manufacturing Year"
            min={1950}
            max={2050}
            {...register("manufacturing_year", { valueAsNumber: true })}
            error={errors.manufacturing_year?.message}
            disabled={isPending}
          />

          {!isAccessories && (
            <>
              <SelectField
                id="final_drive_system"
                label="Final Drive System"
                options={configData?.product_options?.final_drive_system?.map((o) => ({ value: o.id, label: o.title })) || []}
                {...register("final_drive_system")}
                value={watch("final_drive_system") || ""}
                disabled={isPending}
                error={errors.final_drive_system?.message}
              />
              <SelectField
                id="wheels"
                label="Wheels"
                options={configData?.product_options?.wheels?.map((o) => ({ value: o.id, label: o.title })) || []}
                {...register("wheels")}
                value={watch("wheels") || ""}
                disabled={isPending}
                error={errors.wheels?.message}
              />
              <SelectField
                id="engine_size"
                label="Engine Size"
                options={configData?.product_options?.engine_size?.map((o) => ({ value: o.id, label: o.title })) || []}
                {...register("engine_size")}
                value={watch("engine_size") || ""}
                disabled={isPending}
                error={errors.engine_size?.message}
              />
            </>
          )}

          <SelectField
            id="warranty"
            label="Warranty"
            options={configData?.product_options?.warranty?.map((o) => ({ value: o.id, label: o.title })) || []}
            {...register("warranty")}
            value={watch("warranty") || ""}
            disabled={isPending}
            error={errors.warranty?.message}
          />

          <SelectField
            id="seller_type"
            label="Seller Type"
            options={configData?.product_options?.seller_type?.map((o) => ({ value: o.id, label: o.title })) || []}
            {...register("seller_type")}
            value={watch("seller_type") || ""}
            disabled={isPending}
            error={errors.seller_type?.message}
          />
        </div>
      </div>

      <div>
        <h2 className="text-[20px] mb-[13.5px]">Price & Location</h2>
        <div className="space-y-[16.5px]">
          <Input
            id="price"
            type="number"
            min={0}
            label="Price"
            {...register("price", { valueAsNumber: true })}
            error={errors.price?.message}
            disabled={isPending}
          />
          <LocationInput setValue={setValue} register={register} errors={errors} isPending={isPending} />
        </div>
      </div>

      <div>
        <div className="flex space-x-3 items-start">
          <Checkbox id="guidelines" checked={guidelinesChecked} onCheckedChange={(c) => setGuidelinesChecked(c === true)} disabled={isPending} />
          <Label htmlFor="guidelines" className="text-sm leading-none">I confirm this ad follows guidelines</Label>
        </div>
        <Button type="submit" className="w-full bg-black text-white h-[48px] mt-8 rounded-none" disabled={isPending || !guidelinesChecked}>
          {isPending ? "Submitting..." : "Submit Ad"}
        </Button>
      </div>
    </form>
  )
}