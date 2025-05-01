import {
  addressSchema,
  addressSchemaDefaultValues,
  type AddressSchemaType,
} from "@/src/features/listing-wizard/components/create-listing/create-listing-schema"
import { zodResolver } from "@hookform/resolvers/zod"
import React, { useEffect } from "react"
import { FormProvider, type SubmitHandler, useForm } from "react-hook-form"
import { View, StyleSheet, ScrollView } from "react-native"
import {
  Button,
  MD3Colors,
  MD3Theme,
  ProgressBar,
  Snackbar,
  Text,
  useTheme,
} from "react-native-paper"
import FontAwesome5 from "@expo/vector-icons/FontAwesome5"
import RHFTextInput from "@/src/components/ui/rhf-text-input"
import { useCreateListingStore } from "@/src/store/create-listing-store"
import { useGlobalStyles } from "@/src/components/global-styles"
import RHFSegmentedButtons from "@/src/components/ui/rhf-segmented-buttons"
import { ProfileCard } from "@/src/components/profile-card/profile-card"
import { useCreateListingStyles } from "@/src/features/listing-wizard/components/create-listing/create-listing-styles"
import { useRouter } from "expo-router"
import { defaultValues } from "@/src/features/watchdog/components/watchdog-modal/filter-schema"
import { AddressType } from "@/src/api/types"
import { useCreateListing } from "@/src/features/listing-wizard/components/create-listing/helpers"
import { LocationData, useGetCurrentLocation } from "@/src/helpers"
import { useUserProfile } from "@/src/features/profile/queries"

export default function AddressStep() {
  const globalStyles = useGlobalStyles()
  const createListingStyles = useCreateListingStyles()
  const userProfileQuery = useUserProfile()
  const createListingMutation = useCreateListing()
  const listingImages = useCreateListingStore((store) => store.listingImages)
  const resetForm = useCreateListingStore((store) => store.reset)

  const theme = useTheme()
  const styles = createStyles(theme)

  const currentLocationQuery = useGetCurrentLocation()

  const [snackbarVisible, setSnackbarVisible] = React.useState(false)
  const [snackbarMsg, setSnackbarMsg] = React.useState("")

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
    setValue,
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
    // router.back()
    router.back()
  }

  useEffect(() => {
    let timeout: NodeJS.Timeout
    if (createListingMutation.isSuccess) {
      setSnackbarMsg("🎉 Success! Your listing is now live.")
      setSnackbarVisible(true)

      timeout = setTimeout(() => {
        setSnackbarVisible(false)
        reset(addressSchemaDefaultValues)
        resetForm() // reset your form fields
        // createListingMutation.reset() // clear mutation state
        router.dismiss(1)
        router.replace("/(auth)/home")
        createListingMutation.reset()
      }, 1000)
    }

    return () => {
      if (timeout) clearTimeout(timeout)
    }
  }, [createListingMutation])

  const onSubmit: SubmitHandler<AddressSchemaType> = async (data) => {
    setAddress(data)
    createListingMutation.mutate()
  }

  const fillFormFromLocation = (locationData: LocationData) => {
    setValue("country", locationData.isoCountryCode ?? "")
    setValue("city", locationData.district ?? "")
    setValue("postalCode", locationData.postalCode ?? "")
    setValue("street", locationData.street ?? "")
    setValue("longitude", locationData.longitude)
    setValue("latitude", locationData.latitude)
  }

  const handleLocalizeUser = async () => {
    const locationData = await currentLocationQuery.mutateAsync()
    if (locationData) {
      fillFormFromLocation(locationData)
    }
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
              {
                value: AddressType.PROFILE,
                label: "Use profile address",
                accessibilityLabel: "Use address from your profile",
              },
              {
                value: AddressType.OTHER,
                label: "Use other address",
                accessibilityLabel: "Enter a different address",
              },
            ]}
          />
          {addressType === AddressType.OTHER ? (
            <Button
              icon={({ size, color }) => (
                <FontAwesome5
                  name="search-location"
                  size={size}
                  color={color}
                />
              )}
              loading={currentLocationQuery.isPending}
              onPress={handleLocalizeUser}
              style={{ alignSelf: "flex-end" }}
            >
              Use My Location
            </Button>
          ) : null}

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
          <Snackbar
            visible={snackbarVisible}
            onDismiss={() => setSnackbarVisible(false)}
            action={{
              label: "OK",
              onPress: () => setSnackbarVisible(false),
            }}
            duration={4000}
          >
            {snackbarMsg}
          </Snackbar>
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
