// WatchdogModal.tsx
import React, { useEffect, useMemo } from "react"
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
import { apiUpdateWatchdog } from "@/src/api/watchdog"
import { useGetCategories, useGetWatchdog } from "../../services/queries"
import { useCreateWatchdog, useUpdateWatchdog } from "../../services/mutations"

type WatchdogModalProps = {
  visible: boolean
  onDismiss: () => void
  id?: number
}

export function WatchdogModal({ visible, onDismiss, id }: WatchdogModalProps) {
  const theme = useTheme()
  const styles = createStyles(theme)
  const { expoPushToken } = useNotification()

  const categoriesQuery = useGetCategories()
  const watchdogQuery = useGetWatchdog(id)
  const createWatchdogMutation = useCreateWatchdog()
  const updateWatchdogMutation = useUpdateWatchdog()

  const methods = useForm<FilterSchemaType>({
    defaultValues,
    resolver: zodResolver(filterSchema),
  })

  const {
    formState: { errors },
    setFocus,
    setValue,
    watch,
  } = methods
  const { reset } = methods

  const categoryIds = watch("categoryIds", [])
  const actionCreate = watch("variant")
  const searchForSale = watch("searchForSale")
  const searchForRent = watch("searchForRent")

  // convert category IDs to required format by MultiSelect
  const selectedCategoryIds = useMemo(() => {
    return categoryIds.map((id) => id.toString())
  }, [categoryIds])
  // convert category IDs to required format by MultiSelect
  const categories = useMemo(() => {
    return categoriesQuery.data
      ? categoriesQuery.data.map((category) => ({
          ...category,
          id: category.id.toString(),
        }))
      : []
  }, [categoriesQuery.data])

  useEffect(() => {
    if (watchdogQuery.data) {
      reset(watchdogQuery.data)
    }
  }, [reset, watchdogQuery.data])

  const onError: SubmitErrorHandler<FilterSchemaType> = (error) => {
    console.log(error)

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
    const payload = {
      search: formValues.search,
      offerType: formValues.offerType,
      categoryIds: formValues.categoryIds,
    }

    try {
      if (actionCreate === "create") {
        await createWatchdogMutation.mutateAsync(formValues)
      } else if (actionCreate === "edit") {
        await updateWatchdogMutation.mutateAsync(formValues)
        // const response = await apiUpdateWatchdog({
        //   id: id,
        //   devicePushToken: expoPushToken ?? "",
        //   ...payload,
        // })
        // console.log(response)
      }

      methods.reset(defaultValues)
    } catch (e) {
      console.error(e)
    } finally {
      onDismiss()
      methods.reset(defaultValues)
    }
  }

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
          {watchdogQuery.isLoading ? (
            <ActivityIndicator
              style={{ marginTop: 40, minHeight: 450 }}
              animating={true}
              size="large"
            />
          ) : (
            <FormProvider {...methods}>
              <View style={styles.container}>
                <ScrollView style={{ maxHeight: 450 }}>
                  <RHFTextInput<FilterSchemaType>
                    name="search"
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
                    selectedItems={selectedCategoryIds}
                    onSelectedItemsChange={(categoryIds) =>
                      setValue(
                        "categoryIds",
                        categoryIds.map((id) => parseInt(id))
                      )
                    }
                  />
                  {/* <ListingTypes listingTypes={listingTypes} /> */}
                </ScrollView>

                <View style={styles.actions}>
                  <Button
                    onPress={() => {
                      reset(defaultValues)
                      onDismiss()
                    }}
                  >
                    Cancel
                  </Button>
                  <Button
                    // FIXME:
                    loading={
                      actionCreate === "create"
                        ? createWatchdogMutation.isPending
                        : false
                    }
                    disabled={
                      actionCreate === "create"
                        ? createWatchdogMutation.isPending
                        : false
                    }
                    mode="contained"
                    onPress={methods.handleSubmit(onSubmit, onError)}
                  >
                    {actionCreate === "create" ? "Create" : "Edit"}
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
