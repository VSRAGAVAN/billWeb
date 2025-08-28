'use client'

import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import {
  Box,
  Paper,
  Typography,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Button,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Grid,
  Card,
  CardContent,
  Divider,
  Chip,
  Avatar,
  ListItemText,
  ListItemAvatar,
  Switch,
  FormControlLabel,
  AppBar,
  Toolbar,
  Container,
  Tooltip,
  Alert,
  Snackbar,
  InputAdornment,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  List,
  ListItem,
  ListItemIcon,
  ListItemButton,
  SpeedDial,
  SpeedDialIcon,
  SpeedDialAction
} from '@mui/material'
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  Print as PrintIcon,
  Save as SaveIcon,
  PictureAsPdf as PdfIcon,
  ArrowBack as ArrowBackIcon,
  Business as BusinessIcon,
  Person as PersonIcon,
  Receipt as ReceiptIcon,
  Phone as PhoneIcon,
  LocationOn as LocationIcon,
  AccountBalance as AccountBalanceIcon,
  Share as ShareIcon,
  WhatsApp as WhatsAppIcon,
  Telegram as TelegramIcon,
  Email as EmailIcon,
  Facebook as FacebookIcon,
  Twitter as TwitterIcon,
  LinkedIn as LinkedInIcon
} from '@mui/icons-material'
import { ThemeProvider, createTheme } from '@mui/material/styles'
import CommonHeader from '../../components/CommonHeader'
import CommonSidebar from '../../components/CommonSidebar'
import Footer from '../../components/Footer'

// Material UI Theme with dark CRM design
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
      fontWeight: 700,
    },
    h6: {
      fontWeight: 600,
    },
  },
  shape: {
    borderRadius: 12,
  },
  components: {
    MuiPaper: {
      styleOverrides: {
        root: {
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 600,
        },
      },
    },
  },
})

interface BillItem {
  id: string
  product: string
  specification: string
  quantity: number
  unit: string
  rate: number
  amount: number
}

interface CustomerInfo {
  name: string
  address: string
  gstin: string
  phone: string
}

// Product dropdown with Material UI
interface ProductSelectProps {
  value: string
  onChange: (value: string) => void
  products: Array<{ name: string; image: string }>
}

function ProductSelect({ value, onChange, products }: ProductSelectProps) {
  return (
    <FormControl fullWidth size="small">
      <InputLabel>Product</InputLabel>
      <Select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        label="Product"
        renderValue={(selected) => {
          const product = products.find(p => p.name === selected)
          return product ? (
            <Box display="flex" alignItems="center" gap={1}>
              <Avatar
                src={product.image}
                alt={product.name}
                sx={{ width: 24, height: 24 }}
              />
              <Typography variant="body2">{product.name}</Typography>
            </Box>
          ) : 'Select Product'
        }}
      >
        {products.map((product) => (
          <MenuItem key={product.name} value={product.name}>
            <ListItemAvatar>
              <Avatar
                src={product.image}
                alt={product.name}
                sx={{ width: 32, height: 32 }}
              />
            </ListItemAvatar>
            <ListItemText primary={product.name} />
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  )
}

export default function CreateBillPage() {
  const router = useRouter()
  const printRef = useRef<HTMLDivElement>(null)
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [snackbar, setSnackbar] = useState({ 
    open: false, 
    message: '', 
    severity: 'success' as 'success' | 'error' 
  })
  const [shareDialog, setShareDialog] = useState(false)
  const [generatedPdfBlob, setGeneratedPdfBlob] = useState<Blob | null>(null)

  const handleDrawerOpen = () => setDrawerOpen(true)
  const handleDrawerClose = () => setDrawerOpen(false)
  
  const [customerInfo, setCustomerInfo] = useState<CustomerInfo>({
    name: '',
    address: '',
    gstin: '',
    phone: ''
  })

  const [billItems, setBillItems] = useState<BillItem[]>([
    {
      id: '1',
      product: '',
      specification: '',
      quantity: 0,
      unit: 'CFT',
      rate: 0,
      amount: 0
    }
  ])

  const [gstRate] = useState(18)
  const [igstRate] = useState(0)
  const [isInterState, setIsInterState] = useState(true)
  const [billNumber, setBillNumber] = useState('')
  
  useEffect(() => {
    const lastBillNumber = localStorage.getItem('lastBillNumber')
    let nextNumber = 1
    if (lastBillNumber && /^#GWC\d{3}$/.test(lastBillNumber)) {
      nextNumber = parseInt(lastBillNumber.replace('#GWC', ''), 10) + 1
    }
    const formatted = `#GWC${nextNumber.toString().padStart(3, '0')}`
    setBillNumber(formatted)
  }, [])
  
  const [billDate, setBillDate] = useState(new Date().toISOString().split('T')[0])

  const woodProducts = [
    { name: 'Teak Wood', image: '/TeakWood.jpg' },
    { name: 'Pine Wood', image: '/PineWood.jpg' },
    { name: 'Rosewood', image: '/Rosewood.jpg' },
    { name: 'Plywood', image: '/Plywood.jpeg' },
    { name: 'MDF Board', image: '/MDFBoard.jpeg' },
    { name: 'Particle Board', image: '/ParticleBoard.png' }
  ]

  const specifications = [
    'Window', 'Door', 'Cot', 'Sofa', 'Front Entrance',
    'Dining Table', 'Table', 'Logs', 'Premium Quality', 'Standard Quality'
  ]

  const units = ['CFT', 'Pcs', 'feet', 'Sq.Ft']

  const addBillItem = () => {
    const newItem: BillItem = {
      id: Date.now().toString(),
      product: '',
      specification: '',
      quantity: 0,
      unit: 'CFT',
      rate: 0,
      amount: 0
    }
    setBillItems([...billItems, newItem])
  }

  const removeBillItem = (id: string) => {
    if (billItems.length > 1) {
      setBillItems(billItems.filter(item => item.id !== id))
    }
  }

  const updateBillItem = (id: string, field: keyof BillItem, value: string | number) => {
    setBillItems(billItems.map(item => {
      if (item.id === id) {
        const updatedItem = { ...item, [field]: value }
        if (field === 'quantity' || field === 'rate') {
          updatedItem.amount = updatedItem.quantity * updatedItem.rate
        }
        return updatedItem
      }
      return item
    }))
  }

  const calculateSubtotal = () => {
    return billItems.reduce((sum, item) => sum + item.amount, 0)
  }

  const calculateGST = () => {
    const subtotal = calculateSubtotal()
    if (isInterState) {
      return { cgst: 0, sgst: 0, igst: (subtotal * igstRate) / 100 }
    } else {
      const gstAmount = (subtotal * gstRate) / 100
      return { cgst: gstAmount / 2, sgst: gstAmount / 2, igst: 0 }
    }
  }

  const calculateTotal = () => {
    const subtotal = calculateSubtotal()
    const gst = calculateGST()
    return subtotal + gst.cgst + gst.sgst + gst.igst
  }

  const saveBill = () => {
    const billData = {
      billNumber,
      billDate,
      customerInfo,
      billItems,
      gstRate,
      igstRate,
      isInterState,
      subtotal: calculateSubtotal(),
      gst: calculateGST(),
      total: calculateTotal()
    }
    const existingBills = JSON.parse(localStorage.getItem('woodBills') || '[]')
    existingBills.push(billData)
    localStorage.setItem('woodBills', JSON.stringify(existingBills))
    localStorage.setItem('lastBillNumber', billNumber)
    
    const currentNum = parseInt(billNumber.replace('#GWC', ''), 10) + 1
    const nextBillNum = `#GWC${currentNum.toString().padStart(3, '0')}`
    setBillNumber(nextBillNum)
    
    setSnackbar({ open: true, message: 'Bill saved successfully!', severity: 'success' })
    setTimeout(() => router.push('/dashboard'), 1500)
  }

  const handlePrint = () => {
    window.print()
  }

  const generatePDF = async () => {
    try {
      const jsPDF = (await import('jspdf')).default
      const html2canvas = (await import('html2canvas')).default
      
      if (printRef.current) {
        const canvas = await html2canvas(printRef.current, {
          scale: 2,
          useCORS: true,
          allowTaint: true,
          backgroundColor: '#ffffff'
        })
        
        const imgData = canvas.toDataURL('image/png')
        const pdf = new jsPDF('portrait', 'mm', 'a4')
        
        const imgWidth = 210
        const pageHeight = 295
        const imgHeight = (canvas.height * imgWidth) / canvas.width
        let heightLeft = imgHeight
        let position = 0
        
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight)
        heightLeft -= pageHeight
        
        while (heightLeft >= 0) {
          position = heightLeft - imgHeight
          pdf.addPage()
          pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight)
          heightLeft -= pageHeight
        }
        
        // Get PDF as blob for sharing
        const pdfBlob = pdf.output('blob')
        setGeneratedPdfBlob(pdfBlob)
        
        // Save PDF
        pdf.save(`WoodBill-${billNumber}.pdf`)
        
        setSnackbar({ open: true, message: 'PDF generated successfully!', severity: 'success' })
        
        // Open sharing dialog
        setTimeout(() => {
          setShareDialog(true)
        }, 1000)
      }
    } catch (error) {
      console.error('Error generating PDF:', error)
      setSnackbar({ open: true, message: 'Error generating PDF. Please try again.', severity: 'error' })
    }
  }

  // Social media sharing functions
  const shareOnWhatsApp = () => {
    const message = `📋 Wood Bill Generated!\n\n🏢 Ganapathy Timbers and Wood Works\n📄 Bill No: ${billNumber}\n📅 Date: ${new Date(billDate).toLocaleDateString()}\n💰 Total: ₹${calculateTotal().toFixed(2)}\n\n🌲 Premium Wood & Timber Solutions`
    const url = `https://wa.me/?text=${encodeURIComponent(message)}`
    window.open(url, '_blank')
  }

  const shareOnTelegram = () => {
    const message = `📋 Wood Bill Generated!\n\n🏢 Ganapathy Timbers and Wood Works\n📄 Bill No: ${billNumber}\n📅 Date: ${new Date(billDate).toLocaleDateString()}\n💰 Total: ₹${calculateTotal().toFixed(2)}\n\n🌲 Premium Wood & Timber Solutions`
    const url = `https://t.me/share/url?text=${encodeURIComponent(message)}`
    window.open(url, '_blank')
  }

  const shareViaEmail = () => {
    const subject = `Wood Bill ${billNumber} - Ganapathy Timbers and Wood Works`
    const body = `Dear Customer,\n\nPlease find attached your wood bill details:\n\nBill Number: ${billNumber}\nDate: ${new Date(billDate).toLocaleDateString()}\nTotal Amount: ₹${calculateTotal().toFixed(2)}\n\nThank you for choosing Ganapathy Timbers and Wood Works - Premium Wood & Timber Solutions.\n\nBest Regards,\nGanapathy Timbers and Wood Works Team`
    const url = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
    window.open(url)
  }

  const shareOnFacebook = () => {
    const message = `Just generated a professional wood bill with Ganapathy Timbers and Wood Works! 🌲📋 Bill #${billNumber} - Total: ₹${calculateTotal().toFixed(2)}`
    const url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}&quote=${encodeURIComponent(message)}`
    window.open(url, '_blank')
  }

  const shareOnTwitter = () => {
    const message = `📋 Wood Bill Generated! 🌲\n\nBill #${billNumber}\nTotal: ₹${calculateTotal().toFixed(2)}\n\n#WoodBusiness #ProfessionalBilling #GanapathyWoodCarving`
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(message)}`
    window.open(url, '_blank')
  }

  const shareOnLinkedIn = () => {
    const message = `Professional wood billing system in action! Generated Bill #${billNumber} for ₹${calculateTotal().toFixed(2)} with Ganapathy Timbers and Wood Works - Premium Wood & Timber Solutions. #BusinessEfficiency #WoodIndustry`
    const url = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.href)}&summary=${encodeURIComponent(message)}`
    window.open(url, '_blank')
  }

  // Native sharing if available
  const handleNativeShare = async () => {
    if (navigator.share && generatedPdfBlob) {
      try {
        const file = new File([generatedPdfBlob], `WoodBill-${billNumber}.pdf`, { type: 'application/pdf' })
        await navigator.share({
          title: `Wood Bill ${billNumber}`,
          text: `Wood Bill from Ganapathy Timbers and Wood Works - Total: ₹${calculateTotal().toFixed(2)}`,
          files: [file]
        })
      } catch (error) {
        console.error('Error sharing:', error)
      }
    }
  }

  const gstCalculation = calculateGST()

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ bgcolor: 'background.default', minHeight: '100vh' }}>
        {/* Common Header */}
        <CommonHeader onDrawerOpen={handleDrawerOpen} />

        {/* Common Sidebar */}
        <CommonSidebar open={drawerOpen} onClose={handleDrawerClose} />

        {/* Create Bill Actions Bar */}
        <AppBar position="static" elevation={0} sx={{ bgcolor: 'background.paper', borderBottom: 1, borderColor: 'divider' }}>
          <Toolbar>
            <Box sx={{ display: 'flex', alignItems: 'center', flexGrow: 1 }}>
              <ReceiptIcon sx={{ mr: 1, color: 'primary.main' }} />
              <Typography variant="h6" sx={{ color: 'white', fontWeight: 600 }}>
                Create New Bill
              </Typography>
            </Box>
            
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Tooltip title="Print Bill">
                <Button
                  variant="outlined"
                  startIcon={<PrintIcon />}
                  onClick={handlePrint}
                  size="small"
                  sx={{ 
                    '@media print': { display: 'none' },
                    borderColor: 'primary.main',
                    color: 'primary.main'
                  }}
                >
                  Print
                </Button>
              </Tooltip>
              
              <Tooltip title="Generate PDF">
                <Button
                  variant="outlined"
                  startIcon={<PdfIcon />}
                  onClick={generatePDF}
                  size="small"
                  sx={{ 
                    '@media print': { display: 'none' },
                    borderColor: '#dc2626',
                    color: '#dc2626'
                  }}
                >
                  PDF
                </Button>
              </Tooltip>
              
              <Tooltip title="Save Bill">
                <Button
                  variant="contained"
                  startIcon={<SaveIcon />}
                  onClick={saveBill}
                  size="small"
                  sx={{ 
                    '@media print': { display: 'none' },
                    bgcolor: 'primary.main',
                    color: 'black',
                    '&:hover': { bgcolor: 'primary.dark' }
                  }}
                >
                  Save
                </Button>
              </Tooltip>
            </Box>
          </Toolbar>
        </AppBar>

        {/* Main Content */}
        <Container maxWidth="lg" sx={{ py: 3 }}>
          <div ref={printRef}>
            <Paper sx={{ p: 4, mb: 3 }}>
              {/* Company Header */}
              <Box textAlign="center" mb={4} sx={{ borderBottom: 2, borderColor: 'divider', pb: 3 }}>
                <Typography variant="h4" sx={{ color: 'primary.main', fontWeight: 700, mb: 1 }}>
                  Ganapathy Timbers and Wood Works
                </Typography>
                <Typography variant="h6" color="text.secondary" mb={1}>
                  Premium Wood & Timber Solutions
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Address: 123 Timber Street, Wood City | Phone: +91 9486453141
                </Typography>
              </Box>

              {/* Bill Header Info */}
              <Box display="flex" justifyContent="space-between" gap={3} mb={4}>
                {/* Bill To Section */}
                <Card variant="outlined" sx={{ flex: 1 }}>
                  <CardContent>
                    <Box display="flex" alignItems="center" mb={2}>
                      <PersonIcon sx={{ mr: 1, color: 'primary.main' }} />
                      <Typography variant="h6" fontWeight={600}>Bill To:</Typography>
                    </Box>
                    
                    <TextField
                      fullWidth
                      label="Customer Name"
                      value={customerInfo.name}
                      onChange={(e) => setCustomerInfo({...customerInfo, name: e.target.value})}
                      margin="normal"
                      size="small"
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <PersonIcon color="action" />
                          </InputAdornment>
                        ),
                      }}
                    />
                    
                    <TextField
                      fullWidth
                      label="Customer Address"
                      value={customerInfo.address}
                      onChange={(e) => setCustomerInfo({...customerInfo, address: e.target.value})}
                      margin="normal"
                      size="small"
                      multiline
                      rows={2}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <LocationIcon color="action" />
                          </InputAdornment>
                        ),
                      }}
                    />
                    {!isInterState && (
                      <TextField
                        fullWidth
                        label="GSTIN"
                        value={customerInfo.gstin}
                        onChange={(e) => setCustomerInfo({...customerInfo, gstin: e.target.value})}
                      margin="normal"
                      size="small"
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <AccountBalanceIcon color="action" />
                          </InputAdornment>
                        ),
                      }}
                    />
                    )}
                    <TextField
                      fullWidth
                      label="Phone Number"
                      value={customerInfo.phone}
                      onChange={(e) => setCustomerInfo({...customerInfo, phone: e.target.value})}
                      margin="normal"
                      size="small"
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <PhoneIcon color="action" />
                          </InputAdornment>
                        ),
                      }}
                    />
                  </CardContent>
                </Card>
                
                {/* Bill Details Section */}
                <Card variant="outlined" sx={{ flex: 1 }}>
                  <CardContent>
                    <Box display="flex" alignItems="center" mb={2}>
                      <BusinessIcon sx={{ mr: 1, color: 'primary.main' }} />
                      <Typography variant="h6" fontWeight={600}>Bill Details:</Typography>
                    </Box>
                    
                    <TextField
                      fullWidth
                      label="Bill Number"
                      value={billNumber}
                      onChange={(e) => setBillNumber(e.target.value)}
                      margin="normal"
                      size="small"
                    />
                    
                    <TextField
                      fullWidth
                      label="Date"
                      type="date"
                      value={billDate}
                      onChange={(e) => setBillDate(e.target.value)}
                      margin="normal"
                      size="small"
                      InputLabelProps={{ shrink: true }}
                    />
                    
                    <FormControlLabel
                      control={
                        <Switch
                          checked={isInterState}
                          onChange={(e) => setIsInterState(e.target.checked)}
                          color="primary"
                        />
                      }
                      label="Inter-State Transaction"
                      sx={{ mt: 2 }}
                    />
                  </CardContent>
                </Card>
              </Box>

              {/* Bill Items Table */}
              <Box mb={4}>
                <Typography variant="h6" fontWeight={600} mb={2}>Bill Items</Typography>
                <TableContainer component={Paper} variant="outlined">
                  <Table size="small">
                    <TableHead>
                      <TableRow sx={{ bgcolor: 'grey.50' }}>
                        <TableCell>Sr.</TableCell>
                        <TableCell>Product</TableCell>
                        <TableCell>Specification</TableCell>
                        <TableCell>Qty</TableCell>
                        <TableCell>Unit</TableCell>
                        <TableCell>Rate (₹)</TableCell>
                        <TableCell>Amount (₹)</TableCell>
                        <TableCell sx={{ '@media print': { display: 'none' } }}>Action</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {billItems.map((item, index) => (
                        <TableRow key={item.id}>
                          <TableCell>{index + 1}</TableCell>
                          <TableCell sx={{ minWidth: 200 }}>
                            <ProductSelect
                              value={item.product}
                              onChange={(value) => updateBillItem(item.id, 'product', value)}
                              products={woodProducts}
                            />
                          </TableCell>
                          <TableCell>
                            <FormControl fullWidth size="small">
                              <InputLabel>Specification</InputLabel>
                              <Select
                                value={item.specification}
                                onChange={(e) => updateBillItem(item.id, 'specification', e.target.value)}
                                label="Specification"
                              >
                                {specifications.map((spec) => (
                                  <MenuItem key={spec} value={spec}>{spec}</MenuItem>
                                ))}
                              </Select>
                            </FormControl>
                          </TableCell>
                          <TableCell>
                            <TextField
                              type="number"
                              value={item.quantity}
                              onChange={(e) => updateBillItem(item.id, 'quantity', parseFloat(e.target.value) || 0)}
                              size="small"
                              inputProps={{ min: 0, step: 0.01 }}
                              sx={{ width: 80 }}
                            />
                          </TableCell>
                          <TableCell>
                            <FormControl size="small" sx={{ minWidth: 80 }}>
                              <Select
                                value={item.unit}
                                onChange={(e) => updateBillItem(item.id, 'unit', e.target.value)}
                              >
                                {units.map((unit) => (
                                  <MenuItem key={unit} value={unit}>{unit}</MenuItem>
                                ))}
                              </Select>
                            </FormControl>
                          </TableCell>
                          <TableCell>
                            <TextField
                              type="number"
                              value={item.rate}
                              onChange={(e) => updateBillItem(item.id, 'rate', parseFloat(e.target.value) || 0)}
                              size="small"
                              inputProps={{ min: 0, step: 0.01 }}
                              sx={{ width: 100 }}
                            />
                          </TableCell>
                          <TableCell>
                            <Chip 
                              label={`₹${item.amount.toFixed(2)}`} 
                              color="primary" 
                              variant="outlined"
                            />
                          </TableCell>
                          <TableCell sx={{ '@media print': { display: 'none' } }}>
                            <IconButton
                              onClick={() => removeBillItem(item.id)}
                              color="error"
                              disabled={billItems.length === 1}
                              size="small"
                            >
                              <DeleteIcon />
                            </IconButton>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
                
                <Button
                  startIcon={<AddIcon />}
                  onClick={addBillItem}
                  variant="outlined"
                  sx={{ mt: 2, '@media print': { display: 'none' } }}
                >
                  Add Item
                </Button>
              </Box>

              {/* Bill Summary */}
              <Box display="flex" justifyContent="flex-end" mb={4}>
                <Card variant="outlined" sx={{ minWidth: 300 }}>
                  <CardContent>
                    <Typography variant="h6" fontWeight={600} mb={2}>Bill Summary</Typography>
                    
                    <Box display="flex" justifyContent="space-between" mb={1}>
                      <Typography>Subtotal:</Typography>
                      <Typography fontWeight={600}>₹{calculateSubtotal().toFixed(2)}</Typography>
                    </Box>
                    
                    {!isInterState && (
                      <>
                        <Box display="flex" justifyContent="space-between" mb={1}>
                          <Typography>CGST ({gstRate/2}%):</Typography>
                          <Typography>₹{gstCalculation.cgst.toFixed(2)}</Typography>
                        </Box>
                        <Box display="flex" justifyContent="space-between" mb={1}>
                          <Typography>SGST ({gstRate/2}%):</Typography>
                          <Typography>₹{gstCalculation.sgst.toFixed(2)}</Typography>
                        </Box>
                      </>
                    )}
                    
                    <Divider sx={{ my: 1 }} />
                    
                    <Box display="flex" justifyContent="space-between">
                      <Typography variant="h6" fontWeight={700}>Total Amount:</Typography>
                      <Typography variant="h6" fontWeight={700} color="primary.main">
                        ₹{calculateTotal().toFixed(2)}
                      </Typography>
                    </Box>
                  </CardContent>
                </Card>
              </Box>

              {/* Terms and Conditions */}
              <Box mt={4} pt={3} sx={{ borderTop: 1, borderColor: 'divider' }}>
                <Typography variant="h6" fontWeight={600} mb={2}>Terms & Conditions:</Typography>
                <Box sx={{ color: 'text.secondary', fontSize: '0.875rem' }}>
                  <Typography variant="body2" mb={0.5}>1. All wood materials are subject to natural variations in color and grain.</Typography>
                  <Typography variant="body2" mb={0.5}>2. Payment due within 30 days of invoice date.</Typography>
                  <Typography variant="body2" mb={0.5}>3. Goods once sold cannot be returned unless defective.</Typography>
                  <Typography variant="body2">4. Delivery charges are extra and will be charged as per actual.</Typography>
                </Box>
              </Box>

              {/* Signature Section */}
              <Box display="flex" justifyContent="space-between" mt={6}>
                <Box textAlign="center">
                  <Typography variant="body2" color="text.secondary" mb={4}>Customer Signature</Typography>
                  <Box sx={{ borderBottom: 1, borderColor: 'text.primary', width: 200 }} />
                </Box>
                <Box textAlign="center">
                  <Typography variant="body2" color="text.secondary" mb={4}>Authorized Signature</Typography>
                  <Box sx={{ borderBottom: 1, borderColor: 'text.primary', width: 200 }} />
                  <Typography variant="caption" color="text.secondary" mt={1}>For Ganapathy Timbers and Wood Works</Typography>
                </Box>
              </Box>
            </Paper>
          </div>
        </Container>

        {/* Snackbar for notifications */}
        <Snackbar
          open={snackbar.open}
          autoHideDuration={4000}
          onClose={() => setSnackbar({ ...snackbar, open: false })}
        >
          <Alert 
            onClose={() => setSnackbar({ ...snackbar, open: false })} 
            severity={snackbar.severity}
            sx={{ width: '100%' }}
          >
            {snackbar.message}
          </Alert>
        </Snackbar>

        {/* Social Media Sharing Dialog */}
        <Dialog 
          open={shareDialog} 
          onClose={() => setShareDialog(false)}
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle>
            <Box display="flex" alignItems="center">
              <ShareIcon sx={{ mr: 1, color: 'primary.main' }} />
              <Typography variant="h6">Share Your Bill</Typography>
            </Box>
          </DialogTitle>
          <DialogContent>
            <Typography variant="body2" color="text.secondary" mb={3}>
              Share your generated bill on social media or via email
            </Typography>
            
            <List>
              {typeof navigator.share === 'function' && (
                <ListItem disablePadding>
                  <ListItemButton onClick={handleNativeShare}>
                    <ListItemIcon>
                      <ShareIcon color="primary" />
                    </ListItemIcon>
                    <ListItemText 
                      primary="Share PDF File" 
                      secondary="Use device native sharing"
                    />
                  </ListItemButton>
                </ListItem>
              )}
              
              <ListItem disablePadding>
                <ListItemButton onClick={shareOnWhatsApp}>
                  <ListItemIcon>
                    <WhatsAppIcon sx={{ color: '#25D366' }} />
                  </ListItemIcon>
                  <ListItemText 
                    primary="WhatsApp" 
                    secondary="Share bill details on WhatsApp"
                  />
                </ListItemButton>
              </ListItem>
              
              <ListItem disablePadding>
                <ListItemButton onClick={shareOnTelegram}>
                  <ListItemIcon>
                    <TelegramIcon sx={{ color: '#0088cc' }} />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Telegram" 
                    secondary="Share on Telegram"
                  />
                </ListItemButton>
              </ListItem>
              
              <ListItem disablePadding>
                <ListItemButton onClick={shareViaEmail}>
                  <ListItemIcon>
                    <EmailIcon sx={{ color: '#EA4335' }} />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Email" 
                    secondary="Send via email"
                  />
                </ListItemButton>
              </ListItem>
              
              <ListItem disablePadding>
                <ListItemButton onClick={shareOnFacebook}>
                  <ListItemIcon>
                    <FacebookIcon sx={{ color: '#1877F2' }} />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Facebook" 
                    secondary="Share on Facebook"
                  />
                </ListItemButton>
              </ListItem>
              
              <ListItem disablePadding>
                <ListItemButton onClick={shareOnTwitter}>
                  <ListItemIcon>
                    <TwitterIcon sx={{ color: '#1DA1F2' }} />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Twitter" 
                    secondary="Share on Twitter"
                  />
                </ListItemButton>
              </ListItem>
              
              <ListItem disablePadding>
                <ListItemButton onClick={shareOnLinkedIn}>
                  <ListItemIcon>
                    <LinkedInIcon sx={{ color: '#0A66C2' }} />
                  </ListItemIcon>
                  <ListItemText 
                    primary="LinkedIn" 
                    secondary="Share on LinkedIn"
                  />
                </ListItemButton>
              </ListItem>
            </List>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setShareDialog(false)}>Close</Button>
          </DialogActions>
        </Dialog>

        {/* Floating Action Button for Quick Share */}
        {generatedPdfBlob && (
          <SpeedDial
            ariaLabel="Share Bill"
            sx={{ position: 'fixed', bottom: 16, right: 16 }}
            icon={<SpeedDialIcon icon={<ShareIcon />} />}
            onClick={() => setShareDialog(true)}
          >
            <SpeedDialAction
              icon={<WhatsAppIcon sx={{ color: '#25D366' }} />}
              tooltipTitle="WhatsApp"
              onClick={shareOnWhatsApp}
            />
            <SpeedDialAction
              icon={<TelegramIcon sx={{ color: '#0088cc' }} />}
              tooltipTitle="Telegram"
              onClick={shareOnTelegram}
            />
            <SpeedDialAction
              icon={<EmailIcon sx={{ color: '#EA4335' }} />}
              tooltipTitle="Email"
              onClick={shareViaEmail}
            />
            <SpeedDialAction
              icon={<FacebookIcon sx={{ color: '#1877F2' }} />}
              tooltipTitle="Facebook"
              onClick={shareOnFacebook}
            />
          </SpeedDial>
        )}

        {/* Footer */}
        <Footer />
      </Box>
    </ThemeProvider>
  )
}
