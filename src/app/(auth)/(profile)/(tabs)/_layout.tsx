import {
  MaterialTopTabNavigationEventMap,
  MaterialTopTabNavigationOptions,
  createMaterialTopTabNavigator,
} from "@react-navigation/material-top-tabs"
import { withLayoutContext } from "expo-router"
import { ParamListBase, TabNavigationState } from "@react-navigation/native"
import { useTheme } from "react-native-paper"
import FontAwesome from "@expo/vector-icons/FontAwesome"

const { Navigator } = createMaterialTopTabNavigator()

export const MaterialTopTabs = withLayoutContext<
  MaterialTopTabNavigationOptions,
  typeof Navigator,
  TabNavigationState<ParamListBase>,
  MaterialTopTabNavigationEventMap
>(Navigator)

export default function TabLayout() {
  const theme = useTheme()

  return (
    <MaterialTopTabs
      screenOptions={{
        swipeEnabled: true,
        animationEnabled: true,
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: theme.colors.onSurfaceVariant,
        tabBarIndicatorStyle: {
          backgroundColor: theme.colors.primary,
        },
        tabBarLabelStyle: {
          textTransform: "none",
          fontWeight: "600",
        },
        tabBarStyle: {
          backgroundColor: theme.colors.surface,
        },
        tabBarPressColor: theme.colors.primaryContainer,
        tabBarShowIcon: true,
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
