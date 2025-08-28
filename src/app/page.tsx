'use client'

import { Box, CircularProgress, ThemeProvider, Typography, createTheme } from '@mui/material'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: { main: '#f59e0b' },
    secondary: { main: '#10b981' },
    background: { default: '#0f172a', paper: '#1e293b' },
    text: { primary: '#f1f5f9', secondary: '#cbd5e1' },
  },
})

export default function HomePage() {
  const router = useRouter()

  useEffect(() => {
    // Check if user is already logged in
    const isLoggedIn = localStorage.getItem('isLoggedIn')
    const userData = localStorage.getItem('userData')
    
    if (isLoggedIn === 'true' || userData) {
      // Redirect to dashboard if logged in
      router.push('/dashboard')
    } else {
      // Redirect to login if not logged in
      router.push('/login')
    }
  }, [router])

  return (
    <ThemeProvider theme={theme}>
      <Box 
        sx={{ 
          bgcolor: 'background.default', 
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 3
        }}
      >
        <CircularProgress size={60} sx={{ color: 'primary.main' }} />
        <Typography variant="h6" sx={{ color: 'text.primary' }}>
          Loading Ganapathy Timbers...
        </Typography>
        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
          Redirecting you to the appropriate page
        </Typography>
      </Box>
    </ThemeProvider>
  )
}
