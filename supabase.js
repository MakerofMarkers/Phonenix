import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://ssejzjlyhprxkvzqssys.supabase.co"; // Your project URL
const supabaseAnonKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNzZWp6amx5aHByeGt2enFzc3lzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzk2NTk0ODksImV4cCI6MjA1NTIzNTQ4OX0.OszPx18ijjZ7uBRi5mUvfjcEaAC4zT1nrIqxINIDGNU"; // Replace with your actual anon key

const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default supabase;
