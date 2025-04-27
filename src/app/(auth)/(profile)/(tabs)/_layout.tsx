import {
  MaterialTopTabNavigationEventMap,
  MaterialTopTabNavigationOptions,
  createMaterialTopTabNavigator,
} from "@react-navigation/material-top-tabs"
import { withLayoutContext } from "expo-router"
import { ParamListBase, TabNavigationState } from "@react-navigation/native"
import FontAwesome from "@expo/vector-icons/FontAwesome"

const { Navigator } = createMaterialTopTabNavigator()

export const MaterialTopTabs = withLayoutContext<
  MaterialTopTabNavigationOptions,
  typeof Navigator,
  TabNavigationState<ParamListBase>,
  MaterialTopTabNavigationEventMap
>(Navigator)

export default function TabLayout() {
  return (
    <MaterialTopTabs
      // initialRouteName="a_overview"
      screenOptions={{
        // tabBarIndicatorStyle: { backgroundColor: "#4B3B8F" },
        // tabBarActiveTintColor: "#4B3B8F",
        // tabBarInactiveTintColor: "gray",
        // tabBarPressColor: "#4B3B8F",
        // tabBarLabelStyle: { textTransform: "none" },
        // tabBarStyle: { backgroundColor: "white" },
        swipeEnabled: true,
        animationEnabled: true,
      }}
    >
      <MaterialTopTabs.Screen
        name="a_overview"
        options={{
          title: "Overview",
          tabBarIcon: ({ color }) => (
            <FontAwesome name="home" size={20} color={color} />
          ),
        }}
      />
      <MaterialTopTabs.Screen
        name="b_adverts"
        options={{
          title: "Adverts",
          tabBarIcon: ({ color }) => (
            <FontAwesome name="list" size={20} color={color} />
          ),
        }}
      />
      <MaterialTopTabs.Screen
        name="c_reviews"
        options={{
          title: "Reviews",
          tabBarIcon: ({ color }) => (
            <FontAwesome name="star" size={20} color={color} />
          ),
        }}
      />
    </MaterialTopTabs>
  )
}
