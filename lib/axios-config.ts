import axios from "axios"

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
    return config
  },
  (error) => Promise.reject(error)
)
