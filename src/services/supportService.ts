
import { supabase } from "@/integrations/supabase/client";

export interface SupportTicket {
  id: string;
  user_id: string | null;
  issue_description: string;
  status: string;
  created_at: string | null;
  updated_at: string | null;
}

// Create support ticket
export const createSupportTicket = async (ticket: Omit<SupportTicket, 'id' | 'created_at' | 'updated_at' | 'status'>): Promise<SupportTicket> => {
  const { data, error } = await supabase
    .from('support_tickets')
    .insert(ticket)
    .select()
    .single();

  if (error) {
    console.error('Error creating support ticket:', error);
    throw error;
  }

  return data;
};

// Get user support tickets
export const getUserSupportTickets = async (userId: string): Promise<SupportTicket[]> => {
  const { data, error } = await supabase
    .from('support_tickets')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching support tickets:', error);
    throw error;
  }

  return data || [];
};

// Get support ticket by id
export const getSupportTicketById = async (id: string): Promise<SupportTicket | null> => {
  const { data, error } = await supabase
    .from('support_tickets')
    .select('*')
    .eq('id', id)
    .maybeSingle();

  if (error) {
    console.error('Error fetching support ticket:', error);
    throw error;
  }

  return data;
};
