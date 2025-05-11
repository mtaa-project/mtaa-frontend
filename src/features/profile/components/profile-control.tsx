import { router } from "expo-router"
import { useEffect, useState } from "react"
import { StyleSheet, View } from "react-native"
import {
  Button,
  Dialog,
  type MD3Theme,
  Paragraph,
  Portal,
  useTheme,
} from "react-native-paper"

import { auth } from "@/firebase-config"
import { linkAccountFacebook } from "@/src/components/auth/facebook-auth"
import { useGoogleAuth } from "@/src/components/auth/google-auth"

type AccountType = "Facebook" | "Google"

export default function ProfileControl() {
  const theme = useTheme()
  const styles = createStyles(theme)

  const user = auth.currentUser
  const [hasFacebook, setHasFacebook] = useState<boolean>(false)
  const [hasGoogleLinked, setHasGoogleLinked] = useState<boolean>(false)

  const { response, googleSignIn } = useGoogleAuth({ linkAccount: true })

  const [linkingAccountError, setLinkingAccountError] = useState<string | null>(
    null
  )
  const [dialogVisible, setDialogVisible] = useState(false)

  useEffect(() => {
    if (user) {
      const providers = user.providerData.map((provider) => provider.providerId)
      setHasFacebook(providers.includes("facebook.com"))
      setHasGoogleLinked(providers.includes("google.com"))
    }
  }, [user])

  const handleLinkAccount = async (accountType: AccountType) => {
    try {
      if (accountType === "Facebook") {
        await linkAccountFacebook()
        setHasFacebook(true)
      } else if (accountType === "Google") {
        await googleSignIn()
        setHasGoogleLinked(true)
      }
    } catch (error: any) {
      setLinkingAccountError(error.message)
      setDialogVisible(true)
    }
  }

  return (
    <View style={styles.container}>
      <Button
        icon={"facebook"}
        mode="contained"
        disabled={hasFacebook}
        onPress={() => handleLinkAccount("Facebook")}
      >
        {hasFacebook ? "Facebook Account Linked" : "Link Facebook Account"}
      </Button>
      <Button
        icon={"google"}
        mode="contained"
        disabled={hasGoogleLinked}
        onPress={() => handleLinkAccount("Google")}
      >
        {hasGoogleLinked ? "Google Account Linked" : "Link Google Account"}
      </Button>
      <Button
        mode="contained"
        onPress={() => {
          auth.signOut()
          router.replace("/")
        }}
      >
        Sign out
      </Button>
      {/* Link Account Dialog */}
      <Portal>
        <Dialog
          visible={dialogVisible}
          onDismiss={() => setDialogVisible(false)}
        >
          <Dialog.Title>Authentication Error</Dialog.Title>
          <Dialog.Content>
            <Paragraph>{linkingAccountError}</Paragraph>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setDialogVisible(false)}>OK</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </View>
  )
}

const createStyles = (theme: MD3Theme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      gap: 16,
      paddingBlock: 20,
    },
  })
