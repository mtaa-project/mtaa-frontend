import { auth } from "@/firebase-config"
import { View } from "react-native"
import { Text } from "react-native-paper"

export const FavoriteListings = () => {
    const user = auth.currentUser

    return (
        <View>
            <Text>Welcome back {user?.email}</Text>
        </View>
    )
}