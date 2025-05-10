// File: src/features/search-results/components/FilterOverlay.tsx
import React, { useEffect, useMemo, useState } from "react"
import { ScrollView, StyleSheet, View } from "react-native"
import {
  Button,
  Checkbox,
  Divider,
  IconButton,
  type MD3Theme,
  Modal,
  Portal,
  Text,
  TextInput,
  useTheme,
} from "react-native-paper"
import { MultiSelectDropdown } from "react-native-paper-dropdown"

import { OfferType, type PriceRange } from "@/src/api/types"
import { useGlobalStyles } from "@/src/components/global-styles"

import { useGetCategories } from "../../watchdog/services/queries"

interface FilterOverlayProps {
  visible: boolean
  onDismiss: () => void
  onApply: (filters: {
    categoryIds: string[]
    location: string
    locOfferType: OfferType
    saleMin: number
    saleMax: number
    rentMin: number
    rentMax: number

    ratingMin: number
  }) => void
  initialValues?: {
    categoryIds: string[]
    location: string
    locOfferType: OfferType
    priceRangeSale: PriceRange
    priceRangeRent: PriceRange
    ratingMin: number
  }
}

export const FilterOverlay: React.FC<FilterOverlayProps> = ({
  visible,
  onDismiss,
  onApply,
  initialValues,
}: FilterOverlayProps) => {
  const theme = useTheme()
  const globalStyles = useGlobalStyles()
  const styles = makeStyles(theme)

  const categoriesQuery = useGetCategories()
  // build the list in the shape { label, value }
  const categories = useMemo(() => {
    return categoriesQuery.data
      ? categoriesQuery.data.map((category) => ({
          label: category.name,
          value: category.id.toString(),
        }))
      : []
  }, [categoriesQuery.data])

  // --- local UI state (stub out real logic or context) ---
  // inside your component…
  const [category, setCategory] = useState<string[]>([])
  const [location, setLocation] = useState("")
  const [locOfferType, setOfferType] = useState<OfferType>(OfferType.BUY)
  const [saleMin, setSaleMin] = useState(0)
  const [saleMax, setSaleMax] = useState(0)
  const [rentMin, setRentMin] = useState(0)
  const [rentMax, setRentMax] = useState(0)
  const [ratingMin, setRatingMin] = useState(0)

  useEffect(() => {
    if (initialValues) {
      setCategory(initialValues.categoryIds)
      setLocation(initialValues.location)
      setOfferType(initialValues.locOfferType)
      setSaleMin(initialValues.priceRangeSale.min)
      setSaleMax(initialValues.priceRangeSale.max)
      setRentMin(initialValues.priceRangeRent.min)
      setRentMax(initialValues.priceRangeRent.max)
      setRatingMin(initialValues.ratingMin)
    }
  }, [visible])

  const clearAll = () => {
    setCategory([])
    setLocation("")
    setOfferType(OfferType.BUY)
    setSaleMin(0)
    setSaleMax(0)
    setRentMin(0)
    setRentMax(0)
    setRatingMin(0)
  }

  console.log("-----------------------------------")
  console.log("category", category)
  console.log("location", location)
  console.log("offerType", locOfferType)
  console.log("saleMin", saleMin)
  console.log("saleMax", saleMax)
  console.log("rentMin", rentMin)
  console.log("rentMax", rentMax)
  console.log("ratingMin", ratingMin)
  console.log("-----------------------------------")

  return (
    <Portal>
      <Modal
        visible={visible}
        onDismiss={onDismiss}
        contentContainerStyle={[
          styles.container,
          { backgroundColor: theme.colors.surface },
        ]}
      >
        {/* Header */}
        <View style={styles.header}>
          <IconButton icon="close" size={24} onPress={onDismiss} />
          <Text variant="headlineSmall" style={styles.headerTitle}>
            Filters
          </Text>
        </View>
        <Divider />

        {/* Scrollable content */}
        <ScrollView contentContainerStyle={styles.content}>
          {/* Category dropdown */}
          <MultiSelectDropdown
            mode="outlined"
            placeholder="Select Colors"
            label="Select category"
            value={category}
            options={categories}
            onSelect={(value) => setCategory(value)}
          />

          {/* Location dropdown */}
          <Section title="Location" styles={styles}>
            <TextInput
              mode="outlined"
              label="Location"
              placeholder="Anywhere"
              value={location}
              onChangeText={setLocation}
              style={styles.textInput}
            />
          </Section>

          {/* Listing types */}
          <Section title="Listing types" styles={styles}>
            <View style={styles.checkboxRow}>
              <Checkbox.Item
                label="For sale"
                status={
                  locOfferType === OfferType.BUY ? "checked" : "unchecked"
                }
                onPress={() => {
                  setOfferType(OfferType.BUY)
                }}
                uncheckedColor={theme.colors.primary}
                color={theme.colors.primary}
                style={styles.checkboxItem}
              />
              <Checkbox.Item
                label="Renting"
                status={
                  locOfferType === OfferType.RENT ? "checked" : "unchecked"
                }
                onPress={() => {
                  setOfferType(OfferType.RENT)
                }}
                uncheckedColor={theme.colors.primary}
                color={theme.colors.primary}
                style={styles.checkboxItem}
              />
              <Checkbox.Item
                label="Both"
                status={
                  locOfferType === OfferType.BOTH ? "checked" : "unchecked"
                }
                onPress={() => {
                  setOfferType(OfferType.BOTH)
                }}
                uncheckedColor={theme.colors.primary}
                color={theme.colors.primary}
                style={styles.checkboxItem}
              />
            </View>
          </Section>

          {/* Price for sale */}
          <Section title="Price for sale" styles={styles}>
            <View style={styles.inputsRow}>
              <TextInput
                mode="outlined"
                label="Minimum"
                value={`${saleMin}$`}
                keyboardType="numeric"
                onChangeText={(text) =>
                  setSaleMin(Number(text.replace(/\D/g, "")))
                }
                style={styles.smallInput}
              />
              <TextInput
                mode="outlined"
                label="Maximum"
                value={`${saleMax}$`}
                keyboardType="numeric"
                onChangeText={(text) =>
                  setSaleMax(Number(text.replace(/\D/g, "")))
                }
                style={styles.smallInput}
              />
            </View>
          </Section>

          {/* Price for rent */}
          <Section title="Price for rent" styles={styles}>
            <View style={styles.inputsRow}>
              <TextInput
                mode="outlined"
                label="Minimum"
                value={`${rentMin}$`}
                keyboardType="numeric"
                onChangeText={(text) =>
                  setRentMin(Number(text.replace(/\D/g, "")))
                }
                style={styles.smallInput}
              />
              <TextInput
                mode="outlined"
                label="Maximum"
                value={`${rentMax}$`}
                keyboardType="numeric"
                onChangeText={(text) =>
                  setRentMax(Number(text.replace(/\D/g, "")))
                }
                style={styles.smallInput}
              />
            </View>
          </Section>

          {/* User rating */}
          <Section title="User rating" styles={styles}>
            <TextInput
              mode="outlined"
              label="Minimum ranking"
              value={`${ratingMin}`}
              keyboardType="numeric"
              onChangeText={(t) => setRatingMin(Number(t.replace(/\D/g, "")))}
              style={[styles.smallInput, { alignSelf: "flex-start" }]}
            />
          </Section>
        </ScrollView>

        {/* Footer buttons */}
        <View style={styles.footer}>
          <Button
            mode="outlined"
            onPress={clearAll}
            style={[styles.footerButton, styles.clearButton]}
          >
            Clear All
          </Button>
          <Button
            mode="contained"
            onPress={() => {
              onApply({
                categoryIds: category,
                location,
                locOfferType,
                saleMin,
                saleMax,
                rentMin,
                rentMax,
                ratingMin,
              })
              onDismiss()
            }}
            style={[styles.footerButton, styles.applyButton]}
          >
            Show results
          </Button>
        </View>
      </Modal>
    </Portal>
  )
}

// Reusable “card” wrapper for each section
const Section: React.FC<{
  title: string
  children: React.ReactNode
  styles: ReturnType<typeof makeStyles>
}> = ({ title, children, styles }) => {
  return (
    <View style={styles.section}>
      <Text variant="titleMedium" style={styles.sectionTitle}>
        {title}
      </Text>
      {children}
    </View>
  )
}

const makeStyles = (theme: MD3Theme) =>
  StyleSheet.create({
    container: {
      margin: 20,
      padding: 0,
      borderRadius: 8,
      maxHeight: "90%",
    },
    header: {
      flexDirection: "row",
      alignItems: "center",
      paddingHorizontal: 16,
      paddingVertical: 12,
    },
    headerTitle: {
      marginLeft: 8,
    },
    divider: {
      marginBottom: 8,
    },
    content: {
      paddingHorizontal: 16,
      paddingBottom: 16,
    },
    section: {
      backgroundColor: theme.colors.surface,
      borderRadius: 8,
      padding: 12,
      marginBottom: 12,
    },
    sectionTitle: {
      marginBottom: 8,
    },
    textInput: {
      backgroundColor: theme.colors.surface,
    },
    checkboxRow: {
      flexDirection: "row",
      justifyContent: "space-between",
    },
    checkboxItem: {
      flex: 1,
      margin: 0,
      padding: 0,
    },
    slider: {
      height: 40,
    },
    inputsRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      marginTop: 8,
    },
    smallInput: {
      flex: 1,
      marginRight: 8,
      backgroundColor: theme.colors.surface,
    },
    footer: {
      flexDirection: "row",
      padding: 16,
      justifyContent: "space-between",
    },
    footerButton: {
      flex: 1,
    },
    clearButton: {
      marginRight: 8,
      borderColor: theme.colors.outline,
    },
    applyButton: {
      marginLeft: 8,
    },
  })
