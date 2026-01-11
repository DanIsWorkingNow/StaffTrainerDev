import { createServerClient } from "@supabase/ssr";
import { s as setCookie, g as getCookies } from "../server.js";
function getSupabaseServerClient() {
  return createServerClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_ANON_KEY,
    {
      cookies: {
        getAll() {
          return Object.entries(getCookies()).map(([name, value]) => ({
            name,
            value
          }));
        },
        setAll(cookies) {
          cookies.forEach((cookie) => {
            setCookie(cookie.name, cookie.value);
          });
        }
      }
    }
  );
}
export {
  getSupabaseServerClient as g
};
