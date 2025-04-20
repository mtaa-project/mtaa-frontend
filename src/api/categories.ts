import { api } from "../lib/axios-config"
import { Category } from "./types"

export const apiGetCategories = async (): Promise<Category[]> => {
  const response = await api.get("/categories")
  return response.data
}
