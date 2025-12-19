'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { getSupabaseClient } from '@/lib/supabase'
import { LogOut } from 'lucide-react'
import { useRouter } from 'next/navigation'

export default function Navbar() {
  const [user, setUser] = useState<any>(null)
  const router = useRouter()

  useEffect(() => {
    // Only initialize Supabase client on the client side
    const supabase = getSupabaseClient()
    checkUser(supabase)
  }, [])

  const checkUser = async (supabase: ReturnType<typeof getSupabaseClient>) => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)
    } catch (error) {
      // Silently fail during build/runtime if env vars are missing
      console.error('Failed to get user:', error)
    }
  }

  const handleLogout = async () => {
    try {
      const supabase = getSupabaseClient()
      await supabase.auth.signOut()
      setUser(null)
      router.push('/')
    } catch (error) {
      console.error('Failed to logout:', error)
    }
  }

  return (
    <nav className="bg-black border-b border-gray-800">
      <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
        <Link href="/" className="text-2xl font-serif text-white hover:text-gray-300 transition">
          Selfbook
        </Link>

        <div className="flex gap-4 items-center">
          {user ? (
            <>
              <Link href="/dashboard" className="text-gray-400 hover:text-white font-medium transition text-sm">
                Dashboard
              </Link>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-4 py-2 border border-gray-700 text-gray-400 hover:border-gray-600 hover:text-white transition text-sm rounded-lg"
              >
                <LogOut size={16} />
                Exit
              </button>
            </>
          ) : (
            <>
              <Link href="/login" className="text-gray-400 hover:text-white font-medium transition text-sm">
                Enter
              </Link>
              <Link
                href="/signup"
                className="px-4 py-2 bg-white text-black hover:bg-gray-200 transition text-sm font-medium rounded-lg"
              >
                Begin
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  )
}
