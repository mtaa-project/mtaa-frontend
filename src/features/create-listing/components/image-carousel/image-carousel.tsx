import MaterialIcons from "@expo/vector-icons/MaterialIcons"
import { ImagePickerAsset } from "expo-image-picker"
import React, { useState } from "react"
import { LayoutChangeEvent, View, StyleSheet, Alert } from "react-native"
import { Card, IconButton, Text } from "react-native-paper"
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
}

// Docs: https://docs.swmansion.com/react-native-reanimated/docs/scroll/scrollTo
export const ImageCarousel: React.FC<ImageCarouselProps> = ({
  selectedImages,
}) => {
  const [containerWidth, setContainerWidth] = React.useState(0)

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

  // Update the width of an carousel container
  const onContainerLayout = (e: LayoutChangeEvent) => {
    // {nativeEvent: { layout: {x, y, width, height}}}.
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
        // ako daleko musim potiahnut aby sas selectol novy image
        scrollEventThrottle={16}
      >
        {selectedImages.length === 0 ? (
          <View>
            <Text>No Images</Text>
          </View>
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
          style={styles.carouselNavigationButton}
          icon={() => (
            <MaterialIcons name="navigate-before" size={24} color="black" />
          )}
          onPress={() => handleChangeImage("before")}
          accessibilityLabel="Previous image"
          accessibilityHint="Moves to the previous image in the carousel"
        />
        <IconButton
          disabled={selectedImages.length === 0}
          style={styles.carouselNavigationButton}
          icon={() => (
            <MaterialIcons name="navigate-next" size={24} color="black" />
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
    backgroundColor: "rgba(0,0,0,0.4)",
  },

  image: {
    width: "100%",
    height: "100%",
    alignSelf: "center",
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
  },

  addPhotosContainer: {
    backgroundColor: "#F5F5F5",
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    // borderWidth: 2,
    borderColor: "red",
  },

  title: {
    paddingInline: 24,
    paddingBlock: 24,
    backgroundColor: "red",
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

  callToAction: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    position: "absolute",
    margin: "auto",
    width: "100%",
    height: "100%",
  },

  addPhotoText: {
    color: "red",
  },
  note: {
    alignSelf: "flex-end",
    marginTop: "auto",
    color: "#666",
  },
})
