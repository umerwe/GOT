export interface CartItem {
  id: number;
  name: string;
  price: number;
  image: string;
  quantity: number;
  business: number;
  details?: string[];
  seller?: {
    id: number;
    name: string;
  };
}
export interface OrderSummaryProps {
  cartItems: CartItem[];
  subtotal: number;
}