// app/components/ErrorBoundary.tsx
'use client'

import { Component, ReactNode } from 'react'

type Props = { children: ReactNode }
type State = { hasError: boolean }

export default class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false }

  static getDerivedStateFromError() {
    return { hasError: true }
  }

  componentDidCatch(error: any, errorInfo: any) {
    console.error("💥 UI crash:", error, errorInfo)
    setTimeout(() => location.reload(), 3000)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="fixed inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-zinc-900 to-black text-white z-50">
          <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-white mb-6" />
          <h2 className="text-2xl font-bold mb-2">Attente de données</h2>
          <p className="text-gray-300">Chargement automatique dans quelques secondes...</p>
        </div>
      )
    }

    return this.props.children
  }
}
