import { createClient } from "@supabase/supabase-js";
import { env } from "$env/dynamic/public";

const supabaseUrl = env.PUBLIC_SUPABASE_URL;
const supabaseAnonKey = env.PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    "Missing PUBLIC_SUPABASE_URL or PUBLIC_SUPABASE_ANON_KEY. Set these in your Cloudflare Pages environment variables.",
  );
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
