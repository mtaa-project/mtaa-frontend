import React from "react"
import { View, StyleSheet } from "react-native"

// keep your existing components
import Overview from "./a_overview"
import Adverts from "./b_adverts"
import Reviews from "./c_reviews"
import TopBar, { TabDef } from "@/src/components/top-bar"

const TABS: TabDef[] = [
  { key: "overview", label: "Overview", icon: "account-outline" },
  { key: "adverts", label: "Adverts", icon: "format-list-bulleted" },
  { key: "reviews", label: "Reviews", icon: "star-outline" },
]

export default function ProfileTabsScreen() {
  const [active, setActive] = React.useState("overview")

  const Scene = React.useMemo(() => {
    switch (active) {
      case "overview":
        return <Overview />
      case "adverts":
        return <Adverts />
      case "reviews":
        return <Reviews />
      default:
        return null
    }
  }, [active])

  return (
    <View style={{ flex: 1 }}>
      <TopBar tabs={TABS} activeKey={active} onChange={setActive} />
      {Scene}
    </View>
  )
}
