// ListingInfoStep.tsx
import { zodResolver } from "@hookform/resolvers/zod"
import { router } from "expo-router"
import React, { useMemo } from "react"
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
  type ListingInfoSchemaType,
} from "@/src/features/create-listing/create-listing-schema"
import { useCreateListingStore } from "@/src/store/create-listing-store"
import { useGetCategories } from "@/src/features/watchdog/services/queries"
import SectionedMultiSelect from "react-native-sectioned-multi-select"
import RHFSegmentedButtons from "@/src/components/ui/rhf-segmented-buttons"
import { OfferType } from "@/src/api/types"

export default function ListingInfoStep() {
  const theme = useTheme()
  const styles = createStyles(theme)
  const globalStyles = useGlobalStyles()

  const categoriesQuery = useGetCategories()
  const categories = useMemo(() => {
    return categoriesQuery.data
      ? categoriesQuery.data.map((category) => ({
          ...category,
          id: category.id.toString(),
        }))
      : []
  }, [categoriesQuery.data])

  // const selectedCategoryIds = useMemo(() => {
  //   return categoryIds.map((id) => id.toString())
  // }, [categoryIds])
  // // convert category IDs to required format by MultiSelect
  // const categories = useMemo(() => {
  //   return categoriesQuery.data
  //     ? categoriesQuery.data.map((category) => ({
  //         ...category,
  //         id: category.id.toString(),
  //       }))
  //     : []
  // }, [categoriesQuery.data])

  const methods = useForm<ListingInfoSchemaType>({
    resolver: zodResolver(listingInfoSchema),
  })
  const { control, handleSubmit, watch } = methods
  const setListingInfo = useCreateListingStore((state) => state.setListingInfo)

  const onSubmit = (data: ListingInfoSchemaType) => {
    setListingInfo(data)
    router.push("/(auth)/(create-listing)/step-1")
  }

  const productName = watch("productName")
  const productCategory = watch("categoryIds")

  return (
    <FormProvider {...methods}>
      <ScrollView style={globalStyles.pageContainer}>
        <ProgressBar progress={0.5} color={MD3Colors.secondary0} />
        <Text variant="headlineLarge" style={globalStyles.pageTitle}>
          Listing Info
        </Text>

        <AddPhotos />
        <Text variant="headlineLarge">Listing Info</Text>
        <RHFTextInput<ListingInfoSchemaType>
          name="productName"
          label="Product Name"
        />
        <RHFTextInput<ListingInfoSchemaType>
          name="categoryIds"
          label="Product Category"
        />

        {/* <SectionedMultiSelect
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
        /> */}

        <View>
          <Text variant="headlineMedium">Offer Type</Text>
          <RHFSegmentedButtons
            style={{ marginBlock: 20 }}
            name="offerType"
            buttons={[
              { value: OfferType.BUY, label: "For Sale" },
              { value: OfferType.RENT, label: "For Rent" },
              { value: OfferType.BOTH, label: "Both" },
            ]}
          />

          {/* <RHFTextInput<ListingInfoSchemaType>
            name="productCategory"
            label="Item price per day"
          />

          <RHFTextInput<ListingInfoSchemaType>
            name="productCategory"
            label="Item Price"
          /> */}
        </View>

        <Button onPress={handleSubmit(onSubmit)}>Next</Button>

        <Button onPress={() => router.push("/(auth)/(create-listing)/step-1")}>
          Next without
        </Button>

        <ImagePickerExample
        // productName={productName}
        // productCategory={productCategory}
        />
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
