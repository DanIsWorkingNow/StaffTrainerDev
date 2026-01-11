import { a as createServerRpc, c as createServerFn } from "../server.js";
import { redirect } from "@tanstack/react-router";
import { g as getSupabaseServerClient } from "./supabase-CLvfjSRp.js";
import "@tanstack/history";
import "@tanstack/router-core/ssr/client";
import "@tanstack/router-core";
import "node:async_hooks";
import "@tanstack/router-core/ssr/server";
import "h3-v2";
import "tiny-invariant";
import "seroval";
import "react/jsx-runtime";
import "@tanstack/react-router/ssr/server";
import "@supabase/ssr";
const logoutFn_createServerFn_handler = createServerRpc("566828ec21d0ccdce1df662ede59410e979248719d530394b6aca7f837fe7339", (opts, signal) => {
  return logoutFn.__executeServer(opts, signal);
});
const logoutFn = createServerFn().handler(logoutFn_createServerFn_handler, async () => {
  const supabase = getSupabaseServerClient();
  const {
    error
  } = await supabase.auth.signOut();
  if (error) {
    return {
      error: true,
      message: error.message
    };
  }
  throw redirect({
    href: "/"
  });
});
export {
  logoutFn_createServerFn_handler
};
