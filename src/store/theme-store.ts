import { MD3DarkTheme, MD3LightTheme, MD3Theme } from "react-native-paper"
import { create } from "zustand"
import { Appearance } from "react-native"

interface ThemeStore {
  theme: MD3Theme
  setTheme(theme: MD3Theme): void
  toggleTheme(): void
}

const colorScheme = Appearance.getColorScheme()
const defaultTheme = colorScheme === "dark" ? MD3DarkTheme : MD3LightTheme

const useThemeStore = create<ThemeStore>((set, get) => ({
  theme: defaultTheme,
  setTheme: (theme: MD3Theme) => set(() => ({ theme })),
  toggleTheme: () => {
    const currentTheme = get().theme
    const newTheme =
      currentTheme === MD3DarkTheme ? MD3LightTheme : MD3DarkTheme
    return set(() => ({ theme: newTheme }))
  },
}))

export default useThemeStore
