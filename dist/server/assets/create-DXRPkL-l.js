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
const createEventWithTrainers_createServerFn_handler = createServerRpc("b62f62887fffaa317bb91ce939605c2c7ea8f330e29418e20f80b30eea992563", (opts, signal) => {
  return createEventWithTrainers.__executeServer(opts, signal);
});
const createEventWithTrainers = createServerFn({
  method: "POST"
}).inputValidator((data) => data).handler(createEventWithTrainers_createServerFn_handler, async ({
  data
}) => {
  const supabase = getSupabaseServerClient();
  const {
    data: event,
    error: eventError
  } = await supabase.from("events").insert([{
    name: data.name,
    category: data.category,
    start_date: data.start_date,
    end_date: data.end_date,
    description: data.description,
    color: data.color
  }]).select().single();
  if (eventError) {
    return {
      error: eventError.message
    };
  }
  if (data.trainer_ids.length > 0) {
    const scheduleEntries = [];
    const startDate = new Date(data.start_date);
    const endDate = new Date(data.end_date);
    for (let date = new Date(startDate); date <= endDate; date.setDate(date.getDate() + 1)) {
      const dateStr = date.toISOString().split("T")[0];
      for (const trainerId of data.trainer_ids) {
        scheduleEntries.push({
          trainer_id: trainerId,
          date: dateStr,
          status: "scheduled",
          availability: [],
          // Can be updated later
          notes: `Assigned to: ${data.name}`
        });
      }
    }
    const {
      error: scheduleError
    } = await supabase.from("schedules").insert(scheduleEntries);
    if (scheduleError) {
      console.error("Error creating schedules:", scheduleError);
    }
  }
  return {
    success: true,
    event
  };
});
export {
  createEventWithTrainers_createServerFn_handler
};
