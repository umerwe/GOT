export interface Category {
  id: number;
  title: string;
  type: "accessories" | "motorcycles" | "gear" | string;
  image: string;
}

export interface Seller {
  id: number;
  name: string;
  profile_image: string;
  user_type: string;
}

export interface Product {
  id: number;
  title: string;
  description: string;
  product_images: string[];
  price: number;
  status: string;
  category: Category;
  subcategory: {
    id: number;
    title: string;
    image: string;
  };
  brand: {
    id: number;
    title: string;
    image: string;
  };
  seller: Seller;
  usage: string;
  condition: number;
  mileage: number;
  mileage_unit: string;
  manufacturing_year: string;
  final_drive_system: string;
  wheels: string;
  engine_size: string;
  warranty: string;
  seller_type: string;
  address: string;
  lat: number;
  lng: number;
}

export interface Vendor {
  id: number;
  name: string;
  email: string;
  address : string;
  phoneNumber: string;
  logo: string;
  cover: string;
  products: Product[];
}

export interface VendorDataResponse {
  data: Vendor[];
}