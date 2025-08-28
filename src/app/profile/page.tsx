'use client'

import {
  AccountCircle as AccountCircleIcon,
  LocationOn as LocationIcon,
  Security as SecurityIcon,
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon
} from '@mui/icons-material'
import {
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Container,
  createTheme,
  IconButton,
  InputAdornment,
  Tab,
  Tabs,
  TextField,
  ThemeProvider,
  Typography
} from '@mui/material'
import { useEffect, useState } from 'react'
import CommonHeader from '../../components/CommonHeader'
import CommonSidebar from '../../components/CommonSidebar'
import Footer from '../../components/Footer'

// Material UI theme with dark design
const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#f59e0b', // Amber/Orange
      dark: '#d97706',
      light: '#fbbf24'
    },
    secondary: {
      main: '#10b981', // Emerald green
      dark: '#059669',
      light: '#34d399'
    },
    background: {
      default: '#0f172a', // Very dark blue-gray
      paper: '#1e293b'     // Dark blue-gray for cards
    },
    text: {
      primary: '#f8fafc',
      secondary: '#cbd5e1'
    }
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
  },
  components: {
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: '#1e293b',
          borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
        }
      }
    }
  }
})

interface User {
  email: string
  name: string
  displayName: string
}

export default function ProfilePage() {
  const [user, setUser] = useState<User>({ email: '', name: '', displayName: '' })
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [tabValue, setTabValue] = useState(0)
  
  // Profile form data
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('')
  
  // Security form data
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  useEffect(() => {
    // Get user data from localStorage
    const userData = localStorage.getItem('userData')
    if (userData) {
      const parsedUser = JSON.parse(userData)
      setUser(parsedUser)
      
      // Split name into first and last name
      const fullName = parsedUser.name || parsedUser.displayName || ''
      const nameParts = fullName.split(' ')
      setFirstName(nameParts[0] || '')
      setLastName(nameParts.slice(1).join(' ') || '')
      setEmail(parsedUser.email || '') // Set email but don't allow editing
    }
  }, [])

  const handleDrawerOpen = () => setDrawerOpen(true)
  const handleDrawerClose = () => setDrawerOpen(false)
  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => setTabValue(newValue)

  const handleProfileSave = () => {
    // Update user data in localStorage (email stays the same)
    const updatedUser = {
      ...user,
      name: `${firstName} ${lastName}`.trim(),
      displayName: `${firstName} ${lastName}`.trim()
    }
    
    localStorage.setItem('userData', JSON.stringify(updatedUser))
    setUser(updatedUser)
    
    // Show success message (you can implement a snackbar here)
    alert('Profile updated successfully!')
  }

  const handleSecuritySave = () => {
    if (newPassword !== confirmPassword) {
      alert('New password and confirm password do not match!')
      return
    }
    
    if (newPassword.length < 6) {
      alert('Password must be at least 6 characters long!')
      return
    }
    
    // Here you would typically validate current password and update the new one
    // For now, we'll just show a success message
    alert('Password updated successfully!')
    
    // Clear password fields
    setCurrentPassword('')
    setNewPassword('')
    setConfirmPassword('')
  }

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ bgcolor: 'background.default', minHeight: '100vh' }}>
        {/* Common Header */}
        <CommonHeader onDrawerOpen={handleDrawerOpen} />

        {/* Common Sidebar */}
        <CommonSidebar open={drawerOpen} onClose={handleDrawerClose} />

        {/* Main Content */}
        <Container maxWidth="lg" sx={{ py: 3 }}>
          {/* Gradient Header */}
          <Box
            sx={{
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              borderRadius: 3,
              p: 4,
              mb: 3,
              position: 'relative',
              overflow: 'hidden'
            }}
          >
            <Box sx={{ position: 'relative', zIndex: 1 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 3, mb: 2 }}>
                <Avatar
                  sx={{
                    width: 80,
                    height: 80,
                    bgcolor: 'rgba(255, 255, 255, 0.2)',
                    fontSize: '2rem',
                    fontWeight: 'bold',
                    border: '3px solid rgba(255, 255, 255, 0.3)'
                  }}
                >
                  {(user.name || user.displayName || 'U').charAt(0).toUpperCase()}
                </Avatar>
                <Box>
                  <Typography variant="h4" fontWeight={700} sx={{ color: 'white', mb: 1 }}>
                    {user.name || user.displayName || 'User Name'}
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Chip
                      label="Admin"
                      sx={{
                        bgcolor: 'rgba(245, 158, 11, 0.9)',
                        color: 'white',
                        fontWeight: 600
                      }}
                    />
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      <LocationIcon sx={{ fontSize: 16, color: 'rgba(255, 255, 255, 0.8)' }} />
                      <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.8)' }}>
                        India
                      </Typography>
                    </Box>
                  </Box>
                </Box>
              </Box>
            </Box>
          </Box>

          {/* Profile Tabs */}
          <Card sx={{ bgcolor: 'background.paper', borderRadius: 2 }}>
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
              <Tabs
                value={tabValue}
                onChange={handleTabChange}
                sx={{
                  '& .MuiTab-root': {
                    color: 'text.secondary',
                    fontWeight: 600,
                    textTransform: 'none',
                    fontSize: '1rem',
                    '&.Mui-selected': {
                      color: 'primary.main'
                    }
                  }
                }}
              >
                <Tab
                  icon={<AccountCircleIcon />}
                  iconPosition="start"
                  label="Profile"
                  sx={{ px: 3 }}
                />
                <Tab
                  icon={<SecurityIcon />}
                  iconPosition="start"
                  label="Security"
                  sx={{ px: 3 }}
                />
              </Tabs>
            </Box>

            <CardContent sx={{ p: 4 }}>
              {/* Profile Tab Content */}
              {tabValue === 0 && (
                <Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
                    <AccountCircleIcon sx={{ color: 'text.secondary' }} />
                    <Typography variant="h6" fontWeight={600} sx={{ color: 'text.primary' }}>
                      Account Details
                    </Typography>
                  </Box>

                  <Box sx={{ display: 'grid', gap: 3, maxWidth: 600 }}>
                    <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
                      <TextField
                        label="First Name"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        variant="outlined"
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            bgcolor: 'rgba(255, 255, 255, 0.05)',
                            '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.2)' },
                            '&:hover fieldset': { borderColor: 'rgba(255, 255, 255, 0.3)' },
                            '&.Mui-focused fieldset': { borderColor: 'primary.main' }
                          }
                        }}
                      />
                      <TextField
                        label="Last Name"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        variant="outlined"
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            bgcolor: 'rgba(255, 255, 255, 0.05)',
                            '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.2)' },
                            '&:hover fieldset': { borderColor: 'rgba(255, 255, 255, 0.3)' },
                            '&.Mui-focused fieldset': { borderColor: 'primary.main' }
                          }
                        }}
                      />
                    </Box>

                    <TextField
                      label="Email"
                      value={email}
                      variant="outlined"
                      type="email"
                      InputProps={{
                        readOnly: true,
                      }}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          bgcolor: 'rgba(255, 255, 255, 0.02)',
                          '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.1)' },
                          '&:hover fieldset': { borderColor: 'rgba(255, 255, 255, 0.1)' },
                          '&.Mui-focused fieldset': { borderColor: 'rgba(255, 255, 255, 0.1)' }
                        },
                        '& .MuiInputBase-input': {
                          color: 'rgba(255, 255, 255, 0.6)',
                          cursor: 'not-allowed'
                        },
                        '& .MuiInputLabel-root': {
                          color: 'rgba(255, 255, 255, 0.6)'
                        }
                      }}
                    />

                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
                      <Button
                        variant="contained"
                        onClick={handleProfileSave}
                        sx={{
                          bgcolor: 'primary.main',
                          color: 'black',
                          fontWeight: 600,
                          px: 4,
                          py: 1.5,
                          borderRadius: 2,
                          '&:hover': {
                            bgcolor: 'primary.dark'
                          }
                        }}
                      >
                        SAVE
                      </Button>
                    </Box>
                  </Box>
                </Box>
              )}

              {/* Security Tab Content */}
              {tabValue === 1 && (
                <Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
                    <SecurityIcon sx={{ color: 'text.secondary' }} />
                    <Typography variant="h6" fontWeight={600} sx={{ color: 'text.primary' }}>
                      Security Settings
                    </Typography>
                  </Box>

                  <Box sx={{ display: 'grid', gap: 3, maxWidth: 600 }}>
                    <TextField
                      label="Current Password"
                      type={showCurrentPassword ? 'text' : 'password'}
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      variant="outlined"
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton
                              onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                              edge="end"
                              sx={{ color: 'text.secondary' }}
                            >
                              {showCurrentPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                            </IconButton>
                          </InputAdornment>
                        )
                      }}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          bgcolor: 'rgba(255, 255, 255, 0.05)',
                          '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.2)' },
                          '&:hover fieldset': { borderColor: 'rgba(255, 255, 255, 0.3)' },
                          '&.Mui-focused fieldset': { borderColor: 'primary.main' }
                        }
                      }}
                    />

                    <TextField
                      label="New Password"
                      type={showNewPassword ? 'text' : 'password'}
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      variant="outlined"
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton
                              onClick={() => setShowNewPassword(!showNewPassword)}
                              edge="end"
                              sx={{ color: 'text.secondary' }}
                            >
                              {showNewPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                            </IconButton>
                          </InputAdornment>
                        )
                      }}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          bgcolor: 'rgba(255, 255, 255, 0.05)',
                          '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.2)' },
                          '&:hover fieldset': { borderColor: 'rgba(255, 255, 255, 0.3)' },
                          '&.Mui-focused fieldset': { borderColor: 'primary.main' }
                        }
                      }}
                    />

                    <TextField
                      label="Confirm Password"
                      type={showConfirmPassword ? 'text' : 'password'}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      variant="outlined"
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton
                              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                              edge="end"
                              sx={{ color: 'text.secondary' }}
                            >
                              {showConfirmPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                            </IconButton>
                          </InputAdornment>
                        )
                      }}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          bgcolor: 'rgba(255, 255, 255, 0.05)',
                          '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.2)' },
                          '&:hover fieldset': { borderColor: 'rgba(255, 255, 255, 0.3)' },
                          '&.Mui-focused fieldset': { borderColor: 'primary.main' }
                        }
                      }}
                    />

                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
                      <Button
                        variant="contained"
                        onClick={handleSecuritySave}
                        sx={{
                          bgcolor: 'primary.main',
                          color: 'black',
                          fontWeight: 600,
                          px: 4,
                          py: 1.5,
                          borderRadius: 2,
                          '&:hover': {
                            bgcolor: 'primary.dark'
                          }
                        }}
                      >
                        UPDATE PASSWORD
                      </Button>
                    </Box>
                  </Box>
                </Box>
              )}
            </CardContent>
          </Card>
        </Container>

        {/* Footer */}
        <Footer />
      </Box>
    </ThemeProvider>
  )
}
