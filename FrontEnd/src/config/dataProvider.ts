export type DataProvider = 'api' | 'supabase';

const configuredProvider = import.meta.env.VITE_DATA_PROVIDER?.toLowerCase();

export const dataProvider: DataProvider =
  configuredProvider === 'supabase' ? 'supabase' : 'api';

export const isSupabaseProvider = dataProvider === 'supabase';
