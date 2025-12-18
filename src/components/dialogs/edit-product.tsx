"use client"

import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"

interface EditProductForm {
  title: string
  price: string
  product_image: FileList | null
}

interface EditProductDialogProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  product: Product | null
  onSubmit: (values: EditProductForm) => void
  isPending: boolean
}

export function EditProductDialog({
  isOpen,
  onOpenChange,
  product,
  onSubmit,
  isPending,
}: EditProductDialogProps) {
  const [selectedImageName, setSelectedImageName] = useState<string | null>(null)

  const { register, handleSubmit, reset } = useForm<EditProductForm>()

  useEffect(() => {
    if (product) {
      reset({
        title: product.title,
        price: product.price.toString(),
        product_image: null,
      })
      setSelectedImageName(null)
    }
  }, [product, reset])

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) setSelectedImageName(file.name)
  }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Edit Product</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 pt-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input id="title" {...register("title", { required: true })} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="price">Price (AED)</Label>
            <Input
              id="price"
              type="number"
              step="0.01"
              {...register("price", { required: true })}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="image">Product Image</Label>
            <Input
              id="image"
              type="file"
              accept="image/*"
              {...register("product_image")}
              onChange={handleFileChange}
            />
            {selectedImageName && (
              <p className="text-xs text-blue-600 font-medium">
                Selected: {selectedImageName}
              </p>
            )}
          </div>
          <DialogFooter className="pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending ? "Saving..." : "Save Changes"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}