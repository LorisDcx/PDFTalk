import { Suspense } from 'react'
import SignupClient from './signup-client'

export default function SignupPage() {
  return <Suspense fallback={<div className="min-h-screen bg-[#f8f7f4]" />}><SignupClient /></Suspense>
}
