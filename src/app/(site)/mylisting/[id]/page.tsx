import MyListing from '@/components/pages/my-listing'
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "My Listing",
};
const MyListingPage = () => {
  return (
    <MyListing />
  )
}

export default MyListingPage
