interface Category {
  id: number;
  title: string;
  image: string;
  position: number;
  status: number;
  created_at: string;
  updated_at: string;
  child?: Category[];
}

interface Product {
  id?: number; 
  title: string;
  description?: string;
  product_images?: string[];

  price: number;

  status?: "pending" | "approved" | "rejected" | "expired";
  category?: {
    id: number;
    title: string;
    image: string;
  };
  subcategory?: {
    id: number;
    title: string;
    image: string;
  };
  brand?: {
    id: number;
    title: string;
    image: string;
  };
  user?: {
    id: number;
    name: string;
    email: string;
    status: number;
    phoneNumber: string;
    profile_image: string;
    dob: string;
    blood: string | null;
    emergencyContact: string | null;
    medicalCondition: string | null;
    bikeType: string | null;
    mileage: number | null;
    isPremium: number;
    auth_token: string;
    created_at: string;
    updated_at: string;
  };
  usage?: "new" | "used";
  condition?: number;
  mileage?: number;
  mileage_unit?: string;
  manufacturing_year?: string;
  final_drive_system?: string;
  wheels?: string;
  engine_size?: string;
  warranty?: string;
  seller_type?: string;
  address?: string;
  lat?: number;
  lng?: number;
  rating?: number;
  reviewCount?: number;
  ratingOutOf?: string | number;
}

interface ProductFilters {
  category_id?: string;
  type ?: string;
  subcategory_id?: string;
  search ?: string;
  brand_id?: string;
  seller_type?: string;
  condition?: string;
  min_price?: string;
  max_price?: string;
  page ?: number
  per_page ?: number
}

interface FilterOption {
  id?: string;
  value?: string;
  label: string;
}

interface FilterState {
  category: string;
  brand: string;
  price: string;
  sellerType: string;
  condition: string;
}

interface DisplayLabels {
  category: string;
  brand: string;
  price: string;
  sellerType: string;
  condition: string;
}

interface Brand {
  id: number
  title: string
}

interface EditProductForm {
  title: string
  price: string
  product_image: FileList | null
}
