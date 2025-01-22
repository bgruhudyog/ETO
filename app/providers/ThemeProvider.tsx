// app/providers/ThemeProvider.tsx
'use client'

import { createTheme, ThemeProvider as MUIThemeProvider, CssBaseline } from '@mui/material'
import { createContext, useContext, useEffect, useState } from 'react'

type ThemeContextType = {
  toggleTheme: () => void
  mode: 'light' | 'dark'
}

const ThemeContext = createContext<ThemeContextType>({
  toggleTheme: () => {},
  mode: 'light'
})

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const [mode, setMode] = useState<'light' | 'dark'>('light')

  useEffect(() => {
    const savedMode = localStorage.getItem('theme') as 'light' | 'dark'
    if (savedMode) {
      setMode(savedMode)
    }
  }, [])

  const theme = createTheme({
    palette: {
      mode,
      primary: {
        main: '#1976d2',
      },
      secondary: {
        main: '#9c27b0',
      },
    },
  })

  const toggleTheme = () => {
    const newMode = mode === 'light' ? 'dark' : 'light'
    setMode(newMode)
    localStorage.setItem('theme', newMode)
  }

  return (
    <ThemeContext.Provider value={{ toggleTheme, mode }}>
      <MUIThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </MUIThemeProvider>
    </ThemeContext.Provider>
  )
}

export const useTheme = () => useContext(ThemeContext)