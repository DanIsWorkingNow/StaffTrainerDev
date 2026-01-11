import { jsxs, jsx } from "react/jsx-runtime";
import { a as createServerRpc, c as createServerFn } from "../server.js";
import { createFileRoute, Link } from "@tanstack/react-router";
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
const getDashboardData_createServerFn_handler = createServerRpc("c6378a300d852188876e1ee10fcc71e65ce36514e24283174768861f8aa0b891", (opts, signal) => {
  return getDashboardData.__executeServer(opts, signal);
});
const getDashboardData = createServerFn({
  method: "GET"
}).handler(getDashboardData_createServerFn_handler, async () => {
  const supabase = getSupabaseServerClient();
  const today = (/* @__PURE__ */ new Date()).toISOString().split("T")[0];
  const {
    data: trainers
  } = await supabase.from("trainers").select("*").eq("status", "active");
  const {
    data: todaySessions
  } = await supabase.from("training_sessions").select("*").eq("date", today);
  const {
    data: upcomingEvents
  } = await supabase.from("events").select("*").gte("start_date", today).order("start_date", {
    ascending: true
  }).limit(5);
  const {
    data: physicalTraining
  } = await supabase.from("physical_training").select("*").eq("date", today);
  const {
    data: religiousActivities
  } = await supabase.from("religious_activities").select("*").eq("date", today);
  const {
    data: dormitoryAssignments
  } = await supabase.from("dormitory_assignments").select("*");
  const totalCapacity = 50 * 4;
  const occupancyRate = Math.round((dormitoryAssignments?.length || 0) / totalCapacity * 100);
  return {
    stats: {
      activeTrainers: trainers?.length || 0,
      todaySessions: todaySessions?.length || 0,
      physicalTraining: physicalTraining?.length || 0,
      religiousActivities: religiousActivities?.length || 0,
      upcomingEvents: upcomingEvents?.length || 0,
      occupancyRate
    },
    upcomingEvents: upcomingEvents || [],
    todayActivities: {
      sessions: todaySessions || [],
      physical: physicalTraining || [],
      religious: religiousActivities || []
    }
  };
});
const Route = createFileRoute("/_authed/")({
  // Changed from '/' to '/_authed/'
  loader: async () => await getDashboardData(),
  component: DashboardPage
});
function DashboardPage() {
  const {
    stats,
    upcomingEvents,
    todayActivities
  } = Route.useLoaderData();
  const {
    user
  } = Route.useRouteContext();
  return /* @__PURE__ */ jsxs("div", { className: "space-y-6", children: [
    /* @__PURE__ */ jsx("div", { className: "bg-gradient-to-r from-orange-600 to-red-700 rounded lg shadow-lg p-8 text-white", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center space-x-4", children: [
      /* @__PURE__ */ jsx("div", { className: "text-6xl", children: "🔥" }),
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("h1", { className: "text-4xl font-bold mb-2", children: "ABPM Trainer System" }),
        /* @__PURE__ */ jsxs("p", { className: "text-blue-100 text-lg", children: [
          "Welcome back, ",
          user?.email,
          "!"
        ] }),
        /* @__PURE__ */ jsx("p", { className: "text-blue-200 text-sm mt-1", children: (/* @__PURE__ */ new Date()).toLocaleDateString("en-US", {
          weekday: "long",
          year: "numeric",
          month: "long",
          day: "numeric"
        }) })
      ] })
    ] }) }),
    /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4", children: [
      /* @__PURE__ */ jsx(StatCard, { title: "Active Trainers", value: stats.activeTrainers, icon: "👥", color: "bg-blue-500", link: "/schedule" }),
      /* @__PURE__ */ jsx(StatCard, { title: "Today's Sessions", value: stats.todaySessions, icon: "📅", color: "bg-green-500", link: "/schedule" }),
      /* @__PURE__ */ jsx(StatCard, { title: "Upcoming Events", value: stats.upcomingEvents, icon: "📋", color: "bg-purple-500", link: "/events" }),
      /* @__PURE__ */ jsx(StatCard, { title: "PT Today", value: stats.physicalTraining, icon: "💪", color: "bg-orange-500", link: "/physical-training" }),
      /* @__PURE__ */ jsx(StatCard, { title: "Religious", value: stats.religiousActivities, icon: "📖", color: "bg-teal-500", link: "/religious-activity" }),
      /* @__PURE__ */ jsx(StatCard, { title: "Occupancy", value: `${stats.occupancyRate}%`, icon: "🏢", color: "bg-indigo-500", link: "/dormitory" })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-2 gap-6", children: [
      /* @__PURE__ */ jsxs("div", { className: "bg-white rounded-lg shadow", children: [
        /* @__PURE__ */ jsx("div", { className: "bg-teal-50 px-6 py-4 border-b", children: /* @__PURE__ */ jsxs("h2", { className: "text-xl font-semibold text-gray-900 flex items-center space-x-2", children: [
          /* @__PURE__ */ jsx("span", { children: "📖" }),
          /* @__PURE__ */ jsx("span", { children: "Today's Religious Activities" })
        ] }) }),
        /* @__PURE__ */ jsxs("div", { className: "p-6", children: [
          todayActivities.religious.length === 0 ? /* @__PURE__ */ jsx("p", { className: "text-gray-600 text-center py-4", children: "No activities scheduled for today" }) : /* @__PURE__ */ jsx("div", { className: "space-y-3", children: todayActivities.religious.map((activity) => /* @__PURE__ */ jsxs("div", { className: "bg-teal-50 p-3 rounded-lg border-l-4 border-teal-500", children: [
            /* @__PURE__ */ jsx("p", { className: "font-semibold text-gray-900", children: activity.activity }),
            /* @__PURE__ */ jsxs("p", { className: "text-sm text-gray-600 mt-1", children: [
              "Leader: ",
              activity.in_charge
            ] })
          ] }, activity.id)) }),
          /* @__PURE__ */ jsx(Link, { to: "/religious-activity", className: "block mt-4 text-center text-teal-600 hover:text-teal-700 font-semibold", children: "View All →" })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "bg-white rounded-lg shadow", children: [
        /* @__PURE__ */ jsx("div", { className: "bg-orange-50 px-6 py-4 border-b", children: /* @__PURE__ */ jsxs("h2", { className: "text-xl font-semibold text-gray-900 flex items-center space-x-2", children: [
          /* @__PURE__ */ jsx("span", { children: "💪" }),
          /* @__PURE__ */ jsx("span", { children: "Today's Physical Training" })
        ] }) }),
        /* @__PURE__ */ jsxs("div", { className: "p-6", children: [
          todayActivities.physical.length === 0 ? /* @__PURE__ */ jsx("p", { className: "text-gray-600 text-center py-4", children: "No training scheduled for today" }) : /* @__PURE__ */ jsx("div", { className: "space-y-3", children: todayActivities.physical.map((training) => /* @__PURE__ */ jsxs("div", { className: "bg-orange-50 p-3 rounded-lg border-l-4 border-orange-500", children: [
            /* @__PURE__ */ jsx("p", { className: "font-semibold text-gray-900", children: training.training_type }),
            /* @__PURE__ */ jsxs("p", { className: "text-sm text-gray-600 mt-1", children: [
              "Time: ",
              training.time_slot
            ] }),
            /* @__PURE__ */ jsxs("p", { className: "text-sm text-gray-600", children: [
              "In Charge: ",
              training.in_charge
            ] })
          ] }, training.id)) }),
          /* @__PURE__ */ jsx(Link, { to: "/physical-training", className: "block mt-4 text-center text-orange-600 hover:text-orange-700 font-semibold", children: "View All →" })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "bg-white rounded-lg shadow", children: [
      /* @__PURE__ */ jsx("div", { className: "bg-purple-50 px-6 py-4 border-b", children: /* @__PURE__ */ jsxs("h2", { className: "text-xl font-semibold text-gray-900 flex items-center space-x-2", children: [
        /* @__PURE__ */ jsx("span", { children: "📋" }),
        /* @__PURE__ */ jsx("span", { children: "Upcoming Events" })
      ] }) }),
      /* @__PURE__ */ jsxs("div", { className: "p-6", children: [
        upcomingEvents.length === 0 ? /* @__PURE__ */ jsx("p", { className: "text-gray-600 text-center py-4", children: "No upcoming events" }) : /* @__PURE__ */ jsx("div", { className: "space-y-3", children: upcomingEvents.map((event) => {
          const startDate = new Date(event.start_date);
          const endDate = new Date(event.end_date);
          const duration = Math.ceil((endDate.getTime() - startDate.getTime()) / (1e3 * 60 * 60 * 24));
          return /* @__PURE__ */ jsx(Link, { to: "/events/$id", params: {
            id: event.id
          }, className: "block bg-purple-50 p-4 rounded-lg border-l-4 border-purple-500 hover:bg-purple-100 transition", children: /* @__PURE__ */ jsxs("div", { className: "flex justify-between items-start", children: [
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("p", { className: "font-semibold text-gray-900", children: event.name }),
              /* @__PURE__ */ jsx("p", { className: "text-sm text-gray-600 mt-1", children: event.category }),
              /* @__PURE__ */ jsxs("p", { className: "text-sm text-gray-600 mt-1", children: [
                "📅 ",
                startDate.toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric"
                }),
                duration > 1 && ` - ${endDate.toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric"
                })}`
              ] })
            ] }),
            /* @__PURE__ */ jsx("span", { className: "text-gray-400", children: "→" })
          ] }) }, event.id);
        }) }),
        /* @__PURE__ */ jsx(Link, { to: "/events", className: "block mt-4 text-center text-purple-600 hover:text-purple-700 font-semibold", children: "View All Events →" })
      ] })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "bg-white rounded-lg shadow p-6", children: [
      /* @__PURE__ */ jsx("h2", { className: "text-xl font-semibold mb-4", children: "Quick Actions" }),
      /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-2 md:grid-cols-4 gap-4", children: [
        /* @__PURE__ */ jsx(QuickActionButton, { to: "/schedule", icon: "📅", label: "View Schedule", color: "bg-blue-500" }),
        /* @__PURE__ */ jsx(QuickActionButton, { to: "/events/create", icon: "➕", label: "Create Event", color: "bg-purple-500" }),
        /* @__PURE__ */ jsx(QuickActionButton, { to: "/trainer-overview", icon: "👥", label: "Trainer Stats", color: "bg-green-500" }),
        /* @__PURE__ */ jsx(QuickActionButton, { to: "/dormitory", icon: "🏢", label: "Dormitory", color: "bg-indigo-500" })
      ] })
    ] })
  ] });
}
function StatCard({
  title,
  value,
  icon,
  color,
  link
}) {
  return /* @__PURE__ */ jsx(Link, { to: link, className: "bg-white rounded-lg shadow hover:shadow-lg transition p-4", children: /* @__PURE__ */ jsxs("div", { className: "flex flex-col items-center", children: [
    /* @__PURE__ */ jsx("div", { className: `${color} w-12 h-12 rounded-full flex items-center justify-center text-2xl mb-2`, children: icon }),
    /* @__PURE__ */ jsx("p", { className: "text-2xl font-bold text-gray-900", children: value }),
    /* @__PURE__ */ jsx("p", { className: "text-xs text-gray-600 text-center mt-1", children: title })
  ] }) });
}
function QuickActionButton({
  to,
  icon,
  label,
  color
}) {
  return /* @__PURE__ */ jsxs(Link, { to, className: `${color} hover:opacity-90 text-white rounded-lg p-4 flex flex-col items-center justify-center space-y-2 transition`, children: [
    /* @__PURE__ */ jsx("span", { className: "text-3xl", children: icon }),
    /* @__PURE__ */ jsx("span", { className: "text-sm font-semibold text-center", children: label })
  ] });
}
export {
  getDashboardData_createServerFn_handler
};
