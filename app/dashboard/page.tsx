'use client'

import { useRouter } from 'next/navigation'
import TodoList from '@/components/todos/TodoList'
import { useAuth } from '@/lib/context/auth-context'
import supabase from '@/lib/supabase/client'

export default function DashboardPage() {
  const router = useRouter()
  const { user } = useAuth()

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push('/auth/signin')
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-semibold text-gray-900">
                Welcome, {user?.email}
              </h1>
            </div>
            <div className="flex items-center">
              <button
                onClick={handleSignOut}
                className="ml-3 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Sign out
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="py-10">
        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
          <div className="px-4 sm:px-0">
            <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">
              Your Todos
            </h2>
            <TodoList />
          </div>
        </div>
      </main>
    </div>
  )
} 