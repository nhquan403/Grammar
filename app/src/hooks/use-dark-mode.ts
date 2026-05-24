import { useState, useEffect, useCallback } from 'react'

const STORAGE_KEY = 'vocab-theme'

type Theme = 'light' | 'dark' | 'system'

function getSystemPrefersDark() {
  return window.matchMedia('(prefers-color-scheme: dark)').matches
}

function getStoredTheme(): Theme {
  return (localStorage.getItem(STORAGE_KEY) as Theme) ?? 'system'
}

function applyTheme(theme: Theme) {
  const isDark = theme === 'dark' || (theme === 'system' && getSystemPrefersDark())
  document.documentElement.classList.toggle('dark', isDark)
}

export function useDarkMode() {
  const [theme, setThemeState] = useState<Theme>(() => getStoredTheme())
  const [isDark, setIsDark] = useState(() => {
    const t = getStoredTheme()
    return t === 'dark' || (t === 'system' && getSystemPrefersDark())
  })

  const setTheme = useCallback((next: Theme) => {
    setThemeState(next)
    localStorage.setItem(STORAGE_KEY, next)
    applyTheme(next)
    setIsDark(next === 'dark' || (next === 'system' && getSystemPrefersDark()))
  }, [])

  const toggle = useCallback(() => {
    setTheme(isDark ? 'light' : 'dark')
  }, [isDark, setTheme])

  // Apply on mount and listen for system changes
  useEffect(() => {
    applyTheme(theme)
    const mq = window.matchMedia('(prefers-color-scheme: dark)')
    const handler = () => {
      if (theme === 'system') {
        setIsDark(mq.matches)
        applyTheme('system')
      }
    }
    mq.addEventListener('change', handler)
    return () => mq.removeEventListener('change', handler)
  }, [theme])

  return { isDark, theme, setTheme, toggle }
}
