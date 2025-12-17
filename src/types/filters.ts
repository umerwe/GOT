export interface FilterOption {
  id?: string
  value?: string
  label?: string
  image ?: string
}

export interface FilterState {
  category: string
  brand: string
  sellerType: string
  min_price: number
  max_price: number
}

export interface DisplayLabels {
  category: string
  brand: string
  sellerType: string
  priceRange: string
}

export interface ProductFilters {
  category_id?: string
  subcategory_id?: string
  brand_id?: string
  seller_type?: string
  condition?: string
  min_price?: string
  max_price?: string
}
export interface Category {
  id: number
  title: string
  image: string
  child?: {
    id: number
    title: string
    image?: string
  }[]
}


export interface Brand {
  id: number
  title: string
  image : string
}

export interface FilterSidebarProps {
  filterOptions: {
    category: FilterOption[]
    brand: FilterOption[]
    sellerType: FilterOption[]
    condition: FilterOption[]
  }
  selectedFilters: FilterState
  displayLabels: DisplayLabels
  onFilterChange: (filterType: keyof FilterState, value: string | number) => void
  onPriceRangeChange: (minPrice: number, maxPrice: number) => void
  onClearFilters: () => void
  onApplyFilters: (newCategory: string) => void
}