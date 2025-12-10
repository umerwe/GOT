export interface FilterOption {
  id?: string
  value?: string
  label: string
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
}

export interface Brand {
  id: number
  title: string
  image : string
}
