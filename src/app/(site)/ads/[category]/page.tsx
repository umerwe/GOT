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
import SearchAndSort from "@/components/ads/search-and-sort"
import ProductCard from "@/components/ads/product-card"

export default function CategoryLayout() {
  const { category } = useParams()
  const router = useRouter()
  const categoryId = (category as string) || "all"
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
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
  // Update category filter when categoryId changes
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
  // Fetch products
  const { data: productsResponse, isLoading: isProductsLoading } = useGetProducts({
    ...appliedFilters,
    page: currentPage,
  })
  const products = useMemo(() => productsResponse?.data ?? [], [productsResponse])
  const totalPages = productsResponse?.pagination?.totalPages ?? 1

  const filterOptions = useMemo(() => {
    const baseOptions = {
      sellerType: [
        { id: "owner", label: "Owner" },
        { id: "dealer", label: "Dealer" },
        { id: "certified", label: "Dealership/Certified Pre-Owned" },
      ],
      condition: Array.from({ length: 10 }, (_, i) => ({ id: String(i + 1), label: String(i + 1) })),
    }
    return {
      ...baseOptions,
      category: categories?.map((cat: Category) => ({ id: String(cat.id), label: cat.title })) ?? [],
      brand: brands?.map((brand: Brand) => ({ id: String(brand.id), label: brand.title })) ?? [],
    }
  }, [categories, brands])

  // Define getFilterLabel
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
  }, [filterOptions]);

  // Display labels
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

  // Search + Sort
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
  // Handlers
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
    setIsMobileFilterOpen(false) // Close sidebar on clear
  }
  const applyFilters = (newCategory: string) => {
    router.push(`/ads/${newCategory === "all" ? "all" : newCategory}`)
    setIsMobileFilterOpen(false) // Close sidebar on apply
  }
  // Check if no products found
  const isNotFound = !isProductsLoading && products.length === 0
  // Close mobile filter when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement
      // Only close if clicking outside the sidebar and not on the filter toggle button or within Select/Slider components
      if (
        isMobileFilterOpen &&
        !target.closest('.mobile-filter-sidebar') &&
        !target.closest('.filter-toggle-btn') &&
        !target.closest('.select__content') && // Avoid closing when clicking Select dropdown
        !target.closest('.slider') // Avoid closing when clicking Slider
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

  return (
    <div className="2xl:max-w-7xl mx-auto px-7 py-6">
      <div className="flex gap-6">
        {/* Desktop Sidebar */}
        <div className="hidden lg:block">
          <div className="fixed top-[72px] left-0 h-[calc(100vh-80px)] w-[290px] overflow-y-auto border-r bg-white px-6">
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
        {/* Mobile Filter Overlay */}
        {isMobileFilterOpen && (
          <div className="fixed inset-0 bg-black/50 z-40 lg:hidden">
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
        {/* Product area */}
        <div className="flex-1 lg:ml-[270px]">
          {!isNotFound ? (
            <div>
              <div className="flex sm:flex-row items-center justify-between gap-4 mb-6">
                <PageHeader
                  categoryTitle={displayLabels.category}
                  resultCount={filteredProducts?.length ?? 0}
                  isLoading={isProductsLoading}
                />
                {
                  !isProductsLoading &&
                  <div className="lg:hidden">
                    <button
                      onClick={() => setIsMobileFilterOpen(true)}
                      className="filter-toggle-btn flex items-center justify-center gap-2 px-4 py-2 bg-solid text-white rounded-md hover:bg-solid/70 transition-colors duration-200 shadow-sm"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.207A1 1 0 013 6.5V4z" />
                      </svg>
                      Filter
                    </button>
                  </div>
                }

              </div>
              <div className="mb-6">
                <SearchAndSort
                  searchTerm={searchTerm}
                  sortBy={sortBy}
                  onSearchChange={setSearchTerm}
                  onSortChange={setSortBy}
                  isLoading={isProductsLoading}
                />
              </div>
              <ProductCard
                products={filteredProducts}
                isHome={false}
                isLoading={isProductsLoading}
                count={8}
              />
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
                filteredProducts={filteredProducts}
              />
            </div>
          ) : (
            <NoListingsFound />
          )}
        </div>
      </div>
    </div>
  )
}