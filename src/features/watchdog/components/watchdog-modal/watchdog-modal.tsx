// WatchdogModal.tsx
import React, { useEffect, useState } from "react"
import { View, StyleSheet, ScrollView } from "react-native"
import {
  Modal,
  Portal,
  Button,
  Text,
  useTheme,
  MD3Theme,
  ActivityIndicator,
} from "react-native-paper"
import {
  FormProvider,
  SubmitErrorHandler,
  SubmitHandler,
  useForm,
} from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import SectionedMultiSelect from "react-native-sectioned-multi-select"
import Icon from "react-native-vector-icons/MaterialIcons"

import RHFTextInput from "../../../../components/ui/RHFTextInput"
import { RHFCheckbox } from "../../../../components/ui/RHFCheckbox"
import {
  filterSchema,
  defaultValues,
  type FilterSchemaType,
} from "./filter-schema"
import { useNotification } from "@/src/context/NotificationContext"
import { Category, OfferType } from "@/src/api/types"
import {
  apiCreateWatchdog,
  apiGetWatchdog,
  apiUpdateWatchdog,
} from "@/src/api/watchdog"
import { apiGetCategories } from "@/src/api/categories"

type WatchdogModalActions = "edit" | "create"

type WatchdogModalProps = {
  visible: boolean
  onDismiss: () => void
  action?: WatchdogModalActions
  id: number | null
}

export function WatchdogModal({
  visible,
  onDismiss,
  action = "create",
  id,
}: WatchdogModalProps) {
  const theme = useTheme()
  const styles = createStyles(theme)
  const { expoPushToken } = useNotification()
  const [isLoading, setIsLoading] = useState(false)
  const [isFetching, setIsFetching] = useState(false)

  const methods = useForm<FilterSchemaType>({
    defaultValues,
    resolver: zodResolver(filterSchema),
  })

  const {
    formState: { errors },
    setFocus,
  } = methods
  const { reset } = methods

  const [categories, setCategories] = useState<Category[]>([])
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])

  useEffect(() => {
    const fetchCategories = async () => {
      const categories = await apiGetCategories()
      setCategories(
        categories.map((category) => ({
          ...category,
          id: category.id,
        }))
      )
    }
    fetchCategories()
  }, [])

  useEffect(() => {
    const fetchWatchdog = async (id: number) => {
      setIsFetching(true)
      try {
        const data = await apiGetWatchdog(id)
        console.log(
          "lala: ",
          JSON.stringify(data, null, 2),
          action === "edit" && id != null
        )
        console.log(data)

        reset({
          searchTerm: data.searchTerm,
          searchForSale: (data.offerType === "buy" ||
            data.offerType === "both") as true,
          searchForRent: (data.offerType === "rent" ||
            data.offerType === "both") as true,
          priceForSale: undefined,
          // data.offerType !== "rent"
          //   ? {
          //       min: data.categories.selected.find((c) => c.id === "saleMin")
          //         ?.min,
          //       max: data.categories.selected.find((c) => c.id === "saleMax")
          //         ?.max,
          //     }
          //   : undefined,
          priceForRent: undefined,
          // data.offerType !== "buy"
          //   ? {
          //       min: data.categories.selected.find((c) => c.id === "rentMin")
          //         ?.min,
          //       max: data.categories.selected.find((c) => c.id === "rentMax")
          //         ?.max,
          //     }
          //   : undefined,
        })

        setSelectedCategories(data.categories.selected.map((c) => `${c.id}`))
        setCategories(data.categories.notSelected)
      } catch {
        // console.error
      } finally {
        setIsFetching(false)
      }
    }
    if (action === "edit" && id != null) {
      fetchWatchdog(id)
    }
  }, [action, id, reset])

  const onError: SubmitErrorHandler<FilterSchemaType> = (error) => {
    const firstError = (
      Object.keys(errors) as Array<keyof typeof errors>
    ).reduce<keyof typeof errors | null>((field, a) => {
      const fieldKey = field as keyof typeof errors
      return !!errors[fieldKey] && fieldKey !== "root" ? fieldKey : a
    }, null)

    if (firstError && firstError !== "root") {
      setFocus(firstError)
    }
  }

  const onSubmit: SubmitHandler<FilterSchemaType> = async (formValues) => {
    setIsLoading(true)
    const payload = {
      search: formValues.searchTerm,
      offerType:
        formValues.searchForSale && formValues.searchForRent
          ? OfferType.BOTH
          : formValues.searchForSale
            ? OfferType.BUY
            : OfferType.RENT,
      categoryIds: parseCategoryIds(selectedCategories),
    }

    try {
      if (action === "create") {
        const response = await apiCreateWatchdog({
          devicePushToken: expoPushToken ?? "",
          ...payload,
        })
        console.log(response)
      } else if (id !== undefined) {
        const response = await apiUpdateWatchdog({
          id: id,
          devicePushToken: expoPushToken ?? "",
          ...payload,
        })
        console.log(response)
      }

      methods.reset()
    } catch (e) {
      console.error(e)
    } finally {
      setIsLoading(false)
      setSelectedCategories([])
      onDismiss()
      methods.reset()
    }
  }

  function parseCategoryIds(selected: string[]): number[] {
    return selected
      .map((id) => Number(id))
      .filter((id) => !isNaN(id) && Number.isInteger(id))
  }
  const searchForSale = methods.watch("searchForSale")
  const searchForRent = methods.watch("searchForRent")

  const contentStyle = {
    // backgroundColor: theme.colors.surfaceVariant,
    backgroundColor: theme.colors.background,
    padding: 20,
    margin: 20,
    borderRadius: 12,
  } as const

  return (
    <View>
      <Portal>
        <Modal
          visible={visible}
          onDismiss={() => onDismiss()}
          contentContainerStyle={contentStyle}
        >
          <Text variant="titleLarge">Create Watchdog</Text>
          {isFetching ? (
            <ActivityIndicator
              style={{ marginTop: 40, minHeight: 450 }}
              animating={true}
              size="large"
            />
          ) : (
            <FormProvider {...methods}>
              <View style={styles.container}>
                <ScrollView style={{ maxHeight: 450 }}>
                  <RHFTextInput
                    name="searchTerm"
                    label="Search term"
                    style={[styles.section, { marginBlockStart: 40 }]}
                  />
                  <View style={styles.section}>
                    <RHFCheckbox<FilterSchemaType>
                      name="searchForSale"
                      label="For sale"
                    />
                    {searchForSale ? (
                      <View>
                        <Text variant="titleLarge">Price for sale</Text>
                        <View style={styles.row}>
                          <RHFTextInput<FilterSchemaType>
                            name="priceForSale.min"
                            label="Min"
                            keyboardType="numeric"
                            style={styles.flex}
                          />
                          <RHFTextInput<FilterSchemaType>
                            name="priceForSale.max"
                            label="Max"
                            keyboardType="numeric"
                            style={styles.flex}
                          />
                        </View>
                      </View>
                    ) : null}
                  </View>

                  <View>
                    <RHFCheckbox<FilterSchemaType>
                      name="searchForRent"
                      label="For rent"
                    />
                    {searchForRent ? (
                      <View>
                        <Text variant="titleLarge">Price for sale</Text>
                        <View style={styles.row}>
                          <RHFTextInput<FilterSchemaType>
                            name="priceForSale.min"
                            label="Min"
                            keyboardType="numeric"
                            style={styles.flex}
                          />
                          <RHFTextInput<FilterSchemaType>
                            name="priceForSale.max"
                            label="Max"
                            keyboardType="numeric"
                            style={styles.flex}
                          />
                        </View>
                      </View>
                    ) : null}
                  </View>

                  <SectionedMultiSelect
                    IconRenderer={Icon}
                    items={categories}
                    uniqueKey="id"
                    // subKey="children"
                    // displayKey="name"
                    // showDropDowns={true}
                    selectText="Select categories"
                    selectedItems={selectedCategories}
                    onSelectedItemsChange={setSelectedCategories}
                  />

                  {/* <ListingTypes listingTypes={listingTypes} /> */}
                </ScrollView>

                <View style={styles.actions}>
                  <Button onPress={onDismiss}>Cancel</Button>
                  <Button
                    loading={isLoading}
                    disabled={isLoading}
                    mode="contained"
                    onPress={methods.handleSubmit(onSubmit, onError)}
                  >
                    {action === "create" ? "Create" : "Save"}
                  </Button>
                </View>
              </View>
            </FormProvider>
          )}
        </Modal>
      </Portal>
    </View>
  )
}

const createStyles = (theme: MD3Theme) =>
  StyleSheet.create({
    container: { gap: 20 },
    row: { flexDirection: "row", gap: 12 },
    flex: { flex: 1 },
    actions: {
      flexDirection: "row",
      justifyContent: "flex-end",
      gap: 12,
      marginTop: 12,
    },
    section: {
      // borderWidth: 1,
      // borderColor: theme.colors.outline,
    },
  })
