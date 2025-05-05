import React from "react"
import { useWindowDimensions } from "react-native"
import { ApiListingGet } from "@/src/api/types"
import { ListingCardPhone } from "./listing-card.phone"
import { ListingCardTablet } from "./listing-card.tablet"

type Props = { item: ApiListingGet }
export const ListingCard: React.FC<Props> = ({ item }) => {
  const { width } = useWindowDimensions()
  const isTablet = width >= 768 // adjust your breakpoint as needed

  return isTablet ? (
    <ListingCardTablet item={item} />
  ) : (
    <ListingCardPhone item={item} />
  )
}
