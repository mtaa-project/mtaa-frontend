// src/components/animated/AnimatedCard.tsx
import React from "react"
import Animated from "react-native-reanimated"
import {
  LinearTransition,
  FadeIn,
  SlideOutRight,
} from "react-native-reanimated"
import { useActiveAnimation } from "./useActiveAnimation"

type Props = {
  isActive: boolean
  style?: any
  children: React.ReactNode
}

export const AnimatedCard: React.FC<Props> = ({
  isActive,
  style,
  children,
}) => {
  const animatedStyle = useActiveAnimation(isActive)

  return (
    <Animated.View
      style={[style, animatedStyle]}
      layout={LinearTransition}
      entering={FadeIn.duration(250)}
      exiting={SlideOutRight.duration(300)}
    >
      {children}
    </Animated.View>
  )
}
