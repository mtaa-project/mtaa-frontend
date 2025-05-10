import { MD3LightTheme, Switch } from "react-native-paper"

import useThemeStore from "@/src/store/theme-store"

export const ThemeSwitchButton = () => {
  const currentDeviceTheme = useThemeStore((store) => store.theme)
  const toggleTheme = useThemeStore((store) => store.toggleTheme)
  const handleToggleTheme = () => {
    toggleTheme()
  }

  return (
    <Switch
      value={currentDeviceTheme === MD3LightTheme}
      onValueChange={handleToggleTheme}
      accessibilityLabel="Toggle theme"
      accessibilityHint="Switch between light and dark mode for the application"
    />
  )
}
