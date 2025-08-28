'use client'

import { useState, useEffect } from 'react'
import CommonHeader from '../../components/CommonHeader'
import CommonSidebar from '../../components/CommonSidebar'
import Link from 'next/link'
import { 
  AccountCircle as AccountCircleIcon,
  Analytics as AnalyticsIcon,
  CalendarMonth as CalendarMonthIcon,
  Logout as LogoutIcon,
  Receipt as ReceiptIcon,
  Today as TodayIcon,
  Menu as MenuIcon,
  Search as SearchIcon,
  Mail as MailIcon,
  Notifications as NotificationsIcon,
  MoreVert as MoreIcon,
  Dashboard as DashboardIcon,
  Add as AddIcon,
  Assignment as AssignmentIcon,
  Inventory as InventoryIcon,
  Assessment as AssessmentIcon,
  Settings as SettingsIcon,
  ChevronLeft as ChevronLeftIcon,
  People as PeopleIcon
} from '@mui/icons-material'
import {
  Alert,
  AppBar,
  Avatar,
  Badge,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Container,
  Divider,
  Drawer,
  // Grid, (removed unused import)
  IconButton,
  InputBase,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  ThemeProvider,
  Toolbar,
  Typography,
  createTheme,
  styled,
  alpha
} from '@mui/material'
import {
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer
} from 'recharts'

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

const drawerWidth = 240;

// Styled components for the drawer
const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(0, 1),
  ...theme.mixins.toolbar,
  justifyContent: 'flex-end',
}));

// Material UI theme with dark CRM design
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
    h4: {
      fontWeight: 700
    },
    h5: {
      fontWeight: 700
    },
    h6: {
      fontWeight: 600
    }
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
          backgroundColor: '#1e293b',
          borderRadius: 12,
          border: '1px solid rgba(255, 255, 255, 0.1)'
        }
      }
    },
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

interface BillData {
  billNumber: string
  billDate: string
  customerInfo: {
    name: string
    address: string
    gstin: string
    phone: string
  }
  billItems: Array<{
    id: string
    product: string
    specification: string
    quantity: number
    unit: string
    rate: number
    amount: number
  }>
  total: number
  subtotal: number
}

export default function WoodBillingDashboard() {
  const [user, setUser] = useState({ email: '', name: '', displayName: '' })
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const [mobileMoreAnchorEl, setMobileMoreAnchorEl] = useState<null | HTMLElement>(null)
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [bills, setBills] = useState<BillData[]>([])
  const [todayTotal, setTodayTotal] = useState(0)
  // Removed unused weekTotal
  const [monthTotal, setMonthTotal] = useState(0)
  const [productSalesData, setProductSalesData] = useState<{ product: string; amount: number; sales: number }[]>([])
  const [recentBills, setRecentBills] = useState<BillData[]>([])
  const [salesTrendData, setSalesTrendData] = useState<{ date: string; amount: number }[]>([])

  const colors = ['#d97706', '#059669', '#dc2626', '#7c3aed', '#2563eb', '#ea580c']

  const isMenuOpen = Boolean(anchorEl)
  const isMobileMenuOpen = Boolean(mobileMoreAnchorEl)

  useEffect(() => {
    // Get user data from localStorage or session
    const userData = localStorage.getItem('userData')
    if (userData) {
      setUser(JSON.parse(userData))
    }

    // Load bills data
    loadBillsData()
  }, [])

  const loadBillsData = () => {
    const billsData = JSON.parse(localStorage.getItem('woodBills') || '[]')
    setBills(billsData)
    setRecentBills(billsData.slice(-5).reverse()) // Last 5 bills

    // Calculate totals for today, week, month
    const today = new Date()
    const todayStr = today.toISOString().split('T')[0]
    const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000)
    const monthAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000)

    let todaySum = 0
    let weekSum = 0
    let monthSum = 0

    const productSales: { [key: string]: number } = {}
    const dailySales: { [key: string]: number } = {}

    billsData.forEach((bill: BillData) => {
      const billDate = new Date(bill.billDate)
      const billTotal = bill.total || 0

      // Calculate date-based totals
      if (bill.billDate === todayStr) {
        todaySum += billTotal
      }
      if (billDate >= weekAgo) {
        weekSum += billTotal
      }
      if (billDate >= monthAgo) {
        monthSum += billTotal
      }

      // Track product sales
      bill.billItems?.forEach(item => {
        if (item.product) {
          productSales[item.product] = (productSales[item.product] || 0) + item.amount
        }
      })

      // Track daily sales for trend
      const dateStr = bill.billDate
      dailySales[dateStr] = (dailySales[dateStr] || 0) + billTotal
    })

    setTodayTotal(todaySum)
    setMonthTotal(monthSum)

    // Convert product sales to chart data
    const productChartData = Object.entries(productSales)
      .map(([product, amount]) => ({ product, amount, sales: amount }))
      .sort((a, b) => b.amount - a.amount)
      .slice(0, 6)
    setProductSalesData(productChartData)

    // Convert daily sales to trend data
    const trendData = Object.entries(dailySales)
      .map(([date, amount]) => ({ date, amount }))
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
      .slice(-7) // Last 7 days
    setSalesTrendData(trendData)
  }

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

  const handleDrawerOpen = () => {
    setDrawerOpen(true)
  }

  const handleDrawerClose = () => {
    setDrawerOpen(false)
  }

  const handleLogout = () => {
    localStorage.removeItem('userData')
    window.location.href = '/login'
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR'
    }).format(amount)
  }

  // Removed unused formatDate

  return (
    <>
    <ThemeProvider theme={theme}>
      <Box sx={{ bgcolor: 'background.default', minHeight: '100vh' }}>
        {/* Common Header */}
        <CommonHeader onDrawerOpen={handleDrawerOpen} />

        {/* Common Sidebar */}
        <CommonSidebar open={drawerOpen} onClose={handleDrawerClose} />
        <AppBar position="static" elevation={0} sx={{ bgcolor: 'background.paper', borderBottom: 1, borderColor: 'divider' }}>
          <Toolbar>
            {/* Menu Icon */}
            <IconButton
              size="large"
              edge="start"
              color="inherit"
              aria-label="open drawer"
              onClick={handleDrawerOpen}
              sx={{ mr: 2 }}
            >
              <MenuIcon />
            </IconButton>

            {/* Logo and Title */}
            <Box sx={{ display: 'flex', alignItems: 'center', mr: 3 }}>
              <ReceiptIcon sx={{ mr: 1, color: 'primary.main', fontSize: 32 }} />
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

        {/* Navigation Drawer */}
        <Drawer
          sx={{
            width: drawerWidth,
            flexShrink: 0,
            '& .MuiDrawer-paper': {
              width: drawerWidth,
              boxSizing: 'border-box',
              bgcolor: '#1e293b',
              color: 'white',
              borderRight: '1px solid rgba(255, 255, 255, 0.1)'
            },
          }}
          variant="temporary"
          anchor="left"
          open={drawerOpen}
          onClose={handleDrawerClose}
        >
          <DrawerHeader>
            <Box sx={{ display: 'flex', alignItems: 'center', flexGrow: 1, pl: 2 }}>
              <ReceiptIcon sx={{ mr: 1, color: 'primary.main', fontSize: 28 }} />
              <Typography variant="h6" sx={{ color: 'white', fontWeight: 600 }}>
                Ganapathy
              </Typography>
            </Box>
            <IconButton onClick={handleDrawerClose} sx={{ color: 'white' }}>
              <ChevronLeftIcon />
            </IconButton>
          </DrawerHeader>
          <Divider sx={{ borderColor: 'rgba(255, 255, 255, 0.1)' }} />
          
          <List>
            {/* Dashboard */}
            <ListItem disablePadding>
              <ListItemButton
                component={Link}
                href="/dashboard"
                sx={{
                  color: 'white',
                  '&:hover': { bgcolor: 'rgba(245, 158, 11, 0.1)' },
                  bgcolor: 'rgba(245, 158, 11, 0.2)'
                }}
              >
                <ListItemIcon sx={{ color: '#f59e0b' }}>
                  <DashboardIcon />
                </ListItemIcon>
                <ListItemText primary="Dashboard" />
              </ListItemButton>
            </ListItem>

            {/* Create Bill */}
            <ListItem disablePadding>
              <ListItemButton
                component={Link}
                href="/create-bill"
                sx={{
                  color: 'white',
                  '&:hover': { bgcolor: 'rgba(255, 255, 255, 0.1)' }
                }}
              >
                <ListItemIcon sx={{ color: 'white' }}>
                  <AddIcon />
                </ListItemIcon>
                <ListItemText primary="Create Bill" />
              </ListItemButton>
            </ListItem>

            {/* All Bills */}
            <ListItem disablePadding>
              <ListItemButton
                component={Link}
                href="/bills"
                sx={{
                  color: 'white',
                  '&:hover': { bgcolor: 'rgba(255, 255, 255, 0.1)' }
                }}
              >
                <ListItemIcon sx={{ color: 'white' }}>
                  <AssignmentIcon />
                </ListItemIcon>
                <ListItemText primary="All Bills" />
              </ListItemButton>
            </ListItem>

            {/* Customers */}
            <ListItem disablePadding>
              <ListItemButton
                component={Link}
                href="/customers"
                sx={{
                  color: 'white',
                  '&:hover': { bgcolor: 'rgba(255, 255, 255, 0.1)' }
                }}
              >
                <ListItemIcon sx={{ color: 'white' }}>
                  <PeopleIcon />
                </ListItemIcon>
                <ListItemText primary="Customers" />
              </ListItemButton>
            </ListItem>

            {/* Inventory */}
            <ListItem disablePadding>
              <ListItemButton
                component={Link}
                href="/inventory"
                sx={{
                  color: 'white',
                  '&:hover': { bgcolor: 'rgba(255, 255, 255, 0.1)' }
                }}
              >
                <ListItemIcon sx={{ color: 'white' }}>
                  <InventoryIcon />
                </ListItemIcon>
                <ListItemText primary="Inventory" />
              </ListItemButton>
            </ListItem>

            {/* Reports */}
            <ListItem disablePadding>
              <ListItemButton
                sx={{
                  color: 'white',
                  '&:hover': { bgcolor: 'rgba(255, 255, 255, 0.1)' }
                }}
              >
                <ListItemIcon sx={{ color: 'white' }}>
                  <AssessmentIcon />
                </ListItemIcon>
                <ListItemText primary="Reports" />
              </ListItemButton>
            </ListItem>
          </List>

          <Divider sx={{ borderColor: 'rgba(255, 255, 255, 0.1)', my: 1 }} />

          <List>
            {/* Profile */}
            <ListItem disablePadding>
              <ListItemButton
                component={Link}
                href="/profile"
                sx={{
                  color: 'white',
                  '&:hover': { bgcolor: 'rgba(255, 255, 255, 0.1)' }
                }}
              >
                <ListItemIcon sx={{ color: 'white' }}>
                  <AccountCircleIcon />
                </ListItemIcon>
                <ListItemText primary="Profile" />
              </ListItemButton>
            </ListItem>

            {/* Settings */}
            <ListItem disablePadding>
              <ListItemButton
                sx={{
                  color: 'white',
                  '&:hover': { bgcolor: 'rgba(255, 255, 255, 0.1)' }
                }}
              >
                <ListItemIcon sx={{ color: 'white' }}>
                  <SettingsIcon />
                </ListItemIcon>
                <ListItemText primary="Settings" />
              </ListItemButton>
            </ListItem>

            {/* Logout */}
            <ListItem disablePadding>
              <ListItemButton
                onClick={handleLogout}
                sx={{
                  color: 'white',
                  '&:hover': { bgcolor: 'rgba(239, 68, 68, 0.1)' }
                }}
              >
                <ListItemIcon sx={{ color: '#ef4444' }}>
                  <LogoutIcon />
                </ListItemIcon>
                <ListItemText primary="Logout" />
              </ListItemButton>
            </ListItem>
          </List>
        </Drawer>

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

        {/* Main Content */}
        <Container maxWidth="xl" sx={{ py: 3 }}>

          {/* Top Metrics Cards */}
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3, mb: 4 }}>
            <Box sx={{ flex: { xs: '1 1 100%', sm: '1 1 calc(50% - 12px)', md: '1 1 calc(25% - 18px)' } }}>
              <Card sx={{ bgcolor: '#1e293b', color: 'white' }}>
                <CardContent>
                  <Box display="flex" alignItems="center" gap={2}>
                    <Box sx={{ 
                      bgcolor: '#3b82f6', 
                      borderRadius: '50%', 
                      width: 48, 
                      height: 48, 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center' 
                    }}>
                      <ReceiptIcon sx={{ color: 'white' }} />
                    </Box>
                    <Box>
                      <Typography variant="h4" fontWeight={700}>
                        {bills.length}
                      </Typography>
                      <Typography variant="body2" sx={{ opacity: 0.8 }}>
                        Total Bills
                      </Typography>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Box>
            
            <Box sx={{ flex: { xs: '1 1 100%', sm: '1 1 calc(50% - 12px)', md: '1 1 calc(25% - 18px)' } }}>
              <Card sx={{ bgcolor: '#1e293b', color: 'white' }}>
                <CardContent>
                  <Box display="flex" alignItems="center" gap={2}>
                    <Box sx={{ 
                      bgcolor: '#10b981', 
                      borderRadius: '50%', 
                      width: 48, 
                      height: 48, 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center' 
                    }}>
                      <AnalyticsIcon sx={{ color: 'white' }} />
                    </Box>
                    <Box>
                      <Typography variant="h4" fontWeight={700}>
                        {productSalesData.length}
                      </Typography>
                      <Typography variant="body2" sx={{ opacity: 0.8 }}>
                        Products Sold
                      </Typography>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Box>
            
            <Box sx={{ flex: { xs: '1 1 100%', sm: '1 1 calc(50% - 12px)', md: '1 1 calc(25% - 18px)' } }}>
              <Card sx={{ bgcolor: '#1e293b', color: 'white' }}>
                <CardContent>
                  <Box display="flex" alignItems="center" gap={2}>
                    <Box sx={{ 
                      bgcolor: '#f59e0b', 
                      borderRadius: '50%', 
                      width: 48, 
                      height: 48, 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center' 
                    }}>
                      <TodayIcon sx={{ color: 'white' }} />
                    </Box>
                    <Box>
                      <Typography variant="h4" fontWeight={700}>
                        {recentBills.length}
                      </Typography>
                      <Typography variant="body2" sx={{ opacity: 0.8 }}>
                        Recent Orders
                      </Typography>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Box>
            
            <Box sx={{ flex: { xs: '1 1 100%', sm: '1 1 calc(50% - 12px)', md: '1 1 calc(25% - 18px)' } }}>
              <Card sx={{ bgcolor: '#1e293b', color: 'white' }}>
                <CardContent>
                  <Box display="flex" alignItems="center" gap={2}>
                    <Box sx={{ 
                      bgcolor: '#ef4444', 
                      borderRadius: '50%', 
                      width: 48, 
                      height: 48, 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center' 
                    }}>
                      <CalendarMonthIcon sx={{ color: 'white' }} />
                    </Box>
                    <Box>
                      <Typography variant="h4" fontWeight={700}>
                        {formatCurrency(monthTotal).replace('₹', '₹')}
                      </Typography>
                      <Typography variant="body2" sx={{ opacity: 0.8 }}>
                        Monthly Revenue
                      </Typography>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Box>
          </Box>

          {/* Main Dashboard Content */}
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3, mb: 4 }}>
            {/* Stages Section */}
            <Box sx={{ flex: { xs: '1 1 100%', md: '1 1 calc(50% - 12px)' } }}>
              <Card sx={{ bgcolor: '#1e293b', color: 'white', height: '100%' }}>
                <CardContent>
                  <Typography variant="h6" fontWeight={600} mb={3} sx={{ color: 'white' }}>
                    Order Stages
                  </Typography>
                  
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                    <Box>
                      <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                        <Typography variant="body2" sx={{ opacity: 0.8 }}>Order Request From Customer</Typography>
                        <Typography variant="body2" fontWeight={600}>75%</Typography>
                      </Box>
                      <Box sx={{ 
                        width: '100%', 
                        height: 8, 
                        bgcolor: 'rgba(255,255,255,0.1)', 
                        borderRadius: 4,
                        overflow: 'hidden'
                      }}>
                        <Box sx={{ 
                          width: '75%', 
                          height: '100%', 
                          bgcolor: '#10b981',
                          borderRadius: 4
                        }} />
                      </Box>
                    </Box>
                    
                    <Box>
                      <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                        <Typography variant="body2" sx={{ opacity: 0.8 }}>Request Approved by Admin</Typography>
                        <Typography variant="body2" fontWeight={600}>65%</Typography>
                      </Box>
                      <Box sx={{ 
                        width: '100%', 
                        height: 8, 
                        bgcolor: 'rgba(255,255,255,0.1)', 
                        borderRadius: 4,
                        overflow: 'hidden'
                      }}>
                        <Box sx={{ 
                          width: '65%', 
                          height: '100%', 
                          bgcolor: '#f59e0b',
                          borderRadius: 4
                        }} />
                      </Box>
                    </Box>
                    
                    <Box>
                      <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                        <Typography variant="body2" sx={{ opacity: 0.8 }}>Bills Item Order</Typography>
                        <Typography variant="body2" fontWeight={600}>45%</Typography>
                      </Box>
                      <Box sx={{ 
                        width: '100%', 
                        height: 8, 
                        bgcolor: 'rgba(255,255,255,0.1)', 
                        borderRadius: 4,
                        overflow: 'hidden'
                      }}>
                        <Box sx={{ 
                          width: '45%', 
                          height: '100%', 
                          bgcolor: '#3b82f6',
                          borderRadius: 4
                        }} />
                      </Box>
                    </Box>
                    
                    <Box>
                      <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                        <Typography variant="body2" sx={{ opacity: 0.8 }}>Order Delivered</Typography>
                        <Typography variant="body2" fontWeight={600}>30%</Typography>
                      </Box>
                      <Box sx={{ 
                        width: '100%', 
                        height: 8, 
                        bgcolor: 'rgba(255,255,255,0.1)', 
                        borderRadius: 4,
                        overflow: 'hidden'
                      }}>
                        <Box sx={{ 
                          width: '30%', 
                          height: '100%', 
                          bgcolor: '#ef4444',
                          borderRadius: 4
                        }} />
                      </Box>
                    </Box>
                    
                    <Box>
                      <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                        <Typography variant="body2" sx={{ opacity: 0.8 }}>Waiting for Approval</Typography>
                        <Typography variant="body2" fontWeight={600}>20%</Typography>
                      </Box>
                      <Box sx={{ 
                        width: '100%', 
                        height: 8, 
                        bgcolor: 'rgba(255,255,255,0.1)', 
                        borderRadius: 4,
                        overflow: 'hidden'
                      }}>
                        <Box sx={{ 
                          width: '20%', 
                          height: '100%', 
                          bgcolor: '#8b5cf6',
                          borderRadius: 4
                        }} />
                      </Box>
                    </Box>
                    
                    <Box>
                      <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                        <Typography variant="body2" sx={{ opacity: 0.8 }}>Waiting for Parts</Typography>
                        <Typography variant="body2" fontWeight={600}>15%</Typography>
                      </Box>
                      <Box sx={{ 
                        width: '100%', 
                        height: 8, 
                        bgcolor: 'rgba(255,255,255,0.1)', 
                        borderRadius: 4,
                        overflow: 'hidden'
                      }}>
                        <Box sx={{ 
                          width: '15%', 
                          height: '100%', 
                          bgcolor: '#06b6d4',
                          borderRadius: 4
                        }} />
                      </Box>
                    </Box>
                    
                    <Box>
                      <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                        <Typography variant="body2" sx={{ opacity: 0.8 }}>Assembling</Typography>
                        <Typography variant="body2" fontWeight={600}>10%</Typography>
                      </Box>
                      <Box sx={{ 
                        width: '100%', 
                        height: 8, 
                        bgcolor: 'rgba(255,255,255,0.1)', 
                        borderRadius: 4,
                        overflow: 'hidden'
                      }}>
                        <Box sx={{ 
                          width: '10%', 
                          height: '100%', 
                          bgcolor: '#84cc16',
                          borderRadius: 4
                        }} />
                      </Box>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Box>

            {/* Top Products List */}
            <Box sx={{ flex: { xs: '1 1 100%', md: '1 1 calc(50% - 12px)' } }}>
              <Card sx={{ bgcolor: '#1e293b', color: 'white', height: '100%' }}>
                <CardContent>
                  <Typography variant="h6" fontWeight={600} mb={3} sx={{ color: 'white' }}>
                    Top 6 Wood Products List
                  </Typography>
                  
                  {productSalesData.length > 0 ? (
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                      {productSalesData.slice(0, 6).map((product, index) => (
                        <Box key={product.product} display="flex" alignItems="center" gap={2}>
                          <Box sx={{
                            bgcolor: colors[index % colors.length],
                            color: 'white',
                            borderRadius: '50%',
                            width: 32,
                            height: 32,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '0.875rem',
                            fontWeight: 600
                          }}>
                            {index + 1}
                          </Box>
                          <Box sx={{ flexGrow: 1 }}>
                            <Typography variant="body2" fontWeight={600} sx={{ color: 'white' }}>
                              {product.product}
                            </Typography>
                            <Typography variant="caption" sx={{ opacity: 0.7 }}>
                              {formatCurrency(product.amount)}
                            </Typography>
                          </Box>
                          <Typography variant="body2" fontWeight={600} sx={{ color: '#10b981' }}>
                            {Math.round((product.amount / productSalesData.reduce((sum, p) => sum + p.amount, 0)) * 100)}%
                          </Typography>
                        </Box>
                      ))}
                    </Box>
                  ) : (
                    <Alert severity="info" sx={{ bgcolor: 'rgba(59, 130, 246, 0.1)', color: 'white' }}>
                      No product data available yet!
                    </Alert>
                  )}
                </CardContent>
              </Card>
            </Box>
          </Box>

          {/* Pickup and Delivery Chart & Job Stage */}
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3, mb: 4 }}>
            {/* Pickup and Delivery Chart */}
            <Box sx={{ flex: { xs: '1 1 100%', md: '1 1 calc(50% - 12px)' } }}>
              <Card sx={{ bgcolor: '#1e293b', color: 'white' }}>
                <CardContent>
                  <Typography variant="h6" fontWeight={600} mb={3} sx={{ color: 'white' }}>
                    Order and Delivery
                  </Typography>
                  
                  {productSalesData.length > 0 ? (
                    <Box sx={{ position: 'relative', height: 300 }}>
                      <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                          <Pie
                            data={productSalesData}
                            cx="50%"
                            cy="50%"
                            innerRadius={80}
                            outerRadius={120}
                            fill="#8884d8"
                            dataKey="amount"
                            stroke="none"
                          >
                            {productSalesData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                            ))}
                          </Pie>
                        </PieChart>
                      </ResponsiveContainer>
                      <Box sx={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        textAlign: 'center'
                      }}>
                        <Typography variant="h3" fontWeight={700} sx={{ color: 'white' }}>
                          {Math.round((todayTotal / monthTotal) * 100) || 30}%
                        </Typography>
                        <Typography variant="body2" sx={{ opacity: 0.7 }}>
                          Order Segments
                        </Typography>
                      </Box>
                    </Box>
                  ) : (
                    <Box sx={{ height: 300, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Alert severity="info" sx={{ bgcolor: 'rgba(59, 130, 246, 0.1)', color: 'white' }}>
                        No order data available!
                      </Alert>
                    </Box>
                  )}
                  
                  {/* Legend */}
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mt: 2 }}>
                    <Box display="flex" alignItems="center" gap={1}>
                      <Box sx={{ width: 12, height: 12, bgcolor: '#10b981', borderRadius: '50%' }} />
                      <Typography variant="caption" sx={{ opacity: 0.8 }}>Waiting For Pickup</Typography>
                    </Box>
                    <Box display="flex" alignItems="center" gap={1}>
                      <Box sx={{ width: 12, height: 12, bgcolor: '#3b82f6', borderRadius: '50%' }} />
                      <Typography variant="caption" sx={{ opacity: 0.8 }}>Pickup Done</Typography>
                    </Box>
                    <Box display="flex" alignItems="center" gap={1}>
                      <Box sx={{ width: 12, height: 12, bgcolor: '#f59e0b', borderRadius: '50%' }} />
                      <Typography variant="caption" sx={{ opacity: 0.8 }}>Waiting For Delivery</Typography>
                    </Box>
                    <Box display="flex" alignItems="center" gap={1}>
                      <Box sx={{ width: 12, height: 12, bgcolor: '#ef4444', borderRadius: '50%' }} />
                      <Typography variant="caption" sx={{ opacity: 0.8 }}>Delivery Done</Typography>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Box>

            {/* Job Stage */}
            <Box sx={{ flex: { xs: '1 1 100%', md: '1 1 calc(50% - 12px)' } }}>
              <Card sx={{ bgcolor: '#1e293b', color: 'white' }}>
                <CardContent>
                  <Typography variant="h6" fontWeight={600} mb={3} sx={{ color: 'white' }}>
                    Order Stage
                  </Typography>
                  
                  {/* Stage Tabs */}
                  <Box sx={{ display: 'flex', mb: 3, bgcolor: 'rgba(255,255,255,0.1)', borderRadius: 1, p: 0.5 }}>
                    <Button 
                      variant="contained" 
                      size="small" 
                      sx={{ 
                        bgcolor: '#f59e0b', 
                        color: 'white',
                        minWidth: 'auto',
                        px: 2,
                        mr: 1,
                        '&:hover': { bgcolor: '#d97706' }
                      }}
                    >
                      Customer Request
                    </Button>
                    <Button 
                      variant="text" 
                      size="small" 
                      sx={{ color: 'rgba(255,255,255,0.7)', minWidth: 'auto', px: 2, mr: 1 }}
                    >
                      On Process
                    </Button>
                    <Button 
                      variant="text" 
                      size="small" 
                      sx={{ color: 'rgba(255,255,255,0.7)', minWidth: 'auto', px: 2 }}
                    >
                      Completed
                    </Button>
                  </Box>
                  
                  {/* Recent Orders List */}
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    {recentBills.slice(0, 4).map((bill, index) => (
                      <Box key={bill.billNumber} sx={{ 
                        bgcolor: 'rgba(255,255,255,0.05)', 
                        borderRadius: 1, 
                        p: 2,
                        border: '1px solid rgba(255,255,255,0.1)'
                      }}>
                        <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                          <Typography variant="body2" fontWeight={600} sx={{ color: 'white' }}>
                            {bill.billNumber}
                          </Typography>
                          <Chip 
                            label={formatCurrency(bill.total)} 
                            size="small" 
                            sx={{ 
                              bgcolor: '#10b981', 
                              color: 'white',
                              fontWeight: 600
                            }}
                          />
                        </Box>
                        <Typography variant="caption" sx={{ opacity: 0.7, display: 'block' }}>
                          Customer: {bill.customerInfo.name}
                        </Typography>
                        <Typography variant="caption" sx={{ opacity: 0.7 }}>
                          Phone: {bill.customerInfo.phone}
                        </Typography>
                      </Box>
                    ))}
                    
                    {recentBills.length === 0 && (
                      <Alert severity="info" sx={{ bgcolor: 'rgba(59, 130, 246, 0.1)', color: 'white' }}>
                        No recent orders found!
                      </Alert>
                    )}
                  </Box>
                </CardContent>
              </Card>
            </Box>
          </Box>

          {/* Orders and Status Table */}
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
            <Box sx={{ flex: '1 1 100%' }}>
              <Card sx={{ bgcolor: '#1e293b', color: 'white' }}>
                <CardContent>
                  <Typography variant="h6" fontWeight={600} mb={3} sx={{ color: 'white' }}>
                    Orders and Status
                  </Typography>
                  
                  {bills.length > 0 ? (
                    <TableContainer sx={{ bgcolor: 'transparent' }}>
                      <Table>
                        <TableHead>
                          <TableRow>
                            <TableCell sx={{ color: 'rgba(255,255,255,0.7)', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                              ORDER ID
                            </TableCell>
                            <TableCell sx={{ color: 'rgba(255,255,255,0.7)', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                              ASSIGNED EMPLOYEE
                            </TableCell>
                            <TableCell sx={{ color: 'rgba(255,255,255,0.7)', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                              ASSIGNED EMPLOYEE
                            </TableCell>
                            <TableCell sx={{ color: 'rgba(255,255,255,0.7)', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                              CURRENT STATUS
                            </TableCell>
                            <TableCell sx={{ color: 'rgba(255,255,255,0.7)', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                              PROGRESS
                            </TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {bills.slice(0, 5).map((bill, index) => {
                            const statuses = ['Waiting for Parts', 'Received', 'Started', 'Received', 'Machining'];
                            const employees = ['Bench/Work Motor', 'Lucas TKD Wiper Motor', 'Lucas TKD Wiper Motor', 'Bench/Work Motor', 'Subaru Speaker Motor'];
                            const assignedEmployees = ['Eissa R', 'Ramza R', 'Kazi M', 'Machdy M'];
                            const progressValues = [54, 67, 82, 45, 78];
                            
                            return (
                              <TableRow key={bill.billNumber}>
                                <TableCell sx={{ color: 'white', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                                  <Typography variant="body2" fontWeight={600}>
                                    {bill.billNumber}
                                  </Typography>
                                </TableCell>
                                <TableCell sx={{ color: 'white', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                                  <Typography variant="body2">
                                    {employees[index % employees.length]}
                                  </Typography>
                                </TableCell>
                                <TableCell sx={{ color: 'white', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                                  <Typography variant="body2">
                                    {assignedEmployees[index % assignedEmployees.length]}
                                  </Typography>
                                </TableCell>
                                <TableCell sx={{ borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                                  <Chip 
                                    label={statuses[index % statuses.length]}
                                    size="small"
                                    sx={{ 
                                      bgcolor: index % 2 === 0 ? '#f59e0b' : '#10b981',
                                      color: 'white',
                                      fontWeight: 600
                                    }}
                                  />
                                </TableCell>
                                <TableCell sx={{ borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                    <Box sx={{ 
                                      flexGrow: 1,
                                      height: 8, 
                                      bgcolor: 'rgba(255,255,255,0.1)', 
                                      borderRadius: 4,
                                      overflow: 'hidden'
                                    }}>
                                      <Box sx={{ 
                                        width: `${progressValues[index % progressValues.length]}%`, 
                                        height: '100%', 
                                        bgcolor: '#f59e0b',
                                        borderRadius: 4
                                      }} />
                                    </Box>
                                    <Typography variant="body2" sx={{ color: 'white', fontWeight: 600, minWidth: '40px' }}>
                                      {progressValues[index % progressValues.length]}%
                                    </Typography>
                                  </Box>
                                </TableCell>
                              </TableRow>
                            );
                          })}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  ) : (
                    <Alert severity="info" sx={{ bgcolor: 'rgba(59, 130, 246, 0.1)', color: 'white' }}>
                      No orders found. <Link href="/create-bill" style={{ color: '#3b82f6' }}>Create your first order</Link> to get started!
                    </Alert>
                  )}
                  
                  {bills.length > 5 && (
                    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 1, mt: 3 }}>
                      <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)' }}>
                        Showing 1 to 5 of {bills.length} entries
                      </Typography>
                      <Box sx={{ display: 'flex', gap: 1, ml: 2 }}>
                        {[1, 2, 3, 4, 5].map((page) => (
                          <Button
                            key={page}
                            variant={page === 1 ? "contained" : "outlined"}
                            size="small"
                            sx={{
                              minWidth: 32,
                              width: 32,
                              height: 32,
                              bgcolor: page === 1 ? '#f59e0b' : 'transparent',
                              color: page === 1 ? 'white' : 'rgba(255,255,255,0.7)',
                              border: page === 1 ? 'none' : '1px solid rgba(255,255,255,0.3)',
                              '&:hover': {
                                bgcolor: page === 1 ? '#d97706' : 'rgba(255,255,255,0.1)'
                              }
                            }}
                          >
                            {page}
                          </Button>
                        ))}
                      </Box>
                    </Box>
                  )}
                </CardContent>
              </Card>
            </Box>
          </Box>
        </Container>
      </Box>
    </ThemeProvider>
    </>
  )
}
