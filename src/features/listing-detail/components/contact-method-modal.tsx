import * as IntentLauncher from "expo-intent-launcher"
import * as MailComposer from "expo-mail-composer"
import React from "react"
import { Alert, Linking, Platform, StyleSheet, View } from "react-native"
import {
  Button,
  IconButton,
  type MD3Theme,
  Modal,
  Portal,
  RadioButton,
  Text,
  useTheme,
} from "react-native-paper"

export type ContactMethod = "email" | "phone"

interface MailClient {
  label: string
  packageName?: string // Android
  url?: string // iOS
}

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

  // open first available e‑mail client (or fallback to mailto)
  const openMail = async () => {
    if (!sellerEmail) {
      Alert.alert("No email address available")
      return
    }

    const subject = `Inquiry about ${listingTitle}`
    const body = `Hi ${sellerName},\n\nI'm interested in your listing \"${listingTitle}\".\n\nBest regards,\n`

    try {
      const clients = await MailComposer.getClients()
      const first = clients[0]

      if (first && Platform.OS === "android" && first.packageName) {
        await IntentLauncher.startActivityAsync("android.intent.action.SEND", {
          packageName: first.packageName,
          type: "message/rfc822",
          extra: {
            "android.intent.extra.EMAIL": [sellerEmail],
            "android.intent.extra.SUBJECT": subject,
            "android.intent.extra.TEXT": body,
          },
        })
      } else if (first && Platform.OS === "ios" && first.url) {
        const url = encodeURI(
          `${first.url}compose?to=${sellerEmail}&subject=${subject}&body=${body}`
        )
        await Linking.openURL(url)
      } else {
        // fallback → system chooser once
        const url = encodeURI(
          `mailto:${sellerEmail}?subject=${subject}&body=${body}`
        )
        await Linking.openURL(url)
      }
    } catch (e) {
      console.warn(e)
      Alert.alert("Unable to open e‑mail application")
    } finally {
      onDismiss()
    }
  }

  const openPhone = () => {
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
    onDismiss()
  }

  const handleSelect = () => {
    method === "email" ? openMail() : openPhone()
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
          value={method}
          onValueChange={(v) => setMethod(v as ContactMethod)}
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
