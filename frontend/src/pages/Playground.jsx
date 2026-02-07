import { useState } from 'react'

const defaultProfile = {
  name: 'Your Name',
  email: 'you@example.com',
  education: ['B.Sc. Computer Science'],
  skills: ['javascript', 'react', 'node'],
  projects: [
    { title: 'Profile Playground', description: 'A tiny CRUD playground.', links: ['https://github.com/you'] },
  ],
  work: [
    { company: 'Acme', role: 'Developer', start: '2023', end: '2024', description: 'Built APIs.' },
  ],
  links: {
    github: 'https://github.com/you',
    linkedin: 'https://linkedin.com/in/you',
    portfolio: 'https://you.dev',
  },
}

function Playground({ apiUrl, onLogout, addToast }) {
  const [profileJson, setProfileJson] = useState(JSON.stringify(defaultProfile, null, 2))
  const [profileStatus, setProfileStatus] = useState('')
  const [querySkill, setQuerySkill] = useState('')
  const [queryText, setQueryText] = useState('')
  const [results, setResults] = useState(null)

  const baseHeaders = { 'Content-Type': 'application/json' }

  function validateEmail(value) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
  }

  async function loadProfile() {
    setProfileStatus('')

    const res = await fetch(`${apiUrl}/profile`, { credentials: 'include' })
    const data = await res.json()
    if (!res.ok) {
      addToast(data.error || 'Failed to load profile')
      return
    }

    setProfileJson(JSON.stringify(data, null, 2))
    setProfileStatus('Profile loaded')
    addToast('Profile loaded.', 'success')
  }

  async function importProfile() {
    const res = await fetch(`${apiUrl}/profile/export`, { credentials: 'include' })
    if (!res.ok) {
      const data = await res.json().catch(() => ({}))
      addToast(data.error || 'Failed to download profile')
      return
    }

    const blob = await res.blob()
    const url = window.URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = 'profile.json'
    document.body.appendChild(link)
    link.click()
    link.remove()
    window.URL.revokeObjectURL(url)
    addToast('Profile downloaded.', 'success')
  }

  async function saveProfile() {
    setProfileStatus('')

    let payload
    try {
      payload = JSON.parse(profileJson)
    } catch (err) {
      addToast('Profile JSON is invalid.')
      return
    }

    if (!payload.name || !payload.name.trim()) {
      addToast('Profile name is required.')
      return
    }

    if (!payload.email || !validateEmail(payload.email)) {
      addToast('Profile email is invalid.')
      return
    }

    const method = payload._id ? 'PUT' : 'POST'
    const res = await fetch(`${apiUrl}/profile`, {
      method,
      headers: baseHeaders,
      credentials: 'include',
      body: JSON.stringify(payload),
    })

    const data = await res.json()
    if (!res.ok) {
      addToast(data.error || 'Failed to save profile')
      return
    }

    setProfileJson(JSON.stringify(data, null, 2))
    setProfileStatus('Profile saved')
    addToast('Profile saved.', 'success')
  }

  async function runProjectsQuery() {
    if (!querySkill.trim()) {
      addToast('Enter a skill before running this query.')
      return
    }

    const query = querySkill ? `?skill=${encodeURIComponent(querySkill)}` : ''
    const res = await fetch(`${apiUrl}/query/projects${query}`, { credentials: 'include' })
    const data = await res.json()
    if (!res.ok) {
      addToast(data.error || 'Query failed')
      return
    }
    setResults(data)
  }

  async function runSearchQuery() {
    if (!queryText.trim()) {
      addToast('Enter a search term before running this query.')
      return
    }

    const query = queryText ? `?q=${encodeURIComponent(queryText)}` : ''
    const res = await fetch(`${apiUrl}/query/search${query}`, { credentials: 'include' })
    const data = await res.json()
    if (!res.ok) {
      addToast(data.error || 'Search failed')
      return
    }
    setResults(data)
  }

  async function runTopSkills() {
    const res = await fetch(`${apiUrl}/query/skills/top`, { credentials: 'include' })
    const data = await res.json()
    if (!res.ok) {
      addToast(data.error || 'Skills query failed')
      return
    }
    setResults(data)
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <div className="mx-auto max-w-5xl px-6 py-10">
        <header className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Candidate Profile Playground</p>
            <h1 className="text-3xl font-semibold">Profile API + Queries</h1>
            <p className="mt-2 text-sm text-slate-400">
              Save your profile, then run skill and search queries with a minimal UI.
            </p>
          </div>
          <button
            onClick={onLogout}
            className="cursor-pointer rounded-full border border-slate-700 bg-slate-900/60 px-3 py-1 text-xs text-slate-200 hover:border-slate-500"
          >
            Logout
          </button>
        </header>

        <div className="grid gap-6 lg:grid-cols-[1.1fr_1fr]">
          <section className="rounded-2xl border border-slate-800 bg-slate-900/70 p-6">
            <h2 className="text-lg font-semibold">Profile JSON</h2>
            <p className="mt-1 text-xs text-slate-400">Create or update your profile using the JSON payload.</p>
            <textarea
              className="mt-4 h-72 w-full rounded-xl border border-slate-700 bg-slate-950 p-3 text-xs"
              value={profileJson}
              onChange={(event) => setProfileJson(event.target.value)}
            />
            <div className="mt-3 flex flex-wrap gap-2">
              <button
                onClick={loadProfile}
                className="cursor-pointer rounded-lg border border-slate-700 bg-slate-900/60 px-4 py-2 text-sm text-slate-200"
              >
                Load profile
              </button>
              <button
                onClick={importProfile}
                className="cursor-pointer rounded-lg border border-slate-700 bg-slate-900/60 px-4 py-2 text-sm text-slate-200"
              >
                Download
              </button>
              <button
                onClick={saveProfile}
                className="cursor-pointer rounded-lg bg-cyan-400 px-4 py-2 text-sm font-semibold text-slate-950"
              >
                Save profile
              </button>
              {/* {profileStatus ? <span className="text-xs text-emerald-400">{profileStatus}</span> : null} */}
            </div>
          </section>

          <section className="rounded-2xl border border-slate-800 bg-slate-900/70 p-6">
            <h2 className="text-lg font-semibold">Queries</h2>
            <div className="mt-4 grid gap-4">
              <div className="grid gap-2">
                <label className="text-xs text-slate-400">Projects by skill</label>
                <input
                  className="rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm"
                  placeholder="python"
                  value={querySkill}
                  onChange={(event) => setQuerySkill(event.target.value)}
                />
                <button
                  onClick={runProjectsQuery}
                  className="cursor-pointer rounded-lg border border-slate-700 bg-slate-900/60 px-4 py-2 text-sm text-slate-200"
                >
                  Run /query/projects
                </button>
              </div>

              <div className="grid gap-2">
                <label className="text-xs text-slate-400">Search everything</label>
                <input
                  className="rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm"
                  placeholder="react"
                  value={queryText}
                  onChange={(event) => setQueryText(event.target.value)}
                />
                <button
                  onClick={runSearchQuery}
                  className="cursor-pointer rounded-lg border border-slate-700 bg-slate-900/60 px-4 py-2 text-sm text-slate-200"
                >
                  Run /query/search
                </button>
              </div>

              <div className="grid gap-2">
                <label className="text-xs text-slate-400">Top skills</label>
                <button
                  onClick={runTopSkills}
                  className="cursor-pointer rounded-lg border border-slate-700 bg-slate-900/60 px-4 py-2 text-sm text-slate-200"
                >
                  Run /query/skills/top
                </button>
              </div>
            </div>
          </section>
        </div>

        <section className="mt-6 rounded-2xl border border-slate-800 bg-slate-900/70 p-6">
          <h2 className="text-lg font-semibold">Results</h2>
          <div className="mt-4 rounded-xl border border-slate-800 bg-slate-950 p-3 text-xs text-slate-300">
            <pre className="whitespace-pre-wrap">{results ? JSON.stringify(results, null, 2) : 'Run a query to see results.'}</pre>
          </div>
        </section>
      </div>
    </div>
  )
}

export default Playground
