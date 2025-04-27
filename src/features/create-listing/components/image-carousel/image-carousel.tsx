import MaterialIcons from "@expo/vector-icons/MaterialIcons"
import { ImagePickerAsset } from "expo-image-picker"
import React, { useState } from "react"
import {
  LayoutChangeEvent,
  View,
  StyleSheet,
  Alert,
  Pressable,
} from "react-native"
import {
  Card,
  IconButton,
  Text,
  TouchableRipple,
  useTheme,
  MD3Theme,
} from "react-native-paper"
import Animated, {
  useSharedValue,
  useAnimatedRef,
  useAnimatedScrollHandler,
  scrollTo,
  runOnUI,
} from "react-native-reanimated"

type CarouselActionButtonType = "before" | "next"

type ImageCarouselProps = {
  selectedImages: ImagePickerAsset[]
  pickImage: () => Promise<void>
}

export const ImageCarousel: React.FC<ImageCarouselProps> = ({
  selectedImages,
  pickImage,
}) => {
  const theme = useTheme() as MD3Theme

  const [containerWidth, setContainerWidth] = useState(0)
  const translateX = useSharedValue(0)
  const currentIndex = useSharedValue(0)
  const scrollRef = useAnimatedRef<Animated.ScrollView>()

  const handleChangeImage = (buttonType: CarouselActionButtonType) => {
    let increment = buttonType === "before" ? -1 : 1

    if (
      currentIndex.value + increment < 0 ||
      currentIndex.value + increment > selectedImages.length
    ) {
      return
    }

    runOnUI(() => {
      "worklet"
      const next = currentIndex.value + increment
      scrollTo(scrollRef, next * containerWidth, 0, true)
    })()
  }

  const onScroll = useAnimatedScrollHandler({
    onScroll: (e) => {
      translateX.value = e.contentOffset.x
      currentIndex.value = Math.round(e.contentOffset.x / containerWidth)
    },
  })

  const onContainerLayout = (e: LayoutChangeEvent) => {
    setContainerWidth(e.nativeEvent.layout.width)
  }

  return (
    <View style={styles.carouselContainer} onLayout={onContainerLayout}>
      <Animated.ScrollView
        ref={scrollRef}
        onScroll={onScroll}
        style={styles.carousel}
        horizontal
        pagingEnabled
        scrollEventThrottle={16}
      >
        {selectedImages.length === 0 ? (
          <TouchableRipple
            style={[
              styles.emptyStateContainer,
              { backgroundColor: theme.colors.surfaceVariant },
            ]}
            onPress={pickImage}
            accessibilityRole="button"
            accessibilityLabel="Add photos"
            accessibilityHint="Opens the gallery to select one or more photos"
            borderless
          >
            <View style={{ alignItems: "center" }}>
              <MaterialIcons
                name="add-a-photo"
                size={48}
                color={theme.colors.onSurfaceVariant}
              />
              <Text
                variant="titleMedium"
                style={[
                  styles.emptyStateTitle,
                  { color: theme.colors.onSurface },
                ]}
              >
                Add photos
              </Text>
              <Text
                variant="bodySmall"
                style={[
                  styles.emptyStateSubtitle,
                  { color: theme.colors.onSurfaceVariant },
                ]}
              >
                Tap to pick up images
              </Text>
            </View>
          </TouchableRipple>
        ) : (
          selectedImages.map((image, index) => (
            <Animated.View key={index}>
              <Card style={styles.card} elevation={4}>
                <Card.Cover
                  source={{ uri: image.uri }}
                  style={styles.image}
                  accessibilityRole="image"
                  accessibilityLabel={`Image ${index + 1} of ${selectedImages.length}`}
                />
              </Card>
            </Animated.View>
          ))
        )}
      </Animated.ScrollView>

      <View style={styles.carouselNavigation}>
        <IconButton
          disabled={selectedImages.length === 0}
          style={[styles.carouselNavigationButton]}
          icon={() => (
            <MaterialIcons
              name="navigate-before"
              size={24}
              color={theme.colors.onPrimary}
            />
          )}
          onPress={() => handleChangeImage("before")}
          accessibilityLabel="Previous image"
          accessibilityHint="Moves to the previous image in the carousel"
        />
        <IconButton
          disabled={selectedImages.length === 0}
          style={[styles.carouselNavigationButton]}
          icon={() => (
            <MaterialIcons
              name="navigate-next"
              size={24}
              color={theme.colors.onPrimary}
            />
          )}
          onPress={() => handleChangeImage("next")}
          accessibilityLabel="Next image"
          accessibilityHint="Moves to the next image in the carousel"
        />
      </View>
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
    backgroundColor: "rgba(0,0,0,0.4)", // toto môžeš nechať takéto ak chceš semi-transparentné
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
  emptyStateContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 16,
    aspectRatio: 1 / 1,
  },
  emptyStateTitle: {
    marginTop: 8,
  },
  emptyStateSubtitle: {},
})
