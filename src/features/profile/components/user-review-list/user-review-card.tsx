import FontAwesome from "@expo/vector-icons/FontAwesome"
import { useRouter } from "expo-router"
import { Profiler, useCallback } from "react"
import { FlatList, StyleSheet, View } from "react-native"
import {
  ActivityIndicator,
  Avatar,
  Button,
  type MD3Theme,
  Text,
  useTheme,
} from "react-native-paper"

import { type Review } from "@/src/api/types"

import { useUserReviews } from "../../services/queries"

interface Props {
  userId?: number
}

export const UserReviewList: React.FC<Props> = ({ userId }) => {
  const theme = useTheme()
  const styles = createStyles(theme)

  const userReviewsQuery = useUserReviews(userId)
  const router = useRouter()
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
        <Button
          onPress={() =>
            router.push({
              pathname: "/(auth)/listings/[id]/edit/[step]/edit-listing",
              params: { id: "224", step: "0" },
            })
          }
        >
          asd
        </Button>
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
          flex: 1,
          paddingBottom: 16,
          gap: 16,
          paddingBlock: 12,
          backgroundColor: theme.colors.onSecondary,
        }}
        ListEmptyComponent={
          userReviewsQuery.isLoading ? (
            <ActivityIndicator size="large" />
          ) : (
            <View style={styles.emptyReviewContainer}>
              <Text variant="bodyLarge" style={styles.emptyReviewText}>
                You haven’t received any reviews yet.
              </Text>
            </View>
          )
        }
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
    emptyReviewContainer: {
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
    },
    emptyReviewText: {
      // alignSelf: "center",
    },
  })
