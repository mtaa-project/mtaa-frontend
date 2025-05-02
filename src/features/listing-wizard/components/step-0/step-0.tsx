// ListingInfoStep.tsx
import { zodResolver } from "@hookform/resolvers/zod"
import { router, useFocusEffect } from "expo-router"
import React, { useCallback, useMemo } from "react"
import { FormProvider, SubmitErrorHandler, useForm } from "react-hook-form"
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
import {
  listingInfoSchema,
  listingInfoSchemaDefaultValues,
  type ListingInfoSchemaType,
} from "@/src/features/listing-wizard/components/create-listing/create-listing-schema"
import { useCreateListingStore } from "@/src/store/create-listing-store"
import { useGetCategories } from "@/src/features/watchdog/services/queries"
import SectionedMultiSelect from "react-native-sectioned-multi-select"
import RHFSegmentedButtons from "@/src/components/ui/rhf-segmented-buttons"
import { ApiListingGet, OfferType } from "@/src/api/types"
import { useCreateListingStyles } from "@/src/features/listing-wizard/components/create-listing/create-listing-styles"
import { ListingVariant } from "../../types"
import * as ImagePicker from "expo-image-picker"
import { UseQueryResult } from "@tanstack/react-query"
import { AddPhotos } from "../add-photos/add-photos"
type Props = {
  listingVariant: ListingVariant
  listingDetailsQuery: UseQueryResult<ApiListingGet, Error>
}

export const ListingInfoStep: React.FC<Props> = ({
  listingVariant = "create",
  listingDetailsQuery,
}) => {
  const theme = useTheme()
  const styles = createStyles(theme)
  const globalStyles = useGlobalStyles()
  const createListingStyles = useCreateListingStyles()

  const categoriesQuery = useGetCategories()

  const setListingInfo = useCreateListingStore((state) => state.setListingInfo)
  const listingInfo = useCreateListingStore((state) => state.listingInfo)
  const resetForm = useCreateListingStore((state) => state.reset)

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

  const onSubmit = (data: ListingInfoSchemaType) => {
    setListingInfo(data)
    // router.replace("/(auth)/(create-listing)/step-1")
    if (listingVariant === "create") {
      router.push("/(auth)/(tabs)/(create-listing)/step-1")
    } else if (listingVariant === "edit" && listingDetailsQuery.data) {
      router.push({
        pathname: "/listings/[id]/edit/[step]/edit-listing",
        params: { id: listingDetailsQuery.data.id.toString(), step: "1" },
      })
    }
  }

  const onError: SubmitErrorHandler<ListingInfoSchemaType> = (error) => {
    console.log(JSON.stringify(methods.getValues(), null, 2))

    console.log("Form Submit Error: ", JSON.stringify(error, null, 2))
  }

  const productName = watch("title")
  const productCategory = watch("categoryIds")

  const handleStepBack = () => {
    resetForm()
    router.replace("/(auth)/(tabs)/home")
  }
  const setSelectedImages = useCreateListingStore(
    (store) => store.setListingImages
  )

  useFocusEffect(
    useCallback(() => {
      console.log("Variant: ", listingVariant, listingDetailsQuery?.data?.id)

      if (listingVariant === "create" && !listingInfo) {
        reset(listingInfoSchemaDefaultValues)
      } else if (
        listingVariant === "edit" &&
        listingDetailsQuery.isSuccess &&
        listingDetailsQuery.data
      ) {
        const imagePaths: string[] = listingDetailsQuery.data.imagePaths

        const images: ImagePicker.ImagePickerAsset[] = imagePaths.map(
          (url, index) => ({
            uri: url,
            type: "image",
            fileName: `image-${index}.jpg`,
            width: 50,
            height: 50,
          })
        )
        setSelectedImages(images)
        reset({ ...listingDetailsQuery.data, variant: "edit" })
      }
    }, [
      listingInfo,
      reset,
      listingVariant,
      listingDetailsQuery.isSuccess,
      listingDetailsQuery.data,
    ])
  )

  return (
    <FormProvider {...methods}>
      <ScrollView style={[globalStyles.pageContainer]}>
        <ProgressBar progress={0.5} color={MD3Colors.secondary0} />
        <Text variant="headlineLarge" style={globalStyles.pageTitle}>
          {listingVariant === "create" ? "Create Listing" : "Edit Listing"}
        </Text>

        <View>
          <Text variant="headlineMedium">Add Photos</Text>
          <AddPhotos />
        </View>

        <View>
          <Text variant="headlineMedium">Listing Info</Text>
          <RHFTextInput<ListingInfoSchemaType> name="title" label="Title" />
        </View>

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
              {
                value: OfferType.BUY,
                label: "For Sale",
                accessibilityLabel: "Sell an item",
              },
              {
                value: OfferType.RENT,
                label: "For Rent",
                accessibilityLabel: "Rent out an item",
              },
              {
                value: OfferType.BOTH,
                label: "Both",
                accessibilityLabel: "Sell or rent",
              },
            ]}
          />

          <RHFTextInput<ListingInfoSchemaType>
            name="price"
            label="Price"
            defaultValue=""
            keyboardType="number-pad"
          />
        </View>

        <View style={createListingStyles.buttonContainer}>
          <Button
            mode="outlined"
            style={createListingStyles.buttonStyle}
            onPress={handleStepBack}
            accessibilityLabel="Discard listing"
            accessibilityHint="Go back and discard your listing"
          >
            Discard
          </Button>
          <Button
            style={createListingStyles.buttonStyle}
            mode="contained"
            // onPress={() => router.push("/(auth)/(create-listing)/step-1")}
            onPress={handleSubmit(onSubmit, onError)}
            accessibilityLabel="Next step"
            accessibilityHint="Go to the next step of creating the listing"
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
