import React, { useEffect } from "react"
import { Dimensions } from "react-native"
import Animated, {
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from "react-native-reanimated"

const { width } = Dimensions.get("window")

export const Skeleton = ({ height = 20, borderRadius = 6, style = {} }) => {
  const shimmer = useSharedValue(0)

  useEffect(() => {
    shimmer.value = withRepeat(
      withTiming(1, { duration: 1500 }),
      -1,
      true // reverse
    )
  }, [])

  const animatedStyle = useAnimatedStyle(() => {
    const opacity = interpolate(shimmer.value, [0, 1], [0.3, 1])
    return {
      opacity,
    }
  })

  return (
    <Animated.View
      style={[
        {
          backgroundColor: "#E0E0E0",
          height,
          borderRadius,
          width: "100%",
        },
        animatedStyle,
        style,
      ]}
    />
  )
}
