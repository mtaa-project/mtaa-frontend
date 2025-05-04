import MaterialIcons from "@expo/vector-icons/MaterialIcons"
import React, { useState } from "react"
import { LayoutChangeEvent, View, StyleSheet, ViewStyle } from "react-native"
import { Card, IconButton, useTheme, MD3Theme } from "react-native-paper"
import Animated, {
  useSharedValue,
  useAnimatedRef,
  useAnimatedScrollHandler,
  scrollTo,
  runOnUI,
} from "react-native-reanimated"

type CarouselActionButtonType = "before" | "next"

type ImageCarouselProps = {
  /** Pole URL/URI obrázkov na zobrazenie. */
  images: string[]
  /** Nepovinné doplnkové štýly kontejnera. */
  style?: ViewStyle
}

export const ImageCarouselChat: React.FC<ImageCarouselProps> = ({
  images,
  style,
}) => {
  const theme = useTheme() as MD3Theme

  const [containerWidth, setContainerWidth] = useState(0)
  const currentIndex = useSharedValue(0)
  const scrollRef = useAnimatedRef<Animated.ScrollView>()

  const handleChangeImage = (buttonType: CarouselActionButtonType) => {
    "worklet"
    const increment = buttonType === "before" ? -1 : 1

    if (
      currentIndex.value + increment < 0 ||
      currentIndex.value + increment > images.length - 1
    ) {
      return
    }

    runOnUI(() => {
      const next = currentIndex.value + increment
      scrollTo(scrollRef, next * containerWidth, 0, true)
    })()
  }

  const onScroll = useAnimatedScrollHandler({
    onScroll: (e) => {
      currentIndex.value = Math.round(e.contentOffset.x / containerWidth)
    },
  })

  const onContainerLayout = (e: LayoutChangeEvent) =>
    setContainerWidth(e.nativeEvent.layout.width)

  return (
    <View
      style={[styles.carouselContainer, style]}
      onLayout={onContainerLayout}
    >
      <Animated.ScrollView
        ref={scrollRef}
        onScroll={onScroll}
        style={styles.carousel}
        horizontal
        pagingEnabled
        scrollEventThrottle={16}
        showsHorizontalScrollIndicator={false}
      >
        {images.map((uri, index) => (
          <Animated.View key={index} style={{ width: containerWidth }}>
            <Card style={styles.card} elevation={4}>
              <Card.Cover
                source={{ uri }}
                style={styles.image}
                accessibilityRole="image"
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
            disabled={images.length === 0}
            onPress={() => handleChangeImage("before")}
            accessibilityLabel="Previous image"
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
            disabled={images.length === 0}
            onPress={() => handleChangeImage("next")}
            accessibilityLabel="Next image"
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
  carouselNavigation: {
    position: "absolute",
    inset: 0,
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  carouselNavigationButton: {
    backgroundColor: "rgba(0,0,0,0.1)",
  },
  image: {
    width: "100%",
    height: "100%",
    alignSelf: "center",
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
  },
  carousel: {
    aspectRatio: 1 / 1,
  },
  card: {
    width: "100%",
    height: "100%",
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
    aspectRatio: 1 / 1,
  },
})
