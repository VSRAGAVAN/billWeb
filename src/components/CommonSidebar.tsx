'use client'

import {
  AccountCircle as AccountCircleIcon,
  Add as AddIcon,
  Assignment as AssignmentIcon,
  Assessment as AssessmentIcon,
  ChevronLeft as ChevronLeftIcon,
  Dashboard as DashboardIcon,
  Inventory as InventoryIcon,
  Logout as LogoutIcon,
  People as PeopleIcon,
  Receipt as ReceiptIcon,
  Settings as SettingsIcon,
  ViewList as ViewListIcon
} from '@mui/icons-material'
import {
  Box,
  Divider,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography
} from '@mui/material'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const drawerWidth = 280

interface CommonSidebarProps {
  open: boolean
  onClose: () => void
}

export default function CommonSidebar({ open, onClose }: CommonSidebarProps) {
  const pathname = usePathname()

  const handleLogout = () => {
    localStorage.removeItem('userData')
    window.location.href = '/login'
  }

  const menuItems = [
    { 
      label: 'Dashboard', 
      icon: <DashboardIcon />, 
      href: '/dashboard',
      isActive: pathname === '/dashboard'
    },
    { 
      label: 'Create Bill', 
      icon: <AddIcon />, 
      href: '/create-bill',
      isActive: pathname === '/create-bill'
    },
    { 
      label: 'All Bills', 
      icon: <ViewListIcon />, 
      href: '/bills',
      isActive: pathname === '/bills'
    },
    { 
      label: 'Customers', 
      icon: <PeopleIcon />, 
      href: '/customers',
      isActive: pathname === '/customers'
    },
    { 
      label: 'Inventory', 
      icon: <InventoryIcon />, 
      href: '/inventory',
      isActive: pathname === '/inventory'
    },
    { 
      label: 'Reports', 
      icon: <AssessmentIcon />, 
      href: '/reports',
      isActive: pathname === '/reports'
    }
  ]

  const bottomMenuItems = [
    { 
      label: 'Profile', 
      icon: <AccountCircleIcon />, 
      href: '/profile',
      isActive: pathname === '/profile'
    },
    { 
      label: 'Settings', 
      icon: <SettingsIcon />, 
      href: '/settings',
      isActive: pathname === '/settings'
    }
  ]

  return (
    <Drawer
      variant="temporary"
      open={open}
      onClose={onClose}
      ModalProps={{ keepMounted: true }}
      sx={{
        '& .MuiDrawer-paper': {
          boxSizing: 'border-box',
          width: drawerWidth,
          bgcolor: '#334155', // Match the image color
          color: 'white',
          borderRight: 'none'
        },
      }}
    >
      {/* Header */}
      <Box sx={{ 
        p: 3, 
        display: 'flex',
        alignItems: 'center',
        gap: 2,
        borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
      }}>
        <Box sx={{
          width: 32,
          height: 32,
          borderRadius: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <img 
            src="/favicon.ico" 
            alt="Ganapathy Logo" 
            style={{ 
              width: 28, 
              height: 28, 
              borderRadius: 4 
            }} 
          />
        </Box>
        <Typography variant="h6" fontWeight={600} sx={{ color: 'white', fontSize: '1.1rem' }}>
          Ganapathy
        </Typography>
        <ChevronLeftIcon 
          onClick={onClose}
          sx={{ 
            color: 'rgba(255, 255, 255, 0.7)', 
            ml: 'auto',
            cursor: 'pointer',
            '&:hover': { color: 'white' }
          }} 
        />
      </Box>
      
      {/* Main Menu Items */}
      <List sx={{ pt: 2, px: 2 }}>
        {menuItems.map((item) => (
          <ListItem key={item.label} disablePadding sx={{ mb: 0.5 }}>
            <ListItemButton
              component={Link}
              href={item.href}
              onClick={onClose}
              sx={{
                borderRadius: 2,
                py: 1.5,
                px: 2,
                color: item.isActive ? '#1e293b' : 'rgba(255, 255, 255, 0.8)',
                bgcolor: item.isActive ? '#f59e0b' : 'transparent',
                '&:hover': { 
                  bgcolor: item.isActive ? '#d97706' : 'rgba(255, 255, 255, 0.1)',
                  color: item.isActive ? '#1e293b' : 'white'
                },
                '& .MuiListItemIcon-root': {
                  minWidth: 40,
                  color: 'inherit'
                }
              }}
            >
              <ListItemIcon sx={{ color: 'inherit' }}>
                {item.icon}
              </ListItemIcon>
              <ListItemText 
                primary={item.label} 
                primaryTypographyProps={{
                  fontSize: '0.95rem',
                  fontWeight: item.isActive ? 600 : 500
                }}
              />
            </ListItemButton>
          </ListItem>
        ))}
      </List>

      {/* Bottom Menu Items */}
      <Box sx={{ mt: 'auto', p: 2 }}>
        <List sx={{ pt: 0 }}>
          {bottomMenuItems.map((item) => (
            <ListItem key={item.label} disablePadding sx={{ mb: 0.5 }}>
              <ListItemButton
                component={Link}
                href={item.href}
                onClick={onClose}
                sx={{
                  borderRadius: 2,
                  py: 1.5,
                  px: 2,
                  color: item.isActive ? '#1e293b' : 'rgba(255, 255, 255, 0.8)',
                  bgcolor: item.isActive ? '#f59e0b' : 'transparent',
                  '&:hover': { 
                    bgcolor: item.isActive ? '#d97706' : 'rgba(255, 255, 255, 0.1)',
                    color: item.isActive ? '#1e293b' : 'white'
                  },
                  '& .MuiListItemIcon-root': {
                    minWidth: 40,
                    color: 'inherit'
                  }
                }}
              >
                <ListItemIcon sx={{ color: 'inherit' }}>
                  {item.icon}
                </ListItemIcon>
                <ListItemText 
                  primary={item.label} 
                  primaryTypographyProps={{
                    fontSize: '0.95rem',
                    fontWeight: item.isActive ? 600 : 500
                  }}
                />
              </ListItemButton>
            </ListItem>
          ))}

          {/* Logout */}
          <ListItem disablePadding sx={{ mb: 0.5 }}>
            <ListItemButton
              onClick={handleLogout}
              sx={{
                borderRadius: 2,
                py: 1.5,
                px: 2,
                color: 'rgba(255, 255, 255, 0.8)',
                '&:hover': { 
                  bgcolor: 'rgba(239, 68, 68, 0.1)',
                  color: '#ef4444'
                },
                '& .MuiListItemIcon-root': {
                  minWidth: 40,
                  color: 'inherit'
                }
              }}
            >
              <ListItemIcon sx={{ color: 'inherit' }}>
                <LogoutIcon />
              </ListItemIcon>
              <ListItemText 
                primary="Logout" 
                primaryTypographyProps={{
                  fontSize: '0.95rem',
                  fontWeight: 500
                }}
              />
            </ListItemButton>
          </ListItem>
        </List>
      </Box>
    </Drawer>
  )
}
