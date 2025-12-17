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
import ProductCard from "@/components/ads/product-card"
import ProductCard2 from "@/components/ads/product-card2"
import { Grip, AlignJustify, ChevronLeft, SlidersHorizontal, ChevronDownIcon } from "lucide-react"

export default function CategoryLayout() {
  const { category } = useParams()
  const router = useRouter()
  const categoryId = (category as string) || "all"
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(12)

  // View Mode State
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
    per_page: itemsPerPage
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
      sellerType: [
        { id: "owner", label: "Owner" },
        { id: "dealer", label: "Dealer" },
        { id: "certified", label: "Dealership/Certified Pre-Owned" },
      ],
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
      <div className="flex items-center gap-3 pl-2 border-l border-gray-300 ml-2">
        <button
          onClick={() => setViewMode('grid')}
          className={`transition-colors ${viewMode === 'grid' ? 'text-black' : 'text-gray-400 hover:text-black'}`}
          title="Grid View"
        >
          <Grip size={22} fill={viewMode === 'grid' ? "currentColor" : "none"} />
        </button>
        <button
          onClick={() => setViewMode('list')}
          className={`transition-colors ${viewMode === 'list' ? 'text-black' : 'text-gray-400 hover:text-black'}`}
          title="List View"
        >
          <AlignJustify size={22} />
        </button>
      </div>
    </div>
  )

  const BackButton = () => (
    <button onClick={() => router.back()} className="flex items-center gap-1 hover:text-gray-600 font-bold text-black transition-colors text-[13px]">
      <ChevronLeft size={14} strokeWidth={3} /> <span>Back</span>
    </button>
  )

  return (
    <div className="2xl:max-w-7xl mx-auto px-7 py-6">
      <PageHeader
        categoryTitle={displayLabels.category}
        resultCount={filteredProducts?.length ?? 0}
        isLoading={isProductsLoading}
      />

      <div className="lg:hidden mt-6 mb-6 flex flex-col gap-4">
        <div className="flex justify-between items-center">
          <BackButton />
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


      {/* =======================
          DESKTOP MAIN LAYOUT
          ======================= */}
      <div className="flex gap-4 relative items-start mt-8">

        {/* LEFT COLUMN: Sidebar */}
        <aside className="hidden lg:flex flex-col w-[280px] flex-shrink-0 sticky top-24 self-start gap-4">
          {/* Back Button Centered Above Sidebar */}
          <div className="flex justify-center w-full">
            <BackButton />
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

        {/* RIGHT COLUMN: Products */}
        <main className="flex-1 min-w-0">

          {/* DESKTOP HEADER (Hidden on Mobile) */}
          <div className="hidden lg:flex items-center justify-between mb-4">
            {/* Left: Items Count */}
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
                <ProductCard
                  products={filteredProducts}
                  isHome={false}
                  isLoading={isProductsLoading}
                  count={itemsPerPage}
                />
              ) : (
                <ProductCard2
                  products={filteredProducts}
                  isLoading={isProductsLoading}
                />
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

        {/* Mobile Filter Sidebar Overlay */}
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