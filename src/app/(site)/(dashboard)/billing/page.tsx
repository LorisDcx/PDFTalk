import { Suspense } from 'react'
import BillingClient from './billing-client'

export default function BillingPage() {
  return <Suspense fallback={
    <div className="min-h-[calc(100vh-4rem)] bg-[#fffaf5] px-4 py-8 sm:px-6 lg:px-8" aria-busy="true">
      <div className="mx-auto max-w-6xl animate-pulse">
        <div className="mb-3 h-3 w-24 rounded bg-[#eadfe7]" />
        <div className="mb-3 h-12 w-72 max-w-full rounded bg-[#eadfe7]" />
        <div className="mb-9 h-4 w-96 max-w-full rounded bg-[#f1e9ef]" />
        <div className="mb-9 h-32 rounded-[1.5rem] bg-[#eee2ea]" />
        <div className="grid gap-5 md:grid-cols-3">
          {[0, 1, 2].map(item => <div key={item} className="h-96 rounded-[1.5rem] border border-[#ead9cf] bg-white" />)}
        </div>
      </div>
    </div>
  }><BillingClient /></Suspense>
}
