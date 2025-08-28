'use client'

import {
  AccountCircle as AccountCircleIcon,
  Add as AddIcon,
  Assessment as AssessmentIcon,
  Assignment as AssignmentIcon,
  Category as CategoryIcon,
  ChevronLeft as ChevronLeftIcon,
  Dashboard as DashboardIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
  Inventory as InventoryIcon,
  Logout as LogoutIcon,
  Mail as MailIcon,
  Menu as MenuIcon,
  // MoreVert as MoreIcon, (removed unused import)
  Notifications as NotificationsIcon,
  People as PeopleIcon,
  Receipt as ReceiptIcon,
  Search as SearchIcon,
  Settings as SettingsIcon,
  TrendingUp as TrendingUpIcon,
  Warning as WarningIcon
} from '@mui/icons-material'
import {
  AppBar,
  Avatar,
  Badge,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Container,
  createTheme,
  Divider,
  Drawer,
  FormControl,
  IconButton,
  InputAdornment,
  InputLabel,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  Select,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  ThemeProvider,
  Toolbar,
  Typography
} from '@mui/material'
import { alpha, styled } from '@mui/material/styles'
import Link from 'next/link'
import { useEffect, useState } from 'react'

const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#f59e0b',
    },
    secondary: {
      main: '#10b981',
    },
    background: {
      default: '#0f172a',
      paper: '#1e293b',
    },
    text: {
      primary: '#f1f5f9',
      secondary: '#cbd5e1',
    },
  },
})

const drawerWidth = 280

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
}))

const SearchIconWrapper = styled('div')(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: '100%',
  position: 'absolute',
  pointerEvents: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}))

const StyledInputBase = styled('input')(({ theme }) => ({
  color: 'inherit',
  width: '100%',
  '& .MuiInputBase-input': {
    padding: theme.spacing(1, 1, 1, 0),
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create('width'),
    [theme.breakpoints.up('md')]: {
      width: '20ch',
    },
  },
}))

const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(0, 1),
  ...theme.mixins.toolbar,
  justifyContent: 'flex-end',
}))

const inventoryItems = [
  {
    id: 1,
    name: 'Teak Wood',
    category: 'Premium Wood',
    quantity: 150,
    unit: 'Cubic Feet',
    price: 2500,
    minStock: 50,
    supplier: 'Tamil Nadu Timber',
    status: 'In Stock',
    image: '/TeakWood.jpg'
  },
  {
    id: 2,
    name: 'Rose Wood',
    category: 'Premium Wood',
    quantity: 25,
    unit: 'Cubic Feet',
    price: 4500,
    minStock: 30,
    supplier: 'Kerala Wood Co.',
    status: 'Low Stock',
    image: '/Rosewood.jpg'
  },
  {
    id: 3,
    name: 'Pine Wood',
    category: 'Softwood',
    quantity: 300,
    unit: 'Cubic Feet',
    price: 800,
    minStock: 100,
    supplier: 'Himalayan Timber',
    status: 'In Stock',
    image: '/PineWood.jpg'
  },
  {
    id: 4,
    name: 'Plywood',
    category: 'Engineered Wood',
    quantity: 80,
    unit: 'Sheets',
    price: 1200,
    minStock: 50,
    supplier: 'Century Plyboards',
    status: 'In Stock',
    image: '/Plywood.jpeg'
  },
  {
    id: 5,
    name: 'MDF Board',
    category: 'Engineered Wood',
    quantity: 15,
    unit: 'Sheets',
    price: 600,
    minStock: 25,
    supplier: 'Greenpanel Industries',
    status: 'Low Stock',
    image: '/MDFBoard.jpeg'
  },
  {
    id: 6,
    name: 'Particle Board',
    category: 'Engineered Wood',
    quantity: 120,
    unit: 'Sheets',
    price: 450,
    minStock: 30,
    supplier: 'Rushil Decor',
    status: 'In Stock',
    image: '/ParticleBoard.png'
  }
]

export default function InventoryPage() {
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  // const [mobileMoreAnchorEl, setMobileMoreAnchorEl] = useState<null | HTMLElement>(null)
  const [user, setUser] = useState({ email: '', name: '', displayName: '' })

  // Load user data on component mount
  useEffect(() => {
    const userData = localStorage.getItem('userData')
    if (userData) {
      setUser(JSON.parse(userData))
    }
  }, [])

  const handleDrawerOpen = () => setDrawerOpen(true)
  const handleDrawerClose = () => setDrawerOpen(false)

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => setAnchorEl(event.currentTarget)
  const handleMenuClose = () => setAnchorEl(null)

  // const handleMobileMenuOpen = (event: React.MouseEvent<HTMLElement>) => setMobileMoreAnchorEl(event.currentTarget)
  // Removed unused variable: handleMobileMenuClose

  const handleLogout = () => {
    localStorage.removeItem('isLoggedIn')
    localStorage.removeItem('userEmail')
    window.location.href = '/login'
  }

  const filteredItems = inventoryItems.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.supplier.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = !categoryFilter || item.category === categoryFilter
    const matchesStatus = !statusFilter || item.status === statusFilter
    
    return matchesSearch && matchesCategory && matchesStatus
  })

  const categories = [...new Set(inventoryItems.map(item => item.category))]
  const statuses = [...new Set(inventoryItems.map(item => item.status))]

  const totalItems = inventoryItems.length
  const lowStockItems = inventoryItems.filter(item => item.quantity <= item.minStock).length
  const totalValue = inventoryItems.reduce((sum, item) => sum + (item.quantity * item.price), 0)

  const isMenuOpen = Boolean(anchorEl)
  // Removed unused variable: isMobileMenuOpen

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'In Stock':
        return '#10b981'
      case 'Low Stock':
        return '#f59e0b'
      case 'Out of Stock':
        return '#ef4444'
      default:
        return '#6b7280'
    }
  }

  const getStockIcon = (item: typeof inventoryItems[0]) => {
    if (item.quantity <= item.minStock) {
      return <WarningIcon sx={{ color: '#f59e0b', fontSize: 16 }} />
    }
    return null
  }

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ bgcolor: 'background.default', minHeight: '100vh' }}>
        {/* Header */}
        <AppBar position="static" elevation={0}>
          <Toolbar>
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

            <Box sx={{ display: 'flex', alignItems: 'center', mr: 3 }}>
              <InventoryIcon sx={{ mr: 1, color: 'primary.main', fontSize: 32 }} />
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
                Inventory Management
              </Typography>
            </Box>

            <Search>
              <SearchIconWrapper>
                <SearchIcon />
              </SearchIconWrapper>
              <StyledInputBase
                placeholder="Search inventory..."
                aria-label="search"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </Search>

            <Box sx={{ flexGrow: 1 }} />

            <Box sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'center', gap: 1 }}>
              <IconButton size="large" aria-label="show 4 new mails" color="inherit">
                <Badge badgeContent={4} color="error">
                  <MailIcon />
                </Badge>
              </IconButton>
              <IconButton size="large" aria-label="show 17 new notifications" color="inherit">
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
                onClick={handleMenuOpen}
                color="inherit"
              >
                <Avatar sx={{ bgcolor: 'primary.main' }}>
                  <AccountCircleIcon />
                </Avatar>
              </IconButton>
            </Box>

            <Box sx={{ display: { xs: 'flex', md: 'none' } }}>
              {/* Mobile menu button removed (was unused and caused JSX errors) */}
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
            <ListItem disablePadding>
              <ListItemButton component={Link} href="/dashboard" sx={{ color: 'white', '&:hover': { bgcolor: 'rgba(255, 255, 255, 0.1)' } }}>
                <ListItemIcon sx={{ color: 'white' }}><DashboardIcon /></ListItemIcon>
                <ListItemText primary="Dashboard" />
              </ListItemButton>
            </ListItem>

            <ListItem disablePadding>
              <ListItemButton component={Link} href="/create-bill" sx={{ color: 'white', '&:hover': { bgcolor: 'rgba(255, 255, 255, 0.1)' } }}>
                <ListItemIcon sx={{ color: 'white' }}><AddIcon /></ListItemIcon>
                <ListItemText primary="Create Bill" />
              </ListItemButton>
            </ListItem>

            <ListItem disablePadding>
              <ListItemButton component={Link} href="/bills" sx={{ color: 'white', '&:hover': { bgcolor: 'rgba(255, 255, 255, 0.1)' } }}>
                <ListItemIcon sx={{ color: 'white' }}><AssignmentIcon /></ListItemIcon>
                <ListItemText primary="All Bills" />
              </ListItemButton>
            </ListItem>

            <ListItem disablePadding>
              <ListItemButton component={Link} href="/customers" sx={{ color: 'white', '&:hover': { bgcolor: 'rgba(255, 255, 255, 0.1)' } }}>
                <ListItemIcon sx={{ color: 'white' }}><PeopleIcon /></ListItemIcon>
                <ListItemText primary="Customers" />
              </ListItemButton>
            </ListItem>

            <ListItem disablePadding>
              <ListItemButton 
                component={Link} 
                href="/inventory" 
                sx={{ 
                  color: 'white', 
                  '&:hover': { bgcolor: 'rgba(245, 158, 11, 0.1)' },
                  bgcolor: 'rgba(245, 158, 11, 0.2)' 
                }}
              >
                <ListItemIcon sx={{ color: '#f59e0b' }}><InventoryIcon /></ListItemIcon>
                <ListItemText primary="Inventory" />
              </ListItemButton>
            </ListItem>

            <ListItem disablePadding>
              <ListItemButton sx={{ color: 'white', '&:hover': { bgcolor: 'rgba(255, 255, 255, 0.1)' } }}>
                <ListItemIcon sx={{ color: 'white' }}><AssessmentIcon /></ListItemIcon>
                <ListItemText primary="Reports" />
              </ListItemButton>
            </ListItem>
          </List>

          <Divider sx={{ borderColor: 'rgba(255, 255, 255, 0.1)', my: 1 }} />

          <List>
            <ListItem disablePadding>
              <ListItemButton 
                component={Link}
                href="/profile"
                sx={{ 
                  color: 'white', 
                  '&:hover': { bgcolor: 'rgba(255, 255, 255, 0.1)' } 
                }}
              >
                <ListItemIcon sx={{ color: 'white' }}><AccountCircleIcon /></ListItemIcon>
                <ListItemText primary="Profile" />
              </ListItemButton>
            </ListItem>

            <ListItem disablePadding>
              <ListItemButton sx={{ color: 'white', '&:hover': { bgcolor: 'rgba(255, 255, 255, 0.1)' } }}>
                <ListItemIcon sx={{ color: 'white' }}><SettingsIcon /></ListItemIcon>
                <ListItemText primary="Settings" />
              </ListItemButton>
            </ListItem>

            <ListItem disablePadding>
              <ListItemButton onClick={handleLogout} sx={{ color: 'white', '&:hover': { bgcolor: 'rgba(239, 68, 68, 0.1)' } }}>
                <ListItemIcon sx={{ color: '#ef4444' }}><LogoutIcon /></ListItemIcon>
                <ListItemText primary="Logout" />
              </ListItemButton>
            </ListItem>
          </List>
        </Drawer>

        {/* Desktop Menu */}
        <Menu
          anchorEl={anchorEl}
          anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
          keepMounted
          transformOrigin={{ vertical: 'top', horizontal: 'right' }}
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

        {/* Main Content */}
        <Container maxWidth="xl" sx={{ py: 3 }}>
          {/* Page Header */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Typography variant="h4" fontWeight={700} sx={{ color: 'white' }}>
              Inventory Management
            </Typography>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              sx={{
                bgcolor: '#f59e0b',
                color: 'black',
                fontWeight: 600,
                '&:hover': { bgcolor: '#d97706' }
              }}
            >
              Add Item
            </Button>
          </Box>

          {/* Summary Cards */}
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
                      <CategoryIcon sx={{ color: 'white' }} />
                    </Box>
                    <Box>
                      <Typography variant="h4" fontWeight={700}>
                        {totalItems}
                      </Typography>
                      <Typography variant="body2" sx={{ opacity: 0.8 }}>
                        Total Items
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
                      <WarningIcon sx={{ color: 'white' }} />
                    </Box>
                    <Box>
                      <Typography variant="h4" fontWeight={700}>
                        {lowStockItems}
                      </Typography>
                      <Typography variant="body2" sx={{ opacity: 0.8 }}>
                        Low Stock Items
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
                      <TrendingUpIcon sx={{ color: 'white' }} />
                    </Box>
                    <Box>
                      <Typography variant="h4" fontWeight={700}>
                        ₹{totalValue.toLocaleString()}
                      </Typography>
                      <Typography variant="body2" sx={{ opacity: 0.8 }}>
                        Total Value
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
                      bgcolor: '#8b5cf6', 
                      borderRadius: '50%', 
                      width: 48, 
                      height: 48, 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center' 
                    }}>
                      <AssessmentIcon sx={{ color: 'white' }} />
                    </Box>
                    <Box>
                      <Typography variant="h4" fontWeight={700}>
                        {categories.length}
                      </Typography>
                      <Typography variant="body2" sx={{ opacity: 0.8 }}>
                        Categories
                      </Typography>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Box>
          </Box>

          {/* Inventory Table */}
          <Card sx={{ bgcolor: '#1e293b', color: 'white' }}>
            <CardContent sx={{ p: 0 }}>
              <Box sx={{ p: 2, borderBottom: '1px solid rgba(255, 255, 255, 0.1)' }}>
                <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', flexWrap: 'wrap' }}>
                  <TextField
                    size="small"
                    placeholder="Search items..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <SearchIcon sx={{ color: 'rgba(255, 255, 255, 0.5)' }} />
                        </InputAdornment>
                      ),
                    }}
                    sx={{
                      flex: 1,
                      minWidth: 200,
                      '& .MuiOutlinedInput-root': {
                        color: 'white',
                        '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.3)' },
                        '&:hover fieldset': { borderColor: 'rgba(255, 255, 255, 0.5)' },
                        '&.Mui-focused fieldset': { borderColor: '#f59e0b' },
                      },
                    }}
                  />
                  
                  <FormControl size="small" sx={{ minWidth: 150 }}>
                    <InputLabel sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>Category</InputLabel>
                    <Select
                      value={categoryFilter}
                      onChange={(e) => setCategoryFilter(e.target.value)}
                      sx={{
                        color: 'white',
                        '& .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255, 255, 255, 0.3)' },
                        '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255, 255, 255, 0.5)' },
                        '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#f59e0b' },
                      }}
                    >
                      <MenuItem value="">All Categories</MenuItem>
                      {categories.map(category => (
                        <MenuItem key={category} value={category}>{category}</MenuItem>
                      ))}
                    </Select>
                  </FormControl>

                  <FormControl size="small" sx={{ minWidth: 120 }}>
                    <InputLabel sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>Status</InputLabel>
                    <Select
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value)}
                      sx={{
                        color: 'white',
                        '& .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255, 255, 255, 0.3)' },
                        '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255, 255, 255, 0.5)' },
                        '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#f59e0b' },
                      }}
                    >
                      <MenuItem value="">All Status</MenuItem>
                      {statuses.map(status => (
                        <MenuItem key={status} value={status}>{status}</MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Box>
              </Box>

              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow sx={{ '& th': { borderBottom: '1px solid rgba(255, 255, 255, 0.1)' } }}>
                      <TableCell sx={{ color: 'white', fontWeight: 600 }}>ITEM</TableCell>
                      <TableCell sx={{ color: 'white', fontWeight: 600 }}>CATEGORY</TableCell>
                      <TableCell sx={{ color: 'white', fontWeight: 600 }}>QUANTITY</TableCell>
                      <TableCell sx={{ color: 'white', fontWeight: 600 }}>UNIT PRICE</TableCell>
                      <TableCell sx={{ color: 'white', fontWeight: 600 }}>TOTAL VALUE</TableCell>
                      <TableCell sx={{ color: 'white', fontWeight: 600 }}>SUPPLIER</TableCell>
                      <TableCell sx={{ color: 'white', fontWeight: 600 }}>STATUS</TableCell>
                      <TableCell sx={{ color: 'white', fontWeight: 600 }}>ACTION</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {filteredItems.map((item) => (
                      <TableRow 
                        key={item.id}
                        sx={{ 
                          '& td': { borderBottom: '1px solid rgba(255, 255, 255, 0.1)' },
                          '&:hover': { bgcolor: 'rgba(255, 255, 255, 0.05)' }
                        }}
                      >
                        <TableCell>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                            <Avatar 
                              src={item.image} 
                              sx={{ 
                                bgcolor: '#f59e0b', 
                                color: 'black', 
                                width: 40, 
                                height: 40 
                              }}
                            >
                              {item.name.charAt(0)}
                            </Avatar>
                            <Box>
                              <Typography sx={{ color: 'white', fontWeight: 500 }}>
                                {item.name}
                              </Typography>
                              <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.6)' }}>
                                ID: {item.id}
                              </Typography>
                            </Box>
                          </Box>
                        </TableCell>
                        <TableCell sx={{ color: 'rgba(255, 255, 255, 0.8)' }}>{item.category}</TableCell>
                        <TableCell>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Typography sx={{ color: 'white' }}>
                              {item.quantity} {item.unit}
                            </Typography>
                            {getStockIcon(item)}
                          </Box>
                        </TableCell>
                        <TableCell sx={{ color: 'rgba(255, 255, 255, 0.8)' }}>₹{item.price.toLocaleString()}</TableCell>
                        <TableCell sx={{ color: 'rgba(255, 255, 255, 0.8)' }}>₹{(item.quantity * item.price).toLocaleString()}</TableCell>
                        <TableCell sx={{ color: 'rgba(255, 255, 255, 0.8)' }}>{item.supplier}</TableCell>
                        <TableCell>
                          <Chip 
                            label={item.status} 
                            size="small"
                            sx={{ 
                              bgcolor: getStatusColor(item.status), 
                              color: 'white',
                              fontWeight: 500
                            }} 
                          />
                        </TableCell>
                        <TableCell>
                          <Box sx={{ display: 'flex', gap: 1 }}>
                            <IconButton size="small" sx={{ color: '#10b981' }}>
                              <EditIcon fontSize="small" />
                            </IconButton>
                            <IconButton size="small" sx={{ color: '#ef4444' }}>
                              <DeleteIcon fontSize="small" />
                            </IconButton>
                          </Box>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>

              <Box sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid rgba(255, 255, 255, 0.1)' }}>
                <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                  Rows per page: 10
                </Typography>
                <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                  1-{filteredItems.length} of {inventoryItems.length}
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Container>
      </Box>
    </ThemeProvider>
  )
}
