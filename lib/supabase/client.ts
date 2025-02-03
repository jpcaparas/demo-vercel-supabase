import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { Database } from '@/types/supabase'

export const createClient = () => createClientComponentClient<Database>()

// Create a singleton instance for use across the app
const supabase = createClient()

export default supabase 