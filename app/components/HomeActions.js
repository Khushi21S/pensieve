'use client'

import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

export default function HomeActions() {
  const router = useRouter()
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  useEffect(() => {
    const isAuthed = localStorage.getItem('pensieve-auth') === 'true'
    setIsLoggedIn(isAuthed)
  }, [])

  const handleCreateClick = () => {
    if (isLoggedIn) {
      router.push('/admin/create')
    } else {
      router.push('/admin/login')
    }
  }

  return (
    <div className="flex justify-center gap-4">
      <button
        onClick={handleCreateClick}
        className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition cursor-pointer"
      >
        Create Blog
      </button>

      <button
        onClick={() => router.push('/blog')}
        className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-6 py-3 rounded-lg transition cursor-pointer"
      >
        See Blogs
      </button>
    </div>
  )
}
