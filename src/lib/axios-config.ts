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

    // body → snake_case
    if (config.data && config.method?.toLowerCase() !== "get") {
      config.data = snakecaseKeys(config.data, { deep: true })
    }

    // query → snake_case
    if (config.params) {
      config.params = snakecaseKeys(config.params, { deep: true })
    }

    return config
  },
  (error) => Promise.reject(error)
)

api.interceptors.response.use(async (response) => {
  if (response.data) {
    // convert data to camel case
    response.data = camelcaseKeys(response.data, { deep: true })
    response.headers = camelcaseKeys(response.headers, { deep: false })
  }
  return response
})
