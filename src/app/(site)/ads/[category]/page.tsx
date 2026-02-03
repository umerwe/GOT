"use client"
import { useGetBrands } from "@/hooks/useBrand"
import { useGetCategories } from "@/hooks/useCategories"
import { useGetProducts } from "@/hooks/useProduct"
import { useParams, useRouter } from "next/navigation"
import { useCallback, useEffect, useMemo, useState } from "react"
import Pagination from "@/components/ui/pagination"
import type {
  FilterOption,
  FilterState,
  DisplayLabels,
  ProductFilters,
  Category,
  Brand,
} from "@/types/filters"
import NoListingsFound from "@/common/no-listing-found"
import FilterSidebar from "@/components/ads/filter-sidebar"
import PageHeader from "@/components/ads/page-header"
import GridCard from "@/components/cards/grid-card"
import ListCard from "@/components/cards/list-card"
import { ChevronLeft, SlidersHorizontal, ChevronDownIcon, Star } from "lucide-react"
import { BiSolidGrid } from "react-icons/bi";
import { BsFilterLeft } from "react-icons/bs";
import { sellerData } from "@/constants/category"
import Image from 'next/image';
import { FiMapPin } from "react-icons/fi";
import Link from 'next/link'

export default function CategoryLayout() {
  const { category } = useParams()
  const router = useRouter()
  const categoryId = (category as string) || "all"
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(12)

  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  const { data: categories } = useGetCategories()
  const { data: brands } = useGetBrands()

  const [selectedFilters, setSelectedFilters] = useState<FilterState>({
    category: categoryId,
    brand: "all",
    sellerType: "all",
    min_price: 0,
    max_price: 100000,
  })

  useEffect(() => {
    setSelectedFilters((prev) => ({
      ...prev,
      category: categoryId,
    }))
  }, [categoryId])

  const appliedFilters: ProductFilters = useMemo(() => {
    const f: ProductFilters = {}
    if (selectedFilters.category !== "all") f.category_id = selectedFilters.category
    if (selectedFilters.brand !== "all") f.brand_id = selectedFilters.brand
    if (selectedFilters.sellerType !== "all") f.seller_type = selectedFilters.sellerType
    if (selectedFilters.min_price > 0) f.min_price = selectedFilters.min_price.toString()
    if (selectedFilters.max_price < 100000) f.max_price = selectedFilters.max_price.toString()
    return f
  }, [selectedFilters])

  const { data: productsResponse, isLoading: isProductsLoading } = useGetProducts({
    ...appliedFilters,
    page: currentPage,
    per_page: viewMode === "grid" ? 6 : 4
  })

  const products = useMemo(() => productsResponse?.data ?? [], [productsResponse])
  const totalPages = productsResponse?.pagination?.totalPages ?? 1
  const totalItems = productsResponse?.pagination?.total_items || 0

  const startItem = totalItems === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1
  const endItem = Math.min(currentPage * itemsPerPage, totalItems)

  const filterOptions = useMemo(() => {
    return {
      category: categories?.map((cat: Category) => ({ id: String(cat.id), label: cat.title })) ?? [],
      brand: brands?.map((brand: Brand) => ({ id: String(brand.id), label: brand.title, image: brand.image })) ?? [],
      sellerType: sellerData,
      condition: [],
    }
  }, [categories, brands])

  const getFilterLabel = useCallback((filterType: keyof FilterState, value: string | number): string => {
    if (value === "all") {
      if (filterType === "category") return "All Categories"
      return `All ${filterType.charAt(0).toUpperCase() + filterType.slice(1)}s`
    }
    const option =
      (filterOptions[filterType as keyof typeof filterOptions] ?? []).find(
        (item: FilterOption) => item.id === value.toString(),
      )
    return option?.label ?? `All ${filterType}`
  }, [filterOptions])

  const [displayLabels, setDisplayLabels] = useState<DisplayLabels>({
    category: getFilterLabel("category", categoryId),
    brand: "All Brands",
    priceRange: "0 - 100,000",
    sellerType: "All Seller Types",
  })

  useEffect(() => {
    const newDisplayLabels: DisplayLabels = {
      category: getFilterLabel("category", selectedFilters.category),
      brand: getFilterLabel("brand", selectedFilters.brand),
      sellerType: getFilterLabel("sellerType", selectedFilters.sellerType),
      priceRange: `${selectedFilters.min_price.toLocaleString()} - ${selectedFilters.max_price.toLocaleString()}`,
    }
    setDisplayLabels(newDisplayLabels)
  }, [selectedFilters, filterOptions, getFilterLabel])

  const [searchTerm, setSearchTerm] = useState("")
  const [sortBy, setSortBy] = useState("newest")

  const filteredProducts = useMemo(() => {
    if (!products) return []
    let filtered = products
    if (searchTerm) {
      filtered = filtered.filter((p: Product) =>
        p.title?.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }
    if (sortBy === "priceLowHigh") {
      filtered = [...filtered].sort((a, b) => a.price - b.price)
    } else if (sortBy === "priceHighLow") {
      filtered = [...filtered].sort((a, b) => b.price - a.price)
    }
    return filtered
  }, [products, searchTerm, sortBy])

  const handleFilterChange = (filterType: keyof FilterState, value: string | number) => {
    setSelectedFilters((prev) => ({ ...prev, [filterType]: value }))
  }
  const handlePriceRangeChange = (minPrice: number, maxPrice: number) => {
    setSelectedFilters((prev) => ({ ...prev, min_price: minPrice, max_price: maxPrice }))
  }
  const clearAllFilters = () => {
    const reset: FilterState = {
      category: "all",
      brand: "all",
      sellerType: "all",
      min_price: 0,
      max_price: 100000,
    }
    setSelectedFilters(reset)
    setSearchTerm("")
    router.replace("/ads/all")
    setIsMobileFilterOpen(false)
  }
  const applyFilters = (newCategory: string) => {
    router.push(`/ads/${newCategory === "all" ? "all" : newCategory}`)
    setIsMobileFilterOpen(false)
  }

  const isNotFound = !isProductsLoading && products.length === 0

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement
      if (
        isMobileFilterOpen &&
        !target.closest('.mobile-filter-sidebar') &&
        !target.closest('.filter-toggle-btn') &&
        !target.closest('.select__content')
      ) {
        setIsMobileFilterOpen(false)
      }
    }
    if (isMobileFilterOpen) {
      document.addEventListener('mousedown', handleClickOutside)
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.body.style.overflow = 'unset'
    }
  }, [isMobileFilterOpen])

  const RightControls = () => (
    <div className="flex items-center gap-4 text-[13px] text-gray-500">
      {/* Sort By */}
      <div className="flex items-center gap-2">
        <span>Sort By:</span>

        <div className="relative">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="appearance-none border-none bg-transparent focus:ring-0 cursor-pointer pr-5 p-0 text-[13px]"
          >
            <option value="priceLowHigh">Price</option>
          </select>

          {/* Chevron Icon */}
          <ChevronDownIcon
            className="pointer-events-none absolute right-0 top-1 h-3.5 w-3.5 text-gray-500"
          />
        </div>
      </div>

      {/* Show Per Page */}
      <div className="hidden sm:flex items-center gap-2">
        <span>Show:</span>

        <div className="relative">
          <select
            value={itemsPerPage}
            onChange={(e) => setItemsPerPage(Number(e.target.value))}
            className="appearance-none border-none bg-transparent font-semibold text-black focus:ring-0 cursor-pointer pr-5 p-0 text-[13px]"
          >
            <option value={8}>8 per page</option>
            <option value={12}>12 per page</option>
            <option value={24}>24 per page</option>
          </select>

          {/* Chevron Icon */}
          <ChevronDownIcon
            className="pointer-events-none absolute right-0 top-1 h-3.5 w-3.5 text-black"
          />
        </div>
      </div>

      {/* View Toggles */}
      <div className="flex items-center gap-2 pl-2 border-l border-gray-300 ml-2">
        <button
          onClick={() => setViewMode("grid")}
          className={`transition-colors ${viewMode === "grid"
            ? "text-black"
            : "text-gray-400 hover:text-black"
            }`}
          title="Grid View"
        >
          <BiSolidGrid size={22} />
        </button>

        <button
          onClick={() => setViewMode("list")}
          className={`transition-colors ${viewMode === "list" ? "text-black" : "text-gray-400 hover:text-black"
            }`}
          title="List View"
        >
          <BsFilterLeft
            size={24}
            strokeWidth={0.5}
          />
        </button>

      </div>
    </div>
  )

  return (
    <div className="px-[17px] py-6">
      <PageHeader
        categoryTitle={displayLabels.category}
        resultCount={filteredProducts?.length ?? 0}
        isLoading={isProductsLoading}
      />

      <div className="lg:hidden mt-6 mb-6 flex flex-col gap-4">
        <div className="flex justify-between items-center">
          <button onClick={() => router.back()} className="flex items-center gap-1 hover:text-gray-600 font-bold text-black transition-colors text-[13px]">
            <ChevronLeft size={14} strokeWidth={3} /> <span>Back</span>
          </button>
          <button
            onClick={() => setIsMobileFilterOpen(true)}
            className="p-2 text-black hover:bg-gray-100 rounded border border-gray-200"
          >
            <SlidersHorizontal size={20} />
          </button>
        </div>

        <div className="flex flex-wrap justify-between items-center gap-y-3 pb-4 border-b border-gray-200">
          {!isProductsLoading && (
            <span className="text-[13px] text-gray-400">
              Items {startItem}-{endItem} of {totalItems}
            </span>
          )}
          <RightControls />
        </div>
      </div>

      <div className="flex gap-4 relative items-start mt-8">
        {/* LEFT COLUMN: Sidebar */}
        <aside className="hidden lg:flex flex-col w-[280px] flex-shrink-0 sticky top-24 self-start gap-4">
          <div className="flex justify-center w-full">
            <button onClick={() => router.back()} className="flex items-center gap-1 hover:text-gray-600 font-bold text-black transition-colors text-[13px]">
              <ChevronLeft size={14} strokeWidth={3} /> <span>Back</span>
            </button>
          </div>

          <FilterSidebar
            filterOptions={filterOptions}
            selectedFilters={selectedFilters}
            displayLabels={displayLabels}
            onFilterChange={handleFilterChange}
            onPriceRangeChange={handlePriceRangeChange}
            onClearFilters={clearAllFilters}
            onApplyFilters={applyFilters}
          />
        </aside>

        <main className="flex-1 min-w-0">
          <div className="hidden lg:flex items-center justify-between mb-4">
            {!isProductsLoading ? (
              <span className="text-[13px] text-gray-400">
                Items {startItem}-{endItem} of {totalItems}
              </span>
            ) : <span></span>}

            <RightControls />
          </div>

          {!isNotFound ? (
            <>
              {viewMode === 'grid' ? (
                <div className="bg-white space-y-[30px]">
                  <div className='bg-[#F5F5F5] pt-[19px] px-[20px] pb-[30px] rounded-none'>
                    <Link
                      href="/seller"
                      className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-[23px]">
                      <div className="flex items-center gap-3">
                        <div className="relative">
                          <Image
                            src="/moto-mania.png"
                            alt="MotoMania"
                            width={56}
                            height={50}
                            className="rounded-full object-contain"
                          />
                          <div className="absolute bottom-1 right-0 bg-[#E9A426] rounded-full p-0.5">
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-black"><polyline points="20 6 9 17 4 12"></polyline></svg>
                          </div>
                        </div>
                        <div>
                          <h1 className="text-lg text-[#111111]">MotoMania</h1>
                          <p className="text-[#636E7E] text-sm">Premier distributor of motorbike parts and accessories in the UAE.</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-1 text-sm text-[#111111]">
                          <div className="bg-black text-white w-[22px] h-[22px] rounded-[60px] flex items-center justify-center">
                            <FiMapPin size={11} />
                          </div>
                          <span>UAE, Dubai</span>
                        </div>

                        <div className="flex items-center gap-2 bg-[#E9A426] px-3 h-[30px] rounded-full">
                          <div className="bg-[#111111] rounded-full p-0.5">
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[#E9A426]"><polyline points="20 6 9 17 4 12"></polyline></svg>
                          </div>
                          <span className="text-xs font-medium text-[#111111] pt-0.5">Verified Seller</span>
                        </div>

                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium text-[#111111]">4.5 rating</span>
                          <div className="flex">
                            {[...Array(4)].map((_, i) => (
                              <Star key={i} size={20} fill="#E9A426" className="text-[#E9A426]" />
                            ))}
                            <Star size={20} className="text-[#E9A426]" />
                          </div>
                        </div>
                      </div>
                    </Link>
                    <GridCard
                      products={filteredProducts}
                      isHome={false}
                      isLoading={isProductsLoading}
                      count={8}
                      isAdsPage={true}
                    />
                  </div>
                  <div className='bg-[#F5F5F5] pt-[19px] px-[20px] pb-[30px] rounded-none'>
                    <Link
                      href="/seller"
                      className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-[23px]">
                      <div className="flex items-center gap-3">
                        <div className="relative">
                          <Image
                            src="/moto-hub.png"
                            alt="MotoHub"
                            width={56}
                            height={50}
                            className="rounded-full object-contain"
                          />
                          <div className="absolute bottom-1 right-0 bg-[#E9A426] rounded-full p-0.5">
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-black"><polyline points="20 6 9 17 4 12"></polyline></svg>
                          </div>
                        </div>
                        <div>
                          <h1 className="text-lg text-[#111111]">MotoHub</h1>
                          <p className="text-[#636E7E] text-sm">Premier motorcycle parts, accessories, and repair hub in Dubai.</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-1 text-sm text-[#111111]">
                          <div className="bg-black text-white w-[22px] h-[22px] rounded-[60px] flex items-center justify-center">
                            <FiMapPin size={11} />
                          </div>
                          <span>UAE, Dubai</span>
                        </div>

                        <div className="flex items-center gap-2 bg-[#E9A426] px-3 h-[30px] rounded-full">
                          <div className="bg-[#111111] rounded-full p-0.5">
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[#E9A426]"><polyline points="20 6 9 17 4 12"></polyline></svg>
                          </div>
                          <span className="text-xs font-medium text-[#111111] pt-0.5">Verified Seller</span>
                        </div>

                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium text-[#111111]">4.5 rating</span>
                          <div className="flex">
                            {[...Array(4)].map((_, i) => (
                              <Star key={i} size={20} fill="#E9A426" className="text-[#E9A426]" />
                            ))}
                            <Star size={20} className="text-[#E9A426]" />
                          </div>
                        </div>
                      </div>
                    </Link>
                    <GridCard
                      products={filteredProducts}
                      isHome={false}
                      isLoading={isProductsLoading}
                      count={8}
                      isAdsPage={true}
                    />
                  </div>
                </div>
              ) : (
                <div className="bg-white space-y-[20px]">
                  <div className='bg-[#F5F5F5] pt-[19px] px-[20px] pb-[30px] rounded-none'>
                    <Link
                      href="/seller"
                      className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-[23px]">
                      <div className="flex items-center gap-3">
                        <div className="relative">
                          <Image
                            src="/moto-mania.png"
                            alt="MotoMania"
                            width={56}
                            height={50}
                            className="rounded-full object-contain"
                          />
                          <div className="absolute bottom-1 right-0 bg-[#E9A426] rounded-full p-0.5">
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-black"><polyline points="20 6 9 17 4 12"></polyline></svg>
                          </div>
                        </div>
                        <div>
                          <h1 className="text-lg text-[#111111]">MotoMania</h1>
                          <p className="text-[#636E7E] text-sm">Premier distributor of motorbike parts and accessories in the UAE.</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-1 text-sm text-[#111111]">
                          <div className="bg-black text-white w-[22px] h-[22px] rounded-[60px] flex items-center justify-center">
                            <FiMapPin size={11} />
                          </div>
                          <span>UAE, Dubai</span>
                        </div>

                        <div className="flex items-center gap-2 bg-[#E9A426] px-3 h-[30px] rounded-full">
                          <div className="bg-[#111111] rounded-full p-0.5">
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[#E9A426]"><polyline points="20 6 9 17 4 12"></polyline></svg>
                          </div>
                          <span className="text-xs font-medium text-[#111111] pt-0.5">Verified Seller</span>
                        </div>

                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium text-[#111111]">4.5 rating</span>
                          <div className="flex">
                            {[...Array(4)].map((_, i) => (
                              <Star key={i} size={20} fill="#E9A426" className="text-[#E9A426]" />
                            ))}
                            <Star size={20} className="text-[#E9A426]" />
                          </div>
                        </div>
                      </div>
                    </Link>
                    <ListCard
                      products={filteredProducts}
                      isLoading={isProductsLoading}
                      count={4}
                      isHome={false}
                    />
                  </div>
                  <div className='bg-[#F5F5F5] pt-[19px] px-[20px] pb-[30px] rounded-none'>
                    <Link
                      href="/seller"
                      className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-[23px]">
                      <div className="flex items-center gap-3">
                        <div className="relative">
                          <Image
                            src="/moto-hub.png"
                            alt="MotoHub"
                            width={56}
                            height={50}
                            className="rounded-full object-contain"
                          />
                          <div className="absolute bottom-1 right-0 bg-[#E9A426] rounded-full p-0.5">
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-black"><polyline points="20 6 9 17 4 12"></polyline></svg>
                          </div>
                        </div>
                        <div>
                          <h1 className="text-lg text-[#111111]">MotoHub</h1>
                          <p className="text-[#636E7E] text-sm">Premier motorcycle parts, accessories, and repair hub in Dubai.</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-1 text-sm text-[#111111]">
                          <div className="bg-black text-white w-[22px] h-[22px] rounded-[60px] flex items-center justify-center">
                            <FiMapPin size={11} />
                          </div>
                          <span>UAE, Dubai</span>
                        </div>

                        <div className="flex items-center gap-2 bg-[#E9A426] px-3 h-[30px] rounded-full">
                          <div className="bg-[#111111] rounded-full p-0.5">
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[#E9A426]"><polyline points="20 6 9 17 4 12"></polyline></svg>
                          </div>
                          <span className="text-xs font-medium text-[#111111] pt-0.5">Verified Seller</span>
                        </div>

                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium text-[#111111]">4.5 rating</span>
                          <div className="flex">
                            {[...Array(4)].map((_, i) => (
                              <Star key={i} size={20} fill="#E9A426" className="text-[#E9A426]" />
                            ))}
                            <Star size={20} className="text-[#E9A426]" />
                          </div>
                        </div>
                      </div>
                    </Link>
                    <ListCard
                      products={filteredProducts}
                      isLoading={isProductsLoading}
                      count={4}
                      isHome={false}
                    />
                  </div>
                </div>
              )}

              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
                filteredProducts={filteredProducts}
              />
            </>
          ) : (
            <NoListingsFound />
          )}
        </main>

        {isMobileFilterOpen && (
          <div className="fixed inset-0 bg-black/50 z-50 lg:hidden">
            <div className="mobile-filter-sidebar fixed left-0 top-0 h-full w-80 max-w-[85vw] bg-white shadow-xl z-50 overflow-y-auto">
              <div className="flex items-center justify-between p-4 border-b">
                <h2 className="text-lg font-semibold">Filters</h2>
                <button
                  onClick={() => setIsMobileFilterOpen(false)}
                  className="p-2 hover:bg-gray-100 rounded-full"
                  aria-label="Close filters"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <div className="p-6">
                <FilterSidebar
                  filterOptions={filterOptions}
                  selectedFilters={selectedFilters}
                  displayLabels={displayLabels}
                  onFilterChange={handleFilterChange}
                  onPriceRangeChange={handlePriceRangeChange}
                  onClearFilters={clearAllFilters}
                  onApplyFilters={applyFilters}
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}