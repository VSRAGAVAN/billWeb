'use client'

import {
  AccountCircle as AccountCircleIcon,
  Add as AddIcon,
  Assessment as AssessmentIcon,
  Assignment as AssignmentIcon,
  ChevronLeft as ChevronLeftIcon,
  Dashboard as DashboardIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
  FilterList as FilterIcon,
  Inventory as InventoryIcon,
  Logout as LogoutIcon,
  Mail as MailIcon,
  Menu as MenuIcon,
  MoreVert as MoreIcon,
  Notifications as NotificationsIcon,
  People as PeopleIcon,
  Receipt as ReceiptIcon,
  Save as SaveIcon,
  Search as SearchIcon,
  Settings as SettingsIcon
} from '@mui/icons-material'
// Removed unused import CloseIcon
import {
  AppBar,
  Avatar,
  Badge,
  Box,
  Button,
  Card,
  CardContent,
  Checkbox,
  Chip,
  Container,
  createTheme,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
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
  TablePagination,
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
    primary: { main: '#f59e0b' },
    secondary: { main: '#10b981' },
    background: { default: '#0f172a', paper: '#1e293b' },
    text: { primary: '#f1f5f9', secondary: '#cbd5e1' },
  },
})

const drawerWidth = 280

const Search = styled('div')(({ theme }) => ({
  position: 'relative',
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  '&:hover': { backgroundColor: alpha(theme.palette.common.white, 0.25) },
  marginRight: theme.spacing(2),
  marginLeft: 0,
  width: '100%',
  [theme.breakpoints.up('sm')]: { marginLeft: theme.spacing(3), width: 'auto' },
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
  padding: theme.spacing(1, 1, 1, 0),
  paddingLeft: `calc(1em + ${theme.spacing(4)})`,
  transition: theme.transitions.create('width'),
  [theme.breakpoints.up('md')]: { width: '20ch' },
}))

const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(0, 1),
  ...theme.mixins.toolbar,
  justifyContent: 'flex-end',
}))

interface Customer {
  id: number
  name: string
  email: string
  mobile: string
  company: string
  gst: string
  status: 'ACTIVE' | 'INACTIVE'
  initials: string
}

const initialCustomers: Customer[] = [
  { id: 1, name: 'Mari', email: 'mari@gmail.com', mobile: '9731303030', company: 'Trident Automobiles', gst: '29AAICI4188P1ZB', status: 'ACTIVE', initials: 'M' },
  { id: 2, name: 'Esakki', email: 'esakki710@gmail.com', mobile: '9739862927', company: 'GENUINE', gst: '29ASWPS8470L1ZD', status: 'ACTIVE', initials: 'E' },
  { id: 3, name: 'Seenivasan', email: 'seenivasan@gmail.com', mobile: '9876544698', company: 'Ganapathy Timbers', gst: '29BWXP5847L1ZS', status: 'ACTIVE', initials: 'S' },
  { id: 4, name: 'Boobalan R', email: 'kitten.meowpaw@gmail.com', mobile: '7871320105', company: 'Testing', gst: '-', status: 'ACTIVE', initials: 'BR' },
  { id: 5, name: 'Maha V', email: 'maha@gmail.com', mobile: '8737563758', company: 'Gem', gst: '-', status: 'ACTIVE', initials: 'MV' },
  { id: 6, name: 'Srevi S', email: 'tobowi640@fujebr.com', mobile: '9807867878', company: 'Test', gst: '-', status: 'ACTIVE', initials: 'SS' },
  { id: 7, name: 'Testname Name', email: 'testname@gmail.com', mobile: '9998889990', company: '', gst: '', status: 'ACTIVE', initials: 'TN' },
  { id: 8, name: 'Yatran Y', email: 'admin@genuine@gmail.com', mobile: '9087665657', company: 'Zoho', gst: '', status: 'ACTIVE', initials: 'YY' },
  { id: 9, name: 'Guru Anna', email: 'wisax2782@gardair.com', mobile: '9827367136', company: 'Test', gst: '-', status: 'ACTIVE', initials: 'GA' },
  { id: 10, name: 'Jon Snow', email: 'blindarkman@gmail.com', mobile: '9074189699', company: 'Winterfell', gst: '33AAACH7409R1Z8', status: 'ACTIVE', initials: 'JS' }
]

export default function CustomersPage() {
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const [mobileMoreAnchorEl, setMobileMoreAnchorEl] = useState<null | HTMLElement>(null)
  const [customers, setCustomers] = useState<Customer[]>(initialCustomers)
  const [openDialog, setOpenDialog] = useState(false)
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null)
  const [formData, setFormData] = useState<Partial<Customer>>({})
  const [selectedCustomers, setSelectedCustomers] = useState<number[]>([])
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(10)
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
  const handleMobileMenuOpen = (event: React.MouseEvent<HTMLElement>) => setMobileMoreAnchorEl(event.currentTarget)
  const handleMobileMenuClose = () => setMobileMoreAnchorEl(null)

  const handleLogout = () => {
    localStorage.removeItem('userData')
    window.location.href = '/login'
  }

  const filteredCustomers = customers.filter(customer =>
    customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.company.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const paginatedCustomers = filteredCustomers.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)

  const handleOpenDialog = (customer?: Customer) => {
    if (customer) {
      setEditingCustomer(customer)
      setFormData(customer)
    } else {
      setEditingCustomer(null)
      setFormData({
        name: '',
        email: '',
        mobile: '',
        company: '',
        gst: '',
        status: 'ACTIVE',
        initials: ''
      })
    }
    setOpenDialog(true)
  }

  const handleCloseDialog = () => {
    setOpenDialog(false)
    setEditingCustomer(null)
    setFormData({})
  }

  const generateInitials = (name: string) => {
    return name.split(' ').map(word => word.charAt(0).toUpperCase()).join('').substring(0, 2)
  }

  const handleSaveCustomer = () => {
    if (!formData.name || !formData.email || !formData.mobile) {
      alert('Please fill in required fields')
      return
    }

    const customerData = {
      ...formData,
      initials: generateInitials(formData.name || ''),
    } as Customer

    if (editingCustomer) {
      // Update existing customer
      setCustomers(prev => prev.map(customer => 
        customer.id === editingCustomer.id ? { ...customerData, id: editingCustomer.id } : customer
      ))
    } else {
      // Add new customer
      const newId = Math.max(...customers.map(c => c.id)) + 1
      setCustomers(prev => [...prev, { ...customerData, id: newId }])
    }

    handleCloseDialog()
  }

  const handleDeleteCustomer = (customerId: number) => {
    if (window.confirm('Are you sure you want to delete this customer?')) {
      setCustomers(prev => prev.filter(customer => customer.id !== customerId))
    }
  }

  const handleSelectCustomer = (customerId: number) => {
    setSelectedCustomers(prev => 
      prev.includes(customerId) 
        ? prev.filter(id => id !== customerId)
        : [...prev, customerId]
    )
  }

  const handleSelectAll = () => {
    if (selectedCustomers.length === paginatedCustomers.length) {
      setSelectedCustomers([])
    } else {
      setSelectedCustomers(paginatedCustomers.map(customer => customer.id))
    }
  }

  const handleDeleteSelected = () => {
    if (window.confirm(`Are you sure you want to delete ${selectedCustomers.length} selected customers?`)) {
      setCustomers(prev => prev.filter(customer => !selectedCustomers.includes(customer.id)))
      setSelectedCustomers([])
    }
  }

  const isMenuOpen = Boolean(anchorEl)
  const isMobileMenuOpen = Boolean(mobileMoreAnchorEl)

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ bgcolor: 'background.default', minHeight: '100vh' }}>
        {/* Header */}
        <AppBar position="static" elevation={0}>
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
                aria-label="search"
                value={searchTerm} 
                onChange={(e) => setSearchTerm(e.target.value)}
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
                <Avatar sx={{ bgcolor: 'primary.main' }}>
                  <AccountCircleIcon />
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
                  '&:hover': { bgcolor: 'rgba(255, 255, 255, 0.1)' }
                }}
              >
                <ListItemIcon sx={{ color: 'white' }}>
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
                  color: '#f59e0b',
                  bgcolor: 'rgba(245, 158, 11, 0.1)',
                  '&:hover': { bgcolor: 'rgba(245, 158, 11, 0.2)' }
                }}
              >
                <ListItemIcon sx={{ color: '#f59e0b' }}>
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
        </Menu>

        {/* Main Content */}
        <Container maxWidth="xl" sx={{ py: 3 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Typography variant="h4" fontWeight={700} sx={{ color: 'white' }}>
              Customer Management
            </Typography>
            <Button 
              variant="contained" 
              startIcon={<AddIcon />} 
              onClick={() => handleOpenDialog()}
              sx={{ 
                bgcolor: '#f59e0b', 
                color: 'black', 
                fontWeight: 600, 
                '&:hover': { bgcolor: '#d97706' } 
              }}
            >
              Add Customer
            </Button>
          </Box>

          <Card sx={{ bgcolor: '#1e293b', color: 'white' }}>
            <CardContent sx={{ p: 0 }}>
              {/* Filters and Actions */}
              <Box sx={{ p: 2, borderBottom: '1px solid rgba(255, 255, 255, 0.1)' }}>
                <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', justifyContent: 'space-between' }}>
                  <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                    <IconButton sx={{ color: 'white' }}><FilterIcon /></IconButton>
                    <TextField
                      size="small" 
                      placeholder="Search by name, email, or company..." 
                      value={searchTerm} 
                      onChange={(e) => setSearchTerm(e.target.value)}
                      InputProps={{ 
                        startAdornment: (
                          <InputAdornment position="start">
                            <SearchIcon sx={{ color: 'rgba(255, 255, 255, 0.5)' }} />
                          </InputAdornment>
                        ) 
                      }}
                      sx={{ 
                        width: 300,
                        '& .MuiOutlinedInput-root': { 
                          color: 'white', 
                          '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.3)' }, 
                          '&:hover fieldset': { borderColor: 'rgba(255, 255, 255, 0.5)' }, 
                          '&.Mui-focused fieldset': { borderColor: '#f59e0b' } 
                        } 
                      }}
                    />
                  </Box>
                  {selectedCustomers.length > 0 && (
                    <Button 
                      variant="outlined" 
                      color="error" 
                      startIcon={<DeleteIcon />}
                      onClick={handleDeleteSelected}
                    >
                      Delete Selected ({selectedCustomers.length})
                    </Button>
                  )}
                </Box>
              </Box>

              {/* Table */}
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow sx={{ '& th': { borderBottom: '1px solid rgba(255, 255, 255, 0.1)' } }}>
                      <TableCell sx={{ color: 'white', fontWeight: 600 }}>
                        <Checkbox 
                          checked={selectedCustomers.length === paginatedCustomers.length && paginatedCustomers.length > 0}
                          indeterminate={selectedCustomers.length > 0 && selectedCustomers.length < paginatedCustomers.length}
                          onChange={handleSelectAll}
                          sx={{ color: 'white' }}
                        />
                      </TableCell>
                      <TableCell sx={{ color: 'white', fontWeight: 600 }}>S NO</TableCell>
                      <TableCell sx={{ color: 'white', fontWeight: 600 }}>CUSTOMER NAME</TableCell>
                      <TableCell sx={{ color: 'white', fontWeight: 600 }}>EMAIL</TableCell>
                      <TableCell sx={{ color: 'white', fontWeight: 600 }}>MOBILE NUMBER</TableCell>
                      <TableCell sx={{ color: 'white', fontWeight: 600 }}>COMPANY NAME</TableCell>
                      <TableCell sx={{ color: 'white', fontWeight: 600 }}>GST</TableCell>
                      <TableCell sx={{ color: 'white', fontWeight: 600 }}>STATUS</TableCell>
                      <TableCell sx={{ color: 'white', fontWeight: 600 }}>ACTION</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {paginatedCustomers.map((customer, index) => (
                      <TableRow 
                        key={customer.id} 
                        sx={{ 
                          '& td': { borderBottom: '1px solid rgba(255, 255, 255, 0.1)' }, 
                          '&:hover': { bgcolor: 'rgba(255, 255, 255, 0.05)' } 
                        }}
                      >
                        <TableCell>
                          <Checkbox 
                            checked={selectedCustomers.includes(customer.id)}
                            onChange={() => handleSelectCustomer(customer.id)}
                            sx={{ color: 'white' }}
                          />
                        </TableCell>
                        <TableCell sx={{ color: 'white' }}>{page * rowsPerPage + index + 1}</TableCell>
                        <TableCell>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                            <Avatar sx={{ bgcolor: '#f59e0b', color: 'black', width: 32, height: 32 }}>
                              {customer.initials}
                            </Avatar>
                            <Typography sx={{ color: 'white', fontWeight: 500 }}>
                              {customer.name}
                            </Typography>
                          </Box>
                        </TableCell>
                        <TableCell sx={{ color: 'rgba(255, 255, 255, 0.8)' }}>{customer.email}</TableCell>
                        <TableCell sx={{ color: 'rgba(255, 255, 255, 0.8)' }}>{customer.mobile}</TableCell>
                        <TableCell sx={{ color: 'rgba(255, 255, 255, 0.8)' }}>{customer.company || '-'}</TableCell>
                        <TableCell sx={{ color: 'rgba(255, 255, 255, 0.8)' }}>{customer.gst || '-'}</TableCell>
                        <TableCell>
                          <Chip 
                            label={customer.status} 
                            size="small"
                            sx={{ 
                              bgcolor: customer.status === 'ACTIVE' ? '#10b981' : '#ef4444', 
                              color: 'white',
                              fontWeight: 500
                            }} 
                          />
                        </TableCell>
                        <TableCell>
                          <Box sx={{ display: 'flex', gap: 1 }}>
                            <IconButton 
                              size="small" 
                              sx={{ color: '#10b981' }}
                              onClick={() => handleOpenDialog(customer)}
                            >
                              <EditIcon fontSize="small" />
                            </IconButton>
                            <IconButton 
                              size="small" 
                              sx={{ color: '#ef4444' }}
                              onClick={() => handleDeleteCustomer(customer.id)}
                            >
                              <DeleteIcon fontSize="small" />
                            </IconButton>
                          </Box>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>

              {/* Pagination */}
              <TablePagination
                rowsPerPageOptions={[5, 10, 25]}
                component="div"
                count={filteredCustomers.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={(event, newPage) => setPage(newPage)}
                onRowsPerPageChange={(event) => {
                  setRowsPerPage(parseInt(event.target.value, 10))
                  setPage(0)
                }}
                sx={{ 
                  color: 'white',
                  borderTop: '1px solid rgba(255, 255, 255, 0.1)',
                  '& .MuiTablePagination-toolbar': { color: 'white' },
                  '& .MuiTablePagination-selectLabel': { color: 'white' },
                  '& .MuiTablePagination-displayedRows': { color: 'white' }
                }}
              />
            </CardContent>
          </Card>
        </Container>

        {/* Add/Edit Customer Dialog */}
        <Dialog 
          open={openDialog} 
          onClose={handleCloseDialog} 
          maxWidth="md" 
          fullWidth
          PaperProps={{ sx: { bgcolor: '#1e293b', color: 'white' } }}
        >
          <DialogTitle sx={{ color: 'white', borderBottom: '1px solid rgba(255, 255, 255, 0.1)' }}>
            {editingCustomer ? 'Edit Customer' : 'Add New Customer'}
          </DialogTitle>
          <DialogContent sx={{ py: 3 }}>
            <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 3 }}>
              <TextField
                fullWidth
                label="Customer Name"
                required
                value={formData.name || ''}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                sx={{ 
                  '& .MuiOutlinedInput-root': { 
                    color: 'white', 
                    '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.3)' }, 
                    '&:hover fieldset': { borderColor: 'rgba(255, 255, 255, 0.5)' }, 
                    '&.Mui-focused fieldset': { borderColor: '#f59e0b' } 
                  },
                  '& .MuiInputLabel-root': { color: 'rgba(255, 255, 255, 0.7)' }
                }}
              />
              <TextField
                fullWidth
                label="Email"
                required
                type="email"
                value={formData.email || ''}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                sx={{ 
                  '& .MuiOutlinedInput-root': { 
                    color: 'white', 
                    '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.3)' }, 
                    '&:hover fieldset': { borderColor: 'rgba(255, 255, 255, 0.5)' }, 
                    '&.Mui-focused fieldset': { borderColor: '#f59e0b' } 
                  },
                  '& .MuiInputLabel-root': { color: 'rgba(255, 255, 255, 0.7)' }
                }}
              />
              <TextField
                fullWidth
                label="Mobile Number"
                required
                value={formData.mobile || ''}
                onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
                sx={{ 
                  '& .MuiOutlinedInput-root': { 
                    color: 'white', 
                    '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.3)' }, 
                    '&:hover fieldset': { borderColor: 'rgba(255, 255, 255, 0.5)' }, 
                    '&.Mui-focused fieldset': { borderColor: '#f59e0b' } 
                  },
                  '& .MuiInputLabel-root': { color: 'rgba(255, 255, 255, 0.7)' }
                }}
              />
              <TextField
                fullWidth
                label="Company Name"
                value={formData.company || ''}
                onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                sx={{ 
                  '& .MuiOutlinedInput-root': { 
                    color: 'white', 
                    '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.3)' }, 
                    '&:hover fieldset': { borderColor: 'rgba(255, 255, 255, 0.5)' }, 
                    '&.Mui-focused fieldset': { borderColor: '#f59e0b' } 
                  },
                  '& .MuiInputLabel-root': { color: 'rgba(255, 255, 255, 0.7)' }
                }}
              />
              <TextField
                fullWidth
                label="GST Number"
                value={formData.gst || ''}
                onChange={(e) => setFormData({ ...formData, gst: e.target.value })}
                sx={{ 
                  '& .MuiOutlinedInput-root': { 
                    color: 'white', 
                    '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.3)' }, 
                    '&:hover fieldset': { borderColor: 'rgba(255, 255, 255, 0.5)' }, 
                    '&.Mui-focused fieldset': { borderColor: '#f59e0b' } 
                  },
                  '& .MuiInputLabel-root': { color: 'rgba(255, 255, 255, 0.7)' }
                }}
              />
              <FormControl fullWidth>
                <InputLabel sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>Status</InputLabel>
                <Select
                  value={formData.status || 'ACTIVE'}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value as 'ACTIVE' | 'INACTIVE' })}
                  sx={{ 
                    color: 'white', 
                    '& .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255, 255, 255, 0.3)' },
                    '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255, 255, 255, 0.5)' },
                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#f59e0b' }
                  }}
                >
                  <MenuItem value="ACTIVE">Active</MenuItem>
                  <MenuItem value="INACTIVE">Inactive</MenuItem>
                </Select>
              </FormControl>
            </Box>
          </DialogContent>
          <DialogActions sx={{ borderTop: '1px solid rgba(255, 255, 255, 0.1)', p: 2 }}>
            <Button onClick={handleCloseDialog} sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
              Cancel
            </Button>
            <Button 
              onClick={handleSaveCustomer} 
              variant="contained" 
              startIcon={<SaveIcon />}
              sx={{ bgcolor: '#f59e0b', color: 'black', '&:hover': { bgcolor: '#d97706' } }}
            >
              {editingCustomer ? 'Update' : 'Add'} Customer
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </ThemeProvider>
  )
}
