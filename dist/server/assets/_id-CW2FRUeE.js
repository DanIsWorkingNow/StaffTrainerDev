import { jsxs, jsx } from "react/jsx-runtime";
import { a as createServerRpc, c as createServerFn } from "../server.js";
import { createFileRoute } from "@tanstack/react-router";
import { g as getSupabaseServerClient } from "./supabase-CLvfjSRp.js";
import "@tanstack/history";
import "@tanstack/router-core/ssr/client";
import "@tanstack/router-core";
import "node:async_hooks";
import "@tanstack/router-core/ssr/server";
import "h3-v2";
import "tiny-invariant";
import "seroval";
import "@tanstack/react-router/ssr/server";
import "@supabase/ssr";
const getEventWithTrainers_createServerFn_handler = createServerRpc("b5c69dadcd9ff790ff2dc0265a4c8e96636f54a838bf167508d58222aab93238", (opts, signal) => {
  return getEventWithTrainers.__executeServer(opts, signal);
});
const getEventWithTrainers = createServerFn({
  method: "GET"
}).inputValidator((id) => id).handler(getEventWithTrainers_createServerFn_handler, async ({
  data: id
}) => {
  const supabase = getSupabaseServerClient();
  const {
    data: event
  } = await supabase.from("events").select("*").eq("id", id).single();
  const {
    data: schedules
  } = await supabase.from("schedules").select(`
        trainer_id,
        trainers (
          id,
          name,
          rank,
          specialization,
          status
        )
      `).gte("date", event.start_date).lte("date", event.end_date).eq("status", "scheduled");
  const uniqueTrainerIds = /* @__PURE__ */ new Set();
  const assignedTrainers = schedules?.filter((schedule) => {
    if (!uniqueTrainerIds.has(schedule.trainer_id)) {
      uniqueTrainerIds.add(schedule.trainer_id);
      return true;
    }
    return false;
  }).map((schedule) => schedule.trainers).filter(Boolean) || [];
  return {
    event,
    assignedTrainers
  };
});
const Route = createFileRoute("/_authed/events/$id")({
  loader: async ({
    params
  }) => await getEventWithTrainers({
    data: params.id
  }),
  component: EventDetailPage
});
function EventDetailPage() {
  const {
    event,
    assignedTrainers
  } = Route.useLoaderData();
  const startDate = new Date(event.start_date);
  const endDate = new Date(event.end_date);
  const duration = Math.ceil((endDate.getTime() - startDate.getTime()) / (1e3 * 60 * 60 * 24)) + 1;
  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric"
    });
  };
  return /* @__PURE__ */ jsxs("div", { className: "max-w-5xl mx-auto space-y-6", children: [
    /* @__PURE__ */ jsxs("div", { className: "bg-white rounded-lg shadow-lg overflow-hidden", children: [
      /* @__PURE__ */ jsx("div", { className: "h-3", style: {
        backgroundColor: event.color
      } }),
      /* @__PURE__ */ jsxs("div", { className: "p-6", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-start justify-between mb-4", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex-1", children: [
            /* @__PURE__ */ jsx("h1", { className: "text-3xl font-bold text-gray-900 mb-2", children: event.name }),
            /* @__PURE__ */ jsx("div", { className: "flex items-center space-x-2", children: /* @__PURE__ */ jsx("span", { className: "inline-block px-3 py-1 rounded-full text-sm font-semibold text-white", style: {
              backgroundColor: event.color
            }, children: event.category }) })
          ] }),
          /* @__PURE__ */ jsx("div", { children: new Date(event.end_date) < /* @__PURE__ */ new Date() ? /* @__PURE__ */ jsx("span", { className: "px-4 py-2 bg-gray-100 text-gray-700 rounded-lg font-semibold", children: "Completed" }) : new Date(event.start_date) <= /* @__PURE__ */ new Date() && new Date(event.end_date) >= /* @__PURE__ */ new Date() ? /* @__PURE__ */ jsx("span", { className: "px-4 py-2 bg-green-100 text-green-700 rounded-lg font-semibold", children: "Ongoing" }) : /* @__PURE__ */ jsx("span", { className: "px-4 py-2 bg-blue-100 text-blue-700 rounded-lg font-semibold", children: "Upcoming" }) })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-6 mt-6", children: [
          /* @__PURE__ */ jsxs("div", { className: "space-y-3", children: [
            /* @__PURE__ */ jsxs("div", { className: "flex items-start space-x-3", children: [
              /* @__PURE__ */ jsx("svg", { className: "w-6 h-6 text-blue-600 mt-0.5", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" }) }),
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx("p", { className: "text-sm font-semibold text-gray-600", children: "Start Date" }),
                /* @__PURE__ */ jsx("p", { className: "text-base text-gray-900", children: formatDate(event.start_date) })
              ] })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "flex items-start space-x-3", children: [
              /* @__PURE__ */ jsx("svg", { className: "w-6 h-6 text-red-600 mt-0.5", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" }) }),
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx("p", { className: "text-sm font-semibold text-gray-600", children: "End Date" }),
                /* @__PURE__ */ jsx("p", { className: "text-base text-gray-900", children: formatDate(event.end_date) })
              ] })
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "space-y-3", children: [
            /* @__PURE__ */ jsxs("div", { className: "flex items-start space-x-3", children: [
              /* @__PURE__ */ jsx("svg", { className: "w-6 h-6 text-purple-600 mt-0.5", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" }) }),
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx("p", { className: "text-sm font-semibold text-gray-600", children: "Duration" }),
                /* @__PURE__ */ jsxs("p", { className: "text-base text-gray-900", children: [
                  duration,
                  " ",
                  duration === 1 ? "day" : "days"
                ] })
              ] })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "flex items-start space-x-3", children: [
              /* @__PURE__ */ jsx("svg", { className: "w-6 h-6 text-green-600 mt-0.5", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" }) }),
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx("p", { className: "text-sm font-semibold text-gray-600", children: "Assigned Trainers" }),
                /* @__PURE__ */ jsxs("p", { className: "text-base text-gray-900", children: [
                  assignedTrainers.length,
                  " ",
                  assignedTrainers.length === 1 ? "trainer" : "trainers"
                ] })
              ] })
            ] })
          ] })
        ] }),
        event.description && /* @__PURE__ */ jsxs("div", { className: "mt-6 pt-6 border-t", children: [
          /* @__PURE__ */ jsx("h2", { className: "text-lg font-semibold text-gray-900 mb-2", children: "Description" }),
          /* @__PURE__ */ jsx("p", { className: "text-gray-700 leading-relaxed", children: event.description })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "bg-white rounded-lg shadow-lg overflow-hidden", children: [
      /* @__PURE__ */ jsx("div", { className: "bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-center space-x-3", children: [
          /* @__PURE__ */ jsx("svg", { className: "w-6 h-6 text-white", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" }) }),
          /* @__PURE__ */ jsx("h2", { className: "text-xl font-bold text-white", children: "Assigned Trainers" })
        ] }),
        /* @__PURE__ */ jsxs("span", { className: "bg-white/20 text-white px-3 py-1 rounded-full text-sm font-semibold", children: [
          assignedTrainers.length,
          " Total"
        ] })
      ] }) }),
      /* @__PURE__ */ jsx("div", { className: "p-6", children: assignedTrainers.length > 0 ? /* @__PURE__ */ jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4", children: assignedTrainers.map((trainer) => /* @__PURE__ */ jsx("div", { className: "border-2 border-gray-200 rounded-lg p-4 hover:border-blue-400 hover:shadow-md transition", children: /* @__PURE__ */ jsxs("div", { className: "flex items-start space-x-3", children: [
        /* @__PURE__ */ jsx("div", { className: "w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center flex-shrink-0", children: /* @__PURE__ */ jsx("span", { className: "text-white font-bold text-lg", children: trainer.name.charAt(0).toUpperCase() }) }),
        /* @__PURE__ */ jsxs("div", { className: "flex-1 min-w-0", children: [
          /* @__PURE__ */ jsx("h3", { className: "font-semibold text-gray-900 truncate", children: trainer.name }),
          /* @__PURE__ */ jsx("p", { className: "text-sm text-gray-600 truncate", children: trainer.rank }),
          trainer.specialization && /* @__PURE__ */ jsx("p", { className: "text-xs text-blue-600 font-medium mt-1 truncate", children: trainer.specialization }),
          trainer.status && /* @__PURE__ */ jsx("span", { className: `inline-block mt-2 px-2 py-0.5 rounded text-xs font-semibold ${trainer.status === "active" ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"}`, children: trainer.status })
        ] })
      ] }) }, trainer.id)) }) : /* @__PURE__ */ jsxs("div", { className: "text-center py-12", children: [
        /* @__PURE__ */ jsx("svg", { className: "w-16 h-16 text-gray-300 mx-auto mb-4", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" }) }),
        /* @__PURE__ */ jsx("h3", { className: "text-lg font-semibold text-gray-700 mb-2", children: "No Trainers Assigned" }),
        /* @__PURE__ */ jsx("p", { className: "text-gray-500", children: "No trainers have been assigned to this event yet." })
      ] }) })
    ] }),
    /* @__PURE__ */ jsx("div", { className: "bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg p-6 border border-blue-200", children: /* @__PURE__ */ jsxs("div", { className: "flex items-start space-x-3", children: [
      /* @__PURE__ */ jsx("svg", { className: "w-6 h-6 text-blue-600 mt-0.5", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" }) }),
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("h3", { className: "font-semibold text-gray-900 mb-1", children: "Schedule Information" }),
        /* @__PURE__ */ jsxs("p", { className: "text-sm text-gray-700", children: [
          "All assigned trainers are scheduled for the entire event duration (",
          duration,
          " ",
          duration === 1 ? "day" : "days",
          "). Each trainer has individual schedule entries created for every day of the event period."
        ] })
      ] })
    ] }) })
  ] });
}
export {
  getEventWithTrainers_createServerFn_handler
};
