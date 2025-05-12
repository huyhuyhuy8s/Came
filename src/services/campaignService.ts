
import { supabase } from "@/integrations/supabase/client";

export interface Campaign {
  id: string;
  title: string;
  description: string;
  start_date: string;
  end_date: string;
  is_active: boolean;
  image_url: string | null;
}

// Get all active campaigns
export const getActiveCampaigns = async (): Promise<Campaign[]> => {
  const { data, error } = await supabase
    .from('campaigns')
    .select('*')
    .eq('is_active', true)
    .gte('end_date', new Date().toISOString());

  if (error) {
    console.error('Error fetching campaigns:', error);
    throw error;
  }

  return data || [];
};

// Get campaign by id
export const getCampaignById = async (id: string): Promise<Campaign | null> => {
  const { data, error } = await supabase
    .from('campaigns')
    .select('*')
    .eq('id', id)
    .maybeSingle();

  if (error) {
    console.error('Error fetching campaign:', error);
    throw error;
  }

  return data;
};
