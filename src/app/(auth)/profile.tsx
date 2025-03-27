import { useEffect, useState } from "react"
import { View } from "react-native"
import { Button, Dialog, Paragraph, Portal, Text } from "react-native-paper"

import { auth } from "@/firebase-config"
import { linkAccountFacebook } from "@/src/components/auth/facebook-auth"

export default function Profile() {
  const user = auth.currentUser
  const [hasFacebook, setHasFacebook] = useState<boolean>(false)

  const [linkingAccountError, setLinkingAccountError] = useState<string | null>(
    null
  )
  const [dialogVisible, setDialogVisible] = useState(false)

  useEffect(() => {
    if (user) {
      const providers = user.providerData.map((provider) => provider.providerId)
      setHasFacebook(providers.includes("facebook.com"))
    }
  }, [user])

  const handleLinkFacebookAccount = async () => {
    try {
      await linkAccountFacebook()
      setHasFacebook(true)
      console.log("dobre")
    } catch (error: any) {
      console.log("zle")
      setLinkingAccountError(error.message)
      setDialogVisible(true)
    }
  }

  return (
    <View>
      <Text>Profile</Text>
      <Button
        icon={"facebook"}
        mode="contained"
        disabled={hasFacebook}
        onPress={handleLinkFacebookAccount}
      >
        {hasFacebook ? "Linked" : "Link Facebook Account"}
      </Button>
      <Button mode="contained" onPress={() => auth.signOut()}>
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
