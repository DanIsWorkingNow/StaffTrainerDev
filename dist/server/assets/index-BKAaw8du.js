import { jsxs, jsx, Fragment } from "react/jsx-runtime";
import { a as createServerRpc, c as createServerFn } from "../server.js";
import { createFileRoute } from "@tanstack/react-router";
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
const getReligiousActivityData_createServerFn_handler = createServerRpc("b6f115b7aa88c6c5669bce278f549728d6fed9a00bd31a0adc58f013b348561b", (opts, signal) => {
  return getReligiousActivityData.__executeServer(opts, signal);
});
const getReligiousActivityData = createServerFn({
  method: "GET"
}).handler(getReligiousActivityData_createServerFn_handler, async () => {
  const supabase = getSupabaseServerClient();
  const {
    data: activities
  } = await supabase.from("religious_activities").select("*").order("date", {
    ascending: true
  });
  const {
    data: trainers
  } = await supabase.from("trainers").select("*").eq("status", "active");
  const today = (/* @__PURE__ */ new Date()).toISOString().split("T")[0];
  const todayActivities = activities?.filter((a) => a.date === today) || [];
  const startOfWeek = /* @__PURE__ */ new Date();
  const day = startOfWeek.getDay();
  const diff = startOfWeek.getDate() - day + (day === 0 ? -6 : 1);
  startOfWeek.setDate(diff);
  startOfWeek.setHours(0, 0, 0, 0);
  const endOfWeek = new Date(startOfWeek);
  endOfWeek.setDate(startOfWeek.getDate() + 6);
  endOfWeek.setHours(23, 59, 59, 999);
  const thisWeekActivities = activities?.filter((a) => {
    const activityDate = new Date(a.date);
    return activityDate >= startOfWeek && activityDate <= endOfWeek;
  }) || [];
  const user = await getCurrentUserRole();
  let visibleActivities = activities || [];
  if (user?.role === "TRAINER") {
    visibleActivities = visibleActivities.filter((activity) => activity.in_charge === user.name || activity.participants.includes(user.trainerId));
  }
  if (user?.role === "TRAINER") {
    const todayActivitiesFiltered = visibleActivities.filter((a) => a.date === today);
    const thisWeekActivitiesFiltered = visibleActivities.filter((a) => {
      const activityDate = new Date(a.date);
      return activityDate >= startOfWeek && activityDate <= endOfWeek;
    });
    return {
      activities: visibleActivities,
      trainers: trainers || [],
      stats: {
        activeParticipants: trainers?.length || 0,
        todayActivities: todayActivitiesFiltered.length,
        thisWeekActivities: thisWeekActivitiesFiltered.length
      }
    };
  }
  return {
    activities: activities || [],
    trainers: trainers || [],
    stats: {
      activeParticipants: trainers?.length || 0,
      todayActivities: todayActivities.length,
      thisWeekActivities: thisWeekActivities.length
    }
  };
});
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
const ACTIVITY_TYPES = ["Fajr Prayer", "Dhuhr Prayer", "Asr Prayer", "Maghrib Prayer", "Isha Prayer", "Friday Prayer (Jummah)", "Islamic Studies", "Quran Recitation", "Religious Lecture", "Community Prayer", "Tafsir Session", "Dua & Dhikr"];
const Route = createFileRoute("/_authed/religious-activity/")({
  loader: async () => await getReligiousActivityData(),
  component: ReligiousActivityPage
});
function ReligiousActivityPage() {
  const {
    activities,
    trainers,
    stats
  } = Route.useLoaderData();
  const [currentDate, setCurrentDate] = useState(/* @__PURE__ */ new Date());
  const [selectedDate, setSelectedDate] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [view, setView] = useState("month");
  const [selectedParticipant, setSelectedParticipant] = useState("all");
  const getActivitiesForDate = (day, month, year) => {
    const m = month ?? currentDate.getMonth();
    const y = year ?? currentDate.getFullYear();
    const dateStr = `${y}-${String(m + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    return activities.filter((a) => a.date === dateStr);
  };
  const getTodayActivities = () => {
    const today = /* @__PURE__ */ new Date();
    return getActivitiesForDate(today.getDate(), today.getMonth(), today.getFullYear());
  };
  const getWeekActivities = () => {
    const startOfWeek = new Date(currentDate);
    const day = startOfWeek.getDay();
    const diff = startOfWeek.getDate() - day + (day === 0 ? -6 : 1);
    startOfWeek.setDate(diff);
    const activitiesArray = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date(startOfWeek);
      date.setDate(startOfWeek.getDate() + i);
      const dayActivities = getActivitiesForDate(date.getDate(), date.getMonth(), date.getFullYear());
      activitiesArray.push(...dayActivities.map((a) => ({
        ...a,
        displayDate: date
      })));
    }
    return activitiesArray;
  };
  const getParticipantActivities = () => {
    if (selectedParticipant === "all") {
      return activities;
    }
    return activities.filter((a) => a.in_charge === selectedParticipant || a.participants.some((p) => {
      const trainer = trainers.find((tr) => tr.id === p);
      return trainer?.name === selectedParticipant;
    }));
  };
  const handleDateClick = (day) => {
    const selected = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
    setSelectedDate(selected);
    setShowModal(true);
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
  return /* @__PURE__ */ jsxs("div", { className: "space-y-6", children: [
    /* @__PURE__ */ jsxs("div", { className: "bg-white rounded-lg shadow p-6", children: [
      /* @__PURE__ */ jsx("h1", { className: "text-3xl font-bold text-gray-900 mb-2", children: "Religious Activities Schedule" }),
      /* @__PURE__ */ jsx("p", { className: "text-gray-600", children: "Schedule spiritual guidance and community building activities" })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-4", children: [
      /* @__PURE__ */ jsx(StatCard, { title: "Today's Activities", value: stats.todayActivities, icon: "📖", color: "bg-teal-500" }),
      /* @__PURE__ */ jsx(StatCard, { title: "This Week", value: stats.thisWeekActivities, icon: "📅", color: "bg-green-500" }),
      /* @__PURE__ */ jsx(StatCard, { title: "Active Participants", value: stats.activeParticipants, icon: "👥", color: "bg-purple-500" })
    ] }),
    /* @__PURE__ */ jsx("div", { className: "bg-white rounded-lg shadow p-4", children: /* @__PURE__ */ jsxs("div", { className: "flex flex-col sm:flex-row justify-between items-center gap-4", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-center space-x-4", children: [
        /* @__PURE__ */ jsx("button", { onClick: () => {
          const newDate = new Date(currentDate);
          newDate.setMonth(currentDate.getMonth() - 1);
          setCurrentDate(newDate);
        }, className: "p-2 hover:bg-gray-100 rounded-lg transition", children: "◀ Previous" }),
        /* @__PURE__ */ jsx("h2", { className: "text-2xl font-bold", children: currentDate.toLocaleDateString("en-US", {
          month: "long",
          year: "numeric"
        }) }),
        /* @__PURE__ */ jsx("button", { onClick: () => {
          const newDate = new Date(currentDate);
          newDate.setMonth(currentDate.getMonth() + 1);
          setCurrentDate(newDate);
        }, className: "p-2 hover:bg-gray-100 rounded-lg transition", children: "Next ▶" })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex space-x-2", children: [
        /* @__PURE__ */ jsx("button", { onClick: () => setView("week"), className: `px-4 py-2 rounded transition ${view === "week" ? "bg-teal-600 text-white" : "bg-gray-200 hover:bg-gray-300"}`, children: "Week" }),
        /* @__PURE__ */ jsx("button", { onClick: () => setView("month"), className: `px-4 py-2 rounded transition ${view === "month" ? "bg-teal-600 text-white" : "bg-gray-200 hover:bg-gray-300"}`, children: "Month" }),
        /* @__PURE__ */ jsx("button", { onClick: () => setView("participant-schedule"), className: `px-4 py-2 rounded transition ${view === "participant-schedule" ? "bg-teal-600 text-white" : "bg-gray-200 hover:bg-gray-300"}`, children: "Participant Schedule" })
      ] })
    ] }) }),
    view === "month" && /* @__PURE__ */ jsx(MonthView, { getDaysInMonth, getActivitiesForDate, handleDateClick, currentDate }),
    view === "week" && /* @__PURE__ */ jsx(WeekView, { activities: getWeekActivities(), currentDate, trainers }),
    view === "participant-schedule" && /* @__PURE__ */ jsx(ParticipantScheduleView, { trainers, activities: getParticipantActivities(), selectedParticipant, setSelectedParticipant, currentDate }),
    /* @__PURE__ */ jsxs("div", { className: "bg-white rounded-lg shadow p-6", children: [
      /* @__PURE__ */ jsx("h3", { className: "text-xl font-semibold mb-4", children: view === "week" ? "This Week's Religious Activities" : view === "participant-schedule" ? "Participant's Activities" : "Today's Religious Activities" }),
      (() => {
        const displayActivities = view === "week" ? getWeekActivities() : view === "participant-schedule" ? getParticipantActivities() : getTodayActivities();
        if (displayActivities.length === 0) {
          return /* @__PURE__ */ jsx("p", { className: "text-gray-600", children: "No activities scheduled" });
        }
        return /* @__PURE__ */ jsx("div", { className: "space-y-3", children: displayActivities.map((activity) => /* @__PURE__ */ jsx("div", { className: "border-l-4 border-teal-500 bg-teal-50 p-4 rounded hover:shadow-md transition", children: /* @__PURE__ */ jsxs("div", { className: "flex justify-between items-start", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex-1", children: [
            /* @__PURE__ */ jsx("h4", { className: "font-semibold text-gray-900 text-lg", children: activity.activity }),
            activity.displayDate && /* @__PURE__ */ jsxs("p", { className: "text-sm text-gray-600 mt-1", children: [
              /* @__PURE__ */ jsx("strong", { children: "Date:" }),
              " ",
              activity.displayDate.toLocaleDateString("en-US", {
                weekday: "long",
                month: "short",
                day: "numeric",
                year: "numeric"
              })
            ] }),
            /* @__PURE__ */ jsxs("p", { className: "text-sm text-gray-600 mt-1", children: [
              /* @__PURE__ */ jsx("strong", { children: "Leader/Imam:" }),
              " ",
              activity.in_charge
            ] }),
            /* @__PURE__ */ jsxs("p", { className: "text-sm text-gray-600", children: [
              /* @__PURE__ */ jsx("strong", { children: "Participants:" }),
              " ",
              activity.participants.length,
              " participant(s)"
            ] })
          ] }),
          /* @__PURE__ */ jsx("div", { className: "text-xs bg-teal-200 text-teal-800 px-3 py-1 rounded-full", children: "🕌 Religious" })
        ] }) }, activity.id)) });
      })()
    ] }),
    showModal && selectedDate && /* @__PURE__ */ jsx(ActivityModal, { date: selectedDate, trainers, onClose: () => setShowModal(false), onSubmit: createActivity })
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
      /* @__PURE__ */ jsx("p", { className: "text-3xl font-bold text-gray-900", children: value })
    ] }),
    /* @__PURE__ */ jsx("div", { className: `${color} text-white p-4 rounded-lg text-2xl`, children: icon })
  ] }) });
}
function MonthView({
  getDaysInMonth,
  getActivitiesForDate,
  handleDateClick,
  currentDate
}) {
  return /* @__PURE__ */ jsxs("div", { className: "bg-white rounded-lg shadow p-6", children: [
    /* @__PURE__ */ jsx("div", { className: "grid grid-cols-7 gap-2 mb-4", children: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day, idx) => /* @__PURE__ */ jsxs("div", { className: `text-center font-semibold py-2 ${idx === 5 ? "text-green-700" : "text-gray-700"}`, children: [
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
      return /* @__PURE__ */ jsxs("div", { onClick: () => handleDateClick(day), className: `
                aspect-square border-2 rounded-lg p-2 cursor-pointer transition-all
                hover:shadow-lg hover:border-teal-500 hover:scale-105
                ${isToday ? "border-teal-600 bg-teal-50 ring-2 ring-teal-300" : isFriday ? "border-green-400 bg-green-50" : "border-gray-200 bg-white"}
              `, children: [
        /* @__PURE__ */ jsxs("div", { className: `font-semibold mb-1 flex items-center justify-between ${isToday ? "text-teal-700" : isFriday ? "text-green-700" : "text-gray-900"}`, children: [
          /* @__PURE__ */ jsx("span", { children: day }),
          isFriday && /* @__PURE__ */ jsx("span", { className: "text-xs", children: "🕌" })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "space-y-1", children: [
          dayActivities.slice(0, 2).map((activity, idx2) => /* @__PURE__ */ jsxs("div", { className: `text-xs p-1 rounded truncate ${activity.activity.includes("Prayer") || activity.activity.includes("Jummah") ? "bg-green-100 text-green-800" : "bg-teal-100 text-teal-800"}`, title: activity.activity, children: [
            "🕌 ",
            activity.activity.substring(0, 8),
            "..."
          ] }, idx2)),
          dayActivities.length > 2 && /* @__PURE__ */ jsxs("div", { className: "text-xs text-gray-600 font-medium", children: [
            "+",
            dayActivities.length - 2,
            " more"
          ] })
        ] })
      ] }, day);
    }) }),
    /* @__PURE__ */ jsx("div", { className: "mt-6 pt-4 border-t", children: /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap gap-4 text-sm", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
        /* @__PURE__ */ jsx("div", { className: "w-6 h-6 border-2 border-teal-600 bg-teal-50 rounded" }),
        /* @__PURE__ */ jsx("span", { children: "Today" })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
        /* @__PURE__ */ jsx("div", { className: "w-6 h-6 border-2 border-green-400 bg-green-50 rounded" }),
        /* @__PURE__ */ jsx("span", { children: "Friday (Jummah) 🕌" })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
        /* @__PURE__ */ jsx("div", { className: "w-6 h-6 bg-green-100 border border-green-300 rounded" }),
        /* @__PURE__ */ jsx("span", { children: "Prayer Activity" })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
        /* @__PURE__ */ jsx("div", { className: "w-6 h-6 bg-teal-100 border border-teal-300 rounded" }),
        /* @__PURE__ */ jsx("span", { children: "Other Activity" })
      ] })
    ] }) })
  ] });
}
function WeekView({
  activities,
  currentDate,
  trainers
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
  return /* @__PURE__ */ jsx("div", { className: "bg-white rounded-lg shadow p-4", children: /* @__PURE__ */ jsx("div", { className: "grid grid-cols-7 gap-2", children: days.map((day2, idx) => {
    const date = weekDates[idx];
    const dateStr = date.toISOString().split("T")[0];
    const dayActivities = activities.filter((a) => a.date === dateStr);
    const isToday = date.toDateString() === (/* @__PURE__ */ new Date()).toDateString();
    const isFriday = date.getDay() === 5;
    return /* @__PURE__ */ jsxs("div", { className: `text-center p-3 rounded-lg ${isToday ? "bg-teal-50 ring-2 ring-teal-300" : isFriday ? "bg-green-50" : ""}`, children: [
      /* @__PURE__ */ jsxs("div", { className: `font-semibold ${isToday ? "text-teal-600" : isFriday ? "text-green-600" : "text-gray-700"}`, children: [
        day2,
        isFriday && /* @__PURE__ */ jsx("span", { className: "ml-1", children: "🕌" })
      ] }),
      /* @__PURE__ */ jsx("div", { className: `text-2xl font-bold mt-2 ${isToday ? "text-teal-600" : isFriday ? "text-green-600" : "text-gray-900"}`, children: date.getDate() }),
      /* @__PURE__ */ jsxs("div", { className: "mt-4 space-y-2", children: [
        dayActivities.map((activity) => /* @__PURE__ */ jsxs("div", { className: `text-xs p-2 rounded border-l-4 ${activity.activity.includes("Prayer") || activity.activity.includes("Jummah") ? "bg-green-100 text-green-800 border-green-500" : "bg-teal-100 text-teal-800 border-teal-500"}`, children: [
          /* @__PURE__ */ jsx("div", { className: "font-semibold truncate", children: activity.activity }),
          /* @__PURE__ */ jsxs("div", { className: "text-xs mt-1", children: [
            "👤 ",
            activity.in_charge
          ] })
        ] }, activity.id)),
        dayActivities.length === 0 && /* @__PURE__ */ jsx("div", { className: "text-xs text-gray-400 italic", children: "No activities" })
      ] })
    ] }, day2);
  }) }) });
}
function ParticipantScheduleView({
  trainers,
  activities,
  selectedParticipant,
  setSelectedParticipant,
  currentDate
}) {
  return /* @__PURE__ */ jsxs("div", { className: "space-y-6", children: [
    /* @__PURE__ */ jsxs("div", { className: "bg-white rounded-lg shadow p-6", children: [
      /* @__PURE__ */ jsx("label", { className: "block text-sm font-semibold text-gray-700 mb-2", children: "Select Participant" }),
      /* @__PURE__ */ jsxs("select", { value: selectedParticipant, onChange: (e) => setSelectedParticipant(e.target.value), className: "w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-teal-500", children: [
        /* @__PURE__ */ jsx("option", { value: "all", children: "All Participants" }),
        trainers.map((trainer) => /* @__PURE__ */ jsxs("option", { value: trainer.name, children: [
          trainer.rank,
          " ",
          trainer.name
        ] }, trainer.id))
      ] })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-4", children: [
      /* @__PURE__ */ jsxs("div", { className: "bg-white rounded-lg shadow p-4", children: [
        /* @__PURE__ */ jsx("div", { className: "text-sm text-gray-600", children: "Total Activities" }),
        /* @__PURE__ */ jsx("div", { className: "text-2xl font-bold text-gray-900 mt-1", children: activities.length })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "bg-white rounded-lg shadow p-4", children: [
        /* @__PURE__ */ jsx("div", { className: "text-sm text-gray-600", children: "This Month" }),
        /* @__PURE__ */ jsx("div", { className: "text-2xl font-bold text-gray-900 mt-1", children: activities.filter((a) => {
          const activityDate = new Date(a.date);
          return activityDate.getMonth() === currentDate.getMonth() && activityDate.getFullYear() === currentDate.getFullYear();
        }).length })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "bg-white rounded-lg shadow p-4", children: [
        /* @__PURE__ */ jsx("div", { className: "text-sm text-gray-600", children: "As Leader/Imam" }),
        /* @__PURE__ */ jsx("div", { className: "text-2xl font-bold text-gray-900 mt-1", children: activities.filter((a) => a.in_charge === selectedParticipant).length })
      ] })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "bg-white rounded-lg shadow p-6", children: [
      /* @__PURE__ */ jsx("h3", { className: "text-lg font-semibold mb-4", children: "Active Participants" }),
      /* @__PURE__ */ jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4", children: trainers.map((trainer) => {
        const participantActivities = activities.filter((a) => a.in_charge === trainer.name || a.participants.includes(trainer.id));
        return /* @__PURE__ */ jsx("div", { className: `p-4 rounded-lg border-2 transition cursor-pointer ${selectedParticipant === trainer.name ? "border-teal-500 bg-teal-50" : "border-gray-200 hover:border-teal-300"}`, onClick: () => setSelectedParticipant(trainer.name), children: /* @__PURE__ */ jsxs("div", { className: "flex items-center space-x-3", children: [
          /* @__PURE__ */ jsx("div", { className: "bg-teal-100 text-teal-800 w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold", children: trainer.name.charAt(0) }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("div", { className: "font-semibold text-gray-900", children: trainer.name }),
            /* @__PURE__ */ jsx("div", { className: "text-sm text-gray-600", children: trainer.rank }),
            /* @__PURE__ */ jsxs("div", { className: "text-xs text-gray-500 mt-1", children: [
              participantActivities.length,
              " activity(s)"
            ] })
          ] })
        ] }) }, trainer.id);
      }) })
    ] })
  ] });
}
function ActivityModal({
  date,
  trainers,
  onClose,
  onSubmit
}) {
  const [formData, setFormData] = useState({
    activity: ACTIVITY_TYPES[0],
    in_charge: trainers[0]?.name || "",
    participants: []
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    const dateStr = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
    const result = await onSubmit({
      data: {
        date: dateStr,
        ...formData
      }
    });
    if (result.success) {
      window.location.reload();
    }
    setIsSubmitting(false);
  };
  const toggleParticipant = (trainerId) => {
    setFormData((prev) => ({
      ...prev,
      participants: prev.participants.includes(trainerId) ? prev.participants.filter((id) => id !== trainerId) : [...prev.participants, trainerId]
    }));
  };
  const isFriday = date.getDay() === 5;
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx("div", { className: "fixed inset-0 bg-black bg-opacity-50 z-40", onClick: onClose }),
    /* @__PURE__ */ jsx("div", { className: "fixed inset-0 flex items-center justify-center p-4 z-50 pointer-events-none", children: /* @__PURE__ */ jsxs("div", { className: "bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto pointer-events-auto", children: [
      /* @__PURE__ */ jsxs("div", { className: `border-b px-6 py-4 flex justify-between items-center sticky top-0 ${isFriday ? "bg-green-50" : "bg-teal-50"}`, children: [
        /* @__PURE__ */ jsxs("h3", { className: "text-xl font-semibold text-gray-900", children: [
          "Schedule Religious Activity",
          isFriday && /* @__PURE__ */ jsx("span", { className: "ml-2 text-green-600", children: "🕌 Friday" })
        ] }),
        /* @__PURE__ */ jsx("button", { onClick: onClose, className: "text-gray-600 hover:text-gray-900 text-2xl leading-none", type: "button", children: "×" })
      ] }),
      /* @__PURE__ */ jsxs("form", { onSubmit: handleSubmit, className: "p-6 space-y-6", children: [
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("label", { className: "block text-sm font-semibold text-gray-700 mb-2", children: "Date" }),
          /* @__PURE__ */ jsx("input", { type: "text", value: date.toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
            weekday: "long"
          }), readOnly: true, className: "w-full px-4 py-2 border rounded-lg bg-gray-50" })
        ] }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("label", { className: "block text-sm font-semibold text-gray-700 mb-2", children: "Activity Type *" }),
          /* @__PURE__ */ jsx("select", { required: true, value: formData.activity, onChange: (e) => setFormData({
            ...formData,
            activity: e.target.value
          }), className: "w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-teal-500", children: ACTIVITY_TYPES.map((type) => /* @__PURE__ */ jsx("option", { value: type, children: type }, type)) })
        ] }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("label", { className: "block text-sm font-semibold text-gray-700 mb-2", children: "Leader/Imam *" }),
          /* @__PURE__ */ jsx("select", { required: true, value: formData.in_charge, onChange: (e) => setFormData({
            ...formData,
            in_charge: e.target.value
          }), className: "w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-teal-500", children: trainers.map((trainer) => /* @__PURE__ */ jsxs("option", { value: trainer.name, children: [
            trainer.rank,
            " ",
            trainer.name
          ] }, trainer.id)) })
        ] }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("label", { className: "block text-sm font-semibold text-gray-700 mb-2", children: "Participants *" }),
          /* @__PURE__ */ jsx("div", { className: "border rounded-lg p-4 max-h-60 overflow-y-auto space-y-2", children: trainers.map((trainer) => /* @__PURE__ */ jsxs("label", { className: "flex items-center space-x-3 p-2 hover:bg-gray-50 rounded cursor-pointer", children: [
            /* @__PURE__ */ jsx("input", { type: "checkbox", checked: formData.participants.includes(trainer.id), onChange: () => toggleParticipant(trainer.id), className: "w-4 h-4 text-teal-600 rounded focus:ring-2 focus:ring-teal-500" }),
            /* @__PURE__ */ jsxs("span", { className: "text-sm", children: [
              /* @__PURE__ */ jsx("span", { className: "font-medium", children: trainer.rank }),
              " ",
              trainer.name
            ] })
          ] }, trainer.id)) }),
          /* @__PURE__ */ jsxs("p", { className: "text-sm text-gray-600 mt-2", children: [
            "Selected: ",
            formData.participants.length,
            " participant(s)"
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "flex justify-end space-x-3 pt-4", children: [
          /* @__PURE__ */ jsx("button", { type: "button", onClick: onClose, className: "px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 font-semibold", children: "Cancel" }),
          /* @__PURE__ */ jsx("button", { type: "submit", disabled: isSubmitting || formData.participants.length === 0, className: "px-6 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed", children: isSubmitting ? "Scheduling..." : "Schedule Activity" })
        ] })
      ] })
    ] }) })
  ] });
}
export {
  createActivity_createServerFn_handler,
  getReligiousActivityData_createServerFn_handler
};
