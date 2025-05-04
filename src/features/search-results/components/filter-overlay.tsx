// File: src/features/search-results/components/FilterOverlay.tsx
import React from "react"
import { View, StyleSheet } from "react-native"
import { Portal, Modal, Text, Button, Divider } from "react-native-paper"

interface FilterOverlayProps {
  visible: boolean
  onDismiss: () => void
}

export const FilterOverlay: React.FC<FilterOverlayProps> = ({
  visible,
  onDismiss,
}) => {
  return (
    <Portal>
      <Modal
        visible={visible}
        onDismiss={onDismiss}
        contentContainerStyle={styles.container}
      >
        <Text variant="headlineSmall" style={styles.title}>
          Filters
        </Text>
        <Divider />
        {/* TODO: Insert filter controls here (e.g. price range sliders, categories, rating) */}
        <View style={styles.spacer} />
        <Button mode="contained" onPress={onDismiss}>
          Apply Filters
        </Button>
      </Modal>
    </Portal>
  )
}

const styles = StyleSheet.create({
  container: {
    margin: 20,
    padding: 20,
    backgroundColor: "white",
    borderRadius: 8,
  },
  title: {
    marginBottom: 12,
  },
  spacer: {
    height: 24,
  },
})
