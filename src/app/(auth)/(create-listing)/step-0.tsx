// ListingInfoStep.tsx
import { zodResolver } from "@hookform/resolvers/zod"
import { router, useFocusEffect } from "expo-router"
import React, { useCallback, useMemo } from "react"
import { FormProvider, useForm } from "react-hook-form"
import { View, StyleSheet, ScrollView } from "react-native"
import {
  Button,
  MD3Colors,
  MD3Theme,
  ProgressBar,
  Text,
  useTheme,
} from "react-native-paper"
import Icon from "react-native-vector-icons/MaterialIcons"
import { useGlobalStyles } from "@/src/components/global-styles"
import RHFTextInput from "@/src/components/ui/rhf-text-input"
import { AddPhotos } from "@/src/features/create-listing/components/add-photos/add-photos"
import ImagePickerExample from "@/src/features/create-listing/components/img-picker-example"
import {
  listingInfoSchema,
  listingInfoSchemaDefaultValues,
  type ListingInfoSchemaType,
} from "@/src/features/create-listing/create-listing-schema"
import { useCreateListingStore } from "@/src/store/create-listing-store"
import { useGetCategories } from "@/src/features/watchdog/services/queries"
import SectionedMultiSelect from "react-native-sectioned-multi-select"
import RHFSegmentedButtons from "@/src/components/ui/rhf-segmented-buttons"
import { OfferType } from "@/src/api/types"
import { useCreateListingStyles } from "@/src/features/create-listing/create-listing-styles"

export default function ListingInfoStep() {
  const theme = useTheme()
  const styles = createStyles(theme)
  const globalStyles = useGlobalStyles()
  const createListingStyles = useCreateListingStyles()

  const categoriesQuery = useGetCategories()
  const categories = useMemo(() => {
    return categoriesQuery.data
      ? categoriesQuery.data.map((category) => ({
          ...category,
          id: category.id.toString(),
        }))
      : []
  }, [categoriesQuery.data])

  const methods = useForm<ListingInfoSchemaType>({
    resolver: zodResolver(listingInfoSchema),
    defaultValues: listingInfoSchemaDefaultValues,
  })

  const { control, handleSubmit, watch, setValue, reset } = methods

  const categoryIds = watch("categoryIds", [])

  const selectedCategoryIds = useMemo(() => {
    return categoryIds.map((id) => id.toString())
  }, [categoryIds])
  // convert category IDs to required format by MultiSelect

  const setListingInfo = useCreateListingStore((state) => state.setListingInfo)
  const listingInfo = useCreateListingStore((state) => state.listingInfo)
  const resetForm = useCreateListingStore((state) => state.reset)

  const onSubmit = (data: ListingInfoSchemaType) => {
    setListingInfo(data)
    // router.replace("/(auth)/(create-listing)/step-1")
    router.push("/(auth)/(create-listing)/step-1")
  }

  const productName = watch("productName")
  const productCategory = watch("categoryIds")

  const handleStepBack = () => {
    resetForm()
    router.replace("/(auth)/home")
  }

  useFocusEffect(
    useCallback(() => {
      if (!listingInfo) {
        reset(listingInfoSchemaDefaultValues)
      }
    }, [listingInfo, reset])
  )

  return (
    <FormProvider {...methods}>
      <ScrollView style={[globalStyles.pageContainer]}>
        <ProgressBar progress={0.5} color={MD3Colors.secondary0} />
        <Text variant="headlineLarge" style={globalStyles.pageTitle}>
          Create Listing
        </Text>
        <View>
          <Text variant="headlineLarge">Add Photos</Text>
          <AddPhotos />
        </View>
        <Text variant="headlineLarge">Listing Info</Text>
        <RHFTextInput<ListingInfoSchemaType>
          name="productName"
          label="Product Name"
        />
        <RHFTextInput<ListingInfoSchemaType>
          name="description"
          label="Description"
        />

        <SectionedMultiSelect
          IconRenderer={Icon}
          items={categories}
          uniqueKey="id"
          // subKey="children"
          // displayKey="name"
          // showDropDowns={true}
          selectText="Select categories"
          selectedItems={selectedCategoryIds}
          onSelectedItemsChange={(categoryIds) =>
            setValue(
              "categoryIds",
              categoryIds.map((id) => parseInt(id))
            )
          }
        />

        <View>
          <Text variant="headlineMedium">Offer Type</Text>
          <RHFSegmentedButtons<ListingInfoSchemaType>
            style={{ marginBlock: 20 }}
            name="offerType"
            buttons={[
              { value: OfferType.BUY, label: "For Sale" },
              { value: OfferType.RENT, label: "For Rent" },
              { value: OfferType.BOTH, label: "Both" },
            ]}
          />

          <RHFTextInput<ListingInfoSchemaType>
            name="price"
            label="Price"
            keyboardType="number-pad"
          />
        </View>

        <View style={createListingStyles.buttonContainer}>
          <Button
            mode="outlined"
            style={createListingStyles.buttonStyle}
            onPress={handleStepBack}
          >
            Discard
          </Button>
          <Button
            style={createListingStyles.buttonStyle}
            mode="contained"
            // onPress={() => router.push("/(auth)/(create-listing)/step-1")}
            onPress={handleSubmit(onSubmit)}
          >
            Next
          </Button>
        </View>
      </ScrollView>
    </FormProvider>
  )
}

const createStyles = (theme: MD3Theme) =>
  StyleSheet.create({
    container: {
      paddingInline: 16,
    },
    title: {
      backgroundColor: theme.colors.surfaceVariant,
      margin: 20,
      padding: 16,
      borderRadius: 14,
    },
  })
