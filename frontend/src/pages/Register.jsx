import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

function Register({ onRegister, addToast }) {
  const navigate = useNavigate()
  const [form, setForm] = useState({ name: '', email: '', password: '' })

  function validateEmail(value) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
  }

  async function handleSubmit(event) {
    event.preventDefault()

    if (!form.name.trim()) {
      addToast('Name is required for registration.')
      return
    }

    if (!form.email.trim() || !validateEmail(form.email)) {
      addToast('Enter a valid email address.')
      return
    }

    if (!form.password || form.password.length < 6) {
      addToast('Password must be at least 6 characters.')
      return
    }

    const result = await onRegister(form)
    if (result.ok) {
      navigate('/app')
    }
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <div className="mx-auto flex min-h-screen max-w-md items-center px-6">
        <div className="w-full rounded-2xl border border-slate-800 bg-slate-900/70 p-6">
          <h1 className="text-2xl font-semibold">Create account</h1>
          <p className="mt-2 text-sm text-slate-400">Save and query your profile data.</p>
          <form onSubmit={handleSubmit} className="mt-6 grid gap-3">
            <input
              className="rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm"
              placeholder="Name"
              value={form.name}
              onChange={(event) => setForm({ ...form, name: event.target.value })}
            />
            <input
              className="rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm"
              placeholder="Email"
              type="email"
              value={form.email}
              onChange={(event) => setForm({ ...form, email: event.target.value })}
            />
            <input
              className="rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm"
              placeholder="Password"
              type="password"
              value={form.password}
              onChange={(event) => setForm({ ...form, password: event.target.value })}
            />
            <button
              type="submit"
              className="cursor-pointer rounded-lg bg-cyan-400 px-4 py-2 text-sm font-medium text-slate-950"
            >
              Register
            </button>
          </form>
          <p className="mt-4 text-xs text-slate-400">
            Already have an account? <Link className="text-emerald-300" to="/login">Login</Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default Register
