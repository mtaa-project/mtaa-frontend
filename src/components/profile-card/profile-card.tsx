import { StyleSheet, View } from "react-native"
import { Avatar, MD3Theme, Text, useTheme } from "react-native-paper"
import Entypo from "@expo/vector-icons/Entypo"
import EvilIcons from "@expo/vector-icons/EvilIcons"
import { useUserProfile } from "@/src/features/profile/services/queries"
interface Props {
  userId?: number
}

export const ProfileCard: React.FC<Props> = ({ userId }) => {
  const theme = useTheme()
  const styles = createStyles(theme)

  const userProfileQuery = useUserProfile(userId)

  if (userProfileQuery.isError) {
    return (
      <View>
        <Text>Could not load user profile</Text>
      </View>
    )
  }

  return (
    <View style={styles.container}>
      <Avatar.Image
        size={60}
        source={{
          uri: "https://images.unsplash.com/photo-1502685104226-ee32379fefbe?&w=200&h=200&crop=faces&fit=crop",
        }}
      />
      <View style={styles.userInfoContainer}>
        <Text variant="labelLarge">
          {userProfileQuery.data?.firstname} {userProfileQuery.data?.lastname}
        </Text>
        <View style={[styles.row, { flexWrap: "wrap" }]}>
          <Entypo name="location-pin" size={24} color="black" />
          <Text variant="bodyMedium">
            {userProfileQuery.data?.address.city}
          </Text>
        </View>
        <View style={styles.row}>
          <EvilIcons name="star" size={24} color="black" />
          <Text variant="bodyMedium">
            {userProfileQuery.data?.rating ?? 0} / 5
          </Text>
        </View>
      </View>
    </View>
  )
}

const createStyles = (theme: MD3Theme) =>
  StyleSheet.create({
    container: {
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
      gap: 2,
    },
    row: {
      flexDirection: "row",
      gap: 4,
      alignItems: "center",
    },
  })
