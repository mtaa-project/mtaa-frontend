import { api } from "../lib/axios-config"
import { type Category } from "./types"

export const apiGetCategories = async (): Promise<Category[]> => {
  const response = await api.get("/categories")
  return response.data
}
