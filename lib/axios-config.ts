import axios from "axios"
import camelcaseKeys from "camelcase-keys"
import snakecaseKeys from "snakecase-keys"

import { auth } from "@/firebase-config"

export const api = axios.create({
  baseURL: process.env.EXPO_PUBLIC_DEVICE_IP,
})

api.interceptors.request.use(
  async (config) => {
    const token = await auth.currentUser?.getIdToken()
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    if (config.data && config.method !== "get") {
      config.data = snakecaseKeys(config.data, { deep: true })
    }
    return config
  },
  (error) => Promise.reject(error)
)

api.interceptors.request.use(async (response) => {
  if (response.data) {
    response.data = camelcaseKeys(response.data, { deep: true })
  }
  return response
})
