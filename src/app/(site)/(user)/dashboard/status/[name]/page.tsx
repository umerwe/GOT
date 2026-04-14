import MyAds from '@/components/pages/my-ads'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'My Ads | Braaap'
}

const MyAdsPage = () => {
  return (
    <MyAds />
  )
}

export default MyAdsPage