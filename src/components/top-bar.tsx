import React, { useEffect, useState } from "react"
import { StyleSheet, LayoutChangeEvent } from "react-native"
import { Surface, Button, useTheme, MD3Theme } from "react-native-paper"
import { useSafeAreaInsets } from "react-native-safe-area-context"

import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from "react-native-reanimated"

export interface TabDef {
  key: string
  label: string
  icon?: string
}

interface Props {
  tabs: TabDef[]
  activeKey: string
  onChange: (key: string) => void
}

export default function TopBar({ tabs, activeKey, onChange }: Props) {
  const theme = useTheme()
  const styles = createStyle(theme)
  const insets = useSafeAreaInsets()

  //   shared values used in an animation
  const containerWidth = useSharedValue(0)
  const translateX = useSharedValue(0)

  // only for rerender after layout change
  const [widthJS, setWidthJS] = useState(0)

  //   Measures the width of the container (it runs only once after component mounts)
  const onLayout = (e: LayoutChangeEvent) => {
    const layoutWidth = e.nativeEvent.layout.width
    setWidthJS(layoutWidth)
    containerWidth.value = layoutWidth
  }

  useEffect(() => {
    if (containerWidth.value === 0) return // ešte nemáme veľkosť
    const idx = tabs.findIndex((t) => t.key === activeKey)
    if (idx < 0) return

    const tabWidth = containerWidth.value / tabs.length
    translateX.value = withSpring(idx * tabWidth, {
      mass: 1,
      damping: 15,
      stiffness: 180,
    })
  }, [activeKey, tabs.length, containerWidth.value])

  // animated style that can be used in 'style' property in a component:
  // https://docs.swmansion.com/react-native-reanimated/docs/core/useAnimatedStyle/
  const underlineStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }))

  //   only for conditional render of underline and also its width
  const tabWidth = widthJS > 0 ? widthJS / tabs.length : 0

  return (
    <Surface
      elevation={2}
      style={[styles.container, { paddingTop: insets.top }]}
      // onLayout is automatically called after first render
      onLayout={onLayout}
      accessibilityRole="tablist"
    >
      {tabs.map(({ key, label, icon }) => (
        <Button
          key={key}
          mode="text"
          compact
          uppercase={false}
          icon={icon}
          style={[styles.tab, key === activeKey ? styles.labelActive : null]}
          labelStyle={[
            styles.label,
            key === activeKey && {
              color: theme.colors.primary,
              fontWeight: "600",
            },
          ]}
          onPress={() => onChange(key)}
          accessibilityRole="tab"
          accessibilityState={{ selected: key === activeKey }}
          accessibilityLabel={label}
          accessibilityHint={`Show content of a tab ${label}`}
        >
          {label}
        </Button>
      ))}

      {/* Animated underline */}
      {/* {tabWidth > 0 && (
        <Animated.View
          //   pointerEvents="none"
          style={[
            styles.indicator,
            {
              width: tabWidth,
              backgroundColor: colors.primary,
            },
            underlineStyle,
          ]}
        />
      )} */}
    </Surface>
  )
}

const createStyle = (theme: MD3Theme) =>
  StyleSheet.create({
    container: {
      flexDirection: "row",
      position: "relative",
      borderBottomWidth: StyleSheet.hairlineWidth,
    },
    tab: { flex: 1 },
    label: { fontSize: 14, opacity: 0.8 },
    labelActive: {
      backgroundColor: theme.colors.secondaryContainer,
    },
    indicator: {
      position: "absolute",
      bottom: 0,
      height: 2,
    },
  })
