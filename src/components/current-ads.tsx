"use client"
import type React from "react"
import Image from "@/components/custom/MyImage"
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

export default function AdsTable({ selectedStatus, type }: { selectedStatus?: string, type?: string }) {
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
  } , [selectedStatus])


  return (
    <div className="w-full">
      {/* Container with horizontal scroll enabled */}
      <div className={`bg-white ${type === "post-ad" ? "border-[2px]" : "border"} border-gray-200 overflow-x-auto`}>
        
        {/* Fixed minimum width ensures columns don't squash and triggers scrolling */}
        <div className="min-w-[1000px]">
          
          {/* --- Table Header --- */}
          {/* Removed 'hidden sm:grid' and forced 'grid' always */}
          <div className="grid grid-cols-12 gap-4 p-4 border-b border-gray-200 text-[14px] font-bold text-black uppercase tracking-wide">
            <div className="col-span-4">Ads</div>
            <div className="col-span-2">Category</div>
            <div className="col-span-2">Ad Status</div>
            <div className="col-span-2 text-left">Actions</div>
            <div className="col-span-2 text-left"></div>
          </div>

          {/* --- Table Body --- */}
          <div className="divide-y divide-gray-100">
            {isLoading ? (
              <SkeletonLoader type="list" count={5} />
            ) : products.length > 0 ? (
              products.map((ad: Product) => (
                <div
                  onClick={() => router.push(`/listing/${ad.id}`)}
                  key={ad.id}
                  /* Removed grid-cols-1 sm:grid-cols-12 to force desktop view */
                  className="grid grid-cols-12 gap-4 p-4 transition-colors items-center  cursor-pointer"
                >

                  <div className="col-span-4 flex items-center gap-3">
                    <div className="w-[60px] h-[60px] bg-gray-100 relative overflow-hidden flex-shrink-0 border border-gray-200">
                      <Image
                        src={ad.product_images?.[0] || "/placeholder.svg"}
                        alt={ad.title}
                        width={48}
                        height={48}
                        className="object-cover w-full h-full"
                      />
                    </div>
                    <div className="min-w-0">
                      <h1 className="text-sm text-[#000000] h-[24px] leading-[24px] tracking-[-0.31px] truncate">
                        {capitalizeWords(ad.title)}
                      </h1>
                      <p className="text-xs font-normal text-[#6A7282] h-[20px] leading-[20px] tracking-[-0.15px]">
                        AED {ad.price}
                      </p>
                    </div>
                  </div>

                  {/* 2. Category Column - Removed responsive padding/margins */}
                  <div className="col-span-2">
                    <p className="text-sm font-normal h-[20px] leading-[20px] tracking-[-0.15px] text-[#000000] truncate">
                      {ad.category?.title || "Classifieds"}
                    </p>
                    <p className="text-xs font-normal text-[#6A7282] h-[20px] leading-[20px] tracking-[-0.15px] truncate">
                      {ad.subcategory?.title}
                    </p>
                  </div>

                  {/* 3. Ad Status Column - Removed responsive padding/margins */}
                  <div className="col-span-2">
                    <div className="flex items-center gap-2">
                      <span className={`w-2 h-2 rounded-full ${getStatusColor(ad.status)}`} />
                      <span className="text-sm font-normal h-[20px] leading-[20px] tracking-[-0.15px] text-[#6A7282] truncate">
                        {capitalizeWords(ad.status)}
                      </span>
                    </div>
                  </div>

                  {/* 4. Actions Column */}
                  <div
                    onClick={(e) => e.stopPropagation()}
                    className="col-span-2 flex items-center gap-2">
                    <Button
                      className="h-[32px] w-[138.96875px] rounded-none text-[13px] font-medium bg-white border border-gray-200 text-[#0A0A0A] hover:bg-gray-50 hover:text-black"
                      onClick={(e) => {
                        e.stopPropagation();
                        editAd(ad.id as number, ad);
                      }}
                    >
                      Edit Post
                    </Button>
                  </div>

                  <div className="col-span-2 flex items-center justify-end gap-2">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          className="h-8 w-8 p-0 text-gray-600 hover:text-gray-600 bg-transparent hover:bg-transparent"
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
        </div>
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