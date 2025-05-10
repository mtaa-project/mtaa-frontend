import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons"
import React from "react"
import { StyleSheet } from "react-native"
import { Button } from "react-native-paper"

export interface Category {
  id: number
  name: string
  iconName?: keyof typeof MaterialCommunityIcons.glyphMap
}

interface Props {
  category: Category
  onPress?: () => void
}

export const CategoryPill: React.FC<Props> = ({ category, onPress }) => {
  return (
    <Button
      style={styles.button}
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
  button: {
    flex: 1,
  },
})
