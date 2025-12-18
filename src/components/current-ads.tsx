"use client"
import type React from "react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { MoreVertical, Trash2, Eye } from "lucide-react"
import { useState, useEffect } from "react"
import { useGetUserProducts, useDeleteUserProducts, useUpdateUserProduct } from "@/hooks/useProduct"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useForm } from "react-hook-form"
import { capitalizeWords } from "@/utils/capitalizeWords"
import SkeletonLoader from "@/common/skeleton-loader"
import Pagination from "@/components/ui/pagination"
import { getStatusColor } from "@/utils/getStatusColor"
import { DeleteProductDialog } from "./dialogs/delete-product"
import { EditProductDialog } from "./dialogs/edit-product"

export default function AdsTable({ selectedStatus }: { selectedStatus?: string }) {
  const router = useRouter()
  const [currentPage, setCurrentPage] = useState(1)
  const { data: productsResponse, isLoading } = useGetUserProducts(currentPage, selectedStatus)
  const deleteProduct = useDeleteUserProducts()
  const updateProduct = useUpdateUserProduct()

  const [isDeleteOpen, setIsDeleteOpen] = useState(false)
  const [isEditProductOpen, setIsEditProductOpen] = useState(false)
  const [editProductId, setEditProductId] = useState<number | null>(null)
  const [deleteId, setDeleteId] = useState<number | null>(null)
  const [selectedProductImage, setSelectedProductImage] = useState<File | null>(null);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)

  const {
    reset: resetProduct,
  } = useForm<EditProductForm>({
    defaultValues: {
      title: "",
      price: "",
      product_image: null,
    },
  })

  const products = productsResponse?.data || []
  const totalPages = productsResponse?.pagination?.totalPages ?? 1

  const viewAd = (id: number) => {
    router.push(`/listing/${id}`)
  }

  const editAd = (id: number, ad: Product) => {
    setEditProductId(id)
    setEditingProduct(ad)
    setIsEditProductOpen(true)
  }

  const handleDelete = () => {
    if (!deleteId) return
    deleteProduct.mutate(deleteId, {
      onSuccess: () => setIsDeleteOpen(false),
    })
  }

  const confirmDelete = (id: number) => {
    setDeleteId(id)
    setIsDeleteOpen(true)
  }

  const onProductSubmit = async (values: EditProductForm) => {
    if (!editProductId) return
    const formData = new FormData()
    formData.append("title", values.title)
    formData.append("price", values.price)
    if (values.product_image && values.product_image[0]) {
      formData.append("product_images[0]", values.product_image[0])
    }
    updateProduct.mutate(
      { id: editProductId, formData },
      {
        onSuccess: () => {
          setIsEditProductOpen(false)
          setSelectedProductImage(null)
          resetProduct({ title: "", price: "", product_image: null })
        },
      },
    )
  }

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
  }

  useEffect(() => {
    setCurrentPage(1)
  }, [selectedStatus])


  return (
    <div className="w-full">
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">

        {/* --- Table Header --- */}
        <div className="hidden sm:grid grid-cols-12 gap-4 p-4 border-b border-gray-200 bg-gray-50 text-xs font-semibold text-gray-500 uppercase tracking-wide">
          <div className="col-span-4">Ads</div>
          <div className="col-span-3">Category</div>
          <div className="col-span-2">Ad Status</div>
          <div className="col-span-3 text-right">Actions</div>
        </div>

        {/* --- Table Body --- */}
        <div className="divide-y divide-gray-100">
          {isLoading ? (
            <div className="p-3 sm:p-6">
              <SkeletonLoader type="list" count={3} />
            </div>
          ) : products.length > 0 ? (
            products.map((ad: Product) => (
              <div
                onClick={() => router.push(`/listing/${ad.id}`)}
                key={ad.id}
                className="grid grid-cols-1 sm:grid-cols-12 gap-4 p-4 hover:bg-gray-50 transition-colors items-center"
              >

                <div className="col-span-1 sm:col-span-4 flex items-start sm:items-center gap-3">
                  <div className="w-12 h-12 bg-gray-100 rounded-md relative overflow-hidden flex-shrink-0 border border-gray-200">
                    <Image
                      src={ad.product_images?.[0] || "/placeholder.svg"}
                      alt={ad.title}
                      width={48}
                      height={48}
                      className="object-cover w-full h-full"
                    />
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-sm font-bold text-[#000000] line-clamp-1">
                      {capitalizeWords(ad.title)}
                    </h3>
                    <p className="text-xs text-gray-500 mt-0.5">
                      AED {ad.price}
                    </p>
                  </div>
                </div>

                {/* 2. Category Column */}
                <div className="col-span-1 sm:col-span-3 pl-16 sm:pl-0 -mt-2 sm:mt-0">
                  <p className="text-sm font-medium text-[#000000]">
                    {ad.category?.title || "Classifieds"}
                  </p>
                  <p className="text-xs text-gray-500 line-clamp-1">
                    {ad.subcategory?.title}
                  </p>
                </div>

                {/* 3. Ad Status Column */}
                <div className="col-span-1 sm:col-span-2 pl-16 sm:pl-0 -mt-2 sm:mt-0">
                  <div className="flex items-center gap-2">
                    <span className={`w-2 h-2 rounded-full ${getStatusColor(ad.status)}`} />
                    <span className="text-sm text-gray-700 font-medium">
                      {capitalizeWords(ad.status)}
                    </span>
                  </div>
                </div>

                {/* 4. Actions Column */}
                <div
                  onClick={(e) => e.stopPropagation()}
                  className="col-span-1 sm:col-span-3 flex items-center justify-end gap-2">
                  <Button
                    className="h-8 px-3 text-xs font-semibold bg-white border border-gray-300 text-gray-700 hover:bg-gray-50"
                    onClick={(e) => {
                      e.stopPropagation();
                      editAd(ad.id as number, ad);
                    }}
                  >
                    Edit Post
                  </Button>

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        className="h-8 w-8 p-0 text-gray-600 hover:text-gray-600 bg-white hover:bg-gray-100"
                      >
                        <MoreVertical className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => viewAd(ad.id as number)}>
                        <Eye className="w-4 h-4 mr-2" /> View Ad
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => confirmDelete(ad.id as number)} className="text-black focus:text-red-600">
                        <Trash2 className="w-4 h-4 mr-2" /> Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

              </div>
            ))
          ) : (
            <div className="p-8 text-center text-gray-500 text-sm">
              No {selectedStatus} ads found.
            </div>
          )}
        </div>

        {/* --- Pagination --- */}
        {totalPages > 1 && (
          <div className="p-4 border-t border-gray-200">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          </div>
        )}
      </div>

      <DeleteProductDialog
        isOpen={isDeleteOpen}
        onOpenChange={setIsDeleteOpen}
        onConfirm={handleDelete}
        isPending={deleteProduct.isPending}
      />

      <EditProductDialog
        isOpen={isEditProductOpen}
        onOpenChange={setIsEditProductOpen}
        product={editingProduct}
        onSubmit={onProductSubmit}
        isPending={updateProduct.isPending}
      />
    </div>
  )
}