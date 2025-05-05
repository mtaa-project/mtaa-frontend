import React from "react"
import { StyleSheet, View } from "react-native"
import { Button, Text, TouchableRipple, useTheme } from "react-native-paper"
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons"
import { useGlobalStyles } from "@/src/components/global-styles"

export interface Category {
  id: number
  name: string
  iconName?: keyof typeof MaterialCommunityIcons.glyphMap // fallback handled below
}

interface Props {
  category: Category
  onPress?: () => void
}

export const CategoryPill: React.FC<Props> = ({ category, onPress }) => {
  const theme = useTheme()

  return (
    <Button
      style={styles.content}
      icon={({ color, size }) => (
        <MaterialCommunityIcons
          name={category.iconName ?? "bike"}
          size={size}
          color={color}
        />
      )}
      mode="contained"
      onPress={onPress}
    >
      {category.name}
    </Button>
  )
}

const styles = StyleSheet.create({
  content: {
    alignSelf: "stretch",
    gap: 8,
    flexDirection: "row",
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  label: {
    marginLeft: 8,
    fontWeight: "500",
  },
})
