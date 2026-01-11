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
const getTrainerOverviewData_createServerFn_handler = createServerRpc("9bcf9e241e61f6cff0285b7b4794c4d83cb3a2a6260c741b991abb83f0966b40", (opts, signal) => {
  return getTrainerOverviewData.__executeServer(opts, signal);
});
const getTrainerOverviewData = createServerFn({
  method: "GET"
}).inputValidator((data) => data).handler(getTrainerOverviewData_createServerFn_handler, async ({
  data
}) => {
  const supabase = getSupabaseServerClient();
  const {
    data: trainers
  } = await supabase.from("trainers").select("*").eq("status", "active").order("name");
  const startDate = `${data.year}-${String(data.month + 1).padStart(2, "0")}-01`;
  const endDate = new Date(data.year, data.month + 1, 0);
  const endDateStr = `${data.year}-${String(data.month + 1).padStart(2, "0")}-${String(endDate.getDate()).padStart(2, "0")}`;
  const {
    data: religiousActivities
  } = await supabase.from("religious_activities").select("*").gte("date", startDate).lte("date", endDateStr);
  const {
    data: physicalTraining
  } = await supabase.from("physical_training").select("*").gte("date", startDate).lte("date", endDateStr);
  const {
    data: events
  } = await supabase.from("events").select("*").or(`start_date.lte.${endDateStr},end_date.gte.${startDate}`);
  let schedules = [];
  if (data.trainerId) {
    const {
      data: trainerSchedules
    } = await supabase.from("schedules").select("*").eq("trainer_id", data.trainerId).gte("date", startDate).lte("date", endDateStr);
    schedules = trainerSchedules || [];
  }
  return {
    trainers: trainers || [],
    religiousActivities: religiousActivities || [],
    physicalTraining: physicalTraining || [],
    events: events || [],
    schedules: schedules || []
  };
});
export {
  getTrainerOverviewData_createServerFn_handler
};
