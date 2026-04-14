import Favorites from '@/components/pages/favourites'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Favorites | Braaap'
}

const FavoritesPage = () => {
  return (
    <Favorites />
  )
}

export default FavoritesPage