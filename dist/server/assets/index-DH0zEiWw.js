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
const assignTrainer_createServerFn_handler = createServerRpc("59225030f70e54fd37c513636de9238a7b9d1cefd89c7c673f910f3c6e507824", (opts, signal) => {
  return assignTrainer.__executeServer(opts, signal);
});
const assignTrainer = createServerFn({
  method: "POST"
}).inputValidator((data) => data).handler(assignTrainer_createServerFn_handler, async ({
  data
}) => {
  const supabase = getSupabaseServerClient();
  const {
    error
  } = await supabase.from("dormitory_assignments").insert({
    trainer_id: data.trainerId,
    room_id: data.roomId,
    check_in: (/* @__PURE__ */ new Date()).toISOString(),
    status: "active"
  });
  if (error) {
    throw new Error(error.message);
  }
  return {
    success: true
  };
});
const removeTrainer_createServerFn_handler = createServerRpc("9eed1a3f7f261d3e01b9930bb3e5c7652207455ed8ee8cce7136d0e65a84d802", (opts, signal) => {
  return removeTrainer.__executeServer(opts, signal);
});
const removeTrainer = createServerFn({
  method: "POST"
}).inputValidator((data) => data).handler(removeTrainer_createServerFn_handler, async ({
  data
}) => {
  const supabase = getSupabaseServerClient();
  const {
    error
  } = await supabase.from("dormitory_assignments").delete().eq("id", data.assignmentId);
  if (error) {
    throw new Error(error.message);
  }
  return {
    success: true
  };
});
export {
  assignTrainer_createServerFn_handler,
  removeTrainer_createServerFn_handler
};
