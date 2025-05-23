import { auth } from "@/firebase-config"
import { FavoriteListings } from "@/src/features/favorites/favorite-screen"

export default function FavoriteScreen() {
    const user = auth.currentUser
    
    return (
        <FavoriteListings/> // This is a placeholder for the actual component
    )
  }
  