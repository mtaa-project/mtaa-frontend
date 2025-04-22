// TODO:
import * as Device from "expo-device"
import * as Notifications from "expo-notifications"
import { Platform } from "react-native"

function handleRegistrationError(errorMessage: string) {
  alert(errorMessage)
  throw new Error(errorMessage)
}

export async function registerForPushNotificationsAsync() {
  if (Platform.OS === "android") {
    Notifications.setNotificationChannelAsync("default", {
      name: "default",
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: "#FF231F7C",
    })
  }

  if (Device.isDevice) {
    const { status: existingStatus } = await Notifications.getPermissionsAsync()
    // FIXME handle iOS status handling
    let finalStatus = existingStatus
    if (existingStatus !== "granted") {
      const { status } = await Notifications.requestPermissionsAsync()
      finalStatus = status
    }

    if (finalStatus !== "granted") {
      handleRegistrationError(
        "Permission not granted to get push token for push notification!"
      )
      return
    }

    try {
      const pushTokenString = (await Notifications.getDevicePushTokenAsync())
        .data

      console.log("PushToken: ", pushTokenString)
      return pushTokenString
    } catch (e: unknown) {
      handleRegistrationError(`${e}`)
    }
  } else {
    handleRegistrationError("Must use physical device for push notifications")
  }
}
