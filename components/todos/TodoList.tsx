'use client'

import { useEffect, useState } from 'react'
import { useAuth } from '@/lib/context/auth-context'
import { getTodos, addTodo, updateTodo, deleteTodo, subscribeToTodos } from '@/services/todos'
import type { Database } from '@/types/supabase'

type Todo = Database['public']['Tables']['todos']['Row']

export default function TodoList() {
  const { user } = useAuth()
  const [todos, setTodos] = useState<Todo[]>([])
  const [newTodoTitle, setNewTodoTitle] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) return

    // Initial fetch
    const fetchTodos = async () => {
      try {
        const data = await getTodos(user.id)
        setTodos(data)
      } catch (error) {
        console.error('Error fetching todos:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchTodos()

    // Set up real-time subscription
    const unsubscribe = subscribeToTodos(user.id, (updatedTodo) => {
      setTodos((currentTodos) => {
        const exists = currentTodos.some((todo) => todo.id === updatedTodo.id)
        if (exists) {
          return currentTodos.map((todo) =>
            todo.id === updatedTodo.id ? updatedTodo : todo
          )
        }
        return [updatedTodo, ...currentTodos]
      })
    })

    return () => {
      unsubscribe()
    }
  }, [user])

  const handleAddTodo = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user || !newTodoTitle.trim()) return

    try {
      const newTodo = await addTodo({
        title: newTodoTitle,
        user_id: user.id,
        completed: false,
      })
      // Optimistically update the UI
      setTodos((currentTodos) => [newTodo, ...currentTodos])
      setNewTodoTitle('')
    } catch (error) {
      console.error('Error adding todo:', error)
    }
  }

  const handleToggleTodo = async (todo: Todo) => {
    try {
      // Optimistically update the UI
      setTodos((currentTodos) =>
        currentTodos.map((t) =>
          t.id === todo.id ? { ...t, completed: !t.completed } : t
        )
      )
      await updateTodo(todo.id, { completed: !todo.completed })
    } catch (error) {
      // Revert the optimistic update on error
      setTodos((currentTodos) =>
        currentTodos.map((t) =>
          t.id === todo.id ? { ...t, completed: todo.completed } : t
        )
      )
      console.error('Error updating todo:', error)
    }
  }

  const handleDeleteTodo = async (id: string) => {
    try {
      await deleteTodo(id)
      setTodos((todos) => todos.filter((todo) => todo.id !== id))
    } catch (error) {
      console.error('Error deleting todo:', error)
    }
  }

  if (loading) {
    return <div className="text-center">Loading...</div>
  }

  return (
    <div className="max-w-xl mx-auto p-4">
      <form onSubmit={handleAddTodo} className="mb-4">
        <div className="flex gap-2">
          <input
            type="text"
            value={newTodoTitle}
            onChange={(e) => setNewTodoTitle(e.target.value)}
            placeholder="Add a new todo..."
            className="flex-1 rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-900 placeholder-gray-500"
          />
          <button
            type="submit"
            disabled={!newTodoTitle.trim()}
            className="px-4 py-2 bg-indigo-600 text-white rounded-md text-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
          >
            Add
          </button>
        </div>
      </form>

      <ul className="space-y-2">
        {todos.map((todo) => (
          <li
            key={todo.id}
            className="flex items-center justify-between p-3 bg-white rounded-md shadow-sm"
          >
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={todo.completed}
                onChange={() => handleToggleTodo(todo)}
                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
              />
              <span
                className={`text-sm ${
                  todo.completed ? 'text-gray-400 line-through' : 'text-gray-700'
                }`}
              >
                {todo.title}
              </span>
            </div>
            <button
              onClick={() => handleDeleteTodo(todo.id)}
              className="text-red-500 hover:text-red-700 text-sm"
            >
              Delete
            </button>
          </li>
        ))}
      </ul>

      {todos.length === 0 && (
        <p className="text-center text-gray-500 mt-4">No todos yet. Add one above!</p>
      )}
    </div>
  )
} 