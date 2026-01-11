import { jsxs, jsx } from "react/jsx-runtime";
import { a as createServerRpc, c as createServerFn } from "../server.js";
import { createFileRoute } from "@tanstack/react-router";
import { g as getSupabaseServerClient } from "./supabase-CLvfjSRp.js";
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
const getScheduleData_createServerFn_handler = createServerRpc("d80a0367592edd22aafc863ed37709079ca01ec3510c35ff4085aa1040ea6783", (opts, signal) => {
  return getScheduleData.__executeServer(opts, signal);
});
const getScheduleData = createServerFn({
  method: "GET"
}).handler(getScheduleData_createServerFn_handler, async () => {
  const supabase = getSupabaseServerClient();
  const currentDate = /* @__PURE__ */ new Date();
  const firstDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
  const lastDay = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
  const firstDayStr = firstDay.toISOString().split("T")[0];
  const lastDayStr = lastDay.toISOString().split("T")[0];
  const {
    data: events
  } = await supabase.from("events").select("*").or(`start_date.lte.${lastDayStr},end_date.gte.${firstDayStr}`).order("start_date", {
    ascending: true
  });
  const {
    data: trainers
  } = await supabase.from("trainers").select("*").eq("status", "active").order("name", {
    ascending: true
  });
  const {
    data: schedules
  } = await supabase.from("schedules").select(`
      *,
      trainer:trainers(id, name, rank, specialization)
    `).gte("date", firstDayStr).lte("date", lastDayStr).order("date", {
    ascending: true
  });
  const todayStr = currentDate.toISOString().split("T")[0];
  const todaySchedules = schedules?.filter((s) => s.date === todayStr && s.status !== "cancelled") || [];
  const weekSchedules = schedules?.filter((s) => s.status !== "cancelled") || [];
  return {
    events: events || [],
    trainers: trainers || [],
    schedules: schedules || [],
    stats: {
      activeTrainers: trainers?.length || 0,
      todaySessions: todaySchedules.length,
      thisWeekSessions: weekSchedules.length
    }
  };
});
const Route = createFileRoute("/_authed/schedule/")({
  loader: async () => await getScheduleData(),
  component: SchedulePage
});
function SchedulePage() {
  const {
    events,
    trainers,
    schedules,
    stats
  } = Route.useLoaderData();
  const [currentDate, setCurrentDate] = useState(/* @__PURE__ */ new Date());
  const [view, setView] = useState("week");
  return /* @__PURE__ */ jsxs("div", { className: "space-y-6", children: [
    /* @__PURE__ */ jsxs("div", { className: "bg-white rounded-lg shadow p-6", children: [
      /* @__PURE__ */ jsx("h1", { className: "text-3xl font-bold text-gray-900 mb-2", children: "Training Schedule" }),
      /* @__PURE__ */ jsx("p", { className: "text-gray-600", children: "Manage and view all training schedules" })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-4", children: [
      /* @__PURE__ */ jsx(StatCard, { title: "Active Trainers", value: stats.activeTrainers, icon: "👥", color: "bg-blue-500" }),
      /* @__PURE__ */ jsx(StatCard, { title: "Today's Sessions", value: stats.todaySessions, icon: "📅", color: "bg-green-500" }),
      /* @__PURE__ */ jsx(StatCard, { title: "This Week", value: stats.thisWeekSessions, icon: "📊", color: "bg-purple-500" })
    ] }),
    /* @__PURE__ */ jsx("div", { className: "bg-white rounded-lg shadow p-4", children: /* @__PURE__ */ jsxs("div", { className: "flex flex-col sm:flex-row justify-between items-center gap-4", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-center space-x-4", children: [
        /* @__PURE__ */ jsx("button", { onClick: () => {
          const newDate = new Date(currentDate);
          newDate.setMonth(currentDate.getMonth() - 1);
          setCurrentDate(newDate);
        }, className: "p-2 hover:bg-gray-100 rounded", children: "◀" }),
        /* @__PURE__ */ jsx("h2", { className: "text-xl font-semibold", children: currentDate.toLocaleDateString("en-US", {
          month: "long",
          year: "numeric"
        }) }),
        /* @__PURE__ */ jsx("button", { onClick: () => {
          const newDate = new Date(currentDate);
          newDate.setMonth(currentDate.getMonth() + 1);
          setCurrentDate(newDate);
        }, className: "p-2 hover:bg-gray-100 rounded", children: "▶" })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex space-x-2", children: [
        /* @__PURE__ */ jsx("button", { onClick: () => setView("week"), className: `px-4 py-2 rounded ${view === "week" ? "bg-blue-600 text-white" : "bg-gray-200"}`, children: "Week" }),
        /* @__PURE__ */ jsx("button", { onClick: () => setView("month"), className: `px-4 py-2 rounded ${view === "month" ? "bg-blue-600 text-white" : "bg-gray-200"}`, children: "Month" }),
        /* @__PURE__ */ jsx("button", { onClick: () => setView("trainer-schedule"), className: `px-4 py-2 rounded ${view === "trainer-schedule" ? "bg-blue-600 text-white" : "bg-gray-200"}`, children: "Trainer Schedule" })
      ] })
    ] }) }),
    /* @__PURE__ */ jsx("div", { className: "bg-white rounded-lg shadow overflow-hidden", children: view === "week" ? /* @__PURE__ */ jsx(WeeklyCalendar, { schedules, events, currentDate }) : view === "month" ? /* @__PURE__ */ jsx(MonthlyCalendar, { schedules, events, currentDate }) : /* @__PURE__ */ jsx(TrainerScheduleGrid, { trainers, schedules, events, currentDate }) }),
    /* @__PURE__ */ jsxs("div", { className: "bg-white rounded-lg shadow p-6", children: [
      /* @__PURE__ */ jsx("h3", { className: "text-xl font-semibold mb-4", children: "Active Trainers" }),
      /* @__PURE__ */ jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4", children: trainers.map((trainer) => /* @__PURE__ */ jsx("div", { className: "p-4 border rounded-lg hover:shadow-md transition", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center space-x-3", children: [
        /* @__PURE__ */ jsx("div", { className: "w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center", children: /* @__PURE__ */ jsx("span", { className: "text-xl", children: "👤" }) }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("p", { className: "font-semibold", children: trainer.name }),
          /* @__PURE__ */ jsx("p", { className: "text-sm text-gray-600", children: trainer.rank }),
          trainer.specialization && /* @__PURE__ */ jsx("p", { className: "text-xs text-gray-500", children: trainer.specialization })
        ] })
      ] }) }, trainer.id)) })
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
function TrainerScheduleGrid({
  trainers,
  schedules,
  events,
  currentDate
}) {
  const firstDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
  const lastDay = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
  const daysInMonth = lastDay.getDate();
  const dates = Array.from({
    length: daysInMonth
  }, (_, i) => {
    const date = new Date(firstDay);
    date.setDate(firstDay.getDate() + i);
    return date;
  });
  const isEventOnDate = (event, date) => {
    const dateStr = date.toISOString().split("T")[0];
    const startDate = event.start_date;
    const endDate = event.end_date;
    return dateStr >= startDate && dateStr <= endDate;
  };
  const getEventsForDate = (date) => {
    return events.filter((event) => isEventOnDate(event, date));
  };
  const getScheduleForTrainerDate = (trainerId, date) => {
    const dateStr = date.toISOString().split("T")[0];
    return schedules.find((s) => s.trainer_id === trainerId && s.date === dateStr);
  };
  const formatAvailability = (availability) => {
    if (!availability || availability.length === 0) return "";
    return availability.join(", ");
  };
  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "scheduled":
        return "bg-blue-100 text-blue-800 border-blue-300";
      case "in progress":
        return "bg-yellow-100 text-yellow-800 border-yellow-300";
      case "completed":
        return "bg-green-100 text-green-800 border-green-300";
      case "cancelled":
        return "bg-red-100 text-red-800 border-red-300";
      default:
        return "bg-gray-100 text-gray-800 border-gray-300";
    }
  };
  const getTrainerScheduleCount = (trainerId) => {
    return schedules.filter((s) => s.trainer_id === trainerId && s.status !== "cancelled").length;
  };
  return /* @__PURE__ */ jsx("div", { className: "overflow-x-auto", children: /* @__PURE__ */ jsxs("div", { className: "inline-block min-w-full", children: [
    /* @__PURE__ */ jsx("div", { className: "bg-gray-50 border-b sticky top-0 z-20", children: /* @__PURE__ */ jsxs("div", { className: "flex", children: [
      /* @__PURE__ */ jsxs("div", { className: "w-56 p-3 font-semibold border-r sticky left-0 bg-gray-50 z-30", children: [
        /* @__PURE__ */ jsx("div", { children: "Trainer" }),
        /* @__PURE__ */ jsx("div", { className: "text-xs font-normal text-gray-600 mt-1", children: currentDate.toLocaleDateString("en-US", {
          month: "long",
          year: "numeric"
        }) })
      ] }),
      dates.map((date, idx) => {
        const isToday = date.toDateString() === (/* @__PURE__ */ new Date()).toDateString();
        const dayEvents = getEventsForDate(date);
        return /* @__PURE__ */ jsxs("div", { className: `min-w-[100px] p-2 text-center border-r ${isToday ? "bg-blue-50" : ""}`, children: [
          /* @__PURE__ */ jsx("div", { className: "font-semibold text-xs", children: date.toLocaleDateString("en-US", {
            weekday: "short"
          }) }),
          /* @__PURE__ */ jsx("div", { className: `text-sm mt-1 ${isToday ? "text-blue-600 font-bold" : "text-gray-600"}`, children: date.getDate() }),
          dayEvents.length > 0 && /* @__PURE__ */ jsx("div", { className: "mt-1", children: dayEvents.map((event) => /* @__PURE__ */ jsx("div", { className: "w-2 h-2 rounded-full mx-auto", style: {
            backgroundColor: event.color || "#3b82f6"
          }, title: event.name }, event.id)) })
        ] }, idx);
      })
    ] }) }),
    /* @__PURE__ */ jsx("div", { children: trainers.map((trainer) => {
      const scheduleCount = getTrainerScheduleCount(trainer.id);
      return /* @__PURE__ */ jsxs("div", { className: "flex border-b hover:bg-gray-50", children: [
        /* @__PURE__ */ jsxs("div", { className: "w-56 p-3 border-r sticky left-0 bg-white z-10", children: [
          /* @__PURE__ */ jsx("div", { className: "font-semibold text-sm", children: trainer.name }),
          /* @__PURE__ */ jsx("div", { className: "text-xs text-gray-600 mt-1", children: trainer.specialization || trainer.rank }),
          /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 mt-2 flex-wrap", children: [
            /* @__PURE__ */ jsx("span", { className: "text-xs bg-green-100 text-green-700 px-2 py-1 rounded", children: trainer.status }),
            scheduleCount > 0 && /* @__PURE__ */ jsxs("span", { className: "text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded", children: [
              scheduleCount,
              " days"
            ] })
          ] })
        ] }),
        dates.map((date, idx) => {
          const schedule = getScheduleForTrainerDate(trainer.id, date);
          const dayEvents = getEventsForDate(date);
          const isToday = date.toDateString() === (/* @__PURE__ */ new Date()).toDateString();
          return /* @__PURE__ */ jsxs("div", { className: `min-w-[100px] p-2 border-r ${isToday ? "bg-blue-50/30" : ""}`, children: [
            dayEvents.length > 0 && /* @__PURE__ */ jsx("div", { className: "space-y-1 mb-2", children: dayEvents.map((event) => /* @__PURE__ */ jsxs("div", { className: "text-xs p-1.5 rounded border-l-4", style: {
              borderLeftColor: event.color || "#3b82f6",
              backgroundColor: event.color ? `${event.color}15` : "#eff6ff"
            }, title: `${event.name} - ${event.category || "Training"}`, children: [
              /* @__PURE__ */ jsx("div", { className: "font-semibold truncate text-gray-800", children: event.name }),
              event.category && /* @__PURE__ */ jsx("div", { className: "text-xs text-gray-600 truncate", children: event.category })
            ] }, event.id)) }),
            schedule ? /* @__PURE__ */ jsxs("div", { className: `text-xs p-2 rounded border ${getStatusColor(schedule.status)}`, children: [
              /* @__PURE__ */ jsx("div", { className: "font-bold text-center mb-1", children: schedule.status?.toUpperCase() }),
              schedule.availability && schedule.availability.length > 0 && /* @__PURE__ */ jsxs("div", { className: "text-xs text-center mt-1", children: [
                "🕐 ",
                formatAvailability(schedule.availability)
              ] }),
              schedule.notes && /* @__PURE__ */ jsxs("div", { className: "text-xs text-center mt-1 truncate", title: schedule.notes, children: [
                "📝 ",
                schedule.notes
              ] })
            ] }) : /* @__PURE__ */ jsx("div", { className: "text-center text-gray-300 text-xs py-2", children: "—" })
          ] }, idx);
        })
      ] }, trainer.id);
    }) }),
    /* @__PURE__ */ jsx("div", { className: "bg-gray-50 border-t", children: /* @__PURE__ */ jsxs("div", { className: "flex", children: [
      /* @__PURE__ */ jsx("div", { className: "w-56 p-3 font-semibold border-r sticky left-0 bg-gray-50", children: "Total Active" }),
      dates.map((date, idx) => {
        const dateStr = date.toISOString().split("T")[0];
        const daySchedules = schedules.filter((s) => s.date === dateStr && s.status !== "cancelled").length;
        return /* @__PURE__ */ jsx("div", { className: "min-w-[100px] p-3 text-center border-r font-semibold", children: daySchedules > 0 ? daySchedules : "—" }, idx);
      })
    ] }) }),
    /* @__PURE__ */ jsxs("div", { className: "bg-gray-50 p-4 border-t", children: [
      /* @__PURE__ */ jsx("div", { className: "text-sm font-semibold mb-3", children: "Legend:" }),
      /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-2 md:grid-cols-4 gap-3 text-xs", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
          /* @__PURE__ */ jsx("div", { className: "w-6 h-6 bg-blue-100 border border-blue-300 rounded" }),
          /* @__PURE__ */ jsx("span", { children: "Scheduled" })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
          /* @__PURE__ */ jsx("div", { className: "w-6 h-6 bg-yellow-100 border border-yellow-300 rounded" }),
          /* @__PURE__ */ jsx("span", { children: "In Progress" })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
          /* @__PURE__ */ jsx("div", { className: "w-6 h-6 bg-green-100 border border-green-300 rounded" }),
          /* @__PURE__ */ jsx("span", { children: "Completed" })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
          /* @__PURE__ */ jsx("div", { className: "w-6 h-6 bg-red-100 border border-red-300 rounded" }),
          /* @__PURE__ */ jsx("span", { children: "Cancelled" })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "mt-3 text-xs text-gray-600", children: [
        /* @__PURE__ */ jsx("strong", { children: "Events" }),
        " are shown with colored left borders. ",
        /* @__PURE__ */ jsx("strong", { children: "Trainer status" }),
        " is shown in colored blocks with availability times."
      ] })
    ] })
  ] }) });
}
function WeeklyCalendar({
  schedules,
  events,
  currentDate
}) {
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const startOfWeek = new Date(currentDate);
  const day = startOfWeek.getDay();
  const diff = startOfWeek.getDate() - day + (day === 0 ? -6 : 1);
  startOfWeek.setDate(diff);
  const weekDates = Array.from({
    length: 7
  }, (_, i) => {
    const date = new Date(startOfWeek);
    date.setDate(startOfWeek.getDate() + i);
    return date;
  });
  const isEventOnDate = (event, date) => {
    const dateStr = date.toISOString().split("T")[0];
    return dateStr >= event.start_date && dateStr <= event.end_date;
  };
  return /* @__PURE__ */ jsx("div", { className: "p-4", children: /* @__PURE__ */ jsx("div", { className: "grid grid-cols-7 gap-2", children: days.map((day2, idx) => {
    const date = weekDates[idx];
    const dateStr = date.toISOString().split("T")[0];
    const daySchedules = schedules.filter((s) => s.date === dateStr);
    const dayEvents = events.filter((e) => isEventOnDate(e, date));
    return /* @__PURE__ */ jsxs("div", { className: "text-center", children: [
      /* @__PURE__ */ jsx("div", { className: "font-semibold text-gray-700", children: day2 }),
      /* @__PURE__ */ jsx("div", { className: "text-2xl font-bold text-gray-900 mt-2", children: date.getDate() }),
      /* @__PURE__ */ jsxs("div", { className: "mt-4 space-y-2", children: [
        dayEvents.map((event) => /* @__PURE__ */ jsxs("div", { className: "text-xs p-2 rounded border-l-4", style: {
          borderLeftColor: event.color || "#3b82f6",
          backgroundColor: event.color ? `${event.color}15` : "#eff6ff"
        }, children: [
          /* @__PURE__ */ jsx("div", { className: "font-semibold", children: event.name }),
          event.category && /* @__PURE__ */ jsx("div", { className: "text-xs text-gray-600", children: event.category })
        ] }, event.id)),
        daySchedules.map((schedule) => /* @__PURE__ */ jsxs("div", { className: "bg-green-100 text-green-800 text-xs p-2 rounded", children: [
          /* @__PURE__ */ jsx("div", { className: "font-semibold", children: schedule.trainer?.name }),
          /* @__PURE__ */ jsx("div", { className: "text-xs", children: schedule.status }),
          schedule.availability && schedule.availability.length > 0 && /* @__PURE__ */ jsx("div", { className: "text-xs", children: schedule.availability.join(", ") })
        ] }, schedule.id))
      ] })
    ] }, day2);
  }) }) });
}
function MonthlyCalendar({
  schedules,
  events,
  currentDate
}) {
  const firstDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
  const lastDay = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
  const startDay = firstDay.getDay();
  const daysInMonth = lastDay.getDate();
  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const calendar = [];
  for (let i = 0; i < startDay; i++) {
    calendar.push(null);
  }
  for (let day = 1; day <= daysInMonth; day++) {
    calendar.push(day);
  }
  const isEventOnDate = (event, dateStr) => {
    return dateStr >= event.start_date && dateStr <= event.end_date;
  };
  return /* @__PURE__ */ jsxs("div", { className: "p-4", children: [
    /* @__PURE__ */ jsx("div", { className: "grid grid-cols-7 gap-2 mb-2", children: days.map((day) => /* @__PURE__ */ jsx("div", { className: "text-center font-semibold text-gray-700 py-2", children: day }, day)) }),
    /* @__PURE__ */ jsx("div", { className: "grid grid-cols-7 gap-2", children: calendar.map((day, idx) => {
      if (!day) {
        return /* @__PURE__ */ jsx("div", { className: "aspect-square" }, `empty-${idx}`);
      }
      const dateStr = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
      const daySchedules = schedules.filter((s) => s.date === dateStr);
      const dayEvents = events.filter((e) => isEventOnDate(e, dateStr));
      return /* @__PURE__ */ jsxs("div", { className: "aspect-square border rounded-lg p-2 hover:shadow-md transition cursor-pointer", children: [
        /* @__PURE__ */ jsx("div", { className: "font-semibold text-gray-900", children: day }),
        /* @__PURE__ */ jsxs("div", { className: "mt-1 space-y-1", children: [
          dayEvents.slice(0, 1).map((event) => /* @__PURE__ */ jsx("div", { className: "text-xs p-1 rounded border-l-2", style: {
            borderLeftColor: event.color || "#3b82f6",
            backgroundColor: event.color ? `${event.color}20` : "#eff6ff"
          }, title: event.name, children: event.name.substring(0, 8) }, event.id)),
          daySchedules.slice(0, 1).map((schedule) => /* @__PURE__ */ jsx("div", { className: "bg-green-100 text-green-800 text-xs p-1 rounded truncate", title: `${schedule.trainer?.name} - ${schedule.status}`, children: schedule.trainer?.name?.substring(0, 8) }, schedule.id)),
          dayEvents.length + daySchedules.length > 2 && /* @__PURE__ */ jsxs("div", { className: "text-xs text-gray-600", children: [
            "+",
            dayEvents.length + daySchedules.length - 2,
            " more"
          ] })
        ] })
      ] }, day);
    }) })
  ] });
}
export {
  getScheduleData_createServerFn_handler
};
