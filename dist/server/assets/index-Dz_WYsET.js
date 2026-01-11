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
const createTraining_createServerFn_handler = createServerRpc("1a64325f822d5457624f946de9d6534896a6e5418072e7565c3e34f2424cce3f", (opts, signal) => {
  return createTraining.__executeServer(opts, signal);
});
const createTraining = createServerFn({
  method: "POST"
}).inputValidator((data) => data).handler(createTraining_createServerFn_handler, async ({
  data
}) => {
  const supabase = getSupabaseServerClient();
  const {
    error
  } = await supabase.from("physical_training").insert([data]);
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
  createTraining_createServerFn_handler
};
