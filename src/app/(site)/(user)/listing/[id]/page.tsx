import ProductDetails from '@/components/pages/product-details'
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Product Details | Braaap",
};


const ProductDetailsPage = () => {
  return (
    <ProductDetails />
  )
}

export default ProductDetailsPage