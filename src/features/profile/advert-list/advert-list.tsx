import { FlatList, View, StyleSheet } from "react-native"
import { MD3Theme, Text, useTheme } from "react-native-paper"
import { useAdvertList, useAdvertListInfinite } from "./queries"
import { ActivityIndicator } from "react-native-paper"
import { AdvertCard } from "@/src/components/advert-card/advert-card"
import { useCallback, useEffect, useMemo } from "react"
import { Advert } from "@/src/api/types"

export const AdvertList = () => {
  const {
    data,
    isLoading,
    isError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useAdvertListInfinite()

  const theme = useTheme()
  const styles = createStyles(theme)

  const renderItem = useCallback(
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
    <FlatList
      key={"advert-list"}
      data={flatData}
      keyExtractor={keyExtractor}
      renderItem={renderItem}
      onEndReached={() => {
        if (hasNextPage) fetchNextPage()
      }}
      ListFooterComponent={
        isFetchingNextPage ? <ActivityIndicator style={styles.footer} /> : null
      }
      contentContainerStyle={{
        gap: 16,
        marginBlockStart: 16,
      }}
      initialNumToRender={5}
      maxToRenderPerBatch={5}
      windowSize={5}
      showsVerticalScrollIndicator={false}
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
    content: {},
    footer: {
      // marginVertical: 16,
    },
  })
