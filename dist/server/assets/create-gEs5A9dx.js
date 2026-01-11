import { jsxs, jsx } from "react/jsx-runtime";
import { a as createServerRpc, c as createServerFn } from "../server.js";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
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
const getTrainers_createServerFn_handler = createServerRpc("bb9821548a5d9802cf65ba99df69b03ef20843e306372d0d4e8e73744ef8998a", (opts, signal) => {
  return getTrainers.__executeServer(opts, signal);
});
const getTrainers = createServerFn({
  method: "GET"
}).handler(getTrainers_createServerFn_handler, async () => {
  const supabase = getSupabaseServerClient();
  const {
    data: trainers
  } = await supabase.from("trainers").select("*").eq("status", "active").order("name", {
    ascending: true
  });
  return {
    trainers: trainers || []
  };
});
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
const EVENT_CATEGORIES = [{
  name: "Physical Training",
  color: "#3b82f6"
}, {
  name: "Safety Training",
  color: "#8b5cf6"
}, {
  name: "Emergency Response",
  color: "#ef4444"
}, {
  name: "Equipment Inspection",
  color: "#f59e0b"
}, {
  name: "Leadership Training",
  color: "#eab308"
}, {
  name: "Team Building",
  color: "#10b981"
}, {
  name: "Religious Activity",
  color: "#14b8a6"
}, {
  name: "Community Service",
  color: "#06b6d4"
}, {
  name: "Routine Maintenance",
  color: "#92400e"
}, {
  name: "Special Event",
  color: "#ec4899"
}, {
  name: "Development Program",
  color: "#6366f1"
}, {
  name: "Collaboration Activity",
  color: "#a855f7"
}];
const COLOR_PALETTE = [{
  name: "Blue",
  value: "#3b82f6"
}, {
  name: "Purple",
  value: "#8b5cf6"
}, {
  name: "Red",
  value: "#ef4444"
}, {
  name: "Orange",
  value: "#f59e0b"
}, {
  name: "Yellow",
  value: "#eab308"
}, {
  name: "Green",
  value: "#10b981"
}, {
  name: "Teal",
  value: "#14b8a6"
}, {
  name: "Cyan",
  value: "#06b6d4"
}, {
  name: "Brown",
  value: "#92400e"
}, {
  name: "Pink",
  value: "#ec4899"
}, {
  name: "Indigo",
  value: "#6366f1"
}, {
  name: "Violet",
  value: "#a855f7"
}, {
  name: "Emerald",
  value: "#059669"
}, {
  name: "Lime",
  value: "#84cc16"
}, {
  name: "Rose",
  value: "#f43f5e"
}, {
  name: "Sky",
  value: "#0ea5e9"
}];
const Route = createFileRoute("/_authed/events/create")({
  loader: async () => await getTrainers(),
  component: CreateEventPage
});
function CreateEventPage() {
  const navigate = useNavigate();
  const {
    trainers
  } = Route.useLoaderData();
  const [formData, setFormData] = useState({
    name: "",
    category: EVENT_CATEGORIES[0].name,
    start_date: "",
    end_date: "",
    description: "",
    color: EVENT_CATEGORIES[0].color,
    trainer_ids: []
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const handleCategoryChange = (category) => {
    const selectedCategory = EVENT_CATEGORIES.find((c) => c.name === category);
    setFormData({
      ...formData,
      category,
      color: selectedCategory?.color || EVENT_CATEGORIES[0].color
    });
  };
  const handleColorSelect = (color) => {
    setFormData({
      ...formData,
      color
    });
  };
  const handleTrainerToggle = (trainerId) => {
    setFormData((prev) => ({
      ...prev,
      trainer_ids: prev.trainer_ids.includes(trainerId) ? prev.trainer_ids.filter((id) => id !== trainerId) : [...prev.trainer_ids, trainerId]
    }));
  };
  const handleSelectAll = () => {
    setFormData((prev) => ({
      ...prev,
      trainer_ids: trainers.map((t) => t.id)
    }));
  };
  const handleDeselectAll = () => {
    setFormData((prev) => ({
      ...prev,
      trainer_ids: []
    }));
  };
  const getSelectedTrainers = () => {
    return trainers.filter((t) => formData.trainer_ids.includes(t.id));
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);
    try {
      if (new Date(formData.end_date) < new Date(formData.start_date)) {
        setError("End date must be after start date");
        setIsSubmitting(false);
        return;
      }
      const result = await createEventWithTrainers({
        data: formData
      });
      if (result.error) {
        setError(result.error);
        setIsSubmitting(false);
        return;
      }
      navigate({
        to: "/events"
      });
    } catch (err) {
      setError(err.message || "Failed to create event");
      setIsSubmitting(false);
    }
  };
  const selectedTrainers = getSelectedTrainers();
  return /* @__PURE__ */ jsxs("div", { className: "max-w-4xl mx-auto space-y-6", children: [
    /* @__PURE__ */ jsxs("div", { className: "bg-white rounded-lg shadow p-6", children: [
      /* @__PURE__ */ jsx("h1", { className: "text-3xl font-bold text-gray-900 mb-2", children: "Create New Event" }),
      /* @__PURE__ */ jsx("p", { className: "text-gray-600", children: "Fill in the details to create a training event and assign trainers" })
    ] }),
    /* @__PURE__ */ jsxs("form", { onSubmit: handleSubmit, className: "bg-white rounded-lg shadow", children: [
      /* @__PURE__ */ jsxs("div", { className: "p-6 space-y-6", children: [
        error && /* @__PURE__ */ jsx("div", { className: "bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded", children: error }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("label", { className: "block text-sm font-semibold text-gray-700 mb-2", children: "Event Name *" }),
          /* @__PURE__ */ jsx("input", { type: "text", required: true, value: formData.name, onChange: (e) => setFormData({
            ...formData,
            name: e.target.value
          }), className: "w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500", placeholder: "Enter event name" })
        ] }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("label", { className: "block text-sm font-semibold text-gray-700 mb-2", children: "Category *" }),
          /* @__PURE__ */ jsx("select", { required: true, value: formData.category, onChange: (e) => handleCategoryChange(e.target.value), className: "w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500", children: EVENT_CATEGORIES.map((cat) => /* @__PURE__ */ jsx("option", { value: cat.name, children: cat.name }, cat.name)) })
        ] }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("label", { className: "block text-sm font-semibold text-gray-700 mb-2", children: "Event Color *" }),
          /* @__PURE__ */ jsxs("div", { className: "space-y-3", children: [
            /* @__PURE__ */ jsxs("div", { className: "flex items-center space-x-3 p-3 bg-gray-50 rounded-lg border", children: [
              /* @__PURE__ */ jsx("span", { className: "text-sm text-gray-600", children: "Selected Color:" }),
              /* @__PURE__ */ jsx("div", { className: "w-10 h-10 rounded-lg border-2 border-gray-300 shadow-sm", style: {
                backgroundColor: formData.color
              } }),
              /* @__PURE__ */ jsx("span", { className: "text-sm font-medium text-gray-700", children: COLOR_PALETTE.find((c) => c.value === formData.color)?.name || "Custom" })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "border rounded-lg p-4 bg-white", children: [
              /* @__PURE__ */ jsx("p", { className: "text-xs text-gray-600 mb-3", children: "Choose a color for your event:" }),
              /* @__PURE__ */ jsx("div", { className: "grid grid-cols-8 gap-2", children: COLOR_PALETTE.map((colorOption) => /* @__PURE__ */ jsx("button", { type: "button", onClick: () => handleColorSelect(colorOption.value), className: `w-10 h-10 rounded-lg transition-all hover:scale-110 ${formData.color === colorOption.value ? "ring-2 ring-offset-2 ring-gray-900 shadow-lg" : "hover:shadow-md"}`, style: {
                backgroundColor: colorOption.value
              }, title: colorOption.name }, colorOption.value)) })
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: [
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("label", { className: "block text-sm font-semibold text-gray-700 mb-2", children: "Start Date *" }),
            /* @__PURE__ */ jsx("input", { type: "date", required: true, value: formData.start_date, onChange: (e) => setFormData({
              ...formData,
              start_date: e.target.value
            }), className: "w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" })
          ] }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("label", { className: "block text-sm font-semibold text-gray-700 mb-2", children: "End Date *" }),
            /* @__PURE__ */ jsx("input", { type: "date", required: true, value: formData.end_date, onChange: (e) => setFormData({
              ...formData,
              end_date: e.target.value
            }), className: "w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("label", { className: "block text-sm font-semibold text-gray-700 mb-2", children: "Description" }),
          /* @__PURE__ */ jsx("textarea", { value: formData.description, onChange: (e) => setFormData({
            ...formData,
            description: e.target.value
          }), rows: 4, className: "w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500", placeholder: "Enter event description (optional)" })
        ] }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between mb-3", children: [
            /* @__PURE__ */ jsx("label", { className: "block text-sm font-semibold text-gray-700", children: "Assign Trainers" }),
            /* @__PURE__ */ jsxs("div", { className: "flex gap-2", children: [
              /* @__PURE__ */ jsx("button", { type: "button", onClick: handleSelectAll, className: "text-sm text-blue-600 hover:text-blue-800 font-medium", children: "Select All" }),
              /* @__PURE__ */ jsx("span", { className: "text-gray-300", children: "|" }),
              /* @__PURE__ */ jsx("button", { type: "button", onClick: handleDeselectAll, className: "text-sm text-blue-600 hover:text-blue-800 font-medium", children: "Deselect All" })
            ] })
          ] }),
          selectedTrainers.length > 0 && /* @__PURE__ */ jsxs("div", { className: "mb-4 p-4 bg-blue-50 border border-blue-200 rounded-lg", children: [
            /* @__PURE__ */ jsx("div", { className: "flex items-start justify-between mb-2", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center space-x-2", children: [
              /* @__PURE__ */ jsx("svg", { className: "w-5 h-5 text-blue-600", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" }) }),
              /* @__PURE__ */ jsxs("h3", { className: "font-semibold text-blue-900", children: [
                "Selected Trainers (",
                selectedTrainers.length,
                ")"
              ] })
            ] }) }),
            /* @__PURE__ */ jsx("div", { className: "space-y-2", children: selectedTrainers.map((trainer) => /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between bg-white px-3 py-2 rounded border border-blue-200", children: [
              /* @__PURE__ */ jsxs("div", { className: "flex items-center space-x-3", children: [
                /* @__PURE__ */ jsx("div", { className: "w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center", children: /* @__PURE__ */ jsx("span", { className: "text-sm font-semibold text-blue-700", children: trainer.name.charAt(0) }) }),
                /* @__PURE__ */ jsxs("div", { children: [
                  /* @__PURE__ */ jsx("p", { className: "font-medium text-sm text-gray-900", children: trainer.name }),
                  /* @__PURE__ */ jsx("p", { className: "text-xs text-gray-600", children: trainer.specialization || trainer.rank })
                ] })
              ] }),
              /* @__PURE__ */ jsx("button", { type: "button", onClick: () => handleTrainerToggle(trainer.id), className: "text-red-600 hover:text-red-800 text-sm font-medium", children: "Remove" })
            ] }, trainer.id)) })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "border rounded-lg p-4 bg-gray-50", children: [
            /* @__PURE__ */ jsxs("p", { className: "text-sm text-gray-600 mb-3", children: [
              "Select trainers who will be assigned to this event",
              formData.trainer_ids.length === 0 && " (none selected)"
            ] }),
            /* @__PURE__ */ jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 max-h-80 overflow-y-auto", children: trainers.map((trainer) => /* @__PURE__ */ jsxs("label", { className: `flex items-center space-x-3 p-3 rounded-lg border-2 cursor-pointer transition ${formData.trainer_ids.includes(trainer.id) ? "border-blue-500 bg-blue-50" : "border-gray-200 bg-white hover:border-gray-300"}`, children: [
              /* @__PURE__ */ jsx("input", { type: "checkbox", checked: formData.trainer_ids.includes(trainer.id), onChange: () => handleTrainerToggle(trainer.id), className: "w-5 h-5 text-blue-600 rounded focus:ring-blue-500" }),
              /* @__PURE__ */ jsxs("div", { className: "flex-1 min-w-0", children: [
                /* @__PURE__ */ jsx("p", { className: "font-medium text-sm text-gray-900 truncate", children: trainer.name }),
                /* @__PURE__ */ jsx("p", { className: "text-xs text-gray-600 truncate", children: trainer.specialization || trainer.rank })
              ] })
            ] }, trainer.id)) }),
            trainers.length === 0 && /* @__PURE__ */ jsx("p", { className: "text-sm text-gray-500 text-center py-4", children: "No active trainers available" })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "bg-gray-50 px-6 py-4 flex justify-end space-x-3 rounded-b-lg", children: [
        /* @__PURE__ */ jsx("button", { type: "button", onClick: () => navigate({
          to: "/events"
        }), className: "px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 font-semibold", children: "Cancel" }),
        /* @__PURE__ */ jsx("button", { type: "submit", disabled: isSubmitting, className: "px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed", children: isSubmitting ? "Creating..." : "Create Event" })
      ] })
    ] })
  ] });
}
export {
  createEventWithTrainers_createServerFn_handler,
  getTrainers_createServerFn_handler
};
