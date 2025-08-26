'use client'

import { useState, useRef } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

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

export default function CreateBillPage() {
  const router = useRouter()
  const printRef = useRef<HTMLDivElement>(null)
  
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

  const [gstRate, setGstRate] = useState(18) // 18% GST
  const [igstRate, setIgstRate] = useState(0) // IGST for inter-state
  const [isInterState, setIsInterState] = useState(false)
  const [billNumber, setBillNumber] = useState(`WB${Date.now().toString().slice(-6)}`)
  const [billDate, setBillDate] = useState(new Date().toISOString().split('T')[0])

  // Wood product options
  const woodProducts = [
    'Teak Wood',
    'Pine Wood',
    'Rosewood',
    'Mahogany Wood',
    'Bamboo',
    'Oak Wood',
    'Cedar Wood',
    'Plywood',
    'MDF Board',
    'Particle Board'
  ]

  const specifications = [
    '8mm Thickness',
    '12mm Thickness',
    '18mm Thickness',
    '25mm Thickness',
    'Planks',
    'Blocks',
    'Sheets',
    'Logs',
    'Premium Quality',
    'Standard Quality'
  ]

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

  const updateBillItem = (id: string, field: keyof BillItem, value: any) => {
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

  const handlePrint = () => {
    // Hide all elements except the bill content
    const printContents = printRef.current?.innerHTML
    const originalContents = document.body.innerHTML
    
    if (printContents) {
      // Create a new window for printing
      const printWindow = window.open('', '_blank')
      if (printWindow) {
        printWindow.document.write(`
          <!DOCTYPE html>
          <html>
            <head>
              <title>Bill ${billNumber}</title>
              <style>
                body { 
                  font-family: Arial, sans-serif; 
                  margin: 0; 
                  padding: 20px; 
                  font-size: 12px;
                  line-height: 1.4;
                }
                .bill-container { 
                  max-width: 800px; 
                  margin: 0 auto; 
                  background: white;
                }
                .company-header { 
                  text-align: center; 
                  margin-bottom: 30px; 
                  border-bottom: 2px solid #ccc; 
                  padding-bottom: 15px; 
                }
                .company-name { 
                  font-size: 24px; 
                  font-weight: bold; 
                  color: #d97706; 
                  margin-bottom: 5px; 
                }
                .company-tagline { 
                  color: #666; 
                  margin-bottom: 5px; 
                }
                .company-details { 
                  font-size: 10px; 
                  color: #888; 
                }
                .bill-header { 
                  display: flex; 
                  justify-content: space-between; 
                  margin-bottom: 20px; 
                }
                .bill-to, .bill-info { 
                  width: 48%; 
                }
                .bill-to h3, .bill-info h3 { 
                  font-size: 14px; 
                  margin-bottom: 10px; 
                  color: #333; 
                }
                .customer-info, .bill-details { 
                  font-size: 11px; 
                  line-height: 1.5; 
                }
                .items-table { 
                  width: 100%; 
                  border-collapse: collapse; 
                  margin: 20px 0; 
                  font-size: 11px; 
                }
                .items-table th, .items-table td { 
                  border: 1px solid #ddd; 
                  padding: 8px; 
                  text-align: left; 
                }
                .items-table th { 
                  background-color: #f5f5f5; 
                  font-weight: bold; 
                }
                .items-table td.amount { 
                  text-align: right; 
                }
                .bill-summary { 
                  display: flex; 
                  justify-content: flex-end; 
                  margin: 20px 0; 
                }
                .summary-table { 
                  width: 300px; 
                  font-size: 11px; 
                }
                .summary-table td { 
                  padding: 5px 10px; 
                  border-bottom: 1px solid #eee; 
                }
                .summary-table .total-row { 
                  font-weight: bold; 
                  font-size: 13px; 
                  border-top: 2px solid #333; 
                }
                .terms { 
                  margin-top: 30px; 
                  font-size: 10px; 
                  color: #666; 
                }
                .signatures { 
                  display: flex; 
                  justify-content: space-between; 
                  margin-top: 40px; 
                }
                .signature-box { 
                  text-align: center; 
                  width: 200px; 
                }
                .signature-line { 
                  border-bottom: 1px solid #000; 
                  margin-top: 30px; 
                  margin-bottom: 5px; 
                }
                @media print {
                  body { margin: 0; padding: 10px; }
                  .bill-container { max-width: none; }
                }
              </style>
            </head>
            <body>
              <div class="bill-container">
                <div class="company-header">
                  <div class="company-name">WoodBill Pro</div>
                  <div class="company-tagline">Premium Wood & Timber Solutions</div>
                  <div class="company-details">
                    Address: 123 Timber Street, Wood City | Phone: +91 98765 43210 | GSTIN: 29ABCDE1234F1Z5
                  </div>
                </div>
                
                <div class="bill-header">
                  <div class="bill-to">
                    <h3>Bill To:</h3>
                    <div class="customer-info">
                      <div><strong>${customerInfo.name}</strong></div>
                      <div>${customerInfo.address}</div>
                      <div>GSTIN: ${customerInfo.gstin}</div>
                      <div>Phone: ${customerInfo.phone}</div>
                    </div>
                  </div>
                  <div class="bill-info">
                    <div class="bill-details">
                      <div><strong>Bill No:</strong> ${billNumber}</div>
                      <div><strong>Date:</strong> ${new Date(billDate).toLocaleDateString()}</div>
                      <div><strong>Inter-State:</strong> ${isInterState ? 'Yes' : 'No'}</div>
                    </div>
                  </div>
                </div>
                
                <table class="items-table">
                  <thead>
                    <tr>
                      <th>Sr.</th>
                      <th>Product</th>
                      <th>Specification</th>
                      <th>Qty</th>
                      <th>Unit</th>
                      <th>Rate</th>
                      <th>Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    ${billItems.map((item, index) => `
                      <tr>
                        <td>${index + 1}</td>
                        <td>${item.product}</td>
                        <td>${item.specification}</td>
                        <td>${item.quantity}</td>
                        <td>${item.unit}</td>
                        <td>₹${item.rate.toFixed(2)}</td>
                        <td class="amount">₹${item.amount.toFixed(2)}</td>
                      </tr>
                    `).join('')}
                  </tbody>
                </table>
                
                <div class="bill-summary">
                  <table class="summary-table">
                    <tr>
                      <td>Subtotal:</td>
                      <td class="amount">₹${calculateSubtotal().toFixed(2)}</td>
                    </tr>
                    ${!isInterState ? `
                      <tr>
                        <td>CGST (${gstRate/2}%):</td>
                        <td class="amount">₹${gstCalculation.cgst.toFixed(2)}</td>
                      </tr>
                      <tr>
                        <td>SGST (${gstRate/2}%):</td>
                        <td class="amount">₹${gstCalculation.sgst.toFixed(2)}</td>
                      </tr>
                    ` : `
                      <tr>
                        <td>IGST (${igstRate}%):</td>
                        <td class="amount">₹${gstCalculation.igst.toFixed(2)}</td>
                      </tr>
                    `}
                    <tr class="total-row">
                      <td>Total Amount:</td>
                      <td class="amount">₹${calculateTotal().toFixed(2)}</td>
                    </tr>
                  </table>
                </div>
                
                <div class="terms">
                  <h4>Terms & Conditions:</h4>
                  <div>1. All wood materials are subject to natural variations in color and grain.</div>
                  <div>2. Payment due within 30 days of invoice date.</div>
                  <div>3. Goods once sold cannot be returned unless defective.</div>
                  <div>4. Delivery charges are extra and will be charged as per actual.</div>
                </div>
                
                <div class="signatures">
                  <div class="signature-box">
                    <div>Customer Signature</div>
                    <div class="signature-line"></div>
                  </div>
                  <div class="signature-box">
                    <div>Authorized Signature</div>
                    <div class="signature-line"></div>
                    <div style="font-size: 9px; margin-top: 5px;">For WoodBill Pro</div>
                  </div>
                </div>
              </div>
            </body>
          </html>
        `)
        printWindow.document.close()
        printWindow.focus()
        
        // Wait for content to load then print
        setTimeout(() => {
          printWindow.print()
          printWindow.close()
        }, 250)
      }
    }
  }

  const generatePDF = async () => {
    try {
      // Dynamic import to avoid SSR issues
      const jsPDF = (await import('jspdf')).default
      const html2canvas = (await import('html2canvas')).default
      
      if (printRef.current) {
        // Create a clone of the element to avoid modifying the original
        const element = printRef.current.cloneNode(true) as HTMLElement
        
        // Style the clone for better PDF rendering
        element.style.background = 'white'
        element.style.padding = '20px'
        element.style.fontSize = '12px'
        element.style.lineHeight = '1.4'
        
        // Remove interactive elements
        const interactiveElements = element.querySelectorAll('input, select, button, .print\\:hidden')
        interactiveElements.forEach(el => {
          if (el.classList.contains('print:hidden')) {
            el.remove()
          } else {
            // Replace inputs with their values
            const input = el as HTMLInputElement
            if (input.type === 'checkbox') {
              const span = document.createElement('span')
              span.textContent = input.checked ? 'Yes' : 'No'
              input.parentNode?.replaceChild(span, input)
            } else {
              const span = document.createElement('span')
              span.textContent = input.value || input.textContent || ''
              span.style.display = 'inline-block'
              span.style.minWidth = '100px'
              input.parentNode?.replaceChild(span, input)
            }
          }
        })
        
        // Temporarily add to DOM for rendering
        element.style.position = 'absolute'
        element.style.left = '-9999px'
        element.style.top = '0'
        document.body.appendChild(element)
        
        // Generate canvas
        const canvas = await html2canvas(element, {
          scale: 2,
          useCORS: true,
          allowTaint: true,
          backgroundColor: '#ffffff'
        })
        
        // Remove temporary element
        document.body.removeChild(element)
        
        // Create PDF
        const imgData = canvas.toDataURL('image/png')
        const pdf = new jsPDF({
          orientation: 'portrait',
          unit: 'mm',
          format: 'a4'
        })
        
        const imgWidth = 210 // A4 width in mm
        const pageHeight = 295 // A4 height in mm
        const imgHeight = (canvas.height * imgWidth) / canvas.width
        let heightLeft = imgHeight
        
        let position = 0
        
        // Add first page
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight)
        heightLeft -= pageHeight
        
        // Add additional pages if needed
        while (heightLeft >= 0) {
          position = heightLeft - imgHeight
          pdf.addPage()
          pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight)
          heightLeft -= pageHeight
        }
        
        // Save the PDF
        pdf.save(`WoodBill-${billNumber}.pdf`)
        
        // Show success message
        alert('PDF generated successfully!')
      }
    } catch (error) {
      console.error('Error generating PDF:', error)
      alert('Error generating PDF. Please try again.')
    }
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
    
    // Save to localStorage for demo
    const existingBills = JSON.parse(localStorage.getItem('woodBills') || '[]')
    existingBills.push(billData)
    localStorage.setItem('woodBills', JSON.stringify(existingBills))
    
    alert('Bill saved successfully!')
    router.push('/dashboard')
  }

  const gstCalculation = calculateGST()

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow print:hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center space-x-4">
              <Link href="/dashboard" className="text-blue-600 hover:text-blue-800">
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
              </Link>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Create New Bill</h1>
            </div>
            <div className="flex space-x-2">
              <button
                onClick={handlePrint}
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200"
              >
                🖨️ Print
              </button>
              <button
                onClick={() => window.print()}
                className="bg-green-500 hover:bg-green-600 text-white px-3 py-2 rounded-md text-xs font-medium transition-colors duration-200"
                title="Browser Print"
              >
                📄 Quick Print
              </button>
              <button
                onClick={generatePDF}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200"
              >
                📄 PDF
              </button>
              <button
                onClick={saveBill}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200"
              >
                💾 Save Bill
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Bill Content */}
      <div ref={printRef} className="max-w-4xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg p-8 print:shadow-none print:rounded-none">
          
          {/* Company Header */}
          <div className="text-center mb-8 border-b pb-4">
            <h1 className="text-3xl font-bold text-amber-600">WoodBill Pro</h1>
            <p className="text-gray-600 dark:text-gray-400">Premium Wood & Timber Solutions</p>
            <p className="text-sm text-gray-500 dark:text-gray-500">
              Address: 123 Timber Street, Wood City | Phone: +91 98765 43210 | GSTIN: 29ABCDE1234F1Z5
            </p>
          </div>

          {/* Bill Header Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Bill To:</h3>
              <div className="space-y-2">
                <input
                  type="text"
                  placeholder="Customer Name"
                  value={customerInfo.name}
                  onChange={(e) => setCustomerInfo({...customerInfo, name: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white print:border-none print:bg-transparent"
                />
                <textarea
                  placeholder="Customer Address"
                  value={customerInfo.address}
                  onChange={(e) => setCustomerInfo({...customerInfo, address: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white print:border-none print:bg-transparent"
                  rows={3}
                />
                <input
                  type="text"
                  placeholder="GSTIN"
                  value={customerInfo.gstin}
                  onChange={(e) => setCustomerInfo({...customerInfo, gstin: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white print:border-none print:bg-transparent"
                />
                <input
                  type="text"
                  placeholder="Phone Number"
                  value={customerInfo.phone}
                  onChange={(e) => setCustomerInfo({...customerInfo, phone: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white print:border-none print:bg-transparent"
                />
              </div>
            </div>
            
            <div>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="font-medium text-gray-900 dark:text-white">Bill No:</span>
                  <input
                    type="text"
                    value={billNumber}
                    onChange={(e) => setBillNumber(e.target.value)}
                    className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white print:border-none print:bg-transparent"
                  />
                </div>
                <div className="flex justify-between">
                  <span className="font-medium text-gray-900 dark:text-white">Date:</span>
                  <input
                    type="date"
                    value={billDate}
                    onChange={(e) => setBillDate(e.target.value)}
                    className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white print:border-none print:bg-transparent"
                  />
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-medium text-gray-900 dark:text-white">Inter-State:</span>
                  <label className="flex items-center print:hidden">
                    <input
                      type="checkbox"
                      checked={isInterState}
                      onChange={(e) => {
                        setIsInterState(e.target.checked)
                        if (e.target.checked) {
                          setIgstRate(gstRate)
                        } else {
                          setIgstRate(0)
                        }
                      }}
                      className="mr-2"
                    />
                    <span className="text-sm text-gray-600 dark:text-gray-400">Yes</span>
                  </label>
                  <span className="print:inline hidden">{isInterState ? 'Yes' : 'No'}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Bill Items Table */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Bill Items</h3>
            <div className="overflow-x-auto">
              <table className="min-w-full border border-gray-300 dark:border-gray-600">
                <thead className="bg-gray-50 dark:bg-gray-700">
                  <tr>
                    <th className="px-4 py-2 text-left text-sm font-medium text-gray-900 dark:text-white border-b">Sr.</th>
                    <th className="px-4 py-2 text-left text-sm font-medium text-gray-900 dark:text-white border-b">Product</th>
                    <th className="px-4 py-2 text-left text-sm font-medium text-gray-900 dark:text-white border-b">Specification</th>
                    <th className="px-4 py-2 text-left text-sm font-medium text-gray-900 dark:text-white border-b">Qty</th>
                    <th className="px-4 py-2 text-left text-sm font-medium text-gray-900 dark:text-white border-b">Unit</th>
                    <th className="px-4 py-2 text-left text-sm font-medium text-gray-900 dark:text-white border-b">Rate</th>
                    <th className="px-4 py-2 text-left text-sm font-medium text-gray-900 dark:text-white border-b">Amount</th>
                    <th className="px-4 py-2 text-left text-sm font-medium text-gray-900 dark:text-white border-b print:hidden">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {billItems.map((item, index) => (
                    <tr key={item.id} className="border-b border-gray-200 dark:border-gray-600">
                      <td className="px-4 py-2 text-sm text-gray-900 dark:text-white">{index + 1}</td>
                      <td className="px-4 py-2">
                        <select
                          value={item.product}
                          onChange={(e) => updateBillItem(item.id, 'product', e.target.value)}
                          className="w-full px-2 py-1 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm print:border-none print:bg-transparent"
                        >
                          <option value="">Select Product</option>
                          {woodProducts.map((product) => (
                            <option key={product} value={product}>{product}</option>
                          ))}
                        </select>
                      </td>
                      <td className="px-4 py-2">
                        <select
                          value={item.specification}
                          onChange={(e) => updateBillItem(item.id, 'specification', e.target.value)}
                          className="w-full px-2 py-1 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm print:border-none print:bg-transparent"
                        >
                          <option value="">Select Spec</option>
                          {specifications.map((spec) => (
                            <option key={spec} value={spec}>{spec}</option>
                          ))}
                        </select>
                      </td>
                      <td className="px-4 py-2">
                        <input
                          type="number"
                          value={item.quantity}
                          onChange={(e) => updateBillItem(item.id, 'quantity', parseFloat(e.target.value) || 0)}
                          className="w-20 px-2 py-1 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm print:border-none print:bg-transparent"
                          min="0"
                          step="0.01"
                        />
                      </td>
                      <td className="px-4 py-2">
                        <select
                          value={item.unit}
                          onChange={(e) => updateBillItem(item.id, 'unit', e.target.value)}
                          className="w-16 px-2 py-1 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm print:border-none print:bg-transparent"
                        >
                          <option value="CFT">CFT</option>
                          <option value="Pcs">Pcs</option>
                          <option value="Kg">Kg</option>
                          <option value="Sq.Ft">Sq.Ft</option>
                        </select>
                      </td>
                      <td className="px-4 py-2">
                        <input
                          type="number"
                          value={item.rate}
                          onChange={(e) => updateBillItem(item.id, 'rate', parseFloat(e.target.value) || 0)}
                          className="w-24 px-2 py-1 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm print:border-none print:bg-transparent"
                          min="0"
                          step="0.01"
                        />
                      </td>
                      <td className="px-4 py-2 text-sm text-gray-900 dark:text-white">
                        ₹{item.amount.toFixed(2)}
                      </td>
                      <td className="px-4 py-2 print:hidden">
                        <button
                          onClick={() => removeBillItem(item.id)}
                          className="text-red-600 hover:text-red-800 text-sm"
                          disabled={billItems.length === 1}
                        >
                          Remove
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            <button
              onClick={addBillItem}
              className="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200 print:hidden"
            >
              + Add Item
            </button>
          </div>

          {/* Bill Summary */}
          <div className="border-t pt-6">
            <div className="flex justify-end">
              <div className="w-80">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-900 dark:text-white">Subtotal:</span>
                    <span className="text-gray-900 dark:text-white">₹{calculateSubtotal().toFixed(2)}</span>
                  </div>
                  
                  {!isInterState ? (
                    <>
                      <div className="flex justify-between">
                        <span className="text-gray-900 dark:text-white">CGST ({gstRate/2}%):</span>
                        <span className="text-gray-900 dark:text-white">₹{gstCalculation.cgst.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-900 dark:text-white">SGST ({gstRate/2}%):</span>
                        <span className="text-gray-900 dark:text-white">₹{gstCalculation.sgst.toFixed(2)}</span>
                      </div>
                    </>
                  ) : (
                    <div className="flex justify-between">
                      <span className="text-gray-900 dark:text-white">IGST ({igstRate}%):</span>
                      <span className="text-gray-900 dark:text-white">₹{gstCalculation.igst.toFixed(2)}</span>
                    </div>
                  )}
                  
                  <div className="border-t pt-2">
                    <div className="flex justify-between text-lg font-bold">
                      <span className="text-gray-900 dark:text-white">Total Amount:</span>
                      <span className="text-gray-900 dark:text-white">₹{calculateTotal().toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Terms and Conditions */}
          <div className="mt-8 pt-6 border-t">
            <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-2">Terms & Conditions:</h4>
            <div className="text-xs text-gray-600 dark:text-gray-400 space-y-1">
              <p>1. All wood materials are subject to natural variations in color and grain.</p>
              <p>2. Payment due within 30 days of invoice date.</p>
              <p>3. Goods once sold cannot be returned unless defective.</p>
              <p>4. Delivery charges are extra and will be charged as per actual.</p>
            </div>
          </div>

          {/* Signature Section */}
          <div className="mt-8 flex justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Customer Signature</p>
              <div className="mt-8 border-b border-gray-300 w-48"></div>
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Authorized Signature</p>
              <div className="mt-8 border-b border-gray-300 w-48"></div>
              <p className="text-xs text-gray-500 mt-1">For WoodBill Pro</p>
            </div>
          </div>
        </div>
      </div>

      {/* Print Styles */}
      <style jsx global>{`
        @media print {
          @page {
            margin: 0.5in;
            size: A4;
          }
          
          body {
            print-color-adjust: exact;
            -webkit-print-color-adjust: exact;
          }
          
          .print\\:hidden {
            display: none !important;
          }
          
          .print\\:border-none {
            border: none !important;
          }
          
          .print\\:bg-transparent {
            background: transparent !important;
          }
          
          .print\\:rounded-none {
            border-radius: 0 !important;
          }
          
          .print\\:inline {
            display: inline !important;
          }
          
          .print\\:shadow-none {
            box-shadow: none !important;
          }
          
          /* Hide form controls */
          input, select, textarea {
            border: none !important;
            background: transparent !important;
            -webkit-appearance: none;
            -moz-appearance: none;
            appearance: none;
          }
          
          /* Show values instead of form controls */
          input[type="text"], input[type="date"], input[type="number"], select, textarea {
            color: black !important;
            font-size: inherit !important;
          }
          
          /* Table styling for print */
          table {
            border-collapse: collapse !important;
          }
          
          th, td {
            border: 1px solid #000 !important;
            padding: 4px !important;
          }
          
          /* Ensure text is black */
          * {
            color: black !important;
          }
          
          /* Company header styling */
          .text-amber-600 {
            color: #d97706 !important;
          }
        }
      `}</style>
    </div>
  )
}
