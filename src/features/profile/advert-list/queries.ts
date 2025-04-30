import { useQuery } from "@tanstack/react-query"
import { apiGetAdvertList, apiGetAdvertListPaginated } from "../api"
import { useInfiniteQuery } from "@tanstack/react-query"
import { Advert } from "@/src/api/types"

// "title": "No vote majority word behavior they.",
// "description": "Government thus...",
// "price": "597.90",
// "listing_status": "hidden",
// "offer_type": "rent",
// "id": 202,
// "image_path": "https://storage.googleapis.com/mtaa-project-5235a.firebasestorage.app/user_uploads/NrVkdG2xBcTk14ejuq3atkwNrpt1/1744491829418-1000001431.jpg?X-Goog-Algorithm=GOOG4-RSA-SHA256&X-Goog-Credential=firebase-adminsdk-fbsvc%40mtaa-project-5235a.iam.gserviceaccount.com%2F20250426%2Fauto%2Fstorage%2Fgoog4_request&X-Goog-Date=20250426T180721Z&X-Goog-Expires=3600&X-Goog-SignedHeaders=host&X-Goog-Signature=2fd5f22e1dc898d02b8e4c361d9dc8bac6fafb1eb8a76b63acb29d207f4d3e0fa272cac52cb2f262656438fb1d38529a421c4bf0d8825bfaacbb1ca986eaf438699c39ebcf6b3dacf3fa5413b00678c12e2b7820d30ff70420b96b043a119e24da9a27b35045a19bd484e376d8fe3a13717a14f8caebbd1c506faa5f5b5709bf74415a53fb3b10c487e8bd4f65ce4f83d7b87cb6cb9712e374b32c22fac31713f220422027f3547c9bba4378665fe9c183da58e216333478e8c07e321008540d4d782fc34c108ef4d3adc6abe1197502ce0a6d137de7aac5e1a0e05d719134213ac5231b421aade0333424c0ddc754ccc97ada5231472ccc82ae3170579f77b8"

export const useAdvertList = () => {
  return useQuery({
    queryKey: ["profile", "adverts"],
    queryFn: () => apiGetAdvertList(),
  })
}

// src/features/profile/advert-list/queries.ts

export const useAdvertListInfinite = () => {
  return useInfiniteQuery({
    queryKey: ["profile", "adverts"],
    queryFn: apiGetAdvertListPaginated,
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages, lastPageParam) => {
      if (lastPage.length === 0) {
        return undefined
      }
      return lastPageParam + 1
    },
    // getPreviousPageParam: (firstPage, allPages, firstPageParam) => {
    //   if (firstPageParam <= 1) {
    //     return undefined
    //   }
    //   return firstPageParam - 1
    // },
    staleTime: 1000 * 60 * 5,
  })
}
