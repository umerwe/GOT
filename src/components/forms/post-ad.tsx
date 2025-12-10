"use client"

import type React from "react"
import { useState, useCallback, useMemo } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Upload, X } from "lucide-react"
import Image from "next/image"
import { SelectField } from "@/components/ui/select-field"
import { Input } from "@/components/ui/input"
import { useAppSelector } from "@/store/hooks"
import { ConfigData } from "@/types/config"
import {
  postAdSchema,
  type PostAdFormData,
} from "@/validations/ads"
import { LocationInput } from "../ui/location"

interface Category {
  id: number
  title: string
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

export function AdForm({
  categories,
  isCategoriesLoading,
  brandsData,
  isBrandsLoading,
  addProduct,
  isPending,
}: AdFormProps) {
  const [selectedCategoryId, setSelectedCategoryId] = useState<number>(0)
  const [uploadedImages, setUploadedImages] = useState<{ file: File; preview: string }[]>([])
  const [guidelinesChecked, setGuidelinesChecked] = useState(false)

  // Access configData with proper typing
  const configData = useAppSelector((state: { config: { data: ConfigData | null } }) => state.config.data)

  const subcategories = useMemo(() => {
    if (!selectedCategoryId || !categories) return []
    const selectedCategory = categories.find((cat) => cat.id === selectedCategoryId)
    return selectedCategory?.child || []
  }, [selectedCategoryId, categories])

  const form = useForm<PostAdFormData>({
    resolver: zodResolver(postAdSchema),
    defaultValues: {
      category_id: 0,
      subcategory_id: 0,
      title: "",
      brand_id: 0,
      condition: "",
      description: "",
      price: "",
      negotiable: false,
      address: "",
      lat: "",
      lng: "",
      usage: "once_new",
      mileage: "",
      mileage_unit: "kms",
      manufacturing_year: "",
      final_drive_system: "belt",
      wheels: "2_wheels",
      engine_size: "lt_250cc",
      warranty: "yes",
      seller_type: "owner",
      images: [],
    },
  })

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    reset,
    setError,
  } = form

  const handleCategoryChange = (categoryId: number) => {
    setSelectedCategoryId(categoryId)
    setValue("category_id", categoryId)
    setValue("subcategory_id", 0)
  }

  const handleImageUpload = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const files = event.target.files
      if (files) {
        const validFiles = Array.from(files)
        const remainingSlots = 5 - uploadedImages.length

        if (validFiles.length > remainingSlots) {
          setError("images", {
            type: "manual",
            message: `Only ${remainingSlots} more images can be added due to the 5-image limit.`,
          })
          validFiles.splice(remainingSlots)
        }

        const newImages = validFiles.map((file) => ({
          file,
          preview: URL.createObjectURL(file),
        }))

        const updatedImages = [...uploadedImages, ...newImages]
        setUploadedImages(updatedImages)
        setValue(
          "images",
          updatedImages.map((img) => img.file),
          { shouldValidate: true },
        )
      }
      event.target.value = ""
    },
    [uploadedImages, setValue, setError],
  )

  const removeImage = useCallback(
    (index: number) => {
      setUploadedImages((prev) => {
        const imageToRemove = prev[index]
        if (imageToRemove) {
          URL.revokeObjectURL(imageToRemove.preview)
        }
        const newImages = prev.filter((_, i) => i !== index)
        setValue(
          "images",
          newImages.map((img) => img.file),
          { shouldValidate: true },
        )
        return newImages
      })
    },
    [setValue],
  )

  const onSubmit = async (data: PostAdFormData) => {
    const formDataToSend = new FormData()

    Object.entries(data).forEach(([key, value]) => {
      if (key !== "images") {
        formDataToSend.append(key, String(value))
      }
    })

    data.images.forEach((image, index) => {
      formDataToSend.append(`product_images[${index}]`, image)
    })

    await addProduct(formDataToSend, {
      onSuccess: () => {
        reset()
        setUploadedImages([])
        setGuidelinesChecked(false)
        setSelectedCategoryId(0)
      },
    })
  }

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        <div>
          <h3 className="text-lg font-semibold mb-4">Photos</h3>
          <div className="p-6">
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
              <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 mb-2">Drag & drop images here</p>
              <p className="text-sm text-gray-500">Or click to upload (max 5 images)</p>
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleImageUpload}
                className="hidden"
                id="image-upload"
                disabled={isPending}
              />
              <label htmlFor="image-upload">
                <Button
                  type="button"
                  variant="outline"
                  className="mt-4 bg-transparent cursor-pointer"
                  onClick={() => document.getElementById("image-upload")?.click()}
                  disabled={isPending}
                >
                  Upload Images
                </Button>
              </label>
              {errors.images && !Array.isArray(errors.images) && (
                <p className="text-red-500 text-xs mt-2">{errors.images.message}</p>
              )}
              {Array.isArray(errors.images) &&
                errors.images.map(
                  (error, index) =>
                    error && (
                      <p key={index} className="text-red-500 text-xs mt-2">
                        Image {index + 1}: {error.message}
                      </p>
                    ),
                )}
            </div>
            <div className="flex space-x-2 mt-4">
              {Array.from({ length: 5 }).map((_, index) => (
                <div
                  key={index}
                  className="w-16 h-16 bg-gray-200 rounded border-2 border-gray-300 flex items-center justify-center overflow-hidden relative"
                >
                  {index < uploadedImages.length && (
                    <>
                      <Image
                        src={uploadedImages[index].preview || "/placeholder.svg"}
                        alt={`Thumb ${index + 1}`}
                        width={64}
                        height={64}
                        className="object-cover w-full h-full rounded"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute -top-2 -right-2 h-6 w-6 rounded-full bg-white shadow-md flex items-center justify-center hover:bg-gray-100"
                        onClick={() => removeImage(index)}
                        disabled={isPending}
                      >
                        <X className="h-4 w-4 text-red-500" />
                      </Button>
                    </>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-4">Product Details (Listing Information)</h3>
          <div className="p-6 space-y-4">
            <Input
              id="title"
              label="Title"
              placeholder="e.g., 2023 Yamaha MT-07"
              {...register("title")}
              error={errors.title?.message}
              disabled={isPending}
            />

            <SelectField
              id="brand_id"
              label="Brand"
              placeholder="Select a brand"
              options={brandsData.map((brand) => ({ value: brand.id, label: brand.title }))}
              {...register("brand_id", { valueAsNumber: true })}
              disabled={isBrandsLoading || isPending}
              error={errors.brand_id?.message}
            />

<SelectField
              id="category_id"
              label="Category"
              placeholder="Select a Category"
              options={categories.map((cat) => ({ value: cat.id, label: cat.title }))}
              value={selectedCategoryId}
              onChange={(e) => handleCategoryChange(Number(e.target.value))}
              disabled={isCategoriesLoading || isPending}
            />

            <SelectField
              id="subcategory_id"
              label="SubCategory"
              placeholder="Select a SubCategory"
              options={subcategories.map((sub) => ({ value: sub.id, label: sub.title }))}
              {...register("subcategory_id", { valueAsNumber: true })}
              disabled={!selectedCategoryId || subcategories.length === 0 || isPending}
              error={errors.subcategory_id?.message}
            />

            <Input
              id="condition"
              type="number"
              label="Condition (1-10)"
              placeholder="Write Condition 9/10"
              {...register("condition")}
              error={errors.condition?.message}
              disabled={isPending}
            />

            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Describe your item..."
                className="bg-gray-100 min-h-[120px] mt-1"
                {...register("description")}
                disabled={isPending}
              />
              {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description.message}</p>}
            </div>

            <SelectField
              id="usage"
              label="Usage"
              options={configData?.product_options?.usage?.map((option) => ({
                value: option.id,
                label: option.title,
              })) || []}
              {...register("usage")}
              error={errors.usage?.message}
              disabled={isPending}
            />

            <Input
              id="mileage"
              type="number"
              label="Mileage"
              placeholder="Enter mileage"
              {...register("mileage")}
              error={errors.mileage?.message}
              disabled={isPending}
            />

            <SelectField
              id="mileage_unit"
              label="Mileage Unit"
              options={configData?.product_options?.mileage_unit?.map((option) => ({
                value: option.id,
                label: option.title,
              })) || []}
              {...register("mileage_unit")}
              error={errors.mileage_unit?.message}
              disabled={isPending}
            />

            <Input
              id="manufacturing_year"
              type="number"
              label="Manufacturing Year"
              placeholder="Enter year (e.g., 2025)"
              {...register("manufacturing_year")}
              error={errors.manufacturing_year?.message}
              disabled={isPending}
            />

            <SelectField
              id="final_drive_system"
              label="Final Drive System"
              options={configData?.product_options?.final_drive_system?.map((option) => ({
                value: option.id,
                label: option.title,
              })) || []}
              {...register("final_drive_system")}
              error={errors.final_drive_system?.message}
              disabled={isPending}
            />

            <SelectField
              id="wheels"
              label="Wheels"
              options={configData?.product_options?.wheels?.map((option) => ({
                value: option.id,
                label: option.title,
              })) || []}
              {...register("wheels")}
              error={errors.wheels?.message}
              disabled={isPending}
            />

            <SelectField
              id="engine_size"
              label="Engine Size"
              options={configData?.product_options?.engine_size?.map((option) => ({
                value: option.id,
                label: option.title,
              })) || []}
              {...register("engine_size")}
              error={errors.engine_size?.message}
              disabled={isPending}
            />

            <SelectField
              id="warranty"
              label="Warranty"
              options={configData?.product_options?.warranty?.map((option) => ({
                value: option.id,
                label: option.title,
              })) || []}
              {...register("warranty")}
              error={errors.warranty?.message}
              disabled={isPending}
            />

            <SelectField
              id="seller_type"
              label="Seller Type"
              options={configData?.product_options?.seller_type?.map((option) => ({
                value: option.id,
                label: option.title,
              })) || []}
              {...register("seller_type")}
              error={errors.seller_type?.message}
              disabled={isPending}
            />
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-4">Price & Location</h3>
          <div className="p-6 space-y-4">
            <Input
              id="price"
              label="Price"
              placeholder="Enter the price"
              {...register("price")}
              error={errors.price?.message}
              disabled={isPending}
            />

            <LocationInput setValue={setValue} register={register} errors={errors} isPending={isPending} />
          </div>
        </div>

        <div>
          <div className="p-6">
            <div className="flex items-center space-x-3 mt-4">
              <Checkbox
                id="guidelines"
                checked={guidelinesChecked}
                onCheckedChange={(checked) => setGuidelinesChecked(checked === true)}
                disabled={isPending}
              />
              <Label htmlFor="guidelines" className="text-sm">
                I confirm that this ad follows the community&apos;s guidelines
              </Label>
            </div>
            <div className="flex flex-col justify-center items-center gap-4 mt-6">
              <Button
                type="submit"
                className="bg-solid hover:bg-hover text-black"
                disabled={isPending || !guidelinesChecked}
              >
                {isPending ? "Submitting..." : "Submit Ad"}
              </Button>
              <p className="text-xs text-gray-500 flex items-center">
                ✓ Your ad is under review. We&apos;ll notify you when it&apos;s live!
              </p>
            </div>
          </div>
        </div>
      </form>
    </>
  )
}