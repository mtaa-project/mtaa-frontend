export default {
  expo: {
    name: "MTAA Frontend",
    slug: "mtaa-frontend",
    version: "1.0.0",
    orientation: "portrait",
    icon: "./src/assets/images/icon.png",
    scheme: ["mtaa-frontend"],
    userInterfaceStyle: "automatic",
    newArchEnabled: true,
    splash: {
      image: "./src/assets/images/splash-icon.png",
      resizeMode: "contain",
      backgroundColor: "#ffffff",
    },
    ios: {
      supportsTablet: true,
      bundleIdentifier: "com.svato.mtaafrontend",
    },
    android: {
      adaptiveIcon: {
        foregroundImage: "./src/assets/images/adaptive-icon.png",
        backgroundColor: "#ffffff",
      },
      googleServicesFile: "./google-services.json",
      package: "com.svato.mtaafrontend",
    },
    web: {
      bundler: "metro",
      output: "static",
      favicon: "./src/assets/images/favicon.png",
    },
    plugins: [
      "expo-router",
      [
        "react-native-fbsdk-next",
        {
          appID: process.env.EXPO_PUBLIC_FACEBOOK_APP_ID,
          clientToken: process.env.EXPO_PUBLIC_FACEBOOK_CLIENT_TOKEN,
          displayName: process.env.EXPO_PUBLIC_FACEBOOK_DISPLAY_NAME,
          scheme: "mtaa-app",
        },
      ],
    ],
    experiments: {
      typedRoutes: true,
    },
  },
}
