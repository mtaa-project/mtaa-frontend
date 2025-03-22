import axios from "axios"
import camelcaseKeys from "camelcase-keys"
import snakecaseKeys from "snakecase-keys"

import { auth } from "@/firebase-config"
import { env } from "@/src/lib/env"

export const api = axios.create({
  baseURL: env.EXPO_PUBLIC_DEVICE_IP,
})

api.interceptors.request.use(
  async (config) => {
    const token = await auth.currentUser?.getIdToken()
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    // convert data to snake case
    if (config.data && config.method !== "get") {
      config.data = snakecaseKeys(config.data, { deep: true })
    }
    return config
  },
  (error) => Promise.reject(error)
)

api.interceptors.request.use(async (response) => {
  if (response.data) {
    // convert data to camel case
    response.data = camelcaseKeys(response.data, { deep: true })
  }
  return response
})
