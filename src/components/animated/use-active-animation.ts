// src/components/animated/useActiveAnimation.ts
import { useEffect } from "react"
import { type MD3Theme, useTheme } from "react-native-paper"
import {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from "react-native-reanimated"

export function useActiveAnimation(isActive: boolean) {
  const theme = useTheme<MD3Theme>()
  const activeValue = useSharedValue(isActive ? 1 : 0)

  useEffect(() => {
    activeValue.value = withTiming(isActive ? 1 : 0, { duration: 300 })
  }, [isActive])

  return useAnimatedStyle(() => {
    // const backgroundColor = interpolateColor(
    //   activeValue.value,
    //   [0, 1],
    //   [theme.colors.surfaceDisabled, theme.colors.surfaceVariant]
    // )
    const scale = withSpring(activeValue.value === 1 ? 1 : 0.95)

    return {
      // backgroundColor,
      transform: [{ scale }],
    }
  })
}
