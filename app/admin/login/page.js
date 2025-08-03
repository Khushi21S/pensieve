'use client'

import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

export default function AdminLogin() {
  const router = useRouter()

  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    const isAuthed = localStorage.getItem('pensieve-auth') === 'true'
    if (isAuthed) router.replace('/admin/blogs')
  }, [])

  const handleLogin = async (e) => {
    e.preventDefault()

    const res = await fetch('/api/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ username, password })
    })

    const result = await res.json()

    if (result.success) {
      localStorage.setItem('pensieve-auth', 'true')
      localStorage.setItem('pensieve-user', username)
      router.push('/admin/blogs')
    } else {
      setError(result.error || 'Login failed')
    }
  }

  return (
    <div className="h-screen flex items-center justify-center bg-gray-50">
      <form onSubmit={handleLogin} className="bg-white p-8 rounded shadow-md w-80 space-y-4">
        <h1 className="text-2xl font-semibold text-center text-black">Admin Login</h1>

        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="w-full border p-2 text-black rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full border p-2 text-black rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />

        {error && <p className="text-red-500 text-sm">{error}</p>}

        <button
          type="submit"
          className="w-full bg-green-600 text-white py-2 rounded hover:bg-blue-700 transition"
        >
          Login
        </button>
      </form>
    </div>
  )
}
