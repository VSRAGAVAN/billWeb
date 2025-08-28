'use client'

import { CssBaseline } from '@mui/material'
import { ThemeProvider, createTheme } from '@mui/material/styles'
import Link from 'next/link'
import Image from 'next/image'
import { useState } from 'react'
import Footer from '../../components/Footer'

// Dark theme for consistency
const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#f59e0b',
    },
    background: {
      default: '#0f172a',
      paper: '#1e293b'
    },
  },
})

export default function LoginPage() {
  const [formData, setFormData] = useState({ email: '', password: '' })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [showPassword, setShowPassword] = useState(false)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    if (error) setError('')
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')
    
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Check credentials
      if (formData.email === 'Ganapathyadmin@gmail.com' && formData.password === 'Password@123') {
        // Extract username from email (remove @gmail.com part)
        const username = formData.email.split('@')[0]
        
        // Store login state and user data
        localStorage.setItem('isLoggedIn', 'true')
        localStorage.setItem('userEmail', formData.email)
        localStorage.setItem('userData', JSON.stringify({
          email: formData.email,
          name: username,
          displayName: username
        }))
        
        // Redirect to dashboard
        window.location.href = '/dashboard'
      } else {
        setError('Invalid email or password. Please try again.')
      }
    } catch {
      setError('Login failed. Please check your credentials.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <div className="min-h-screen flex flex-col bg-[#23253A]">
        {/* Main content area */}
        <div className="flex flex-1">
          {/* Left side: branding, metrics, illustration */}
          <div className="flex-1 flex flex-col justify-center items-center relative overflow-hidden px-8 py-12">
            {/* Logo */}
            <div className="absolute top-8 left-8">
              <div className="flex items-center gap-2">
                <Image
                  src="/favicon.ico"
                  alt="Ganapathy Logo"
                  width={32}
                  height={32}
                  style={{ borderRadius: 4 }}
                  priority
                />
                <span className="text-2xl font-bold text-cyan-400">Ganapathy</span>
                <span className="text-2xl font-bold text-red-500">Timbers</span>
              </div>
            </div>
            {/* Circular accent */}
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none">
              <div className="rounded-full border-2 border-[#35375A] opacity-30 w-[420px] h-[420px]" />
            </div>
            {/* Metrics cards */}
            <div className="flex gap-8 mb-8 z-10">
              <div className="bg-[#2C2E48] rounded-xl p-6 w-48 shadow-lg flex flex-col justify-between">
                <div className="text-gray-300 text-sm mb-2">Profit <span className="block text-xs text-gray-500">Last Month</span></div>
                <div className="flex items-end gap-2">
                  <span className="text-2xl font-bold text-white">624k</span>
                  <span className="text-green-400 text-xs font-semibold">+8.24%</span>
                </div>
                {/* Simple line chart */}
                <svg width="100%" height="40" viewBox="0 0 120 40" fill="none">
                  <polyline points="0,35 20,20 40,30 60,10 80,25 100,5 120,30" stroke="#4F8CFF" strokeWidth="3" fill="none" />
                  <circle cx="120" cy="30" r="3" fill="#4F8CFF" />
                </svg>
              </div>
              <div className="bg-[#2C2E48] rounded-xl p-6 w-48 shadow-lg flex flex-col justify-between">
                <div className="text-gray-300 text-sm mb-2">Order <span className="block text-xs text-gray-500">Last week</span></div>
                <div className="flex items-end gap-2">
                  <span className="text-2xl font-bold text-white">124k</span>
                  <span className="text-green-400 text-xs font-semibold">+12.6%</span>
                </div>
                {/* Simple bar chart */}
                <svg width="100%" height="40" viewBox="0 0 120 40" fill="none">
                  <rect x="5" y="25" width="8" height="15" rx="2" fill="#4F8CFF" />
                  <rect x="20" y="15" width="8" height="25" rx="2" fill="#4F8CFF" />
                  <rect x="35" y="20" width="8" height="20" rx="2" fill="#4F8CFF" />
                  <rect x="50" y="10" width="8" height="30" rx="2" fill="#4F8CFF" />
                  <rect x="65" y="18" width="8" height="22" rx="2" fill="#4F8CFF" />
                  <rect x="80" y="8" width="8" height="32" rx="2" fill="#4F8CFF" />
                  <rect x="95" y="22" width="8" height="18" rx="2" fill="#4F8CFF" />
                </svg>
              </div>
            </div>
            {/* Illustration - 3D Character */}
            <div className="z-10">
              <div className="relative w-64 h-80 flex items-center justify-center">
                {/* 3D Character placeholder - you can replace with actual 3D model or illustration */}
                <div className="relative">
                  {/* Character body */}
                  <div className="w-24 h-32 bg-gradient-to-b from-purple-500 to-purple-600 rounded-t-3xl rounded-b-lg mx-auto mb-2"></div>
                  {/* Character head */}
                  <div className="w-16 h-16 bg-gradient-to-b from-amber-200 to-amber-300 rounded-full mx-auto -mt-6 mb-2"></div>
                  {/* Character arms */}
                  <div className="absolute top-8 -left-6 w-8 h-16 bg-gradient-to-b from-purple-500 to-purple-600 rounded-full transform rotate-12"></div>
                  <div className="absolute top-8 -right-6 w-8 h-16 bg-gradient-to-b from-purple-500 to-purple-600 rounded-full transform -rotate-12"></div>
                  {/* Character legs */}
                  <div className="absolute -bottom-2 left-2 w-6 h-12 bg-gradient-to-b from-gray-600 to-gray-700 rounded-lg"></div>
                  <div className="absolute -bottom-2 right-2 w-6 h-12 bg-gradient-to-b from-gray-600 to-gray-700 rounded-lg"></div>
                  {/* Thumbs up gesture */}
                  <div className="absolute top-4 -right-4 w-3 h-3 bg-amber-200 rounded-full"></div>
                </div>
              </div>
            </div>
          </div>
          {/* Right side: sign-in form */}
          <div className="w-full max-w-md flex flex-col justify-center px-10 py-16 bg-[#292B44] shadow-2xl">
            <h2 className="text-2xl font-bold text-white mb-2 flex items-center gap-2">Welcome to Ganapathy Timbers! <span>👋</span></h2>
            <p className="text-sm text-gray-400 mb-8">Please sign-in to your account and start the adventure</p>
            <form className="space-y-6" onSubmit={handleSubmit}>
              <div className="space-y-4">
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-1">Email</label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    value={formData.email}
                    onChange={handleInputChange}
                    className="rounded-lg block w-full px-3 py-3 border border-gray-600 bg-[#23253A] text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#FFD600] focus:border-[#FFD600] sm:text-sm"
                    placeholder="Enter your email"
                  />
                </div>
                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-1">Password</label>
                  <div className="relative">
                    <input
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      autoComplete="current-password"
                      required
                      value={formData.password}
                      onChange={handleInputChange}
                      className="rounded-lg block w-full px-3 py-3 border border-gray-600 bg-[#23253A] text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#FFD600] focus:border-[#FFD600] sm:text-sm pr-10"
                      placeholder="••••••••"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center hover:bg-gray-700 rounded-r-lg transition-colors duration-200"
                    >
                      {showPassword ? (
                        // Eye slash icon (hide password)
                        <svg className="h-5 w-5 text-gray-400 hover:text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.542-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                        </svg>
                      ) : (
                        // Eye icon (show password)
                        <svg className="h-5 w-5 text-gray-400 hover:text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                      )}
                    </button>
                  </div>
                </div>
              </div>
              {error && (
                <div className="rounded-md bg-red-900 p-4">
                  <div className="text-sm text-red-200">{error}</div>
                </div>
              )}
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input 
                    id="remember-me" 
                    name="remember-me" 
                    type="checkbox" 
                    className="h-4 w-4 text-[#FFD600] focus:ring-[#FFD600] border-gray-600 rounded bg-[#23253A]" 
                  />
                  <label htmlFor="remember-me" className="ml-2 block text-sm text-yellow-400">
                    <span className="text-yellow-400">⚠️</span> Remember me
                  </label>
                </div>
                <div className="text-sm">
                  <Link href="/forgot-password" className="font-medium text-[#FFD600] hover:text-yellow-400">
                    Forgot password?
                  </Link>
                </div>
              </div>
              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex justify-center py-3 px-4 text-base font-semibold rounded-lg text-[#23253A] bg-[#FFD600] hover:bg-yellow-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#FFD600] disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 shadow-lg"
              >
                {isLoading ? (
                  <div className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-[#23253A]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Signing in...
                  </div>
                ) : (
                  'Login'
                )}
              </button>
            </form>
            <div className="text-center mt-6">
              <Link href="/" className="text-sm text-gray-400 hover:text-white">
                ← Back to home
              </Link>
            </div>
          </div>
        </div>
        
        {/* Footer */}
        <Footer />
      </div>
    </ThemeProvider>
  )
}
