import { AdvertList } from "@/src/features/profile/advert-list/advert-list"
import { useEffect } from "react"
import { View, Text, StyleSheet } from "react-native"

export default function AdvertScreen() {
  return (
    <View style={styles.container}>
      <AdvertList />
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1 }, // <— very important so swipe gestures & nesting work
})
