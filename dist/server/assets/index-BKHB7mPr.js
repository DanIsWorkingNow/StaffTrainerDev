import { jsxs, jsx, Fragment } from "react/jsx-runtime";
import { c as createServerFn, a as createServerRpc } from "../server.js";
import { g as getSupabaseServerClient } from "./supabase-CLvfjSRp.js";
import { useState } from "react";
import { c as Route } from "./router-B338aohD.js";
import "@tanstack/history";
import "@tanstack/router-core/ssr/client";
import "@tanstack/router-core";
import "node:async_hooks";
import "@tanstack/router-core/ssr/server";
import "h3-v2";
import "tiny-invariant";
import "seroval";
import "@tanstack/react-router/ssr/server";
import "@tanstack/react-router";
import "@supabase/ssr";
import "@tanstack/react-router-devtools";
import "./seo-DlwJpbcL.js";
import "./rbac-C9pGKYGe.js";
import "redaxios";
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
function TrainerOverviewPage() {
  const initialData = Route.useLoaderData();
  const [trainers] = useState(initialData.trainers);
  const [selectedTrainer, setSelectedTrainer] = useState(null);
  const [currentDate, setCurrentDate] = useState(/* @__PURE__ */ new Date());
  const [selectedDate, setSelectedDate] = useState(null);
  const [religiousActivities, setReligiousActivities] = useState(initialData.religiousActivities);
  const [physicalTraining, setPhysicalTraining] = useState(initialData.physicalTraining);
  const [events, setEvents] = useState(initialData.events);
  const [schedules, setSchedules] = useState(initialData.schedules);
  const reloadData = async (trainerId, month, year) => {
    const data = await getTrainerOverviewData({
      data: {
        trainerId: trainerId || void 0,
        month,
        year
      }
    });
    setReligiousActivities(data.religiousActivities);
    setPhysicalTraining(data.physicalTraining);
    setEvents(data.events);
    setSchedules(data.schedules);
  };
  const handleTrainerChange = async (trainerId) => {
    const id = trainerId ? parseInt(trainerId) : null;
    setSelectedTrainer(id);
    setSelectedDate(null);
    if (id) {
      await reloadData(id, currentDate.getMonth(), currentDate.getFullYear());
    }
  };
  const handleMonthChange = async (direction) => {
    const newDate = new Date(currentDate);
    if (direction === "prev") {
      newDate.setMonth(currentDate.getMonth() - 1);
    } else {
      newDate.setMonth(currentDate.getMonth() + 1);
    }
    setCurrentDate(newDate);
    setSelectedDate(null);
    if (selectedTrainer) {
      await reloadData(selectedTrainer, newDate.getMonth(), newDate.getFullYear());
    }
  };
  const trainer = trainers.find((t) => t.id === selectedTrainer);
  const getMonthlySummary = () => {
    if (!selectedTrainer) {
      return {
        religious: 0,
        events: 0,
        physical: 0,
        leadership: 0
      };
    }
    const religious = religiousActivities.filter((activity) => activity.in_charge === trainer?.name || activity.participants.includes(selectedTrainer)).length;
    const eventCount = events.filter((event) => {
      const eventStart = new Date(event.start_date);
      const eventEnd = new Date(event.end_date);
      return schedules.some((schedule) => {
        const scheduleDate = new Date(schedule.date);
        return scheduleDate >= eventStart && scheduleDate <= eventEnd;
      });
    }).length;
    const physical = physicalTraining.filter((training) => training.in_charge === trainer?.name || training.participants.includes(selectedTrainer)).length;
    const leadership = religiousActivities.filter((a) => a.in_charge === trainer?.name).length + physicalTraining.filter((t) => t.in_charge === trainer?.name).length;
    return {
      religious,
      events: eventCount,
      physical,
      leadership
    };
  };
  const getActivitiesForDate = (day) => {
    if (!selectedTrainer) return [];
    const dateStr = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    const activities = [];
    religiousActivities.forEach((activity) => {
      if (activity.date === dateStr) {
        if (activity.in_charge === trainer?.name) {
          activities.push({
            type: "Religious Activity",
            time: "Morning",
            activity: activity.activity,
            role: "Leader/Imam",
            color: "#22c55e"
          });
        } else if (activity.participants.includes(selectedTrainer)) {
          activities.push({
            type: "Religious Activity",
            time: "Morning",
            activity: activity.activity,
            role: "Participant",
            color: "#86efac"
          });
        }
      }
    });
    events.forEach((event) => {
      const eventStart = new Date(event.start_date);
      const eventEnd = new Date(event.end_date);
      const checkDate = new Date(dateStr);
      if (checkDate >= eventStart && checkDate <= eventEnd) {
        activities.push({
          type: "Event",
          time: "Full Day",
          activity: event.name,
          role: "Participant",
          color: event.color || "#3b82f6"
        });
      }
    });
    physicalTraining.forEach((training) => {
      if (training.date === dateStr) {
        if (training.in_charge === trainer?.name) {
          activities.push({
            type: "Physical Training",
            time: training.time_slot || "5:00 PM - 7:00 PM",
            activity: training.training_type,
            role: "In Charge",
            color: "#f97316"
          });
        } else if (training.participants.includes(selectedTrainer)) {
          activities.push({
            type: "Physical Training",
            time: training.time_slot || "5:00 PM - 7:00 PM",
            activity: training.training_type,
            role: "Participant",
            color: "#fdba74"
          });
        }
      }
    });
    return activities;
  };
  const getDaysInMonth = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startDay = firstDay.getDay();
    const days = [];
    for (let i = 0; i < startDay; i++) {
      days.push(null);
    }
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(day);
    }
    return days;
  };
  const summary = getMonthlySummary();
  return /* @__PURE__ */ jsxs("div", { className: "space-y-6", children: [
    /* @__PURE__ */ jsxs("div", { className: "bg-white rounded-lg shadow p-6", children: [
      /* @__PURE__ */ jsx("h1", { className: "text-3xl font-bold text-gray-900 mb-2", children: "Trainer Activity Overview" }),
      /* @__PURE__ */ jsx("p", { className: "text-gray-600", children: "Comprehensive Trainer Schedule Monitoring" })
    ] }),
    /* @__PURE__ */ jsx("div", { className: "bg-white rounded-lg shadow p-6", children: /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: [
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("label", { className: "block text-sm font-semibold text-gray-700 mb-2", children: "Select Trainer" }),
        /* @__PURE__ */ jsxs("select", { value: selectedTrainer || "", onChange: (e) => handleTrainerChange(e.target.value), className: "w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500", children: [
          /* @__PURE__ */ jsx("option", { value: "", children: "Select a Trainer" }),
          trainers.map((t) => /* @__PURE__ */ jsxs("option", { value: t.id, children: [
            t.rank,
            " ",
            t.name
          ] }, t.id))
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("label", { className: "block text-sm font-semibold text-gray-700 mb-2", children: "Month & Year" }),
        /* @__PURE__ */ jsxs("div", { className: "flex items-center space-x-2", children: [
          /* @__PURE__ */ jsx("button", { onClick: () => handleMonthChange("prev"), className: "px-4 py-2 border rounded-lg hover:bg-gray-50 transition", children: "◀" }),
          /* @__PURE__ */ jsx("div", { className: "flex-1 text-center font-semibold text-lg", children: currentDate.toLocaleDateString("en-US", {
            month: "long",
            year: "numeric"
          }) }),
          /* @__PURE__ */ jsx("button", { onClick: () => handleMonthChange("next"), className: "px-4 py-2 border rounded-lg hover:bg-gray-50 transition", children: "▶" })
        ] })
      ] })
    ] }) }),
    selectedTrainer && trainer ? /* @__PURE__ */ jsxs(Fragment, { children: [
      /* @__PURE__ */ jsxs("div", { className: "bg-white rounded-lg shadow p-6", children: [
        /* @__PURE__ */ jsxs("h3", { className: "text-xl font-semibold text-gray-900 mb-4 text-center", children: [
          "Monthly Summary for ",
          trainer.rank,
          " ",
          trainer.name
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-2 md:grid-cols-4 gap-4", children: [
          /* @__PURE__ */ jsx(SummaryCard, { title: "Religious Activities", value: summary.religious, icon: "🕌", color: "bg-teal-500" }),
          /* @__PURE__ */ jsx(SummaryCard, { title: "Event Details", value: summary.events, icon: "📅", color: "bg-blue-500" }),
          /* @__PURE__ */ jsx(SummaryCard, { title: "Physical Training", value: summary.physical, icon: "💪", color: "bg-orange-500" }),
          /* @__PURE__ */ jsx(SummaryCard, { title: "Leadership Roles", value: summary.leadership, icon: "⭐", color: "bg-yellow-500" })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "bg-white rounded-lg shadow p-6", children: [
        /* @__PURE__ */ jsx("h3", { className: "text-lg font-semibold text-gray-900 mb-4", children: "Monthly Calendar" }),
        /* @__PURE__ */ jsx("div", { className: "grid grid-cols-7 gap-2 mb-4", children: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day, idx) => /* @__PURE__ */ jsxs("div", { className: `text-center font-semibold py-2 ${idx === 5 ? "text-teal-700" : "text-gray-700"}`, children: [
          day,
          idx === 5 && /* @__PURE__ */ jsx("span", { className: "ml-1", children: "🕌" })
        ] }, day)) }),
        /* @__PURE__ */ jsx("div", { className: "grid grid-cols-7 gap-2", children: getDaysInMonth().map((day, idx) => {
          if (!day) {
            return /* @__PURE__ */ jsx("div", { className: "aspect-square" }, `empty-${idx}`);
          }
          const dayActivities = getActivitiesForDate(day);
          const isToday = day === (/* @__PURE__ */ new Date()).getDate() && currentDate.getMonth() === (/* @__PURE__ */ new Date()).getMonth() && currentDate.getFullYear() === (/* @__PURE__ */ new Date()).getFullYear();
          const dateObj = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
          const isFriday = dateObj.getDay() === 5;
          const isSelectedDate = selectedDate?.getDate() === day && selectedDate?.getMonth() === currentDate.getMonth() && selectedDate?.getFullYear() === currentDate.getFullYear();
          return /* @__PURE__ */ jsxs("div", { onClick: () => {
            const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
            setSelectedDate(date);
          }, className: `
                      aspect-square border-2 rounded-lg p-2 cursor-pointer transition-all
                      hover:shadow-lg hover:scale-105
                      ${isToday ? "border-blue-600 bg-blue-50 ring-2 ring-blue-300" : isFriday ? "border-teal-400 bg-teal-50" : isSelectedDate ? "border-purple-600 bg-purple-50" : "border-gray-200 bg-white"}
                    `, children: [
            /* @__PURE__ */ jsx("div", { className: `font-semibold mb-1 text-sm ${isToday ? "text-blue-700" : isFriday ? "text-teal-700" : isSelectedDate ? "text-purple-700" : "text-gray-900"}`, children: day }),
            /* @__PURE__ */ jsxs("div", { className: "space-y-1", children: [
              dayActivities.slice(0, 2).map((activity, idx2) => /* @__PURE__ */ jsx("div", { className: "text-xs px-1 py-0.5 rounded truncate", style: {
                backgroundColor: activity.color + "20",
                color: activity.color
              }, title: `${activity.activity} (${activity.role})`, children: activity.type === "Religious Activity" ? "🕌" : activity.type === "Physical Training" ? "💪" : "📅" }, idx2)),
              dayActivities.length > 2 && /* @__PURE__ */ jsxs("div", { className: "text-xs text-gray-600 font-medium", children: [
                "+",
                dayActivities.length - 2
              ] })
            ] })
          ] }, day);
        }) }),
        /* @__PURE__ */ jsx("div", { className: "mt-6 pt-4 border-t", children: /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap gap-4 text-sm", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
            /* @__PURE__ */ jsx("div", { className: "w-6 h-6 border-2 border-blue-600 bg-blue-50 rounded" }),
            /* @__PURE__ */ jsx("span", { children: "Today" })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
            /* @__PURE__ */ jsx("div", { className: "w-6 h-6 border-2 border-purple-600 bg-purple-50 rounded" }),
            /* @__PURE__ */ jsx("span", { children: "Selected" })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
            /* @__PURE__ */ jsx("div", { className: "w-6 h-6 border-2 border-teal-400 bg-teal-50 rounded" }),
            /* @__PURE__ */ jsx("span", { children: "Friday 🕌" })
          ] })
        ] }) })
      ] }),
      selectedDate && /* @__PURE__ */ jsxs("div", { className: "bg-white rounded-lg shadow p-6", children: [
        /* @__PURE__ */ jsxs("h3", { className: "text-xl font-semibold text-gray-900 mb-4", children: [
          "Daily Schedule for ",
          trainer.rank,
          " ",
          trainer.name,
          " - ",
          " ",
          selectedDate.toLocaleDateString("en-US", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric"
          })
        ] }),
        (() => {
          const activities = getActivitiesForDate(selectedDate.getDate());
          if (activities.length === 0) {
            return /* @__PURE__ */ jsxs("div", { className: "text-center py-8 text-gray-500", children: [
              /* @__PURE__ */ jsx("p", { className: "text-lg", children: "No activities scheduled for this day" }),
              /* @__PURE__ */ jsx("p", { className: "text-sm mt-2", children: "This trainer is free on this date" })
            ] });
          }
          return /* @__PURE__ */ jsx("div", { className: "space-y-3", children: activities.map((activity, idx) => /* @__PURE__ */ jsx("div", { className: "border-l-4 p-4 rounded-r-lg", style: {
            borderLeftColor: activity.color,
            backgroundColor: activity.color + "10"
          }, children: /* @__PURE__ */ jsxs("div", { className: "flex justify-between items-start", children: [
            /* @__PURE__ */ jsxs("div", { className: "flex-1", children: [
              /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 mb-2", children: [
                /* @__PURE__ */ jsx("span", { className: "text-2xl", children: activity.type === "Religious Activity" ? "🕌" : activity.type === "Physical Training" ? "💪" : "📅" }),
                /* @__PURE__ */ jsx("h4", { className: "font-semibold text-gray-900 text-lg", children: activity.activity })
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "space-y-1 text-sm text-gray-700", children: [
                /* @__PURE__ */ jsxs("p", { children: [
                  /* @__PURE__ */ jsx("strong", { children: "Type:" }),
                  " ",
                  activity.type
                ] }),
                /* @__PURE__ */ jsxs("p", { children: [
                  /* @__PURE__ */ jsx("strong", { children: "Time:" }),
                  " ",
                  activity.time
                ] }),
                /* @__PURE__ */ jsxs("p", { children: [
                  /* @__PURE__ */ jsx("strong", { children: "Role:" }),
                  " ",
                  activity.role
                ] })
              ] })
            ] }),
            /* @__PURE__ */ jsx("div", { className: "text-xs px-3 py-1 rounded-full text-white font-semibold", style: {
              backgroundColor: activity.color
            }, children: activity.role })
          ] }) }, idx)) });
        })(),
        /* @__PURE__ */ jsx("div", { className: "mt-6 pt-4 border-t", children: /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-2 md:grid-cols-3 gap-4", children: [
          /* @__PURE__ */ jsxs("div", { className: "text-center", children: [
            /* @__PURE__ */ jsx("div", { className: "text-2xl font-bold text-gray-900", children: getActivitiesForDate(selectedDate.getDate()).length }),
            /* @__PURE__ */ jsx("div", { className: "text-sm text-gray-600", children: "Total Activities" })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "text-center", children: [
            /* @__PURE__ */ jsx("div", { className: "text-2xl font-bold text-gray-900", children: getActivitiesForDate(selectedDate.getDate()).filter((a) => a.role.includes("In Charge") || a.role.includes("Leader")).length }),
            /* @__PURE__ */ jsx("div", { className: "text-sm text-gray-600", children: "Leadership Roles" })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "text-center", children: [
            /* @__PURE__ */ jsx("div", { className: "text-2xl font-bold text-gray-900", children: getActivitiesForDate(selectedDate.getDate()).filter((a) => a.role === "Participant").length }),
            /* @__PURE__ */ jsx("div", { className: "text-sm text-gray-600", children: "Participations" })
          ] })
        ] }) })
      ] })
    ] }) : /* @__PURE__ */ jsxs("div", { className: "bg-white rounded-lg shadow p-12 text-center", children: [
      /* @__PURE__ */ jsx("div", { className: "text-6xl mb-4", children: "👥" }),
      /* @__PURE__ */ jsx("h3", { className: "text-2xl font-semibold text-gray-900 mb-2", children: "Select a Trainer" }),
      /* @__PURE__ */ jsx("p", { className: "text-gray-600", children: "Choose a trainer from the dropdown above to view their activity overview and schedule" })
    ] })
  ] });
}
function SummaryCard({
  title,
  value,
  icon,
  color
}) {
  return /* @__PURE__ */ jsx("div", { className: "bg-white border-2 border-gray-200 rounded-lg p-4 hover:shadow-lg transition", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
    /* @__PURE__ */ jsxs("div", { className: "flex-1", children: [
      /* @__PURE__ */ jsx("p", { className: "text-sm text-gray-600 mb-1", children: title }),
      /* @__PURE__ */ jsx("p", { className: "text-3xl font-bold text-gray-900", children: value })
    ] }),
    /* @__PURE__ */ jsx("div", { className: `${color} text-white p-3 rounded-lg text-2xl`, children: icon })
  ] }) });
}
export {
  TrainerOverviewPage as component
};
