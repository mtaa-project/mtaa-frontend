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
import { api } from "@/src/lib/axios-config"
import { useNotification } from "@/src/context/NotificationContext"
import { OfferType } from "@/src/api/types"
import { apiCreateWatchdog } from "@/src/api/watchdog"

type Category = {
  id: string
  name: string
}

type WatchdogModalProps = {
  visible: boolean
  onDismiss: () => void
}

export function WatchdogModal({ visible, onDismiss }: WatchdogModalProps) {
  const theme = useTheme()
  const styles = createStyles(theme)
  const { expoPushToken } = useNotification()
  const [isLoading, setIsLoading] = useState(false)

  const methods = useForm<FilterSchemaType>({
    defaultValues,
    resolver: zodResolver(filterSchema),
  })

  const {
    formState: { errors },
    setFocus,
  } = methods

  const [categories, setCategories] = useState<Category[]>([])
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])

  const contentStyle = {
    // backgroundColor: theme.colors.surfaceVariant,
    backgroundColor: theme.colors.background,
    padding: 20,
    margin: 20,
    borderRadius: 12,
  } as const

  function parseCategoryIds(selected: string[]): number[] {
    return selected
      .map((id) => Number(id))
      .filter((id) => !isNaN(id) && Number.isInteger(id))
  }

  useEffect(() => {
    const fetchCategories = async () => {
      const response = await api.get("/categories")
      setCategories(
        response.data.map((category: { id: number; name: string }) => ({
          ...category,
          id: `${category.id}`,
        }))
      )
    }
    fetchCategories()
  }, [])

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

  const onSubmit: SubmitHandler<FilterSchemaType> = async (data) => {
    const categoryIds = parseCategoryIds(selectedCategories)
    setIsLoading(true)
    try {
      let listingType = OfferType.BUY
      if (data.searchForRent && data.searchForRent) {
        listingType = OfferType.BOTH
      } else if (data.searchForRent) {
        listingType = OfferType.RENT
      }

      const response = await apiCreateWatchdog({
        devicePushToken: expoPushToken ?? "",
        search: data.searchTerm,
        offerType: listingType,
        categoryIds: categoryIds,
      })
      console.log(response)
      methods.reset()
    } catch (e) {
      console.error(e)
    } finally {
      setIsLoading(false)
      setSelectedCategories([])
      onDismiss()
    }
  }
  const searchForSale = methods.watch("searchForSale")
  const searchForRent = methods.watch("searchForRent")

  return (
    <View>
      <Portal>
        <Modal
          visible={visible}
          onDismiss={() => onDismiss()}
          contentContainerStyle={contentStyle}
        >
          <Text variant="titleLarge">Create Watchdog</Text>
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
                  Create
                </Button>
              </View>
            </View>
          </FormProvider>
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
