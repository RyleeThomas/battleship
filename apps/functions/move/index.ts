// Supabase Edge Function (Deno) — validate and record a move (starter stub)
import { serve } from "https://deno.land/std@0.224.0/http/server.ts";

serve(async (req) => {
  if (req.method !== 'POST') return new Response('Method Not Allowed', { status: 405 });
  const body = await req.json();
  // TODO: validate JWT via supabase, check turn order, write move to DB
  return new Response(JSON.stringify({ ok: true, received: body }), { headers: { 'content-type': 'application/json' } });
});