import { z } from "zod"

const envSchema = z.object({
  EXPO_PUBLIC_DEVICE_IP: z.string().url(),
  EXPO_PUBLIC_ANDROID_CLIENT_ID: z.string(),
  EXPO_PUBLIC_IOS_CLIENT_ID: z.string(),
  EXPO_PUBLIC_WEB_CLIENT_ID: z.string(),
})

let env: z.infer<typeof envSchema>

try {
  env = envSchema.parse({
    EXPO_PUBLIC_DEVICE_IP: process.env.EXPO_PUBLIC_DEVICE_IP,
    EXPO_PUBLIC_ANDROID_CLIENT_ID: process.env.EXPO_PUBLIC_ANDROID_CLIENT_ID,
    EXPO_PUBLIC_IOS_CLIENT_ID: process.env.EXPO_PUBLIC_IOS_CLIENT_ID,
    EXPO_PUBLIC_WEB_CLIENT_ID: process.env.EXPO_PUBLIC_WEB_CLIENT_ID,
  })
} catch (error) {
  if (error instanceof z.ZodError) {
    console.error(
      "⚠️ Invalid environment variables:",
      error.flatten().fieldErrors
    )
  }
  throw new Error("Invalid environment configuration. Check your .env file.")
}

export { env }
