import { StatisticsCard } from "@/src/features/profile/components/statistics-card"
import { UserDetails } from "@/src/features/profile/components/user-details/user-details"
import { ScrollView, StyleSheet, View } from "react-native"
import { Text } from "react-native-paper"

export default function OverviewScreen() {
  return (
    <ScrollView style={styles.container}>
      {/* <Text style={styles.title}>Tab One</Text> */}
      <StatisticsCard />
      <UserDetails />
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginBlock: 20,
    // alignItems: "center",
    // justifyContent: "center",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
})
