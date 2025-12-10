// types/config.ts
export interface ConfigOption {
  id: string;
  title: string;
}

export interface ProductOptions {
  usage: ConfigOption[];
  mileage_unit: ConfigOption[];
  final_drive_system: ConfigOption[];
  wheels: ConfigOption[];
  engine_size: ConfigOption[];
  warranty: ConfigOption[];
  seller_type: ConfigOption[];
  status: ConfigOption[];
}

export interface ConfigData {
  product_options: ProductOptions;
  privacy_policy?: string;
  site_logo ?: string
  site_name ?: string
  terms_condition?: string;
  google_login?: boolean;
}
