// src/features/listings/components/ContactMethodModal.tsx

import React from "react"
import {
  MD3Theme,
  useTheme,
  Text,
  Portal,
  Modal,
  RadioButton,
  IconButton,
  Button,
} from "react-native-paper"
import { StyleSheet, View, Linking, Alert } from "react-native"

export type ContactMethod = "email" | "phone"

interface ContactMethodModalProps {
  visible: boolean
  sellerName: string
  sellerEmail?: string
  sellerPhone?: string
  listingTitle: string
  onDismiss: () => void
}

export const ContactMethodModal: React.FC<ContactMethodModalProps> = ({
  visible,
  sellerName,
  sellerEmail,
  sellerPhone,
  listingTitle,
  onDismiss,
}) => {
  const theme = useTheme()
  const styles = createStyles(theme)
  const [method, setMethod] = React.useState<ContactMethod>("email")

  React.useEffect(() => {
    if (visible) setMethod("email")
  }, [visible])

  const handleSelect = () => {
    if (method === "phone") {
      if (!sellerPhone) {
        Alert.alert("No phone number available")
      } else {
        const url = `tel:${sellerPhone}`
        Linking.canOpenURL(url)
          .then((ok) =>
            ok ? Linking.openURL(url) : Alert.alert("Can't open dialer")
          )
          .catch(() => Alert.alert("Failed to open dialer"))
      }
    } else {
      // email
      if (!sellerEmail) {
        Alert.alert("No email address available")
      } else {
        const subject = encodeURIComponent(`Inquiry about "${listingTitle}"`)
        const body = encodeURIComponent(
          `Hi ${sellerName},\n\nI saw your listing for "${listingTitle}" and…`
        )
        const url = `mailto:${sellerEmail}?subject=${subject}&body=${body}`
        Linking.canOpenURL(url)
          .then((ok) =>
            ok ? Linking.openURL(url) : Alert.alert("Can't open mail app")
          )
          .catch(() => Alert.alert("Failed to open mail app"))
      }
    }
    onDismiss()
  }

  return (
    <Portal>
      <Modal
        visible={visible}
        onDismiss={onDismiss}
        contentContainerStyle={styles.modalContainer}
      >
        <Text variant="headlineSmall" style={styles.modalTitle}>
          Contact Method
        </Text>
        <Text variant="bodyMedium" style={styles.modalSubtitle}>
          {`Choose how you'd like to connect with ${sellerName}:`}
        </Text>

        <RadioButton.Group
          onValueChange={(value) => setMethod(value as ContactMethod)}
          value={method}
        >
          <View style={styles.optionRow}>
            <IconButton icon="email-outline" size={24} />
            <Text style={styles.optionLabel}>Email</Text>
            <RadioButton value="email" />
          </View>
          <View style={styles.optionRow}>
            <IconButton icon="phone-outline" size={24} />
            <Text style={styles.optionLabel}>Phone</Text>
            <RadioButton value="phone" />
          </View>
        </RadioButton.Group>

        <View style={styles.modalActions}>
          <Button onPress={onDismiss}>Cancel</Button>
          <Button onPress={handleSelect}>Select</Button>
        </View>
      </Modal>
    </Portal>
  )
}

const createStyles = (theme: MD3Theme) =>
  StyleSheet.create({
    modalContainer: {
      backgroundColor: theme.colors.surface,
      margin: 0,
      padding: 24,
      borderTopLeftRadius: 16,
      borderTopRightRadius: 16,
      position: "absolute",
      bottom: 0,
      left: 0,
      right: 0,
    },
    modalTitle: { marginBottom: 8 },
    modalSubtitle: {
      marginBottom: 16,
      color: theme.colors.onSurfaceVariant,
    },
    optionRow: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      marginBottom: 12,
    },
    optionLabel: { flex: 1, fontSize: 16 },
    modalActions: {
      flexDirection: "row",
      justifyContent: "flex-end",
      marginTop: 24,
    },
  })
