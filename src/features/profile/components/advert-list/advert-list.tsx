import { useCallback, useMemo } from "react"
import { StyleSheet, View } from "react-native"
import { type MD3Theme, Text, useTheme } from "react-native-paper"
import { ActivityIndicator } from "react-native-paper"
import Animated, { LinearTransition } from "react-native-reanimated"

import { type Advert } from "@/src/api/types"
import { AdvertCard } from "@/src/components/advert-card/advert-card"
import { AnimatedCard } from "@/src/components/animated/animated-card"
import { useScrollExtension } from "@/src/hooks/use-scroll-extension"

import { useAdvertListInfinite } from "./queries"

export const AdvertList = () => {
  const {
    data,
    isLoading,
    isError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useAdvertListInfinite()
  const { isExtended, onScroll } = useScrollExtension(10)

  const theme = useTheme()
  const styles = createStyles(theme)

  const renderItemCard = useCallback(
    ({ item }: { item: Advert }) => <AdvertCard advert={item} />,
    []
  )
  const keyExtractor = useCallback((item: Advert) => item.id.toString(), [])

  // Merge all pages into one array
  const flatData = useMemo<Advert[]>(
    () => data?.pages.flat() ?? [],
    [data?.pages]
  )

  // if (isLoading) {
  //   return <ActivityIndicator style={styles.center} />
  // }
  // if (isError) {
  //   return <Text style={styles.center}>Unable to load adverts</Text>
  // }

  return (
    <Animated.FlatList
      key={"advert-list"}
      data={flatData}
      keyExtractor={keyExtractor}
      renderItem={({ item }) => (
        <AnimatedCard isActive={true}>
          <AdvertCard advert={item} />
        </AnimatedCard>
      )}
      onEndReached={() => {
        if (hasNextPage) fetchNextPage()
      }}
      ListFooterComponent={
        isFetchingNextPage ? <ActivityIndicator style={styles.footer} /> : null
      }
      ListEmptyComponent={
        isLoading ? (
          <View style={styles.emptyContainer}>
            <ActivityIndicator size={"large"} />
            <Text variant="bodyLarge">Loading...</Text>
          </View>
        ) : (
          <Text variant="bodySmall">No reviews found.</Text>
        )
      }
      contentContainerStyle={{
        gap: 16,
        paddingBlock: 16,
      }}
      initialNumToRender={5}
      maxToRenderPerBatch={5}
      windowSize={5}
      showsVerticalScrollIndicator={false}
      // required props for animation
      itemLayoutAnimation={LinearTransition}
      onScroll={onScroll}
      scrollEventThrottle={16}
    />
  )
}

const createStyles = (theme: MD3Theme) =>
  StyleSheet.create({
    center: {
      flex: 1,
      backgroundColor: theme.colors.background,

      justifyContent: "center",
      alignItems: "center",
    },
    emptyContainer: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      gap: 16,
      // Use a theme color for background
      backgroundColor: theme.colors.background,
    },
    content: {},
    footer: {
      // marginVertical: 16,
    },
  })
