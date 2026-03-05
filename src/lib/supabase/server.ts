// lib/supabase/server.ts
import { createClient } from '@supabase/supabase-js';

// Usando las variables de entorno del servidor
const supabaseUrl = process.env.SUPABASE_URL as string;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY as string;

export const supabase = createClient(supabaseUrl, supabaseKey);