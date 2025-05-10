import { zodResolver } from "@hookform/resolvers/zod"
import React, { useEffect, useMemo } from "react"
import {
  FormProvider,
  type SubmitErrorHandler,
  type SubmitHandler,
  useForm,
} from "react-hook-form"
import { ScrollView, StyleSheet, View } from "react-native"
import {
  ActivityIndicator,
  Button,
  type MD3Theme,
  Modal,
  Portal,
  Text,
  useTheme,
} from "react-native-paper"
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated"

import { OfferType } from "@/src/api/types"
import RHFMultiSelectDropdown from "@/src/components/ui/rhf-multiselect-dropdown"
import RHFSegmentedButtons from "@/src/components/ui/rhf-segmented-buttons"
import RHFTextInput from "@/src/components/ui/rhf-text-input"

import { useCreateWatchdog, useUpdateWatchdog } from "../../services/mutations"
import { useGetCategories, useGetWatchdog } from "../../services/queries"
import {
  defaultValues,
  filterSchema,
  type FilterSchemaType,
} from "./filter-schema"

type WatchdogModalProps = {
  visible: boolean
  onDismiss: () => void
  id?: number
}

export function WatchdogModal({ visible, onDismiss, id }: WatchdogModalProps) {
  const theme = useTheme()
  const styles = createStyles(theme)

  const categoriesQuery = useGetCategories()
  const watchdogQuery = useGetWatchdog(id)
  const createWatchdogMutation = useCreateWatchdog()
  const updateWatchdogMutation = useUpdateWatchdog()

  const methods = useForm<FilterSchemaType>({
    defaultValues: defaultValues,
    resolver: zodResolver(filterSchema),
  })

  useEffect(() => {
    if (!visible) {
      reset(defaultValues)
    }
  }, [visible])

  const {
    formState: { errors },
    setFocus,
    setValue,
    watch,
  } = methods
  const { reset } = methods

  const actionCreate = watch("variant")
  const offerType = watch("offerType")

  useEffect(() => {
    if (watchdogQuery.data) {
      const a = filterSchema.safeParse(watchdogQuery.data)
      console.log(JSON.stringify(a, null, 2))
      reset(watchdogQuery.data)
    }
  }, [reset, watchdogQuery.data])

  const onError: SubmitErrorHandler<FilterSchemaType> = (error) => {
    console.log("Form Submit Error: ", JSON.stringify(error, null, 2))
  }

  const onSubmit: SubmitHandler<FilterSchemaType> = async (formValues) => {
    try {
      if (actionCreate === "create") {
        await createWatchdogMutation.mutateAsync(formValues)
      } else if (actionCreate === "edit") {
        await updateWatchdogMutation.mutateAsync(formValues)
      }
    } catch (e) {
      console.error(e)
    } finally {
      onDismiss()
      methods.reset(defaultValues)
    }
  }

  const isUpdating =
    createWatchdogMutation.isPending || updateWatchdogMutation.isPending

  const slideY = useSharedValue(50) // offscreen

  const slideInDuration = 400
  useEffect(() => {
    slideY.value = visible
      ? // if is visible transformY to initial position
        withTiming(0, { duration: slideInDuration })
      : // if it is invisible transformY to position with offset 50
        withTiming(50, { duration: slideInDuration })
  }, [visible])

  const slideInStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: slideY.value }],
    // opacity: withTiming(visible ? 1 : 0, { duration: slideInDuration }),
  }))

  const priceForRentIsActive = offerType === OfferType.RENT
  const priceForSaleIsActive = offerType === OfferType.BUY
  const categoryOptions = useMemo(() => {
    return (
      categoriesQuery.data?.map((cat) => ({
        label: cat.name,
        value: cat.id.toString(),
      })) ?? []
    )
  }, [categoriesQuery.data])
  return (
    <View>
      <Portal>
        <Modal
          visible={visible}
          onDismiss={() => onDismiss()}
          // contentContainerStyle={{ padding: 0, backgroundColor: "transparent" }} // necháme len prázdne
        >
          <Animated.View style={[styles.contentStyle, slideInStyle]}>
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
                    <RHFSegmentedButtons<FilterSchemaType>
                      style={{ marginBlock: 20 }}
                      name="offerType"
                      buttons={[
                        { value: OfferType.BUY, label: "For Sale" },
                        { value: OfferType.RENT, label: "For Rent" },
                        { value: OfferType.BOTH, label: "Both" },
                      ]}
                    />

                    <View>
                      <Text variant="titleLarge">Price for Sale</Text>
                      <View style={styles.row}>
                        <RHFTextInput<FilterSchemaType>
                          name="priceForSale.minPrice"
                          label="Min"
                          keyboardType="numeric"
                          asNumber
                          style={styles.flex}
                          disabled={priceForRentIsActive}
                        />
                        <RHFTextInput<FilterSchemaType>
                          name="priceForSale.maxPrice"
                          label="Max"
                          keyboardType="numeric"
                          asNumber
                          style={styles.flex}
                          disabled={priceForRentIsActive}
                        />
                      </View>
                    </View>

                    <View>
                      <Text variant="titleLarge">Price for Rent</Text>
                      <View style={styles.row}>
                        <RHFTextInput<FilterSchemaType>
                          name="priceForRent.minPrice"
                          label="Min"
                          keyboardType="numeric"
                          asNumber
                          style={styles.flex}
                          disabled={priceForSaleIsActive}
                        />
                        <RHFTextInput<FilterSchemaType>
                          name="priceForRent.maxPrice"
                          label="Max"
                          asNumber
                          keyboardType="number-pad"
                          style={styles.flex}
                          disabled={priceForSaleIsActive}
                        />
                      </View>
                    </View>

                    <RHFMultiSelectDropdown<FilterSchemaType>
                      name="categoryIds"
                      label="Select categories"
                      placeholder="Choose…"
                      options={categoryOptions}
                    />
                  </ScrollView>

                  <View style={styles.actions}>
                    <Button
                      onPress={() => {
                        onDismiss()
                        reset(defaultValues)
                      }}
                    >
                      Cancel
                    </Button>
                    <Button
                      loading={isUpdating}
                      disabled={isUpdating}
                      mode="contained"
                      onPress={methods.handleSubmit(onSubmit, onError)}
                    >
                      {actionCreate === "create" ? "Create" : "Edit"}
                    </Button>
                  </View>
                </View>
              </FormProvider>
            )}
          </Animated.View>
        </Modal>
      </Portal>
    </View>
  )
}

const createStyles = (theme: MD3Theme) =>
  StyleSheet.create({
    contentStyle: {
      backgroundColor: theme.colors.background,
      padding: 20,
      margin: 20,
      borderRadius: 12,
    },
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
