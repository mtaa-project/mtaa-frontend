import {
  addressSchema,
  addressSchemaDefaultValues,
  type AddressSchemaType,
} from "@features/create-listing/create-listing-schema"
import { zodResolver } from "@hookform/resolvers/zod"
import React, { useEffect } from "react"
import { FormProvider, type SubmitHandler, useForm } from "react-hook-form"
import { View, StyleSheet, ScrollView } from "react-native"
import {
  Button,
  MD3Colors,
  MD3Theme,
  ProgressBar,
  Text,
  useTheme,
} from "react-native-paper"

import RHFTextInput from "@/src/components/ui/rhf-text-input"
import { useCreateListingStore } from "@/src/store/create-listing-store"
import { useGlobalStyles } from "@/src/components/global-styles"
import RHFSegmentedButtons from "@/src/components/ui/rhf-segmented-buttons"
import { ProfileCard } from "@/src/components/profile-card/profile-card"
import { useCreateListingStyles } from "@/src/features/create-listing/create-listing-styles"
import { useRouter } from "expo-router"
import { useUserProfile } from "@/src/components/profile-card/queries"
import { defaultValues } from "@/src/features/watchdog/components/watchdog-modal/filter-schema"
import { AddressType } from "@/src/api/types"
import { useCreateListing } from "@/src/features/create-listing/helpers"

export default function AddressStep() {
  const globalStyles = useGlobalStyles()
  const createListingStyles = useCreateListingStyles()
  const userProfileQuery = useUserProfile()
  const createListingMutation = useCreateListing()
  const listingImages = useCreateListingStore((store) => store.listingImages)
  const theme = useTheme()
  const styles = createStyles(theme)

  const router = useRouter()
  const methods = useForm<AddressSchemaType>({
    resolver: zodResolver(addressSchema),
    defaultValues: addressSchemaDefaultValues,
  })

  const {
    control,
    handleSubmit,
    formState: { errors },
    watch,
    reset,
  } = methods
  const addressType = watch("addressType")

  useEffect(() => {
    if (addressType === AddressType.PROFILE && userProfileQuery.isSuccess) {
      const { address, phoneNumber } = userProfileQuery.data
      reset({
        addressType: AddressType.PROFILE,
        country: address.country,
        city: address.city,
        postalCode: address.postalCode,
        street: address.street,
      })
    } else if (addressType === AddressType.OTHER) {
      reset(addressSchemaDefaultValues)
    }
  }, [addressType, userProfileQuery.isSuccess])

  const setAddress = useCreateListingStore((state) => state.setAddress)
  const listingInfo = useCreateListingStore((state) => state.listingInfo)

  console.log(errors)

  const handleStepBack = () => {
    router.back()
  }

  const onSubmit: SubmitHandler<AddressSchemaType> = (data) => {
    setAddress(data)

    const finalData = {
      listingInfo: listingInfo,
      address: data,
    }
    createListingMutation.mutate()
    console.log("Final Data:", finalData)
  }

  return (
    <FormProvider {...methods}>
      <ScrollView style={globalStyles.pageContainer}>
        <ProgressBar progress={1} color={MD3Colors.secondary0} />

        <Text variant="headlineLarge" style={globalStyles.pageTitle}>
          Address Info
        </Text>
        <Text variant="bodyLarge" style={{ paddingBlock: 12 }}>
          Would you like to use the address data from your profile or fill in a
          new one ?
        </Text>
        <View style={{ gap: 8, paddingBlock: 8 }}>
          <Text variant="labelLarge">
            On the offer page, you are displayed as follows:
          </Text>
          <ProfileCard />
        </View>

        <View style={styles.profileAddressInputList}>
          <RHFSegmentedButtons<AddressSchemaType>
            style={{ marginBlock: 20 }}
            name="addressType"
            buttons={[
              { value: AddressType.PROFILE, label: "Use profile address" },
              { value: AddressType.OTHER, label: "Use other address" },
            ]}
          />

          <RHFTextInput<AddressSchemaType> name="country" label="Country" />
          <RHFTextInput<AddressSchemaType> name="city" label="City" />
          <RHFTextInput<AddressSchemaType>
            name="postalCode"
            label="Postal Code"
          />
          <RHFTextInput<AddressSchemaType> name="street" label="Street" />
        </View>

        <View style={createListingStyles.buttonContainer}>
          <Button
            mode="outlined"
            style={createListingStyles.buttonStyle}
            onPress={handleStepBack}
          >
            Back
          </Button>
          <Button
            disabled={createListingMutation.isPending}
            loading={createListingMutation.isPending}
            style={createListingStyles.buttonStyle}
            mode="contained"
            onPress={handleSubmit(onSubmit)}
          >
            Create Listing
          </Button>
        </View>
      </ScrollView>
    </FormProvider>
  )
}

const createStyles = (theme: MD3Theme) =>
  StyleSheet.create({
    profileAddressInputList: {
      gap: 16,
    },
  })
