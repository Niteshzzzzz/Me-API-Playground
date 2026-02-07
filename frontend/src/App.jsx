import { useEffect, useState } from 'react'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import './App.css'

import ToastStack from './components/ToastStack.jsx'
import Login from './pages/Login.jsx'
import Register from './pages/Register.jsx'
import Playground from './pages/Playground.jsx'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000'

function App() {
  const [isAuthed, setIsAuthed] = useState(false)
  const [authChecked, setAuthChecked] = useState(false)
  const [toasts, setToasts] = useState([])

  function addToast(message, tone = 'error') {
    const id = crypto.randomUUID()
    setToasts((prev) => [...prev, { id, message, tone }])
    setTimeout(() => {
      setToasts((prev) => prev.filter((toast) => toast.id !== id))
    }, 3500)
  }

  useEffect(() => {
    async function checkAuth() {
      try {
        const res = await fetch(`${API_URL}/auth/me`, { credentials: 'include' })
        setIsAuthed(res.ok)
      } catch (err) {
        setIsAuthed(false)
      } finally {
        setAuthChecked(true)
      }
    }

    checkAuth()
  }, [])

  async function loginUser(payload) {
    const res = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(payload),
    })

    const data = await res.json()
    if (!res.ok) {
      addToast(data.error || 'Auth failed')
      return { ok: false }
    }

    setIsAuthed(true)
    addToast('Authenticated successfully.', 'success')
    return { ok: true }
  }

  async function registerUser(payload) {
    const res = await fetch(`${API_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(payload),
    })

    const data = await res.json()
    if (!res.ok) {
      addToast(data.error || 'Registration failed')
      return { ok: false }
    }

    setIsAuthed(true)
    addToast('Authenticated successfully.', 'success')
    return { ok: true }
  }

  async function handleLogout() {
    await fetch(`${API_URL}/auth/logout`, { method: 'POST', credentials: 'include' })
    setIsAuthed(false)
    addToast('Logged out.', 'success')
  }

  if (!authChecked) {
    return null
  }

  return (
    <BrowserRouter>
      <ToastStack toasts={toasts} />
      <Routes>
        <Route path="/" element={<Navigate to={isAuthed ? '/app' : '/login'} replace />} />
        <Route
          path="/login"
          element={<Login onLogin={loginUser} addToast={addToast} />}
        />
        <Route
          path="/register"
          element={<Register onRegister={registerUser} addToast={addToast} />}
        />
        <Route
          path="/app"
          element={
            isAuthed ? (
              <Playground apiUrl={API_URL} onLogout={handleLogout} addToast={addToast} />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
