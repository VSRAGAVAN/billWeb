import Link from 'next/link'
import Image from 'next/image'

export default function ForgotPasswordPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <div className="flex justify-center items-center gap-2 mb-4">
            <img 
              src="/favicon.ico" 
              alt="Ganapathy Logo" 
              style={{ 
                width: 40, 
                height: 40, 
                borderRadius: 4 
              }} 
            />
            <span className="text-2xl font-bold text-gray-900 dark:text-white">Ganapathy Timbers</span>
          </div>
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900 dark:text-white">
            Reset your password
          </h2>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            Remember your password?{' '}
            <Link href="/login" className="font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400">
              Sign in here
            </Link>
          </p>
        </div>

        <div className="mt-8 bg-yellow-50 dark:bg-yellow-900 border border-yellow-200 dark:border-yellow-700 rounded-md p-4">
          <div className="text-center">
            <h3 className="text-sm font-medium text-yellow-800 dark:text-yellow-200">
              Coming Soon
            </h3>
            <p className="mt-2 text-sm text-yellow-700 dark:text-yellow-300">
              The password reset functionality is under development. For now, please use the{' '}
              <Link href="/login" className="font-medium underline">
                login page
              </Link>{' '}
              to see the authentication interface.
            </p>
          </div>
        </div>

        <div className="text-center">
          <Link href="/login" className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white">
            ← Back to login
          </Link>
        </div>
      </div>
    </div>
  )
}
