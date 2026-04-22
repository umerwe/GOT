"use client"
import type React from "react"
import Image from "@/components/custom/MyImage"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { MoreVertical, Trash2, Eye, PowerOff, Star } from "lucide-react"
import { useState, useEffect } from "react"
import {
  useGetUserProducts,
  useDeleteUserProducts,
  useUpdateUserProduct,
  useActivateProduct,
  useDeactivateProduct
} from "@/hooks/useProduct"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
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

  // API Hooks
  const { data: productsResponse, isLoading } = useGetUserProducts(currentPage, selectedStatus)
  const deleteProduct = useDeleteUserProducts()
  const updateProduct = useUpdateUserProduct()
  const activateProduct = useActivateProduct()
  const deactivateProduct = useDeactivateProduct()

  // Dialog States
  const [isDeleteOpen, setIsDeleteOpen] = useState(false)
  const [isEditProductOpen, setIsEditProductOpen] = useState(false)
  const [isFeatureOpen, setIsFeatureOpen] = useState(false)

  // Selection States
  const [editProductId, setEditProductId] = useState<number | null>(null)
  const [deleteId, setDeleteId] = useState<number | null>(null)
  const [featureProductId, setFeatureProductId] = useState<number | null>(null)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)

  const { reset: resetProduct } = useForm<EditProductForm>({
    defaultValues: { title: "", price: "", product_image: null },
  })

  const products = productsResponse?.data || []
  const totalPages = productsResponse?.pagination?.totalPages ?? 1

  const viewAd = (id: number) => router.push(`/listing/${id}`)

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

  const openFeatureDialog = (id: number) => {
    setFeatureProductId(id)
    setIsFeatureOpen(true)
  }

  const handleActivateProduct = async (id: string) => await activateProduct.mutateAsync(id)
  const handleDeactivateProduct = async (id: string) => await deactivateProduct.mutateAsync(id)

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
          resetProduct({ title: "", price: "", product_image: null })
        },
      },
    )
  }

  useEffect(() => {
    setCurrentPage(1)
  }, [selectedStatus])

  return (
    <div className="w-full">
      <div className={`bg-white ${type === "post-ad" ? "border-[2px]" : "border"} border-gray-200 overflow-x-auto`}>
        <div className="min-w-[1000px]">

          {/* --- Table Header --- */}
          <div className="grid grid-cols-12 gap-4 p-4 border-b border-gray-200 text-[14px] font-bold text-black uppercase tracking-wide">
            <div className="col-span-3">Ads</div>
            <div className="col-span-2">Category</div>
            <div className="col-span-2">Ad Status</div>
            <div className="col-span-2">Featured</div>
            <div className="col-span-2 text-left">Actions</div>
            <div className="col-span-1"></div>
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
                  className="grid grid-cols-12 gap-4 p-4 transition-colors items-center cursor-pointer"
                >
                  {/* Ad Info */}
                  <div className="col-span-3 flex items-center gap-3">
                    <div className="w-[60px] h-[60px] bg-gray-100 relative overflow-hidden flex-shrink-0 border border-gray-200">
                      <Image
                        src={ad.product_images?.[0] || "/fallback.png"}
                        alt={ad.title}
                        width={256}
                        height={256}
                        className="object-cover w-full h-full"
                      />
                    </div>
                    <div className="min-w-0">
                      <h1 className="text-sm text-[#000000] h-[24px] leading-[24px] truncate">
                        {capitalizeWords(ad.title)}
                      </h1>
                      <p className="text-xs font-normal text-[#6A7282]">
                        AED {ad.price}
                      </p>
                    </div>
                  </div>

                  {/* Category */}
                  <div className="col-span-2">
                    <p className="text-sm font-normal text-[#000000] truncate">
                      {ad.category?.title || "Classifieds"}
                    </p>
                    <p className="text-xs font-normal text-[#6A7282] truncate">
                      {ad.subcategory?.title}
                    </p>
                  </div>

                  {/* Status */}
                  <div className="col-span-2">
                    <div className="flex items-center gap-2">
                      <span className={`w-2 h-2 rounded-full ${getStatusColor(ad.status)}`} />
                      <span className="text-sm font-normal text-[#6A7282]">
                        {capitalizeWords(ad.status)}
                      </span>
                    </div>
                  </div>

                  {/* Featured Status Column */}
                  <div className="col-span-2">
                    <span className="text-sm font-normal text-[#6A7282]">
                      {ad.is_featured === 0 ? "False" : "True"}
                    </span>
                  </div>

                  {/* Edit Button */}
                  <div
                    onClick={(e) => e.stopPropagation()}
                    className="col-span-2 flex items-center gap-2">
                    <Button
                      className="h-[32px] w-[138.96875px] rounded-none text-[13px] font-medium bg-white border border-gray-200 text-[#0A0A0A] hover:bg-gray-50"
                      onClick={(e) => {
                        e.stopPropagation();
                        editAd(ad.id as number, ad);
                      }}
                    >
                      Edit Post
                    </Button>
                  </div>

                  {/* 3 Dots Menu */}
                  <div className="col-span-1 flex items-center justify-end">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          className="h-8 w-8 p-0 text-gray-600 bg-transparent hover:bg-transparent hover:text-gray-800"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <MoreVertical className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>

                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => viewAd(ad.id as number)}>
                          <Eye className="w-4 h-4" /> View Ad
                        </DropdownMenuItem>

                        <DropdownMenuItem
                          onClick={(e) => {
                            e.stopPropagation();
                            openFeatureDialog(ad.id as number);
                          }}
                        >
                          <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" /> Feature Ad
                        </DropdownMenuItem>

                        {ad.status === 'approved' && (
                          <DropdownMenuItem
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeactivateProduct(ad.id?.toString() || '');
                            }}
                          >
                            <PowerOff className="w-4 h-4" /> Deactivate
                          </DropdownMenuItem>
                        )}

                        {ad.status === 'expired' && (
                          <DropdownMenuItem
                            onClick={(e) => {
                              e.stopPropagation();
                              handleActivateProduct(ad.id?.toString() || '');
                            }}
                          >
                            <PowerOff className="w-4 h-4" /> Renew
                          </DropdownMenuItem>
                        )}

                        <DropdownMenuItem
                          className="text-red-600 focus:text-red-600"
                          onClick={(e) => {
                            e.stopPropagation();
                            confirmDelete(ad.id as number);
                          }}
                        >
                          <Trash2 className="w-4 h-4" /> Delete
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

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="p-4 border-t border-gray-200">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </div>
      )}

      {/* Delete Dialog */}
      <DeleteProductDialog
        isOpen={isDeleteOpen}
        onOpenChange={setIsDeleteOpen}
        onConfirm={handleDelete}
        isPending={deleteProduct.isPending}
      />

      {/* Edit Dialog */}
      <EditProductDialog
        isOpen={isEditProductOpen}
        onOpenChange={setIsEditProductOpen}
        product={editingProduct}
        onSubmit={onProductSubmit}
        isPending={updateProduct.isPending}
      />

      {/* Feature Ad Dialog */}
      <Dialog open={isFeatureOpen} onOpenChange={setIsFeatureOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
              Feature Your Ad
            </DialogTitle>
            <DialogDescription className="pt-4 text-gray-600">
              Boost your visibility! Featured ads appear at the top of search results and category pages, helping you sell faster.
            </DialogDescription>
          </DialogHeader>

          <div className="bg-gray-50 p-4 rounded-lg border border-gray-100 my-4">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-gray-700">Service Fee</span>
              <span className="text-lg font-bold text-black">AED 50.00</span>
            </div>
          </div>

          <DialogFooter className="flex flex-col sm:flex-row gap-2">
            <Button
              className="w-full bg-black text-white border-0 hover:bg-gray-800"
              onClick={() => router.push(`/checkout?type=feature_ad&product_id=${featureProductId}`)}
            >
              Pay Now
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}