import React from "react"
import { View } from "react-native"

import TopBar, { type TabDef } from "@/src/components/top-bar"

// keep your existing components
import Overview from "./a-overview"
import Adverts from "./b-adverts"
import Reviews from "./c-reviews"

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
