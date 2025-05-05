// File: src/features/search-results/components/FilterOverlay.tsx
import React, { useEffect, useMemo, useState } from "react"
import { View, StyleSheet, ScrollView } from "react-native"
import { Dropdown } from "react-native-paper-dropdown"
import {
  Portal,
  Modal,
  Text,
  Divider,
  IconButton,
  Checkbox,
  TextInput,
  Button,
  useTheme,
  MD3Theme,
} from "react-native-paper"
import { useGetCategories } from "../../watchdog/services/queries"
import { useGlobalStyles } from "@/src/components/global-styles"
import { OfferType, PriceRange } from "@/src/api/types"

interface FilterOverlayProps {
  visible: boolean
  onDismiss: () => void
  onApply: (filters: {
    categoryIds: string[]
    location: string
    locOfferType: OfferType
    priceRangeSale: PriceRange
    priceRangeRent: PriceRange
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
  const [showDropDown, setShowDropDown] = useState(false)
  const [category, setCategory] = useState<string[]>([])
  const [location, setLocation] = useState("")
  const [locOfferType, setOfferType] = useState<OfferType>(OfferType.BUY)
  const [priceRangeSale, setPriceRangeSale] = useState<PriceRange>({
    min: 0,
    max: 0,
  })
  const [priceRangeRent, setPriceRangeRent] = useState<PriceRange>({
    min: 0,
    max: 0,
  })
  const [ratingMin, setRatingMin] = useState(0)

  useEffect(() => {
    if (initialValues) {
      setCategory(initialValues.categoryIds)
      setLocation(initialValues.location)
      setOfferType(initialValues.locOfferType)
      setPriceRangeSale({
        min: initialValues.priceRangeSale.min,
        max: initialValues.priceRangeSale.max,
      })
      setPriceRangeRent({
        min: initialValues.priceRangeRent.min,
        max: initialValues.priceRangeRent.max,
      })
      setRatingMin(initialValues.ratingMin)
    }
  }, [visible])

  const clearAll = () => {
    setCategory([])
    setLocation("")
    setOfferType(OfferType.BUY)
    setPriceRangeSale({ min: 0, max: 0 })
    setPriceRangeRent({ min: 0, max: 0 })
    setRatingMin(0)
  }

  console.log("category", category)
  console.log("location", location)
  console.log("offerType", locOfferType)
  console.log("priceRangeSale", priceRangeSale)
  console.log("priceRangeRent", priceRangeRent)
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
          <Section title="Category" styles={styles}>
            <Dropdown
              mode="outlined"
              label="Select category"
              options={categories}
              onSelect={(value) => setCategory(value ? [value] : [])}
            />
          </Section>

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
                value={`${priceRangeSale.min}$`}
                keyboardType="numeric"
                onChangeText={(text) =>
                  setPriceRangeSale({
                    ...priceRangeSale,
                    min: Number(text.replace(/\D/g, "")),
                  })
                }
                style={styles.smallInput}
              />
              <TextInput
                mode="outlined"
                label="Maximum"
                value={`${priceRangeSale.max}$`}
                keyboardType="numeric"
                onChangeText={(text) =>
                  setPriceRangeSale({
                    ...priceRangeSale,
                    max: Number(text.replace(/\D/g, "")),
                  })
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
                value={`${priceRangeRent.min}$`}
                keyboardType="numeric"
                onChangeText={(text) =>
                  setPriceRangeRent({
                    ...priceRangeRent,
                    min: Number(text.replace(/\D/g, "")),
                  })
                }
                style={styles.smallInput}
              />
              <TextInput
                mode="outlined"
                label="Maximum"
                value={`${priceRangeRent.max}$`}
                keyboardType="numeric"
                onChangeText={(text) =>
                  setPriceRangeRent({
                    ...priceRangeRent,
                    max: Number(text.replace(/\D/g, "")),
                  })
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
                priceRangeSale,
                priceRangeRent,
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
