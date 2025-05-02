import { useUserProfile } from "@/src/features/profile/services/queries"
import { UserReviewList } from "@/src/features/profile/user-review-list/user-review-card"
export default function UserReviewScreen() {
  const userProfileQuery = useUserProfile()
  return <UserReviewList userId={userProfileQuery?.data?.id} />
}
