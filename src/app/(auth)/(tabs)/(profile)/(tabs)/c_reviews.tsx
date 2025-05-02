import { UserReviewList } from "@/src/features/profile/components/user-review-list/user-review-card"
import { useUserProfile } from "@/src/features/profile/services/queries"
export default function UserReviewScreen() {
  const userProfileQuery = useUserProfile()
  return <UserReviewList userId={userProfileQuery?.data?.id} />
}
