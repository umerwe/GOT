"use client"
import { useGetBrands } from "@/hooks/useBrand"
import { useGetCategories } from "@/hooks/useCategories"
import { useGetBusinessProducts } from "@/hooks/useProduct"
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
import { ChevronLeft, ChevronDownIcon, Star, SlidersHorizontal } from "lucide-react" // Added SlidersHorizontal back
import { BiSolidGrid } from "react-icons/bi";
import { BsFilterLeft } from "react-icons/bs";
import { sellerData } from "@/constants/category"
import Image from 'next/image';
import Link from 'next/link'
import { Business } from "@/types/business"


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
    setSelectedFilters((prev) => ({ ...prev, category: categoryId }))
  }, [categoryId])

  const appliedFilters: ProductFilters = useMemo(() => {
    const f: ProductFilters = {}
    if (selectedFilters.category !== "all") f.category_id = selectedFilters.category
    if (selectedFilters.brand !== "all") f.brand_id = selectedFilters.brand
    if (selectedFilters.sellerType !== "all") f.seller_type = selectedFilters.sellerType
    if (selectedFilters.min_price >= 0) f.min_price = selectedFilters.min_price.toString()
    if (selectedFilters.max_price >= 0) f.max_price = selectedFilters.max_price.toString()
    return f
  }, [selectedFilters])

  const { data: businessResponse, isLoading: isProductsLoading } = useGetBusinessProducts({
    ...appliedFilters,
    page: currentPage,
    per_page: itemsPerPage
  })

  const businesss = useMemo(() => businessResponse?.data ?? [], [businessResponse])
  const totalPages = businessResponse?.pagination?.totalPages ?? 1
  const totalItems = businessResponse?.pagination?.total_items || 0

  const startItem = totalItems === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1
  const endItem = Math.min(currentPage * itemsPerPage, totalItems)

  const filterOptions = useMemo(() => ({
    category: categories?.map((cat: Category) => ({ id: String(cat.id), label: cat.title })) ?? [],
    brand: brands?.map((brand: Brand) => ({ id: String(brand.id), label: brand.title, image: brand.image })) ?? [],
    sellerType: sellerData,
    condition: [],
  }), [categories, brands])

  const getFilterLabel = useCallback((filterType: keyof FilterState, value: string | number): string => {
    if (value === "all") return filterType === "category" ? "All Categories" : `All ${filterType}s`;
    const option = (filterOptions[filterType as keyof typeof filterOptions] ?? []).find((o: FilterOption) => o.id === value.toString());
    return option?.label ?? `All ${filterType}`;
  }, [filterOptions])

  const [displayLabels, setDisplayLabels] = useState<DisplayLabels>({
    category: getFilterLabel("category", categoryId),
    brand: "All Brands",
    priceRange: "0 - 100,000",
    sellerType: "All Seller Types",
  })

  useEffect(() => {
    setDisplayLabels({
      category: getFilterLabel("category", selectedFilters.category),
      brand: getFilterLabel("brand", selectedFilters.brand),
      sellerType: getFilterLabel("sellerType", selectedFilters.sellerType),
      priceRange: `${selectedFilters.min_price.toLocaleString()} - ${selectedFilters.max_price.toLocaleString()}`,
    })
  }, [selectedFilters, filterOptions, getFilterLabel])

  const [sortBy, setSortBy] = useState("newest")

  const handleFilterChange = (filterType: keyof FilterState, value: string | number) => setSelectedFilters(prev => ({ ...prev, [filterType]: value }));
  const handlePriceRangeChange = (min: number, max: number) => setSelectedFilters(prev => ({ ...prev, min_price: min, max_price: max }));
  const clearAllFilters = () => {
    setSelectedFilters({ category: "all", brand: "all", sellerType: "all", min_price: 0, max_price: 100000 });
    router.replace("/ads/all");
    setIsMobileFilterOpen(false);
  }

  const isNotFound = !isProductsLoading && businesss.length === 0

  const RightControls = () => (
    <div className="flex items-center gap-4 text-[13px] text-gray-500">
      <div className="flex items-center gap-2">
        <span>Sort By:</span>
        <div className="relative">
          <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="appearance-none border-none bg-transparent focus:ring-0 cursor-pointer pr-5 p-0 text-[13px]">
            <option value="priceLowHigh">Price</option>
          </select>
          <ChevronDownIcon className="pointer-events-none absolute right-0 top-1 h-3.5 w-3.5 text-gray-500" />
        </div>
      </div>
      <div className="hidden sm:flex items-center gap-2">
        <span>Show:</span>
        <div className="relative">
          <select value={itemsPerPage} onChange={(e) => setItemsPerPage(Number(e.target.value))} className="appearance-none border-none bg-transparent font-semibold text-black focus:ring-0 cursor-pointer pr-5 p-0 text-[13px]">
            <option value={8}>8 per page</option>
            <option value={12}>12 per page</option>
          </select>
          <ChevronDownIcon className="pointer-events-none absolute right-0 top-1 h-3.5 w-3.5 text-black" />
        </div>
      </div>
      <div className="flex items-center gap-2 pl-2 border-l border-gray-300 ml-2">
        <button onClick={() => setViewMode("grid")} className={viewMode === "grid" ? "text-black" : "text-gray-400"}><BiSolidGrid size={22} /></button>
        <button onClick={() => setViewMode("list")} className={viewMode === "list" ? "text-black" : "text-gray-400"}><BsFilterLeft size={24} /></button>
      </div>
    </div>
  )

  return (
    <div className="px-[17px] py-6">
      <PageHeader categoryTitle={displayLabels.category} resultCount={totalItems} isLoading={isProductsLoading} />

      {/* Mobile Controls Block */}
      <div className="lg:hidden mt-6 mb-6 flex flex-col gap-4">
        <div className="flex justify-between items-center">
          <button onClick={() => router.back()} className="flex items-center gap-1 font-bold text-black text-[13px]">
            <ChevronLeft size={14} strokeWidth={3} /> <span>Back</span>
          </button>
          {/* RE-ADDED FILTER ICON HERE */}
          <button
            onClick={() => setIsMobileFilterOpen(true)}
            className="p-2 text-black hover:bg-gray-100 rounded border border-gray-200"
          >
            <SlidersHorizontal size={20} />
          </button>
        </div>
        <div className="flex flex-wrap justify-between items-center gap-y-3 pb-4 border-b border-gray-200">
          {!isProductsLoading && <span className="text-[13px] text-gray-400">Items {startItem}-{endItem} of {totalItems}</span>}
          <RightControls />
        </div>
      </div>

      <div className="flex gap-4 relative items-start mt-8">
        <aside className="hidden lg:flex flex-col w-[280px] flex-shrink-0 sticky top-24 self-start gap-4">
          <div className="flex justify-center w-full">
            <button onClick={() => router.back()} className="flex items-center gap-1 font-bold text-black text-[13px]">
              <ChevronLeft size={14} strokeWidth={3} /> <span>Back</span>
            </button>
          </div>
          <FilterSidebar filterOptions={filterOptions} selectedFilters={selectedFilters} displayLabels={displayLabels} onFilterChange={handleFilterChange} onPriceRangeChange={handlePriceRangeChange} onClearFilters={clearAllFilters} onApplyFilters={(cat) => router.push(`/ads/${cat}`)} />
        </aside>

        <main className="flex-1 min-w-0">
          <div className="hidden lg:flex items-center justify-between mb-4">
            {!isProductsLoading ? (
              <span className="text-[13px] text-gray-400">
                Items {startItem}-{endItem} of {totalItems}
              </span>
            ) : (
              <span className="h-4 w-32 bg-gray-200 animate-pulse rounded" /> // Header Skeleton
            )}
            <RightControls />
          </div>

          {/* 1. Show Skeletons while Loading */}
          {isProductsLoading ? (
            <div className="space-y-[30px]">
              {[...Array(2)].map((_, i) => (
                <div key={i} className="bg-[#F5F5F5] pt-[19px] px-[20px] pb-[30px] animate-pulse">
                  {/* Business Info Header Skeleton */}
                  <div className="flex items-center gap-3 mb-[23px]">
                    <div className="w-[56px] h-[56px] bg-gray-300 rounded-full" />
                    <div className="space-y-2">
                      <div className="h-4 w-40 bg-gray-300 rounded" />
                      <div className="h-3 w-64 bg-gray-300 rounded" />
                    </div>
                  </div>
                  {/* Grid/List Card Skeleton */}
                  <GridCard products={[]} isLoading={true} count={8} />
                </div>
              ))}
            </div>
          ) : !isNotFound ? (
            <div className="space-y-[30px]">
              {businesss.map((business: Business) => (
                <div key={business.id} className='bg-[#F5F5F5] pt-[19px] px-[20px] pb-[30px] rounded-none'>

                  <Link href={`/seller/${business.id}`} className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-[23px]">
                    <div className="flex items-center gap-3">
                      <div className="relative h-[56px] w-[56px]">
                        <Image src={business.logo || "/default-avatar.png"} alt={business.name} fill className="rounded-full object-contain bg-white" />
                        <div className="absolute bottom-1 right-0 bg-[#E9A426] rounded-full p-0.5 border-2 border-white">
                          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="text-black"><polyline points="20 6 9 17 4 12"></polyline></svg>
                        </div>
                      </div>
                      <div>
                        <h1 className="text-lg font-bold text-black">{business.name}</h1>
                        <p className="text-[#636E7E] text-sm">{business.address}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      {/* <div className="flex items-center gap-1 text-sm text-black">
                        <div className="bg-black text-white w-[22px] h-[22px] rounded-full flex items-center justify-center"><FiMapPin size={11} /></div>
                        <span className="font-medium max-w-[100px] truncate">{business.address || "UAE, Dubai"}</span>
                      </div> */}
                      <div className="flex items-center gap-2 bg-[#E9A426] px-3 h-[30px] rounded-full">
                        <span className="text-xs font-bold text-black">Verified Seller</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-black">4.5 rating</span>
                        <div className="flex">{[...Array(4)].map((_, i) => <Star key={i} size={18} fill="#E9A426" className="text-[#E9A426]" />)}<Star size={18} className="text-[#E9A426]" /></div>
                      </div>
                    </div>
                  </Link>

                  {viewMode === 'grid' ? (
                    <GridCard products={business.products as Product[]} isLoading={false} count={8} isAdsPage={true} />
                  ) : (
                    <ListCard products={business.products as Product[]} isLoading={false} count={4} />
                  )}
                </div>
              ))}
              <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />
            </div>
          ) : (
            /* 3. Show No Listings */
            <NoListingsFound />
          )}
        </main>
      </div>

      {/* MOBILE OVERLAY FILTER SIDEBAR */}
      {isMobileFilterOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 lg:hidden">
          <div className="fixed left-0 top-25 h-full w-80 max-w-[85vw] bg-white shadow-xl z-50 overflow-y-auto">
            <div className="flex items-center justify-between p-4 border-b">
              <h2 className="text-lg font-semibold">Filters</h2>
              <button onClick={() => setIsMobileFilterOpen(false)} className="p-2 hover:bg-gray-100 rounded-full">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="p-6 mb-20">
              <FilterSidebar filterOptions={filterOptions} selectedFilters={selectedFilters} displayLabels={displayLabels} onFilterChange={handleFilterChange} onPriceRangeChange={handlePriceRangeChange} onClearFilters={clearAllFilters} onApplyFilters={(cat) => { router.push(`/ads/${cat}`); setIsMobileFilterOpen(false); }} />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
