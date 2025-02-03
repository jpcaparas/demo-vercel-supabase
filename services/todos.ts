import supabase from '@/lib/supabase/client'
import { Database } from '@/types/supabase'

type Todo = Database['public']['Tables']['todos']['Row']
type NewTodo = Database['public']['Tables']['todos']['Insert']

export async function getTodos(userId: string) {
  const { data, error } = await supabase
    .from('todos')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })

  if (error) throw error
  return data
}

export async function addTodo(todo: NewTodo) {
  const { data, error } = await supabase
    .from('todos')
    .insert(todo)
    .select()
    .single()

  if (error) throw error
  return data
}

export async function updateTodo(id: string, updates: Partial<Todo>) {
  const { data, error } = await supabase
    .from('todos')
    .update(updates)
    .eq('id', id)
    .select()
    .single()

  if (error) throw error
  return data
}

export async function deleteTodo(id: string) {
  const { error } = await supabase
    .from('todos')
    .delete()
    .eq('id', id)

  if (error) throw error
}

// Real-time subscription helper
export function subscribeToTodos(userId: string, callback: (todo: Todo) => void) {
  const subscription = supabase
    .channel('todos')
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'todos',
        filter: `user_id=eq.${userId}`,
      },
      (payload) => {
        callback(payload.new as Todo)
      }
    )
    .subscribe()

  return () => {
    subscription.unsubscribe()
  }
} 