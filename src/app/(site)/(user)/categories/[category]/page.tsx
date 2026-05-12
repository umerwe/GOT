"use client"
import { useGetBrands } from "@/hooks/useBrand"
import { useGetCategories } from "@/hooks/useCategories"
import { useGetBusinessProducts, useGetSellerProducts } from "@/hooks/useProduct"
import { useParams, useRouter, useSearchParams } from "next/navigation"
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
import { ChevronLeft, ChevronDownIcon, SlidersHorizontal, ChevronRight } from "lucide-react"
import { sellerData } from "@/constants/category"
import Link from 'next/link'
import { Business } from "@/types/business"
import MyImage from "@/components/custom/MyImage"
import { BiSolidGrid } from "react-icons/bi"
import { BsFilterLeft } from "react-icons/bs"
import { Button } from "@/components/ui/button"
import Image from "@/components/custom/MyImage"

export default function CategoryLayout() {
  const { category } = useParams()
  const searchParams = useSearchParams()
  const router = useRouter()

  const categoryId = (category as string) || "all"
  const stateParam = searchParams.get("state");
  const searchParam = searchParams.get("search");
  const brandParam = searchParams.get("brand")

  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(12)
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState("price_low_to_high");
  const [isFilterChanging, setIsFilterChanging] = useState(false);

  // Client-side pagination map for each business's products (6 per page)
  const [paginationMap, setPaginationMap] = useState<Record<number | string, number>>({});

  // Seller products pagination (for Private Sellers card)
  const [sellerPage, setSellerPage] = useState(1);

  const handleBusinessPaginate = (businessId: number, dir: number) => {
    setPaginationMap((prev) => ({
      ...prev,
      [businessId]: Math.max(0, (prev[businessId] || 0) + (dir * 6))
    }));
  };

  const handleSellerPaginate = (dir: number) => {
    setSellerPage((prev) => prev + dir);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
    setPaginationMap({})
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  const { data: categories } = useGetCategories();
  
  const { data: brands } = useGetBrands(1)

  const [selectedFilters, setSelectedFilters] = useState<FilterState>({
    category: categoryId,
    subcategory: "all",
    brand: "all",
    sellerType: "all",
    min_price: 0,
    max_price: 100000,
  })

  useEffect(() => {
    setSelectedFilters((prev) => ({
      ...prev,
      category: categoryId,
      subcategory: "all",
      brand: brandParam || "all",
    }))
  }, [categoryId, brandParam])

  const appliedFilters: ProductFilters = useMemo(() => {
    const f: ProductFilters = {}
    if (selectedFilters.category !== "all") f.category_id = selectedFilters.category
    if (selectedFilters.subcategory !== "all") f.subcategory_id = selectedFilters.subcategory
    if (selectedFilters.brand !== "all") f.brand_id = selectedFilters.brand
    if (selectedFilters.sellerType !== "all") f.seller_type = selectedFilters.sellerType
    if (selectedFilters.min_price >= 0) f.min_price = selectedFilters.min_price.toString()
    if (selectedFilters.max_price >= 0) f.max_price = selectedFilters.max_price.toString()

    f.sort = sortBy;
    f.page = currentPage;
    f.per_page = itemsPerPage;

    if (stateParam) f.state = stateParam
    if (searchParam) f.search = searchParam

    return f;
  }, [selectedFilters, stateParam, searchParam, sortBy, currentPage, itemsPerPage])

  const { data: businessResponse, isLoading: isProductsLoading } = useGetBusinessProducts(
    {
      ...appliedFilters,
      user_type: "business"
    }
  );

  // Seller products — shown only on last page, same filters applied
  const { data: sellerResponse, isLoading: sellerLoading } = useGetSellerProducts({
    ...appliedFilters,
    page: sellerPage,
    per_page: 6,
  });

  const businesss = useMemo(() => businessResponse?.data ?? [], [businessResponse])

  const totalPages = businessResponse?.pagination?.totalPages ?? 1
  const totalItems = businessResponse?.pagination?.total_items || 0

  const isLastPage = currentPage >= totalPages

  const sellerProducts = sellerResponse?.data || [];
  const sellerPagination = sellerResponse?.pagination;

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

  const handleFilterChange = (filterType: keyof FilterState, value: string | number) => {
    setIsFilterChanging(true);
    setSelectedFilters(prev => ({ ...prev, [filterType]: value }));
    setCurrentPage(1);
    setSellerPage(1);
    setTimeout(() => setIsFilterChanging(false), 300);
  };
  const handlePriceRangeChange = (min: number, max: number) => {
    setIsFilterChanging(true);
    setSelectedFilters(prev => ({ ...prev, min_price: min, max_price: max }));
    setCurrentPage(1);
    setSellerPage(1);
    setTimeout(() => setIsFilterChanging(false), 300);
  };

  const clearAllFilters = () => {
    setSelectedFilters({ category: "all", subcategory: "all", brand: "all", sellerType: "all", min_price: 0, max_price: 100000 });
    router.replace("/categories/all");
    setIsMobileFilterOpen(false);
  }

  const isNotFound = !isProductsLoading && !sellerLoading && !isFilterChanging && businesss.length === 0 && sellerProducts.length === 0

  const RightControls = () => (
    <div className="flex items-center gap-4 text-[13px] text-gray-500">
      <div className="flex items-center gap-2">
        <span>Sort By:</span>
        <div className="relative">
          <select
            value={sortBy}
            onChange={(e) => {
              setSortBy(e.target.value);
              setCurrentPage(1);
            }}
            className="appearance-none border-none bg-transparent focus:ring-0 cursor-pointer pr-5 p-0 text-[13px] font-semibold text-black"
          >
            <option value="price_low_to_high">Price: Low to High</option>
            <option value="price_high_to_low">Price: High to Low</option>
          </select>
          <ChevronDownIcon className="pointer-events-none absolute right-0 top-1 h-3.5 w-3.5 text-gray-500" />
        </div>
      </div>

      <div className="hidden sm:flex items-center gap-2">
        <span>Show:</span>
        <div className="relative">
          <select
            value={itemsPerPage}
            onChange={(e) => {
              setItemsPerPage(Number(e.target.value));
              setCurrentPage(1);
            }}
            className="appearance-none border-none bg-transparent font-semibold text-black focus:ring-0 cursor-pointer pr-5 p-0 text-[13px]"
          >
            <option value={8}>8 per page</option>
            <option value={12}>12 per page</option>
            <option value={24}>24 per page</option>
          </select>
          <ChevronDownIcon className="pointer-events-none absolute right-0 top-1 h-3.5 w-3.5 text-black" />
        </div>
      </div>

      <div className="flex items-center gap-2 pl-2 border-l border-gray-300 ml-2">
        <button
          onClick={() => setViewMode("grid")}
          className={viewMode === "grid" ? "text-black" : "text-gray-400"}
          title="Grid View"
        >
          <BiSolidGrid size={22} />
        </button>
        <button
          onClick={() => setViewMode("list")}
          className={viewMode === "list" ? "text-black" : "text-gray-400"}
          title="List View"
        >
          <BsFilterLeft size={24} />
        </button>
      </div>
    </div>
  );

  const ActiveFilters = () => {
    const activeFilters = [];

    if (selectedFilters.category !== "all") activeFilters.push({ id: 'category', label: displayLabels.category });
    if (selectedFilters.subcategory !== "all") {
      const selectedCategory = categories?.find((c: Category) => String(c.id) === String(selectedFilters.category));
      const selectedSubcategory = selectedCategory?.child?.find((child: { id: number; title: string; image?: string }) => String(child.id) === String(selectedFilters.subcategory));
      if (selectedSubcategory) {
        activeFilters.push({ id: 'subcategory', label: selectedSubcategory.title });
      }
    }
    if (selectedFilters.brand !== "all") activeFilters.push({ id: 'brand', label: displayLabels.brand });
    if (selectedFilters.sellerType !== "all") activeFilters.push({ id: 'sellerType', label: displayLabels.sellerType });
    if (selectedFilters.min_price > 0 || selectedFilters.max_price < 100000) {
      activeFilters.push({ id: 'price', label: `Price: ${displayLabels.priceRange}` });
    }

    if (activeFilters.length === 0) return null;

    return (
      <div className="flex flex-wrap items-center gap-2 mb-6">
        <span className="text-[13px] font-semibold text-gray-400 mr-1">Active Filters:</span>
        {activeFilters.map((filter) => (
          <div
            key={filter.id}
            className="flex items-center gap-2 bg-gray-100 px-3 py-1.5 rounded-full border border-gray-200"
          >
            <span className="text-[12px] font-semibold text-black">{filter.label}</span>
            <button
              onClick={() => {
                if (filter.id === 'price') handlePriceRangeChange(0, 100000);
                else handleFilterChange(filter.id as keyof FilterState, "all");
              }}
              className="hover:text-red-500 transition-colors"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
            </button>
          </div>
        ))}
      </div>
    );
  };

  // Reusable Private Sellers card — same UI as business cards
  const PrivateSellersCard = () => (
    <div className='bg-[#F5F5F5] pt-[19px] px-[14px] pb-[30px] rounded-none'>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-[23px]">
        <div className="flex items-center gap-3">
          <div className="relative h-[56px] w-[56px]">
            <Image
              src="/hero-img.png"
              alt="Private Sellers"
              width={256}
              height={256}
              className="rounded-full w-14 h-14 object-cover bg-white border border-gray-200"
            />
          </div>
          <div>
            <h1 className="text-lg font-bold text-black">Private Sellers</h1>
            <p className="text-[#636E7E] text-sm">Individual listings from across the community</p>
          </div>
        </div>

        {(sellerProducts.length > 0 && sellerPagination.totalPages > 1 || sellerLoading) && (
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              className="rounded-full h-8 w-8 bg-white"
              onClick={() => handleSellerPaginate(-1)}
              disabled={sellerPage <= 1 || sellerLoading}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="rounded-full h-8 w-8 bg-white"
              onClick={() => handleSellerPaginate(1)}
              disabled={!sellerPagination || sellerPage >= sellerPagination.totalPages || sellerLoading}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        )}
      </div>

      {viewMode === 'grid' ? (
        <GridCard
          products={sellerProducts as Product[]}
          isLoading={sellerLoading}
          count={6}
          isAdsPage={true}
          isSecond={true}
          isPrivate={true}
        />
      ) : (
        <ListCard
          products={sellerProducts as Product[]}
          isLoading={sellerLoading}
          count={4}
        />
      )}
    </div>
  );

  return (
    <div className="px-[17px] pt-6 pb-[60px]">
      <PageHeader
        categoryTitle={displayLabels.category}
        resultCount={totalItems}
        isLoading={isProductsLoading}
        searchQuery={searchParam}
      />

      <div className="mt-4">
        <ActiveFilters />
      </div>

      <div className="lg:hidden mt-6 mb-6 flex flex-col gap-4">
        <div className="flex justify-between items-center">
          <button onClick={() => router.back()} className="flex items-center gap-1 font-bold text-black text-[13px]">
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
          {!isProductsLoading && <span className="text-[13px] text-gray-400">Items {startItem}-{endItem} of {totalItems}</span>}
          <RightControls />
        </div>
      </div>

      <div className="flex gap-4 relative items-start mt-8">
        <aside className="hidden lg:flex flex-col w-[280px] flex-shrink-0 gap-4">
          <div className="flex justify-center w-full">
            <button onClick={() => router.back()} className="flex items-center gap-1 font-bold text-black text-[13px]">
              <ChevronLeft size={14} strokeWidth={3} /> <span>Back</span>
            </button>
          </div>
          <FilterSidebar filterOptions={filterOptions} selectedFilters={selectedFilters} displayLabels={displayLabels} onFilterChange={handleFilterChange} onPriceRangeChange={handlePriceRangeChange} onClearFilters={clearAllFilters} onApplyFilters={(cat) => router.push(`/categories/${cat}`)} categoriesData={categories || []} />
        </aside>

        <main className="flex-1 min-w-0">
          <div className="hidden lg:flex items-center justify-between mb-4">
            {!isProductsLoading ? (
              <span className="text-[13px] text-gray-400">
                Sellers {startItem}-{endItem} of {totalItems}
              </span>
            ) : (
              <span className="h-4 w-32 bg-gray-200 animate-pulse rounded" />
            )}
            <RightControls />
          </div>

          {isProductsLoading || isFilterChanging ? (
            <div className="space-y-[30px]">
              {[...Array(2)].map((_, i) => (
                <div key={i} className="bg-[#F5F5F5] pt-[19px] px-[20px] pb-[30px] animate-pulse">
                  <div className="flex items-center gap-3 mb-[23px]">
                    <div className="w-[56px] h-[56px] bg-gray-300 rounded-full" />
                    <div className="space-y-2">
                      <div className="h-4 w-40 bg-gray-300 rounded" />
                      <div className="h-3 w-64 bg-gray-300 rounded" />
                    </div>
                  </div>
                  <GridCard products={[]} isLoading={true} count={6} isAdsPage={true} />
                </div>
              ))}
            </div>
          ) : !isNotFound ? (
            <div className="space-y-[30px]">
              {businesss.map((business: Business) => {
                const currentIndex = paginationMap[business.id] || 0;
                const totalProducts = business.products?.length || 0;
                const visibleProducts = business.products?.slice(currentIndex, currentIndex + 6) || [];

                return (
                  <div key={business.id} className='bg-[#F5F5F5] pt-[19px] px-[14px] pb-[30px] rounded-none'>
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-[23px]">
                      <div className="flex items-center gap-3">
                        <Link href={`/business/${business.id}`} className="relative h-[56px] w-[56px] flex-shrink-0">
                          <MyImage src={business.logo || "/default-avatar.png"} alt={business.name} fill className="rounded-full object-contain bg-white" />
                          <div className="absolute bottom-1 right-0 bg-[#E9A426] rounded-full p-0.5 border-2 border-white">
                            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="text-black"><polyline points="20 6 9 17 4 12"></polyline></svg>
                          </div>
                        </Link>
                        <Link href={`/business/${business.id}`} className="min-w-0">
                          <h1 className="text-lg font-bold text-black capitalize">{business.name}</h1>
                          <p className="text-[#636E7E] text-sm truncate">{business.address}</p>
                        </Link>
                      </div>

                      {totalProducts > 6 && business.products?.length > 6 && (
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="icon"
                            className="rounded-full h-8 w-8 bg-white"
                            onClick={() => handleBusinessPaginate(business.id, -1)}
                            disabled={currentIndex === 0}
                          >
                            <ChevronLeft className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="icon"
                            className="rounded-full h-8 w-8 bg-white"
                            onClick={() => handleBusinessPaginate(business.id, 1)}
                            disabled={currentIndex + 6 >= totalProducts}
                          >
                            <ChevronRight className="h-4 w-4" />
                          </Button>
                        </div>
                      )}
                    </div>

                    {viewMode === 'grid' ? (
                      <GridCard products={visibleProducts as Product[]} isLoading={false} count={6} isAdsPage={true} />
                    ) : (
                      <ListCard products={visibleProducts as Product[]} isLoading={false} count={4} />
                    )}
                  </div>
                );
              })}

              {/* Private Sellers card — only rendered on the last page */}
              {isLastPage && <PrivateSellersCard />}

              <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />
            </div>
          ) : (
            <NoListingsFound />
          )}
        </main>
      </div>

      {isMobileFilterOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 lg:hidden">
          <div className="fixed left-0 top-22 h-full w-80 max-w-[85vw] bg-white shadow-xl z-50 overflow-y-auto">
            <div className="flex items-center justify-between p-4 border-b">
              <h2 className="text-lg font-semibold">Filters</h2>
              <button onClick={() => setIsMobileFilterOpen(false)} className="p-2 hover:bg-gray-100 rounded-full">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="p-6 mb-20">
              <FilterSidebar filterOptions={filterOptions} selectedFilters={selectedFilters} displayLabels={displayLabels} onFilterChange={handleFilterChange} onPriceRangeChange={handlePriceRangeChange} onClearFilters={clearAllFilters} onApplyFilters={(cat) => { router.push(`/categories/${cat}`); setIsMobileFilterOpen(false); }} categoriesData={categories || []} />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}