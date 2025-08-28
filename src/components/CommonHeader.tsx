'use client'

import {
  AccountCircle as AccountCircleIcon,
  Logout as LogoutIcon,
  Mail as MailIcon,
  Menu as MenuIcon,
  MoreVert as MoreIcon,
  Notifications as NotificationsIcon,
  Receipt as ReceiptIcon,
  Search as SearchIcon
} from '@mui/icons-material'
import {
  AppBar,
  Avatar,
  Badge,
  Box,
  Button,
  IconButton,
  InputBase,
  Menu,
  MenuItem,
  Toolbar,
  Typography,
  alpha,
  styled
} from '@mui/material'
import Link from 'next/link'
import { useState, useEffect } from 'react'

// Styled components for search functionality
const Search = styled('div')(({ theme }) => ({
  position: 'relative',
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  '&:hover': {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  marginRight: theme.spacing(2),
  marginLeft: 0,
  width: '100%',
  [theme.breakpoints.up('sm')]: {
    marginLeft: theme.spacing(3),
    width: 'auto',
  },
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: '100%',
  position: 'absolute',
  pointerEvents: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: 'inherit',
  '& .MuiInputBase-input': {
    padding: theme.spacing(1, 1, 1, 0),
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('md')]: {
      width: '20ch',
    },
  },
}));

interface User {
  email: string
  name: string
  displayName: string
}

interface CommonHeaderProps {
  onDrawerOpen: () => void
}

export default function CommonHeader({ onDrawerOpen }: CommonHeaderProps) {
  const [user, setUser] = useState<User>({ email: '', name: '', displayName: '' })
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const [mobileMoreAnchorEl, setMobileMoreAnchorEl] = useState<null | HTMLElement>(null)

  const isMenuOpen = Boolean(anchorEl)
  const isMobileMenuOpen = Boolean(mobileMoreAnchorEl)

  useEffect(() => {
    // Get user data from localStorage
    const userData = localStorage.getItem('userData')
    if (userData) {
      setUser(JSON.parse(userData))
    }
  }, [])

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget)
  }

  const handleMenuClose = () => {
    setAnchorEl(null)
    handleMobileMenuClose()
  }

  const handleMobileMenuClose = () => {
    setMobileMoreAnchorEl(null)
  }

  const handleMobileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setMobileMoreAnchorEl(event.currentTarget)
  }

  const handleLogout = () => {
    localStorage.removeItem('userData')
    window.location.href = '/login'
  }

  return (
    <>
      {/* Header */}
      <AppBar position="static" elevation={0}>
        <Toolbar>
          {/* Menu Icon */}
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="open drawer"
            onClick={onDrawerOpen}
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton>

          {/* Logo and Title */}
          <Box sx={{ display: 'flex', alignItems: 'center', mr: 3 }}>
            <img 
              src="/favicon.ico" 
              alt="Ganapathy Logo" 
              style={{ 
                width: 32, 
                height: 32, 
                marginRight: 8,
                borderRadius: 4 
              }} 
            />
            <Typography 
              variant="h6" 
              noWrap 
              component="div" 
              sx={{ 
                color: 'white', 
                fontWeight: 700,
                display: { xs: 'none', sm: 'block' }
              }}
            >
              Ganapathy Timbers and Wood Works
            </Typography>
          </Box>

          {/* Search Bar */}
          <Search>
            <SearchIconWrapper>
              <SearchIcon />
            </SearchIconWrapper>
            <StyledInputBase
              placeholder="Search bills, customers..."
              inputProps={{ 'aria-label': 'search' }}
            />
          </Search>

          <Box sx={{ flexGrow: 1 }} />

          {/* Header Actions - Desktop */}
          <Box sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'center', gap: 1 }}>
            <Button 
              variant="outlined" 
              size="small" 
              sx={{ 
                color: 'white', 
                borderColor: 'rgba(255,255,255,0.3)',
                '&:hover': { borderColor: 'rgba(255,255,255,0.5)' }
              }}
            >
              Last 7 Days
            </Button>
            <Button 
              variant="outlined" 
              size="small" 
              sx={{ 
                color: 'white', 
                borderColor: 'rgba(255,255,255,0.3)',
                '&:hover': { borderColor: 'rgba(255,255,255,0.5)' }
              }}
            >
              This Month
            </Button>
            <Button 
              variant="outlined" 
              size="small" 
              sx={{ 
                color: 'white', 
                borderColor: 'rgba(255,255,255,0.3)',
                '&:hover': { borderColor: 'rgba(255,255,255,0.5)' }
              }}
            >
              This Year
            </Button>
            
            <IconButton size="large" aria-label="show 4 new mails" color="inherit">
              <Badge badgeContent={4} color="error">
                <MailIcon />
              </Badge>
            </IconButton>
            <IconButton
              size="large"
              aria-label="show 17 new notifications"
              color="inherit"
            >
              <Badge badgeContent={17} color="error">
                <NotificationsIcon />
              </Badge>
            </IconButton>

            <Typography variant="body2" color="text.secondary" sx={{ mx: 2 }}>
              Welcome, {user.name || user.displayName || 'User'}
            </Typography>
            
            <IconButton
              size="large"
              edge="end"
              aria-label="account of current user"
              aria-controls="primary-search-account-menu"
              aria-haspopup="true"
              onClick={handleMenuOpen}
              color="inherit"
            >
              <Avatar sx={{ 
                bgcolor: 'primary.main',
                width: 36,
                height: 36,
                fontSize: '1rem',
                fontWeight: 'bold'
              }}>
                {(user.name || user.displayName || 'U').charAt(0).toUpperCase()}
              </Avatar>
            </IconButton>
          </Box>

          {/* Header Actions - Mobile */}
          <Box sx={{ display: { xs: 'flex', md: 'none' } }}>
            <IconButton
              size="large"
              aria-label="show more"
              aria-controls="primary-search-account-menu-mobile"
              aria-haspopup="true"
              onClick={handleMobileMenuOpen}
              color="inherit"
            >
              <MoreIcon />
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Desktop Menu */}
      <Menu
        anchorEl={anchorEl}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        id="primary-search-account-menu"
        keepMounted
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        open={isMenuOpen}
        onClose={handleMenuClose}
        PaperProps={{
          sx: { 
            bgcolor: '#1e293b', 
            color: 'white',
            minWidth: '280px',
            borderRadius: 2,
            mt: 1
          }
        }}
      >
        {/* User Info Header */}
        <Box sx={{ 
          px: 2, 
          py: 1.5, 
          borderBottom: '1px solid rgba(255,255,255,0.1)',
          display: 'flex',
          alignItems: 'center',
          gap: 1.5
        }}>
          <Avatar sx={{ 
            bgcolor: 'primary.main', 
            width: 40, 
            height: 40,
            fontSize: '1.2rem',
            fontWeight: 'bold'
          }}>
            {(user.name || user.displayName || 'U').charAt(0).toUpperCase()}
          </Avatar>
          <Box>
            <Typography variant="subtitle1" sx={{ 
              color: 'white', 
              fontWeight: 600,
              lineHeight: 1.2
            }}>
              {user.name || user.displayName || 'User'}
            </Typography>
            <Typography variant="body2" sx={{ 
              color: 'rgba(255,255,255,0.7)',
              fontSize: '0.85rem'
            }}>
              {user.email || 'user@example.com'}
            </Typography>
          </Box>
        </Box>

        {/* Menu Items */}
        <MenuItem 
          component={Link}
          href="/profile"
          onClick={handleMenuClose} 
          sx={{ 
            color: 'white',
            py: 1.5,
            px: 2,
            '&:hover': {
              bgcolor: 'rgba(255,255,255,0.1)'
            }
          }}
        >
          <AccountCircleIcon sx={{ mr: 2, fontSize: 20 }} />
          My Profile
        </MenuItem>

        {/* Logout Button */}
        <Box sx={{ p: 1 }}>
          <Button
            onClick={handleLogout}
            fullWidth
            variant="contained"
            sx={{
              bgcolor: '#ef4444',
              color: 'white',
              py: 1,
              fontWeight: 600,
              '&:hover': {
                bgcolor: '#dc2626'
              },
              borderRadius: 1.5
            }}
            startIcon={<LogoutIcon />}
          >
            Logout
          </Button>
        </Box>
      </Menu>

      {/* Mobile Menu */}
      <Menu
        anchorEl={mobileMoreAnchorEl}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        id="primary-search-account-menu-mobile"
        keepMounted
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        open={isMobileMenuOpen}
        onClose={handleMobileMenuClose}
        PaperProps={{
          sx: { bgcolor: '#1e293b', color: 'white' }
        }}
      >
        <MenuItem sx={{ color: 'white' }}>
          <IconButton size="large" aria-label="show 4 new mails" color="inherit">
            <Badge badgeContent={4} color="error">
              <MailIcon />
            </Badge>
          </IconButton>
          <Typography>Messages</Typography>
        </MenuItem>
        <MenuItem sx={{ color: 'white' }}>
          <IconButton
            size="large"
            aria-label="show 17 new notifications"
            color="inherit"
          >
            <Badge badgeContent={17} color="error">
              <NotificationsIcon />
            </Badge>
          </IconButton>
          <Typography>Notifications</Typography>
        </MenuItem>
        <MenuItem onClick={handleMenuOpen} sx={{ color: 'white' }}>
          <IconButton
            size="large"
            aria-label="account of current user"
            aria-controls="primary-search-account-menu"
            aria-haspopup="true"
            color="inherit"
          >
            <AccountCircleIcon />
          </IconButton>
          <Typography>Profile</Typography>
        </MenuItem>
      </Menu>
    </>
  )
}
