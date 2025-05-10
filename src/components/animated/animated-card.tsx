// src/components/animated/AnimatedCard.tsx
import React from "react"
import Animated from "react-native-reanimated"
import {
  FadeIn,
  LinearTransition,
  SlideOutRight,
} from "react-native-reanimated"

import { useActiveAnimation } from "./use-active-animation"

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
