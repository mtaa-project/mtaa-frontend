import * as Notifications from "expo-notifications"
import { useRouter } from "expo-router"
import React, { useContext, useEffect, useRef } from "react"
import { type ReactNode, useState } from "react"

import { registerForPushNotificationsAsync } from "../lib/notifications"

interface NotificationContextType {
  expoPushToken: string | null
  // represents a single notification that has been triggered by some request
  notification: Notifications.Notification | null
  error: Error | null
}

const NotificationContext = React.createContext<
  NotificationContextType | undefined
>(undefined)

type NotificationProviderProps = {
  children: ReactNode
}

export const useNotification = () => {
  const context = useContext(NotificationContext)
  if (context === undefined) {
    throw new Error(
      "useNotifications must be used within a NotificationProvider"
    )
  }

  return context
}

export const NotificationProvider: React.FC<NotificationProviderProps> = ({
  children,
}) => {
  const [expoPushToken, setExpoPushToken] = useState(null)
  const [notification, setNotification] =
    useState<Notifications.Notification | null>(null)
  const [error, setError] = useState<Error | null>(null)
  const router = useRouter()

  const notificationListener = useRef<Notifications.EventSubscription>()
  const responseListener = useRef<Notifications.EventSubscription>()

  useEffect(() => {
    ;(async () => {
      try {
        const token = await registerForPushNotificationsAsync()
        setExpoPushToken(token)
      } catch (error) {
        console.error(error)
        // setError(error)
      }
    })()

    // Listeners registered by this method will be called whenever a
    // notification is received while the app is running
    notificationListener.current =
      Notifications.addNotificationReceivedListener((notification) => {
        console.log(
          "Notification Received (while the app is running): ",
          notification
        )
        setNotification(notification)
      })

    // whenever an user interacts with the notification (tap, etc.)
    responseListener.current =
      Notifications.addNotificationResponseReceivedListener((response) => {
        console.log(
          "Notification Response:",
          JSON.stringify(response, null, 2),
          JSON.stringify(response.notification.request.content.data, null, 2)
        )

        // const deeplink = response.notification.request.content.data.deep_link
        // console.log("Deeplink: ", deeplink)

        // router.navigate(deeplink)
      })

    return () => {
      notificationListener.current &&
        Notifications.removeNotificationSubscription(
          notificationListener.current
        )
      responseListener.current &&
        Notifications.removeNotificationSubscription(responseListener.current)
    }
  }, [])

  return (
    <NotificationContext.Provider
      value={{ expoPushToken, notification, error }}
    >
      {children}
    </NotificationContext.Provider>
  )
}
