import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type ItemStatus = 'available' | 'borrowed';
export type RequestStatus = 'pending' | 'approved' | 'returned';

export interface Item {
  id: string;
  name: string;
  category: string;
  image_url: string;
  status: ItemStatus;
  created_at: string;
}

export interface BorrowRequest {
  id: string;
  item_id: string;
  full_name: string;
  phone: string;
  start_date: string;
  end_date: string;
  status: RequestStatus;
  created_at: string;
}
