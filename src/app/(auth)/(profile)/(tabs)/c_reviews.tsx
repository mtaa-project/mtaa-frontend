import { useUserProfile } from "@/src/features/profile/queries"
import { UserReviewList } from "@/src/features/profile/user-review-list/user-review-card"
import { Text } from "react-native-paper"
export default function UserReviewScreen() {
  const userProfileQuery = useUserProfile()
  return <UserReviewList userId={userProfileQuery?.data?.id} />
}
