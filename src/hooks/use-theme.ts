import { useKV } from '@github/spark/hooks'
import { useEffect } from 'react'

type Theme = 'light' | 'dark'

export function useTheme() {
  const [theme, setTheme] = useKV<Theme>('theme', 'light')

  useEffect(() => {
    const root = document.documentElement
    if (theme) {
      root.classList.remove('light', 'dark')
      root.classList.add(theme)
    }
  }, [theme])

  const toggleTheme = () => {
    setTheme((currentTheme) => currentTheme === 'light' ? 'dark' : 'light')
  }

  return { theme: theme || 'light', setTheme, toggleTheme }
}
