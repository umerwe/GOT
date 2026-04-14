import Cart from '@/components/pages/cart'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Cart | Braaap'
}

const CartPage = () => {
  return (
    <Cart />
  )
}

export default CartPage  