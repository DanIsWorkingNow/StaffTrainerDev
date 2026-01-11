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
const getPhysicalTrainingData_createServerFn_handler = createServerRpc("6266443a313041fd0cec2c9298b1129e438c486762bb7bff2c5d2e53e2e508e9", (opts, signal) => {
  return getPhysicalTrainingData.__executeServer(opts, signal);
});
const getPhysicalTrainingData = createServerFn({
  method: "GET"
}).handler(getPhysicalTrainingData_createServerFn_handler, async () => {
  const supabase = getSupabaseServerClient();
  const {
    data: trainers
  } = await supabase.from("trainers").select("*").eq("status", "active").order("name");
  const {
    data: trainingSessions
  } = await supabase.from("physical_training").select("*").order("date", {
    ascending: true
  });
  const today = (/* @__PURE__ */ new Date()).toISOString().split("T")[0];
  const todayTrainings = trainingSessions?.filter((t) => t.date === today) || [];
  const startOfWeek = /* @__PURE__ */ new Date();
  const day = startOfWeek.getDay();
  const diff = startOfWeek.getDate() - day + (day === 0 ? -6 : 1);
  startOfWeek.setDate(diff);
  startOfWeek.setHours(0, 0, 0, 0);
  const endOfWeek = new Date(startOfWeek);
  endOfWeek.setDate(startOfWeek.getDate() + 6);
  endOfWeek.setHours(23, 59, 59, 999);
  const thisWeekTrainings = trainingSessions?.filter((t) => {
    const trainingDate = new Date(t.date);
    return trainingDate >= startOfWeek && trainingDate <= endOfWeek;
  }) || [];
  const user = await getCurrentUserRole();
  let visibleTrainingSessions = trainingSessions || [];
  if (user?.role === "TRAINER") {
    visibleTrainingSessions = visibleTrainingSessions.filter((session) => session.in_charge === user.name || session.participants.includes(user.trainerId));
  }
  if (user?.role === "TRAINER") {
    const todayTrainingsFiltered = visibleTrainingSessions.filter((t) => t.date === today);
    const thisWeekTrainingsFiltered = visibleTrainingSessions.filter((t) => {
      const trainingDate = new Date(t.date);
      return trainingDate >= startOfWeek && trainingDate <= endOfWeek;
    });
    return {
      trainers: trainers || [],
      trainingSessions: visibleTrainingSessions,
      stats: {
        activeTrainers: trainers?.length || 0,
        todaySessions: todayTrainingsFiltered.length,
        thisWeekSessions: thisWeekTrainingsFiltered.length
      }
    };
  }
  return {
    trainers: trainers || [],
    trainingSessions: trainingSessions || [],
    stats: {
      activeTrainers: trainers?.length || 0,
      todaySessions: todayTrainings.length,
      thisWeekSessions: thisWeekTrainings.length
    }
  };
});
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
const TRAINING_TYPES = ["Physical Fitness Training", "Combat Drills", "Agility Exercises", "Endurance Training", "Strength Conditioning", "Flexibility Sessions", "Safety Equipment Inspection", "Emergency Response Drill", "Team Building Workshop"];
const TIME_SLOTS = ["5:00 PM - 6:00 PM", "6:00 PM - 7:00 PM"];
const Route = createFileRoute("/_authed/physical-training/")({
  loader: async () => await getPhysicalTrainingData(),
  component: PhysicalTrainingPage
});
function PhysicalTrainingPage() {
  const {
    trainers,
    trainingSessions,
    stats
  } = Route.useLoaderData();
  const [currentDate, setCurrentDate] = useState(/* @__PURE__ */ new Date());
  const [selectedDate, setSelectedDate] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [view, setView] = useState("month");
  const [selectedTrainer, setSelectedTrainer] = useState("all");
  const getTrainingsForDate = (day, month, year) => {
    const m = month ?? currentDate.getMonth();
    const y = year ?? currentDate.getFullYear();
    const dateStr = `${y}-${String(m + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    return trainingSessions.filter((t) => t.date === dateStr);
  };
  const getTodayTrainings = () => {
    const today = /* @__PURE__ */ new Date();
    return getTrainingsForDate(today.getDate(), today.getMonth(), today.getFullYear());
  };
  const getWeekTrainings = () => {
    const startOfWeek = new Date(currentDate);
    const day = startOfWeek.getDay();
    const diff = startOfWeek.getDate() - day + (day === 0 ? -6 : 1);
    startOfWeek.setDate(diff);
    const trainings = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date(startOfWeek);
      date.setDate(startOfWeek.getDate() + i);
      const dayTrainings = getTrainingsForDate(date.getDate(), date.getMonth(), date.getFullYear());
      trainings.push(...dayTrainings.map((t) => ({
        ...t,
        displayDate: date
      })));
    }
    return trainings;
  };
  const getTrainerTrainings = () => {
    if (selectedTrainer === "all") {
      return trainingSessions;
    }
    return trainingSessions.filter((t) => t.in_charge === selectedTrainer || t.participants.some((p) => {
      const trainer = trainers.find((tr) => tr.id === p);
      return trainer?.name === selectedTrainer;
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
      /* @__PURE__ */ jsx("h1", { className: "text-3xl font-bold text-gray-900 mb-2", children: "Physical Training Schedule" }),
      /* @__PURE__ */ jsx("p", { className: "text-gray-600", children: "Schedule after-hours physical activities (5:00 PM - 7:00 PM)" })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-4", children: [
      /* @__PURE__ */ jsx(StatCard, { title: "Active Trainers", value: stats.activeTrainers, icon: "💪", color: "bg-orange-500" }),
      /* @__PURE__ */ jsx(StatCard, { title: "Today's Sessions", value: stats.todaySessions, icon: "📅", color: "bg-green-500" }),
      /* @__PURE__ */ jsx(StatCard, { title: "This Week", value: stats.thisWeekSessions, icon: "📊", color: "bg-purple-500" })
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
        /* @__PURE__ */ jsx("button", { onClick: () => setView("week"), className: `px-4 py-2 rounded transition ${view === "week" ? "bg-orange-600 text-white" : "bg-gray-200 hover:bg-gray-300"}`, children: "Week" }),
        /* @__PURE__ */ jsx("button", { onClick: () => setView("month"), className: `px-4 py-2 rounded transition ${view === "month" ? "bg-orange-600 text-white" : "bg-gray-200 hover:bg-gray-300"}`, children: "Month" }),
        /* @__PURE__ */ jsx("button", { onClick: () => setView("trainer-schedule"), className: `px-4 py-2 rounded transition ${view === "trainer-schedule" ? "bg-orange-600 text-white" : "bg-gray-200 hover:bg-gray-300"}`, children: "Trainer Schedule" })
      ] })
    ] }) }),
    view === "month" && /* @__PURE__ */ jsx(MonthView, { getDaysInMonth, getTrainingsForDate, handleDateClick, currentDate }),
    view === "week" && /* @__PURE__ */ jsx(WeekView, { trainingSessions: getWeekTrainings(), currentDate, trainers }),
    view === "trainer-schedule" && /* @__PURE__ */ jsx(TrainerScheduleView, { trainers, trainingSessions: getTrainerTrainings(), selectedTrainer, setSelectedTrainer, currentDate }),
    /* @__PURE__ */ jsxs("div", { className: "bg-white rounded-lg shadow p-6", children: [
      /* @__PURE__ */ jsx("h3", { className: "text-xl font-semibold mb-4", children: view === "week" ? "This Week's Training Events" : view === "trainer-schedule" ? "Trainer's Training Events" : "Today's Training Events" }),
      (() => {
        const displayTrainings = view === "week" ? getWeekTrainings() : view === "trainer-schedule" ? getTrainerTrainings() : getTodayTrainings();
        if (displayTrainings.length === 0) {
          return /* @__PURE__ */ jsx("p", { className: "text-gray-600", children: "No training scheduled" });
        }
        return /* @__PURE__ */ jsx("div", { className: "space-y-3", children: displayTrainings.map((training) => /* @__PURE__ */ jsx("div", { className: "border-l-4 border-orange-500 bg-orange-50 p-4 rounded hover:shadow-md transition", children: /* @__PURE__ */ jsxs("div", { className: "flex justify-between items-start", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex-1", children: [
            /* @__PURE__ */ jsx("h4", { className: "font-semibold text-gray-900", children: training.training_type }),
            training.displayDate && /* @__PURE__ */ jsxs("p", { className: "text-sm text-gray-600 mt-1", children: [
              /* @__PURE__ */ jsx("strong", { children: "Date:" }),
              " ",
              training.displayDate.toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric"
              })
            ] }),
            /* @__PURE__ */ jsxs("p", { className: "text-sm text-gray-600 mt-1", children: [
              /* @__PURE__ */ jsx("strong", { children: "In Charge:" }),
              " ",
              training.in_charge
            ] }),
            /* @__PURE__ */ jsxs("p", { className: "text-sm text-gray-600", children: [
              /* @__PURE__ */ jsx("strong", { children: "Participants:" }),
              " ",
              training.participants.length,
              " trainer(s)"
            ] }),
            /* @__PURE__ */ jsxs("p", { className: "text-sm text-gray-600", children: [
              /* @__PURE__ */ jsx("strong", { children: "Time:" }),
              " ",
              training.time_slot
            ] })
          ] }),
          /* @__PURE__ */ jsx("div", { className: "text-xs bg-orange-200 text-orange-800 px-3 py-1 rounded-full", children: "💪 Physical" })
        ] }) }, training.id)) });
      })()
    ] }),
    showModal && selectedDate && /* @__PURE__ */ jsx(AssignmentModal, { date: selectedDate, trainers, onClose: () => setShowModal(false), onSubmit: createTraining })
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
  getTrainingsForDate,
  handleDateClick,
  currentDate
}) {
  return /* @__PURE__ */ jsxs("div", { className: "bg-white rounded-lg shadow p-6", children: [
    /* @__PURE__ */ jsx("div", { className: "grid grid-cols-7 gap-2 mb-4", children: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => /* @__PURE__ */ jsx("div", { className: "text-center font-semibold text-gray-700 py-2", children: day }, day)) }),
    /* @__PURE__ */ jsx("div", { className: "grid grid-cols-7 gap-2", children: getDaysInMonth().map((day, idx) => {
      if (!day) {
        return /* @__PURE__ */ jsx("div", { className: "aspect-square" }, `empty-${idx}`);
      }
      const trainings = getTrainingsForDate(day);
      const isToday = day === (/* @__PURE__ */ new Date()).getDate() && currentDate.getMonth() === (/* @__PURE__ */ new Date()).getMonth() && currentDate.getFullYear() === (/* @__PURE__ */ new Date()).getFullYear();
      return /* @__PURE__ */ jsxs("div", { onClick: () => handleDateClick(day), className: `
                aspect-square border-2 rounded-lg p-2 cursor-pointer transition-all
                hover:shadow-lg hover:border-orange-500 hover:scale-105
                ${isToday ? "border-orange-600 bg-orange-50" : "border-gray-200 bg-white"}
              `, children: [
        /* @__PURE__ */ jsx("div", { className: `font-semibold mb-1 ${isToday ? "text-orange-600" : "text-gray-900"}`, children: day }),
        /* @__PURE__ */ jsxs("div", { className: "space-y-1", children: [
          trainings.slice(0, 2).map((training, idx2) => /* @__PURE__ */ jsxs("div", { className: "bg-orange-100 text-orange-800 text-xs p-1 rounded truncate", title: training.training_type, children: [
            "💪 ",
            training.training_type.substring(0, 8),
            "..."
          ] }, idx2)),
          trainings.length > 2 && /* @__PURE__ */ jsxs("div", { className: "text-xs text-gray-600 font-medium", children: [
            "+",
            trainings.length - 2,
            " more"
          ] })
        ] })
      ] }, day);
    }) })
  ] });
}
function WeekView({
  trainingSessions,
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
    const dayTrainings = trainingSessions.filter((t) => t.date === dateStr);
    const isToday = date.toDateString() === (/* @__PURE__ */ new Date()).toDateString();
    return /* @__PURE__ */ jsxs("div", { className: `text-center p-3 rounded-lg ${isToday ? "bg-orange-50" : ""}`, children: [
      /* @__PURE__ */ jsx("div", { className: `font-semibold ${isToday ? "text-orange-600" : "text-gray-700"}`, children: day2 }),
      /* @__PURE__ */ jsx("div", { className: `text-2xl font-bold mt-2 ${isToday ? "text-orange-600" : "text-gray-900"}`, children: date.getDate() }),
      /* @__PURE__ */ jsxs("div", { className: "mt-4 space-y-2", children: [
        dayTrainings.map((training) => /* @__PURE__ */ jsxs("div", { className: "bg-orange-100 text-orange-800 text-xs p-2 rounded border-l-4 border-orange-500", children: [
          /* @__PURE__ */ jsx("div", { className: "font-semibold truncate", children: training.training_type }),
          /* @__PURE__ */ jsx("div", { className: "text-xs mt-1", children: training.time_slot }),
          /* @__PURE__ */ jsxs("div", { className: "text-xs", children: [
            "👤 ",
            training.in_charge
          ] })
        ] }, training.id)),
        dayTrainings.length === 0 && /* @__PURE__ */ jsx("div", { className: "text-xs text-gray-400 italic", children: "No training" })
      ] })
    ] }, day2);
  }) }) });
}
function TrainerScheduleView({
  trainers,
  trainingSessions,
  selectedTrainer,
  setSelectedTrainer,
  currentDate
}) {
  return /* @__PURE__ */ jsxs("div", { className: "space-y-6", children: [
    /* @__PURE__ */ jsxs("div", { className: "bg-white rounded-lg shadow p-6", children: [
      /* @__PURE__ */ jsx("label", { className: "block text-sm font-semibold text-gray-700 mb-2", children: "Select Trainer" }),
      /* @__PURE__ */ jsxs("select", { value: selectedTrainer, onChange: (e) => setSelectedTrainer(e.target.value), className: "w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500", children: [
        /* @__PURE__ */ jsx("option", { value: "all", children: "All Trainers" }),
        trainers.map((trainer) => /* @__PURE__ */ jsxs("option", { value: trainer.name, children: [
          trainer.rank,
          " ",
          trainer.name
        ] }, trainer.id))
      ] })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-4", children: [
      /* @__PURE__ */ jsxs("div", { className: "bg-white rounded-lg shadow p-4", children: [
        /* @__PURE__ */ jsx("div", { className: "text-sm text-gray-600", children: "Total Sessions" }),
        /* @__PURE__ */ jsx("div", { className: "text-2xl font-bold text-gray-900 mt-1", children: trainingSessions.length })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "bg-white rounded-lg shadow p-4", children: [
        /* @__PURE__ */ jsx("div", { className: "text-sm text-gray-600", children: "This Month" }),
        /* @__PURE__ */ jsx("div", { className: "text-2xl font-bold text-gray-900 mt-1", children: trainingSessions.filter((t) => {
          const trainingDate = new Date(t.date);
          return trainingDate.getMonth() === currentDate.getMonth() && trainingDate.getFullYear() === currentDate.getFullYear();
        }).length })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "bg-white rounded-lg shadow p-4", children: [
        /* @__PURE__ */ jsx("div", { className: "text-sm text-gray-600", children: "As Lead Trainer" }),
        /* @__PURE__ */ jsx("div", { className: "text-2xl font-bold text-gray-900 mt-1", children: trainingSessions.filter((t) => t.in_charge === selectedTrainer).length })
      ] })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "bg-white rounded-lg shadow p-6", children: [
      /* @__PURE__ */ jsx("h3", { className: "text-lg font-semibold mb-4", children: "Active Trainers" }),
      /* @__PURE__ */ jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4", children: trainers.map((trainer) => {
        const trainerSessions = trainingSessions.filter((t) => t.in_charge === trainer.name || t.participants.includes(trainer.id));
        return /* @__PURE__ */ jsx("div", { className: `p-4 rounded-lg border-2 transition cursor-pointer ${selectedTrainer === trainer.name ? "border-orange-500 bg-orange-50" : "border-gray-200 hover:border-orange-300"}`, onClick: () => setSelectedTrainer(trainer.name), children: /* @__PURE__ */ jsxs("div", { className: "flex items-center space-x-3", children: [
          /* @__PURE__ */ jsx("div", { className: "bg-orange-100 text-orange-800 w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold", children: trainer.name.charAt(0) }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("div", { className: "font-semibold text-gray-900", children: trainer.name }),
            /* @__PURE__ */ jsx("div", { className: "text-sm text-gray-600", children: trainer.rank }),
            /* @__PURE__ */ jsxs("div", { className: "text-xs text-gray-500 mt-1", children: [
              trainerSessions.length,
              " session(s)"
            ] })
          ] })
        ] }) }, trainer.id);
      }) })
    ] })
  ] });
}
function AssignmentModal({
  date,
  trainers,
  onClose,
  onSubmit
}) {
  const [formData, setFormData] = useState({
    training_type: TRAINING_TYPES[0],
    in_charge: trainers[0]?.name || "",
    participants: [],
    time_slot: TIME_SLOTS[0]
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
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx("div", { className: "fixed inset-0 bg-black bg-opacity-50 z-40", onClick: onClose }),
    /* @__PURE__ */ jsx("div", { className: "fixed inset-0 flex items-center justify-center p-4 z-50 pointer-events-none", children: /* @__PURE__ */ jsxs("div", { className: "bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto pointer-events-auto", children: [
      /* @__PURE__ */ jsxs("div", { className: "bg-green-50 border-b px-6 py-4 flex justify-between items-center sticky top-0", children: [
        /* @__PURE__ */ jsx("h3", { className: "text-xl font-semibold text-gray-900", children: "Assign Physical Training" }),
        /* @__PURE__ */ jsx("button", { onClick: onClose, className: "text-gray-600 hover:text-gray-900 text-2xl leading-none", type: "button", children: "×" })
      ] }),
      /* @__PURE__ */ jsxs("form", { onSubmit: handleSubmit, className: "p-6 space-y-6", children: [
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("label", { className: "block text-sm font-semibold text-gray-700 mb-2", children: "Date" }),
          /* @__PURE__ */ jsx("input", { type: "text", value: date.toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric"
          }), readOnly: true, className: "w-full px-4 py-2 border rounded-lg bg-gray-50" })
        ] }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("label", { className: "block text-sm font-semibold text-gray-700 mb-2", children: "Training Type *" }),
          /* @__PURE__ */ jsx("select", { required: true, value: formData.training_type, onChange: (e) => setFormData({
            ...formData,
            training_type: e.target.value
          }), className: "w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500", children: TRAINING_TYPES.map((type) => /* @__PURE__ */ jsx("option", { value: type, children: type }, type)) })
        ] }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("label", { className: "block text-sm font-semibold text-gray-700 mb-2", children: "Time Slot *" }),
          /* @__PURE__ */ jsx("select", { required: true, value: formData.time_slot, onChange: (e) => setFormData({
            ...formData,
            time_slot: e.target.value
          }), className: "w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500", children: TIME_SLOTS.map((slot) => /* @__PURE__ */ jsx("option", { value: slot, children: slot }, slot)) })
        ] }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("label", { className: "block text-sm font-semibold text-gray-700 mb-2", children: "Trainer in Charge *" }),
          /* @__PURE__ */ jsx("select", { required: true, value: formData.in_charge, onChange: (e) => setFormData({
            ...formData,
            in_charge: e.target.value
          }), className: "w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500", children: trainers.map((trainer) => /* @__PURE__ */ jsxs("option", { value: trainer.name, children: [
            trainer.rank,
            " ",
            trainer.name
          ] }, trainer.id)) })
        ] }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("label", { className: "block text-sm font-semibold text-gray-700 mb-2", children: "Participating Trainers *" }),
          /* @__PURE__ */ jsx("div", { className: "border rounded-lg p-4 max-h-60 overflow-y-auto space-y-2", children: trainers.map((trainer) => /* @__PURE__ */ jsxs("label", { className: "flex items-center space-x-3 p-2 hover:bg-gray-50 rounded cursor-pointer", children: [
            /* @__PURE__ */ jsx("input", { type: "checkbox", checked: formData.participants.includes(trainer.id), onChange: () => toggleParticipant(trainer.id), className: "w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500" }),
            /* @__PURE__ */ jsxs("span", { className: "text-sm", children: [
              /* @__PURE__ */ jsx("span", { className: "font-medium", children: trainer.rank }),
              " ",
              trainer.name
            ] })
          ] }, trainer.id)) }),
          /* @__PURE__ */ jsxs("p", { className: "text-sm text-gray-600 mt-2", children: [
            "Selected: ",
            formData.participants.length,
            " trainer(s)"
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "flex justify-end space-x-3 pt-4", children: [
          /* @__PURE__ */ jsx("button", { type: "button", onClick: onClose, className: "px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 font-semibold", children: "Cancel" }),
          /* @__PURE__ */ jsx("button", { type: "submit", disabled: isSubmitting || formData.participants.length === 0, className: "px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed", children: isSubmitting ? "Assigning..." : "Assign Training" })
        ] })
      ] })
    ] }) })
  ] });
}
export {
  createTraining_createServerFn_handler,
  getPhysicalTrainingData_createServerFn_handler
};
