import { createBrowserClient } from "@supabase/ssr";
import { getEnvConfig } from "@/lib/env";

const { supabaseUrl, supabaseAnonKey } = getEnvConfig();

export const createClient = () =>
  createBrowserClient(
    supabaseUrl,
    supabaseAnonKey,
  );