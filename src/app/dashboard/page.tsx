'use client'

import {
  Box,
  Button,
  Card,
  CardContent,
  Container,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  ThemeProvider,
  Typography,
  createTheme
} from '@mui/material'
import { useEffect, useState } from 'react'
import {
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer
} from 'recharts'
import CommonHeader from '../../components/CommonHeader'
import CommonSidebar from '../../components/CommonSidebar'
import Footer from '../../components/Footer'

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

interface BillData {
  id: string
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
  const [drawerOpen, setDrawerOpen] = useState(false)
  // Removed unused variable: bills
  const [todayTotal, setTodayTotal] = useState(0)
  const [weekTotal, setWeekTotal] = useState(0)
  const [monthTotal, setMonthTotal] = useState(0)
  const [productSalesData, setProductSalesData] = useState<{ product: string; amount: number; sales: number }[]>([])
  const [recentBills, setRecentBills] = useState<BillData[]>([])

  const colors = ['#d97706', '#059669', '#dc2626', '#7c3aed', '#2563eb', '#ea580c']

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
  // setBills(billsData) // Removed unused state
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
    })

    setTodayTotal(todaySum)
    setWeekTotal(weekSum)
    setMonthTotal(monthSum)

    // Convert product sales to chart data
    const productChartData = Object.entries(productSales)
      .map(([product, amount]) => ({ product, amount, sales: amount }))
      .sort((a, b) => b.amount - a.amount)
      .slice(0, 6)
    setProductSalesData(productChartData)
  }

  const handleDrawerOpen = () => setDrawerOpen(true)
  const handleDrawerClose = () => setDrawerOpen(false)

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR'
    }).format(amount)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ bgcolor: 'background.default', minHeight: '100vh' }}>
        {/* Common Header */}
        <CommonHeader onDrawerOpen={handleDrawerOpen} />

        {/* Common Sidebar */}
        <CommonSidebar open={drawerOpen} onClose={handleDrawerClose} />

        {/* Main Content */}
        <Container maxWidth="xl" sx={{ py: 3 }}>
          {/* Welcome Section */}
          <Box sx={{ mb: 4 }}>
            <Typography variant="h4" fontWeight={700} sx={{ color: 'white', mb: 1 }}>
              Welcome, {user.name || user.displayName || 'User'}!
            </Typography>
            <Typography variant="body1" sx={{ color: 'text.secondary' }}>
              Here&apos;s what&apos;s happening with your wood business today.
            </Typography>
          </Box>

          {/* Stats Cards */}
          <Stack direction={{ xs: 'column', md: 'row' }} spacing={3} sx={{ mb: 4 }}>
            <Card sx={{ bgcolor: 'background.paper', borderRadius: 2, flex: 1 }}>
              <CardContent>
                <Typography variant="h6" sx={{ color: 'primary.main', mb: 1 }}>
                  Today&apos;s Sales
                </Typography>
                <Typography variant="h4" fontWeight={700} sx={{ color: 'white' }}>
                  {formatCurrency(todayTotal)}
                </Typography>
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                  Revenue generated today
                </Typography>
              </CardContent>
            </Card>

            <Card sx={{ bgcolor: 'background.paper', borderRadius: 2, flex: 1 }}>
              <CardContent>
                <Typography variant="h6" sx={{ color: 'secondary.main', mb: 1 }}>
                  This Week
                </Typography>
                <Typography variant="h4" fontWeight={700} sx={{ color: 'white' }}>
                  {formatCurrency(weekTotal)}
                </Typography>
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                  Last 7 days performance
                </Typography>
              </CardContent>
            </Card>

            <Card sx={{ bgcolor: 'background.paper', borderRadius: 2, flex: 1 }}>
              <CardContent>
                <Typography variant="h6" sx={{ color: '#8b5cf6', mb: 1 }}>
                  This Month
                </Typography>
                <Typography variant="h4" fontWeight={700} sx={{ color: 'white' }}>
                  {formatCurrency(monthTotal)}
                </Typography>
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                  Last 30 days total
                </Typography>
              </CardContent>
            </Card>
          </Stack>

          {/* Charts and Recent Bills */}
          <Stack direction={{ xs: 'column', md: 'row' }} spacing={3}>
            {/* Product Sales Chart */}
            <Card sx={{ bgcolor: 'background.paper', borderRadius: 2, height: '400px', flex: 1 }}>
              <CardContent>
                <Typography variant="h6" fontWeight={600} sx={{ color: 'white', mb: 3 }}>
                  Top Products by Sales
                </Typography>
                {productSalesData.length > 0 ? (
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={productSalesData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={120}
                        paddingAngle={5}
                        dataKey="amount"
                      >
                        {productSalesData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                        ))}
                      </Pie>
                    </PieChart>
                  </ResponsiveContainer>
                ) : (
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: 300 }}>
                    <Typography variant="body1" sx={{ color: 'text.secondary' }}>
                      No sales data available
                    </Typography>
                  </Box>
                )}
              </CardContent>
            </Card>

            {/* Recent Bills */}
            <Card sx={{ bgcolor: 'background.paper', borderRadius: 2, height: '400px', flex: 1 }}>
              <CardContent>
                <Typography variant="h6" fontWeight={600} sx={{ color: 'white', mb: 3 }}>
                  Recent Bills
                </Typography>
                <TableContainer sx={{ maxHeight: 300 }}>
                  <Table stickyHeader>
                    <TableHead>
                      <TableRow>
                        <TableCell sx={{ bgcolor: 'background.paper', color: 'white', border: 'none' }}>
                          Bill #
                        </TableCell>
                        <TableCell sx={{ bgcolor: 'background.paper', color: 'white', border: 'none' }}>
                          Customer
                        </TableCell>
                        <TableCell sx={{ bgcolor: 'background.paper', color: 'white', border: 'none' }}>
                          Amount
                        </TableCell>
                        <TableCell sx={{ bgcolor: 'background.paper', color: 'white', border: 'none' }}>
                          Date
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {recentBills.length > 0 ? (
                        recentBills.map((bill) => (
                          <TableRow key={bill.id}>
                            <TableCell sx={{ color: 'primary.main', border: 'none' }}>
                              {bill.billNumber}
                            </TableCell>
                            <TableCell sx={{ color: 'white', border: 'none' }}>
                              {bill.customerInfo.name}
                            </TableCell>
                            <TableCell sx={{ color: 'secondary.main', border: 'none' }}>
                              {formatCurrency(bill.total)}
                            </TableCell>
                            <TableCell sx={{ color: 'text.secondary', border: 'none' }}>
                              {formatDate(bill.billDate)}
                            </TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan={4} sx={{ color: 'text.secondary', textAlign: 'center', border: 'none' }}>
                            No bills found
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </TableContainer>
              </CardContent>
            </Card>
          </Stack>

          {/* Quick Actions */}
          <Card sx={{ bgcolor: 'background.paper', borderRadius: 2, mt: 3 }}>
            <CardContent>
              <Typography variant="h6" fontWeight={600} sx={{ color: 'white', mb: 3 }}>
                Quick Actions
              </Typography>
              <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                <Button
                  variant="contained"
                  sx={{
                    bgcolor: 'primary.main',
                    color: 'black',
                    fontWeight: 600,
                    '&:hover': { bgcolor: 'primary.dark' }
                  }}
                >
                  Create New Bill
                </Button>
                <Button
                  variant="outlined"
                  sx={{
                    borderColor: 'secondary.main',
                    color: 'secondary.main',
                    '&:hover': { bgcolor: 'rgba(16, 185, 129, 0.1)' }
                  }}
                >
                  Add Customer
                </Button>
                <Button
                  variant="outlined"
                  sx={{
                    borderColor: '#8b5cf6',
                    color: '#8b5cf6',
                    '&:hover': { bgcolor: 'rgba(139, 92, 246, 0.1)' }
                  }}
                >
                  Manage Inventory
                </Button>
                <Button
                  variant="outlined"
                  sx={{
                    borderColor: '#06b6d4',
                    color: '#06b6d4',
                    '&:hover': { bgcolor: 'rgba(6, 182, 212, 0.1)' }
                  }}
                >
                  View Reports
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Container>

        {/* Footer */}
        <Footer />
      </Box>
    </ThemeProvider>
  )
}
