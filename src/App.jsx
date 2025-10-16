import React from 'react'
import LotteryForm from './components/LotteryForm'

export default function App() {
  return (
    <div className="d-flex flex-column min-vh-100">
      <header className="bg-dark text-white py-3 shadow-sm">
        <div className="container text-center">
          <h1 className="h4">Shaao - The Charity Term</h1>
        </div>
      </header>

      <main className="flex-grow-1">
        <div className="container py-4">
          <LotteryForm />
        </div>
      </main>

      <footer className="bg-light py-3 mt-auto border-top">
        <div className="container text-center text-muted">
          © {new Date().getFullYear()} Shaao - The Charity Term
        </div>
      </footer>
    </div>
  )
}