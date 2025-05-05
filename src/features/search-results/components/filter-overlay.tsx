// File: src/features/search-results/components/FilterOverlay.tsx
import React, { useState } from "react"
import { View, StyleSheet, ScrollView } from "react-native"
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
// Using @react-native-community/slider; you can swap for any range‐slider lib

interface FilterOverlayProps {
  visible: boolean
  onDismiss: () => void
}

export const FilterOverlay: React.FC<FilterOverlayProps> = ({
  visible,
  onDismiss,
}) => {
  const theme = useTheme()
  const styles = makeStyles(theme)

  // --- local UI state (stub out real logic or context) ---
  const [category, setCategory] = useState("")
  const [location, setLocation] = useState("")
  const [forSale, setForSale] = useState(true)
  const [renting, setRenting] = useState(true)
  const [priceSaleMin, setPriceSaleMin] = useState(0)
  const [priceSaleMax, setPriceSaleMax] = useState(0)
  const [priceRentMin, setPriceRentMin] = useState(0)
  const [priceRentMax, setPriceRentMax] = useState(0)
  const [ratingMin, setRatingMin] = useState(0)

  const clearAll = () => {
    setCategory("")
    setLocation("")
    setForSale(true)
    setRenting(true)
    setPriceSaleMin(0)
    setPriceSaleMax(0)
    setPriceRentMin(0)
    setPriceRentMax(0)
    setRatingMin(0)
  }

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
            <TextInput
              mode="outlined"
              label="Select category"
              placeholder="Select category"
              value={category}
              onFocus={() => {
                /* TODO: open actual dropdown */
              }}
              right={<TextInput.Icon icon="chevron-down" />}
              style={styles.textInput}
            />
          </Section>

          {/* Location dropdown */}
          <Section title="Location" styles={styles}>
            <TextInput
              mode="outlined"
              label="Anywhere"
              placeholder="Anywhere"
              value={location}
              onFocus={() => {
                /* TODO: open actual dropdown */
              }}
              right={<TextInput.Icon icon="chevron-down" />}
              style={styles.textInput}
            />
          </Section>

          {/* Listing types */}
          <Section title="Listing types" styles={styles}>
            <View style={styles.checkboxRow}>
              <Checkbox.Item
                label="For sale"
                status={forSale ? "checked" : "unchecked"}
                onPress={() => setForSale(!forSale)}
                uncheckedColor={theme.colors.primary}
                color={theme.colors.primary}
                style={styles.checkboxItem}
              />
              <Checkbox.Item
                label="Renting"
                status={renting ? "checked" : "unchecked"}
                onPress={() => setRenting(!renting)}
                uncheckedColor={theme.colors.primary}
                color={theme.colors.primary}
                style={styles.checkboxItem}
              />
            </View>
          </Section>

          {/* Price for sale */}
          <Section title="Price for sale" styles={styles}>
            {/* <Slider
              style={styles.slider}
              minimumValue={0}
              maximumValue={1000}
              step={1}
              minimumTrackTintColor={theme.colors.primary}
              maximumTrackTintColor="#E0E0E0"
              thumbTintColor={theme.colors.primary}
              value={priceSaleMin}
              onValueChange={setPriceSaleMin}
            /> */}
            <View style={styles.inputsRow}>
              <TextInput
                mode="outlined"
                label="Minimum"
                value={`${priceSaleMin}$`}
                keyboardType="numeric"
                onChangeText={(text) =>
                  setPriceSaleMin(Number(text.replace(/\D/g, "")))
                }
                style={styles.smallInput}
              />
              <TextInput
                mode="outlined"
                label="Maximum"
                value={`${priceSaleMax}$`}
                keyboardType="numeric"
                onChangeText={(text) =>
                  setPriceSaleMax(Number(text.replace(/\D/g, "")))
                }
                style={styles.smallInput}
              />
            </View>
          </Section>

          {/* Price for rent */}
          <Section title="Price for rent" styles={styles}>
            {/* <Slider
              style={styles.slider}
              minimumValue={0}
              maximumValue={1000}
              step={1}
              minimumTrackTintColor={theme.colors.primary}
              maximumTrackTintColor="#E0E0E0"
              thumbTintColor={theme.colors.primary}
              value={priceRentMin}
              onValueChange={setPriceRentMin}
            /> */}
            <View style={styles.inputsRow}>
              <TextInput
                mode="outlined"
                label="Minimum"
                value={`${priceRentMin}$`}
                keyboardType="numeric"
                onChangeText={(text) =>
                  setPriceRentMin(Number(text.replace(/\D/g, "")))
                }
                style={styles.smallInput}
              />
              <TextInput
                mode="outlined"
                label="Maximum"
                value={`${priceRentMax}$`}
                keyboardType="numeric"
                onChangeText={(text) =>
                  setPriceRentMax(Number(text.replace(/\D/g, "")))
                }
                style={styles.smallInput}
              />
            </View>
          </Section>

          {/* User rating */}
          <Section title="User rating" styles={styles}>
            {/* <Slider
              style={styles.slider}
              minimumValue={0}
              maximumValue={5}
              step={0.5}
              minimumTrackTintColor={theme.colors.primary}
              maximumTrackTintColor="#E0E0E0"
              thumbTintColor={theme.colors.primary}
              value={ratingMin}
              onValueChange={setRatingMin}
            /> */}
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
            onPress={onDismiss}
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
