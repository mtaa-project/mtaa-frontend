import { FlatList, StyleSheet, View } from "react-native"
import { Avatar, MD3Theme, Text, useTheme } from "react-native-paper"
import FontAwesome from "@expo/vector-icons/FontAwesome"
import { useUserReviews } from "./queries"
import { Review } from "@/src/api/types"
import { Profiler, useCallback } from "react"

interface Props {
  userId?: number
}

export const UserReviewList: React.FC<Props> = ({ userId }) => {
  const theme = useTheme()
  const styles = createStyles(theme)

  const userReviewsQuery = useUserReviews(userId)

  // if (userReviewsQuery.isError) {
  //   return <View>Could not load user profile</View>
  // }
  // if (userReviewsQuery.isError) {
  //   return <View></View>
  // }
  const keyExtractor = useCallback(
    (item: Review, index: number) => `${item.reviewer.id}-${index}`,
    []
  )
  const onRender: React.ProfilerOnRenderCallback = (_id, phase, actualTime) => {
    console.log(`UserReviewList [${phase}] render=${actualTime.toFixed(2)}ms`)
  }

  const USER_MAX_RATING = 5
  const PROFILE_IMAGE_URI =
    "https://images.unsplash.com/photo-1502685104226-ee32379fefbe?&w=200&h=200&crop=faces&fit=crop"
  const renderItem = useCallback(({ item }: { item: Review }) => {
    return (
      <View style={styles.container}>
        <Avatar.Image
          size={60}
          source={{
            uri: PROFILE_IMAGE_URI + `&sig=${item.reviewer.id}`,
          }}
        />
        <View style={styles.userInfoContainer}>
          <Text variant="labelLarge">
            {item.reviewer.firstname} {item.reviewer.lastname}
          </Text>
          <View style={styles.row}>
            {Array.from({ length: USER_MAX_RATING }, (_, index) => (
              <FontAwesome
                key={index}
                name={index < item.rating ? "star" : "star-o"}
                size={20}
                color="black"
              />
            ))}
          </View>
        </View>
      </View>
    )
  }, [])

  return (
    <Profiler id="UserReviewList" onRender={onRender}>
      <FlatList
        key={"review-list"}
        data={userReviewsQuery.data ?? []}
        keyExtractor={keyExtractor}
        renderItem={renderItem}
        contentContainerStyle={{
          paddingBottom: 16,
          gap: 16,
          paddingBlock: 12,
          backgroundColor: theme.colors.onSecondary,
        }}
        initialNumToRender={5}
        maxToRenderPerBatch={5}
        windowSize={5}
      />
    </Profiler>
  )
}

const createStyles = (theme: MD3Theme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      flexDirection: "row",
      gap: 8,
      alignItems: "center",
      backgroundColor: theme.colors.surfaceVariant,
      paddingBlock: 12,
      paddingInline: 14,
      borderRadius: 12,
    },
    userInfoContainer: {
      flexDirection: "column",
      gap: 6,
    },
    row: {
      flexDirection: "row",
      gap: 4,
      alignItems: "center",
    },
  })
