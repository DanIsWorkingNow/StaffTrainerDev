import { jsxs, jsx, Fragment } from "react/jsx-runtime";
import { a as createServerRpc, c as createServerFn } from "../server.js";
import { createFileRoute, Link } from "@tanstack/react-router";
import { g as getSupabaseServerClient } from "./supabase-CLvfjSRp.js";
import { g as getCurrentUserRole } from "./rbac-C9pGKYGe.js";
import { useState } from "react";
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
const getEventsWithTrainers_createServerFn_handler = createServerRpc("d3dd5b598f90d443ce89f6c8949f4bbb99835a79ef7e5102d09153ca3d092020", (opts, signal) => {
  return getEventsWithTrainers.__executeServer(opts, signal);
});
const getEventsWithTrainers = createServerFn({
  method: "GET"
}).handler(getEventsWithTrainers_createServerFn_handler, async () => {
  const supabase = getSupabaseServerClient();
  const user = await getCurrentUserRole();
  const {
    data: events,
    error
  } = await supabase.from("events").select("*").order("start_date", {
    ascending: true
  });
  let visibleEvents = events || [];
  if (user?.role === "TRAINER") {
    const {
      data: mySchedules
    } = await supabase.from("schedules").select("date").eq("trainer_id", user.trainerId).eq("status", "scheduled");
    const scheduleDates = new Set(mySchedules?.map((s) => s.date));
    visibleEvents = visibleEvents.filter((event) => {
      let curr = new Date(event.start_date);
      const end = new Date(event.end_date);
      while (curr <= end) {
        const dateStr = curr.toISOString().split("T")[0];
        if (scheduleDates.has(dateStr)) return true;
        curr.setDate(curr.getDate() + 1);
      }
      return false;
    });
  }
  const eventsWithTrainers = await Promise.all(visibleEvents.map(async (event) => {
    const {
      data: schedules
    } = await supabase.from("schedules").select(`
          trainer_id,
          trainers (
            id,
            name,
            rank
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
      ...event,
      trainer_count: assignedTrainers.length,
      trainer_preview: assignedTrainers.slice(0, 3)
      // First 3 trainers for preview
    };
  }));
  return {
    events: eventsWithTrainers
  };
});
const EVENT_COLORS = [{
  name: "Physical Training",
  color: "#3b82f6",
  bg: "bg-blue-500"
}, {
  name: "Safety Training",
  color: "#8b5cf6",
  bg: "bg-purple-500"
}, {
  name: "Emergency Response",
  color: "#ef4444",
  bg: "bg-red-500"
}, {
  name: "Equipment Inspection",
  color: "#f59e0b",
  bg: "bg-orange-500"
}, {
  name: "Leadership Training",
  color: "#eab308",
  bg: "bg-yellow-500"
}, {
  name: "Team Building",
  color: "#10b981",
  bg: "bg-green-500"
}, {
  name: "Religious Activity",
  color: "#14b8a6",
  bg: "bg-teal-500"
}, {
  name: "Community Service",
  color: "#06b6d4",
  bg: "bg-cyan-500"
}, {
  name: "Routine Maintenance",
  color: "#92400e",
  bg: "bg-amber-800"
}, {
  name: "Special Event",
  color: "#ec4899",
  bg: "bg-pink-500"
}, {
  name: "Development Program",
  color: "#6366f1",
  bg: "bg-indigo-500"
}, {
  name: "Collaboration Activity",
  color: "#a855f7",
  bg: "bg-violet-500"
}];
const Route = createFileRoute("/_authed/events/")({
  loader: async () => await getEventsWithTrainers(),
  component: EventsPage
});
function EventsPage() {
  const {
    events
  } = Route.useLoaderData();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const filteredEvents = events.filter((event) => {
    const matchesSearch = event.name.toLowerCase().includes(searchTerm.toLowerCase()) || event.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "all" || event.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });
  const upcomingEvents = filteredEvents.filter((e) => new Date(e.start_date) > /* @__PURE__ */ new Date());
  const ongoingEvents = filteredEvents.filter((e) => {
    const start = new Date(e.start_date);
    const end = new Date(e.end_date);
    const now = /* @__PURE__ */ new Date();
    return start <= now && end >= now;
  });
  const pastEvents = filteredEvents.filter((e) => new Date(e.end_date) < /* @__PURE__ */ new Date());
  return /* @__PURE__ */ jsxs("div", { className: "space-y-6", children: [
    /* @__PURE__ */ jsx("div", { className: "bg-white rounded-lg shadow p-6", children: /* @__PURE__ */ jsxs("div", { className: "flex flex-col md:flex-row justify-between items-start md:items-center gap-4", children: [
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("h1", { className: "text-3xl font-bold text-gray-900 mb-2", children: "Event Management" }),
        /* @__PURE__ */ jsx("p", { className: "text-gray-600", children: "Create and manage training events" })
      ] }),
      /* @__PURE__ */ jsxs(Link, { to: "/events/create", className: "bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold flex items-center space-x-2", children: [
        /* @__PURE__ */ jsx("svg", { className: "w-5 h-5", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M12 4v16m8-8H4" }) }),
        /* @__PURE__ */ jsx("span", { children: "Create Event" })
      ] })
    ] }) }),
    /* @__PURE__ */ jsx("div", { className: "bg-white rounded-lg shadow p-6", children: /* @__PURE__ */ jsxs("div", { className: "flex flex-col md:flex-row gap-4", children: [
      /* @__PURE__ */ jsx("div", { className: "flex-1", children: /* @__PURE__ */ jsx("input", { type: "text", placeholder: "Search events...", value: searchTerm, onChange: (e) => setSearchTerm(e.target.value), className: "w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" }) }),
      /* @__PURE__ */ jsxs("select", { value: selectedCategory, onChange: (e) => setSelectedCategory(e.target.value), className: "px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500", children: [
        /* @__PURE__ */ jsx("option", { value: "all", children: "All Categories" }),
        EVENT_COLORS.map((cat) => /* @__PURE__ */ jsx("option", { value: cat.name, children: cat.name }, cat.name))
      ] })
    ] }) }),
    /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-4", children: [
      /* @__PURE__ */ jsx(StatCard, { title: "Upcoming Events", value: upcomingEvents.length, icon: "📅", color: "bg-blue-500" }),
      /* @__PURE__ */ jsx(StatCard, { title: "Ongoing Events", value: ongoingEvents.length, icon: "🔄", color: "bg-green-500" }),
      /* @__PURE__ */ jsx(StatCard, { title: "Past Events", value: pastEvents.length, icon: "✅", color: "bg-gray-500" })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
      ongoingEvents.length > 0 && /* @__PURE__ */ jsx(EventSection, { title: "Ongoing Events", events: ongoingEvents }),
      upcomingEvents.length > 0 && /* @__PURE__ */ jsx(EventSection, { title: "Upcoming Events", events: upcomingEvents }),
      pastEvents.length > 0 && /* @__PURE__ */ jsx(EventSection, { title: "Past Events", events: pastEvents }),
      filteredEvents.length === 0 && /* @__PURE__ */ jsxs("div", { className: "bg-white rounded-lg shadow p-12 text-center", children: [
        /* @__PURE__ */ jsx("div", { className: "text-6xl mb-4", children: "🔭" }),
        /* @__PURE__ */ jsx("h3", { className: "text-xl font-semibold text-gray-700 mb-2", children: "No Events Found" }),
        /* @__PURE__ */ jsx("p", { className: "text-gray-600", children: "Try adjusting your search or filters" })
      ] })
    ] })
  ] });
}
function StatCard({
  title,
  value,
  icon,
  color
}) {
  return /* @__PURE__ */ jsx("div", { className: "bg-white rounded-lg shadow p-6", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
    /* @__PURE__ */ jsxs("div", { children: [
      /* @__PURE__ */ jsx("p", { className: "text-sm text-gray-600 mb-1", children: title }),
      /* @__PURE__ */ jsx("p", { className: "text-3xl font-bold", children: value })
    ] }),
    /* @__PURE__ */ jsx("div", { className: `${color} w-16 h-16 rounded-full flex items-center justify-center text-3xl`, children: icon })
  ] }) });
}
function EventSection({
  title,
  events
}) {
  return /* @__PURE__ */ jsxs("div", { className: "bg-white rounded-lg shadow overflow-hidden", children: [
    /* @__PURE__ */ jsx("div", { className: "bg-gray-50 px-6 py-4 border-b", children: /* @__PURE__ */ jsx("h2", { className: "text-xl font-semibold text-gray-900", children: title }) }),
    /* @__PURE__ */ jsx("div", { className: "divide-y", children: events.map((event) => /* @__PURE__ */ jsx(EventCard, { event }, event.id)) })
  ] });
}
function EventCard({
  event
}) {
  const categoryColor = EVENT_COLORS.find((c) => c.name === event.category);
  const startDate = new Date(event.start_date);
  const endDate = new Date(event.end_date);
  const duration = Math.ceil((endDate.getTime() - startDate.getTime()) / (1e3 * 60 * 60 * 24)) + 1;
  return /* @__PURE__ */ jsx(Link, { to: `/events/$id`, params: {
    id: event.id
  }, className: "block hover:bg-gray-50 transition", children: /* @__PURE__ */ jsx("div", { className: "p-6", children: /* @__PURE__ */ jsxs("div", { className: "flex items-start justify-between", children: [
    /* @__PURE__ */ jsxs("div", { className: "flex-1", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-center space-x-3 mb-2", children: [
        /* @__PURE__ */ jsx("div", { className: `w-4 h-4 rounded-full ${categoryColor?.bg || "bg-gray-400"}` }),
        /* @__PURE__ */ jsx("h3", { className: "text-lg font-semibold text-gray-900", children: event.name })
      ] }),
      /* @__PURE__ */ jsx("p", { className: "text-sm text-gray-600 mb-3", children: event.category }),
      /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap gap-4 text-sm text-gray-600 mb-3", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-center space-x-2", children: [
          /* @__PURE__ */ jsx("span", { children: "📅" }),
          /* @__PURE__ */ jsxs("span", { children: [
            startDate.toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric"
            }),
            duration > 1 && /* @__PURE__ */ jsxs(Fragment, { children: [
              " - ",
              endDate.toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric"
              })
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "flex items-center space-x-2", children: [
          /* @__PURE__ */ jsx("span", { children: "⏱️" }),
          /* @__PURE__ */ jsxs("span", { children: [
            duration,
            " ",
            duration === 1 ? "day" : "days"
          ] })
        ] })
      ] }),
      event.trainer_count > 0 && /* @__PURE__ */ jsxs("div", { className: "mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-center space-x-2", children: [
            /* @__PURE__ */ jsx("svg", { className: "w-5 h-5 text-blue-600", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" }) }),
            /* @__PURE__ */ jsxs("span", { className: "text-sm font-semibold text-blue-900", children: [
              event.trainer_count,
              " ",
              event.trainer_count === 1 ? "Trainer" : "Trainers",
              " Assigned"
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "flex -space-x-2", children: [
            event.trainer_preview?.slice(0, 3).map((trainer, index) => /* @__PURE__ */ jsx("div", { className: "w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 border-2 border-white flex items-center justify-center", title: trainer.name, children: /* @__PURE__ */ jsx("span", { className: "text-white text-xs font-semibold", children: trainer.name.charAt(0).toUpperCase() }) }, trainer.id)),
            event.trainer_count > 3 && /* @__PURE__ */ jsx("div", { className: "w-8 h-8 rounded-full bg-gray-300 border-2 border-white flex items-center justify-center", children: /* @__PURE__ */ jsxs("span", { className: "text-gray-700 text-xs font-semibold", children: [
              "+",
              event.trainer_count - 3
            ] }) })
          ] })
        ] }),
        event.trainer_preview?.length > 0 && /* @__PURE__ */ jsx("div", { className: "mt-2", children: /* @__PURE__ */ jsxs("p", { className: "text-xs text-blue-700", children: [
          event.trainer_preview.slice(0, 2).map((t) => t.name).join(", "),
          event.trainer_count > 2 && ` and ${event.trainer_count - 2} more`
        ] }) })
      ] }),
      event.trainer_count === 0 && /* @__PURE__ */ jsx("div", { className: "mt-4 p-3 bg-gray-50 rounded-lg border border-gray-200", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center space-x-2", children: [
        /* @__PURE__ */ jsx("svg", { className: "w-5 h-5 text-gray-400", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" }) }),
        /* @__PURE__ */ jsx("span", { className: "text-sm text-gray-500", children: "No trainers assigned yet" })
      ] }) }),
      event.description && /* @__PURE__ */ jsx("p", { className: "mt-3 text-gray-700 line-clamp-2", children: event.description })
    ] }),
    /* @__PURE__ */ jsx("div", { className: "ml-4", children: /* @__PURE__ */ jsx("svg", { className: "w-6 h-6 text-gray-400", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M9 5l7 7-7 7" }) }) })
  ] }) }) });
}
export {
  getEventsWithTrainers_createServerFn_handler
};
