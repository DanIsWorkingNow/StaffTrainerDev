import { a as createServerRpc, c as createServerFn } from "../server.js";
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
import "@tanstack/react-router";
import "@supabase/ssr";
const createActivity_createServerFn_handler = createServerRpc("9b4a3abb16692c7d16e5a557f306a68ae8461dd5cf627e66abd23e5becb0fc46", (opts, signal) => {
  return createActivity.__executeServer(opts, signal);
});
const createActivity = createServerFn({
  method: "POST"
}).inputValidator((data) => data).handler(createActivity_createServerFn_handler, async ({
  data
}) => {
  const supabase = getSupabaseServerClient();
  const {
    error
  } = await supabase.from("religious_activities").insert([data]);
  if (error) {
    return {
      error: error.message
    };
  }
  return {
    success: true
  };
});
export {
  createActivity_createServerFn_handler
};
