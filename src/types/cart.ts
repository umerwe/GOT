export interface CartItem {
  id: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
  details?: string[];
}
export interface OrderSummaryProps {
  cartItems: CartItem[];
  subtotal: number;
}