import React from 'react'
import { GoogleLoginButton } from './GoogleLoginButton'
import SparkLogin from './SparkLogin'
import Link from 'next/link'

const LoginCard = () => {
  return (
    <div className="p-6 space-y-6">
      <div className="text-center space-y-4 max-w-md">
        <div className="flex justify-center mb-4">
          <div className="w-36 h-10">
            <img
              src="/logo_black.png"
              alt="Black Logo"
              className="dark:hidden block"
            />
            <img
              src="/logo_white.png"
              alt="White Logo"
              className="dark:block hidden"
            />
          </div>
        </div>
        <p className="text-sm text-gray-600 dark:text-gray-300">
          You are one click away from transforming your investment approach
        </p>
      </div>

      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          Welcome
        </h2>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Sign in to access your personalized dashboard
        </p>
      </div>

      <div className="space-y-4">
        {/* <GoogleLoginButton /> */}
        <div className="flex items-center justify-center">
          <div className="w-16 h-0.5 bg-gray-200 dark:bg-gray-700"></div>
          <p className="mx-2 text-sm text-gray-500 dark:text-gray-400">
            or
          </p>
          <div className="w-16 h-0.5 bg-gray-200 dark:bg-gray-700"></div>
        </div>
        <SparkLogin />

        <div className="text-center">
          <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
            By signing in, you agree to our{" "}
            <Link
              href="/terms"
              className="underline hover:text-primary transition-colors"
            >
              Terms of Service
            </Link>{" "}
            and{" "}
            <Link
              href="/privacy"
              className="underline hover:text-primary transition-colors"
            >
              Privacy Policy
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default LoginCard