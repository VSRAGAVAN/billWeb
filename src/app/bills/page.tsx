'use client'

import {
  Add as AddIcon,
  PictureAsPdf as PdfIcon,
  Print as PrintIcon,
  Receipt as ReceiptIcon,
  Visibility as ViewIcon
} from '@mui/icons-material'
import {
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Container,
  IconButton,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Stack,
  ThemeProvider,
  Typography,
  createTheme
} from '@mui/material'
import Link from 'next/link'
import { useEffect, useState } from 'react'
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
  }
})

interface Bill {
  billNumber: string
  billDate: string
  customerInfo: {
    name: string
    address: string
    gstin: string
    phone: string
  }
  total: number
  isInterState: boolean
}

export default function BillsListPage() {
  const [bills, setBills] = useState<Bill[]>([])
  const [drawerOpen, setDrawerOpen] = useState(false)

  useEffect(() => {
    // Load bills from localStorage
    const savedBills = JSON.parse(localStorage.getItem('woodBills') || '[]')
    setBills(savedBills)
  }, [])

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
          {/* Page Header */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
            <Typography variant="h4" fontWeight={700} sx={{ color: 'white' }}>
              All Bills
            </Typography>
            <Button
              component={Link}
              href="/create-bill"
              variant="contained"
              startIcon={<AddIcon />}
              sx={{
                bgcolor: 'primary.main',
                color: 'black',
                fontWeight: 600,
                '&:hover': { bgcolor: 'primary.dark' }
              }}
            >
              Create New Bill
            </Button>
          </Box>

          {/* Bills List */}
          {bills.length === 0 ? (
            <Card sx={{ bgcolor: 'background.paper', borderRadius: 2, textAlign: 'center', py: 8 }}>
              <CardContent>
                <ReceiptIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
                <Typography variant="h6" sx={{ color: 'white', mb: 1 }}>
                  No bills found
                </Typography>
                <Typography variant="body2" sx={{ color: 'text.secondary', mb: 4 }}>
                  Get started by creating your first bill.
                </Typography>
                <Button
                  component={Link}
                  href="/create-bill"
                  variant="contained"
                  startIcon={<AddIcon />}
                  sx={{
                    bgcolor: 'primary.main',
                    color: 'black',
                    fontWeight: 600,
                    '&:hover': { bgcolor: 'primary.dark' }
                  }}
                >
                  Create New Bill
                </Button>
              </CardContent>
            </Card>
          ) : (
            <Card sx={{ bgcolor: 'background.paper', borderRadius: 2 }}>
              <List>
                {bills.map((bill, index) => (
                  <ListItem
                    key={index}
                    sx={{
                      borderBottom: index < bills.length - 1 ? '1px solid rgba(255, 255, 255, 0.1)' : 'none',
                      py: 2
                    }}
                  >
                    <ListItemAvatar>
                      <Avatar sx={{ bgcolor: 'primary.main', color: 'black' }}>
                        <ReceiptIcon />
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                          <Typography variant="subtitle1" sx={{ color: 'white', fontWeight: 600 }}>
                            Bill #{bill.billNumber}
                          </Typography>
                          <Chip
                            label={bill.isInterState ? 'IGST' : 'CGST+SGST'}
                            size="small"
                            sx={{
                              bgcolor: bill.isInterState ? '#f59e0b' : '#10b981',
                              color: 'black',
                              fontWeight: 600
                            }}
                          />
                        </Box>
                      }
                      secondary={
                        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                          {bill.customerInfo.name} • {formatDate(bill.billDate)}
                        </Typography>
                      }
                    />
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Typography variant="h6" sx={{ color: 'secondary.main', fontWeight: 600 }}>
                        {formatCurrency(bill.total)}
                      </Typography>
                      <Stack direction="row" spacing={1}>
                        <IconButton
                          size="small"
                          sx={{ color: 'primary.main', '&:hover': { bgcolor: 'rgba(245, 158, 11, 0.1)' } }}
                        >
                          <ViewIcon />
                        </IconButton>
                        <IconButton
                          size="small"
                          sx={{ color: 'secondary.main', '&:hover': { bgcolor: 'rgba(16, 185, 129, 0.1)' } }}
                        >
                          <PrintIcon />
                        </IconButton>
                        <IconButton
                          size="small"
                          sx={{ color: '#dc2626', '&:hover': { bgcolor: 'rgba(220, 38, 38, 0.1)' } }}
                        >
                          <PdfIcon />
                        </IconButton>
                      </Stack>
                    </Box>
                  </ListItem>
                ))}
              </List>
            </Card>
          )}
        </Container>

        {/* Footer */}
        <Footer />
      </Box>
    </ThemeProvider>
  )
}
