import { useMutation } from "@tanstack/react-query"
import * as Location from "expo-location"
import { type LocationGeocodedAddress } from "expo-location"

export type LocationData = LocationGeocodedAddress & {
  latitude: number
  longitude: number
}

const fetchCurrentLocation = async (): Promise<LocationData> => {
  const { status } = await Location.requestForegroundPermissionsAsync()
  if (status !== "granted") {
    throw new Error("Permission to access location was denied")
  }

  let loc = await Location.getLastKnownPositionAsync({ maxAge: 18_000 })

  if (!loc) {
    loc = await Location.getCurrentPositionAsync()
  }

  const addresses = await Location.reverseGeocodeAsync({
    latitude: loc.coords.latitude,
    longitude: loc.coords.longitude,
  })

  const address = addresses[0] ?? {}
  console.log(address.formattedAddress)
  // TODO: add country code
  console.log(address.isoCountryCode)
  console.log(address.district)

  return {
    latitude: loc.coords.latitude,
    longitude: loc.coords.longitude,
    ...address,
  }
}

export const useGetCurrentLocation = () =>
  useMutation({
    mutationKey: ["get-current-location"],
    mutationFn: fetchCurrentLocation,
  })
