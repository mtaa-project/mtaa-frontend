import MaterialIcons from "@expo/vector-icons/MaterialIcons"
import { useIsFocused } from "@react-navigation/native"
import React, { useEffect, useState } from "react"
import {
  type LayoutChangeEvent,
  StyleSheet,
  useWindowDimensions,
  View,
  type ViewStyle,
} from "react-native"
import { Card, IconButton, type MD3Theme, useTheme } from "react-native-paper"
import Animated, {
  runOnUI,
  scrollTo,
  useAnimatedRef,
  useAnimatedScrollHandler,
  useSharedValue,
} from "react-native-reanimated"

type CarouselActionButtonType = "before" | "next"

type ImageCarouselProps = {
  images: string[]
  style?: ViewStyle
  onImagePress?: (index: number) => void

  /** if true, ignore the square aspect ratio and fill the whole screen */
  fullScreen?: boolean
}

export const ImageCarouselChat: React.FC<ImageCarouselProps> = ({
  images,
  style,
  onImagePress,
  fullScreen = false,
}) => {
  const theme = useTheme() as MD3Theme
  const { width: screenWidth, height: screenHeight } = useWindowDimensions()

  // track the container width (only used when not fullScreen)
  const [containerWidth, setContainerWidth] = useState(0)
  const currentIndex = useSharedValue(0)
  const scrollRef = useAnimatedRef<Animated.ScrollView>()

  const handleChangeImage = (buttonType: CarouselActionButtonType) => {
    "worklet"
    const increment = buttonType === "before" ? -1 : 1
    const maxIndex = images.length - 1
    const next = currentIndex.value + increment
    if (next < 0 || next > maxIndex) return

    runOnUI(() => {
      const offsetX = fullScreen ? next * screenWidth : next * containerWidth
      scrollTo(scrollRef, offsetX, 0, true)
    })()
  }

  const onScroll = useAnimatedScrollHandler((e) => {
    const offsetX = e.contentOffset.x
    currentIndex.value = fullScreen
      ? Math.round(offsetX / screenWidth)
      : Math.round(offsetX / containerWidth)
  })

  // reset carousel position
  const isFocused = useIsFocused()
  useEffect(() => {
    if (isFocused) {
      currentIndex.value = 0
      scrollRef.current?.scrollTo({ x: 0, animated: false })
    }
  }, [isFocused, currentIndex])

  const onContainerLayout = (e: LayoutChangeEvent) =>
    setContainerWidth(e.nativeEvent.layout.width)

  // decide the outer size: full screen or square
  const containerStyles: ViewStyle[] = [styles.carouselContainer]
  if (fullScreen) {
    containerStyles.push({ width: screenWidth, height: screenHeight })
  } else {
    containerStyles.push(style || {})
  }

  // decide the scrollView style override
  const scrollStyles: ViewStyle[] = [styles.carousel]
  if (fullScreen) {
    scrollStyles.push({ width: screenWidth, height: screenHeight })
  }

  return (
    <View
      style={containerStyles}
      onLayout={fullScreen ? undefined : onContainerLayout}
    >
      <Animated.ScrollView
        ref={scrollRef}
        horizontal
        pagingEnabled
        scrollEventThrottle={16}
        showsHorizontalScrollIndicator={false}
        onScroll={onScroll}
        style={scrollStyles}
      >
        {images.map((uri, index) => (
          <Animated.View
            key={index}
            style={{
              width: fullScreen ? screenWidth : containerWidth,
              height: fullScreen ? screenHeight : containerWidth,
            }}
          >
            <Card
              style={styles.card}
              elevation={4}
              onPress={() => onImagePress?.(index)}
            >
              <Card.Cover
                source={{ uri }}
                style={styles.image}
                accessibilityRole="imagebutton"
                accessibilityLabel={`Image ${index + 1} of ${images.length}`}
              />
            </Card>
          </Animated.View>
        ))}
      </Animated.ScrollView>

      {images.length > 1 && (
        <View style={styles.carouselNavigation}>
          <IconButton
            style={styles.carouselNavigationButton}
            icon={() => (
              <MaterialIcons
                name="navigate-before"
                size={32}
                color={theme.colors.onPrimary}
              />
            )}
            onPress={() => handleChangeImage("before")}
            disabled={images.length < 2}
          />
          <IconButton
            style={styles.carouselNavigationButton}
            icon={() => (
              <MaterialIcons
                name="navigate-next"
                size={32}
                color={theme.colors.onPrimary}
              />
            )}
            onPress={() => handleChangeImage("next")}
            disabled={images.length < 2}
          />
        </View>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  carouselContainer: {
    position: "relative",
  },
  carousel: {
    // default square aspect
    aspectRatio: 1,
  },
  card: {
    width: "100%",
    height: "100%",
  },
  image: {
    width: "100%",
    height: "100%",
  },
  carouselNavigation: {
    position: "absolute",
    inset: 0,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  carouselNavigationButton: {
    backgroundColor: "rgba(0,0,0,0.1)",
  },
})
