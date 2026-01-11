import { jsxs, jsx, Fragment } from "react/jsx-runtime";
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
const getUserProfile_createServerFn_handler = createServerRpc("fa5bad6b93e6979e4fd1bfc5f1db5baa3a8f8d9080461a2199935af1f171ff21", (opts, signal) => {
  return getUserProfile.__executeServer(opts, signal);
});
const getUserProfile = createServerFn({
  method: "GET"
}).handler(getUserProfile_createServerFn_handler, async () => {
  const supabase = getSupabaseServerClient();
  const {
    data: {
      user
    },
    error: authError
  } = await supabase.auth.getUser();
  if (authError || !user) {
    throw new Error("Not authenticated");
  }
  const {
    data: profileData,
    error: profileError
  } = await supabase.rpc("get_trainer_profile", {
    p_user_id: user.id
  });
  if (profileError || !profileData) {
    const {
      data: trainerData,
      error: trainerError
    } = await supabase.from("trainers").select("id, name, rank, region, specialization, status, is_active, created_at, updated_at, last_login, role_id").eq("user_id", user.id).single();
    if (trainerError || !trainerData) {
      console.error("Error fetching trainer data:", trainerError);
      throw new Error("Failed to fetch user profile");
    }
    let roleData = null;
    if (trainerData.role_id) {
      const {
        data: role
      } = await supabase.from("roles").select("id, name, level, description").eq("id", trainerData.role_id).single();
      roleData = role;
    }
    const firstDayOfMonth = new Date((/* @__PURE__ */ new Date()).getFullYear(), (/* @__PURE__ */ new Date()).getMonth(), 1).toISOString().split("T")[0];
    const {
      data: religiousActivities
    } = await supabase.from("religious_activities").select("id").contains("participants", [trainerData.id]);
    const {
      data: physicalTraining
    } = await supabase.from("physical_training").select("id").contains("participants", [trainerData.id]);
    const {
      data: events
    } = await supabase.from("events").select("id").contains("trainer_ids", [trainerData.id]);
    const {
      data: monthlyReligious
    } = await supabase.from("religious_activities").select("id").contains("participants", [trainerData.id]).gte("date", firstDayOfMonth);
    const {
      data: monthlyPT
    } = await supabase.from("physical_training").select("id").contains("participants", [trainerData.id]).gte("date", firstDayOfMonth);
    const activityStats = {
      totalReligious: religiousActivities?.length || 0,
      totalPhysicalTraining: physicalTraining?.length || 0,
      totalEvents: events?.length || 0,
      monthlyReligious: monthlyReligious?.length || 0,
      monthlyPhysicalTraining: monthlyPT?.length || 0
    };
    return {
      profile: {
        id: trainerData.id,
        name: trainerData.name,
        email: user.email || "",
        role: roleData?.name || "UNKNOWN",
        roleLevel: roleData?.level || 0,
        roleDescription: roleData?.description || "",
        rank: trainerData.rank || "Not set",
        region: trainerData.region || "Not set",
        specialization: trainerData.specialization || "Not set",
        status: trainerData.status,
        isActive: trainerData.is_active,
        createdAt: trainerData.created_at,
        updatedAt: trainerData.updated_at,
        lastLogin: trainerData.last_login || null
      },
      activityStats
    };
  }
  return profileData;
});
const Route = createFileRoute("/_authed/profile/")({
  loader: async () => await getUserProfile(),
  component: ProfilePage
});
function ProfilePage() {
  const {
    profile,
    activityStats
  } = Route.useLoaderData();
  return /* @__PURE__ */ jsxs("div", { className: "max-w-5xl mx-auto p-6 space-y-6", children: [
    /* @__PURE__ */ jsx("div", { className: "bg-gradient-to-r from-orange-600 to-red-700 rounded-lg shadow-lg p-8 text-white", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center space-x-6", children: [
      /* @__PURE__ */ jsx("div", { className: "w-24 h-24 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center border-4 border-white/30", children: /* @__PURE__ */ jsx("span", { className: "text-5xl font-bold text-white", children: profile.name?.charAt(0).toUpperCase() || "U" }) }),
      /* @__PURE__ */ jsxs("div", { className: "flex-1", children: [
        /* @__PURE__ */ jsx("h1", { className: "text-3xl font-bold mb-2", children: profile.role === "ADMIN" ? "System Administrator" : profile.name }),
        /* @__PURE__ */ jsx("p", { className: "text-orange-100 text-lg", children: profile.email }),
        /* @__PURE__ */ jsxs("div", { className: "flex items-center space-x-4 mt-3", children: [
          /* @__PURE__ */ jsx("span", { className: `px-3 py-1 rounded-full text-sm font-semibold ${profile.isActive ? "bg-green-500/30 text-green-100 border border-green-300/50" : "bg-gray-500/30 text-gray-100 border border-gray-300/50"}`, children: profile.isActive ? "✓ Active" : "Inactive" }),
          /* @__PURE__ */ jsx("span", { className: `px-3 py-1 rounded-full text-sm font-semibold ${profile.role === "ADMIN" ? "bg-purple-500/30 text-purple-100 border border-purple-300/50" : profile.role === "COORDINATOR" ? "bg-blue-500/30 text-blue-100 border border-blue-300/50" : "bg-green-500/30 text-green-100 border border-green-300/50"}`, children: profile.role === "ADMIN" ? "👑 Administrator" : profile.role === "COORDINATOR" ? "📋 Coordinator" : "👨‍🏫 Trainer" })
        ] })
      ] })
    ] }) }),
    /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-3 gap-6", children: [
      /* @__PURE__ */ jsxs("div", { className: "lg:col-span-2 space-y-6", children: [
        /* @__PURE__ */ jsxs("div", { className: "bg-white rounded-lg shadow-lg p-6", children: [
          /* @__PURE__ */ jsxs("h2", { className: "text-2xl font-bold text-gray-900 mb-6 flex items-center", children: [
            /* @__PURE__ */ jsx("span", { className: "text-3xl mr-3", children: "👤" }),
            "Personal Information"
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-6", children: [
            /* @__PURE__ */ jsx(InfoField, { label: "Full Name", value: profile.name }),
            /* @__PURE__ */ jsx(InfoField, { label: "Email Address", value: profile.email }),
            /* @__PURE__ */ jsx(InfoField, { label: "Role", value: profile.role }),
            /* @__PURE__ */ jsx(InfoField, { label: "Rank", value: profile.rank }),
            /* @__PURE__ */ jsx(InfoField, { label: "Region", value: profile.region }),
            /* @__PURE__ */ jsx(InfoField, { label: "Specialization", value: profile.specialization }),
            /* @__PURE__ */ jsx(InfoField, { label: "Account Created", value: new Date(profile.createdAt).toLocaleDateString("en-MY", {
              year: "numeric",
              month: "long",
              day: "numeric"
            }) }),
            /* @__PURE__ */ jsx(InfoField, { label: "Last Updated", value: new Date(profile.updatedAt).toLocaleDateString("en-MY", {
              year: "numeric",
              month: "long",
              day: "numeric"
            }) })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "bg-white rounded-lg shadow-lg p-6", children: [
          /* @__PURE__ */ jsxs("h2", { className: "text-2xl font-bold text-gray-900 mb-6 flex items-center", children: [
            /* @__PURE__ */ jsx("span", { className: "text-3xl mr-3", children: "🔐" }),
            "Role & Permissions"
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
            /* @__PURE__ */ jsxs("div", { className: "p-4 bg-blue-50 rounded-lg border-2 border-blue-200", children: [
              /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between mb-2", children: [
                /* @__PURE__ */ jsx("h3", { className: "font-bold text-lg text-gray-900", children: profile.role }),
                /* @__PURE__ */ jsxs("span", { className: "px-3 py-1 bg-blue-600 text-white rounded-full text-sm font-semibold", children: [
                  "Level ",
                  profile.roleLevel
                ] })
              ] }),
              /* @__PURE__ */ jsx("p", { className: "text-sm text-gray-700", children: profile.roleDescription })
            ] }),
            profile.role === "ADMIN" && /* @__PURE__ */ jsx("div", { className: "p-4 bg-purple-50 rounded-lg border border-purple-200", children: /* @__PURE__ */ jsx("p", { className: "text-sm text-purple-900 font-medium", children: "✓ Full system access • User management • All modules" }) }),
            profile.role === "COORDINATOR" && /* @__PURE__ */ jsx("div", { className: "p-4 bg-blue-50 rounded-lg border border-blue-200", children: /* @__PURE__ */ jsx("p", { className: "text-sm text-blue-900 font-medium", children: "✓ Schedule management • Event creation • Trainer assignments" }) }),
            profile.role === "TRAINER" && /* @__PURE__ */ jsx("div", { className: "p-4 bg-green-50 rounded-lg border border-green-200", children: /* @__PURE__ */ jsx("p", { className: "text-sm text-green-900 font-medium", children: "✓ View schedules • Update profile • View activities" }) })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "bg-white rounded-lg shadow-lg p-6", children: [
          /* @__PURE__ */ jsxs("h2", { className: "text-2xl font-bold text-gray-900 mb-6 flex items-center", children: [
            /* @__PURE__ */ jsx("span", { className: "text-3xl mr-3", children: "🔒" }),
            "Account Security"
          ] }),
          /* @__PURE__ */ jsx("div", { className: "space-y-4", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between p-4 border-2 border-gray-200 rounded-lg hover:border-blue-400 transition", children: [
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("h3", { className: "font-semibold text-gray-900", children: "Password" }),
              /* @__PURE__ */ jsx("p", { className: "text-sm text-gray-600", children: "Change your password" })
            ] }),
            /* @__PURE__ */ jsx("button", { className: "px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition", children: "Change Password" })
          ] }) })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "space-y-6", children: [
        activityStats && /* @__PURE__ */ jsxs(Fragment, { children: [
          /* @__PURE__ */ jsxs("div", { className: "bg-white rounded-lg shadow-lg p-6", children: [
            /* @__PURE__ */ jsxs("h2", { className: "text-xl font-bold text-gray-900 mb-4 flex items-center", children: [
              /* @__PURE__ */ jsx("span", { className: "text-2xl mr-2", children: "📊" }),
              "Activity Overview"
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "space-y-3", children: [
              /* @__PURE__ */ jsx(StatItem, { icon: "📖", label: "Religious Activities", count: activityStats.totalReligious, color: "bg-green-100 text-green-800" }),
              /* @__PURE__ */ jsx(StatItem, { icon: "💪", label: "Physical Training", count: activityStats.totalPhysicalTraining, color: "bg-orange-100 text-orange-800" }),
              /* @__PURE__ */ jsx(StatItem, { icon: "📅", label: "Events Assigned", count: activityStats.totalEvents, color: "bg-blue-100 text-blue-800" })
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg shadow-lg p-6 text-white", children: [
            /* @__PURE__ */ jsxs("h2", { className: "text-xl font-bold mb-4 flex items-center", children: [
              /* @__PURE__ */ jsx("span", { className: "text-2xl mr-2", children: "📅" }),
              "This Month"
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "space-y-3", children: [
              /* @__PURE__ */ jsxs("div", { className: "flex justify-between items-center py-2 border-b border-white/20", children: [
                /* @__PURE__ */ jsx("span", { className: "text-blue-100", children: "Religious Activities" }),
                /* @__PURE__ */ jsx("span", { className: "text-2xl font-bold", children: activityStats.monthlyReligious })
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "flex justify-between items-center py-2 border-b border-white/20", children: [
                /* @__PURE__ */ jsx("span", { className: "text-blue-100", children: "PT Sessions" }),
                /* @__PURE__ */ jsx("span", { className: "text-2xl font-bold", children: activityStats.monthlyPhysicalTraining })
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "flex justify-between items-center py-2", children: [
                /* @__PURE__ */ jsx("span", { className: "text-blue-100", children: "Total Activities" }),
                /* @__PURE__ */ jsx("span", { className: "text-2xl font-bold", children: activityStats.monthlyReligious + activityStats.monthlyPhysicalTraining })
              ] })
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "bg-white rounded-lg shadow-lg p-6", children: [
          /* @__PURE__ */ jsxs("h2", { className: "text-xl font-bold text-gray-900 mb-4 flex items-center", children: [
            /* @__PURE__ */ jsx("span", { className: "text-2xl mr-2", children: "⚡" }),
            "Quick Actions"
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
            /* @__PURE__ */ jsx(QuickActionButton, { to: "/schedule", label: "View Schedule", icon: "📅" }),
            /* @__PURE__ */ jsx(QuickActionButton, { to: "/physical-training", label: "PT Sessions", icon: "💪" }),
            /* @__PURE__ */ jsx(QuickActionButton, { to: "/religious-activity", label: "Religious Activities", icon: "📖" }),
            (profile.role === "ADMIN" || profile.role === "COORDINATOR") && /* @__PURE__ */ jsx(QuickActionButton, { to: "/trainer-overview", label: "Trainer Overview", icon: "👨‍🏫" }),
            /* @__PURE__ */ jsx(QuickActionButton, { to: "/logout", label: "Logout", icon: "🚪", color: "text-red-600" })
          ] })
        ] })
      ] })
    ] })
  ] });
}
function InfoField({
  label,
  value
}) {
  return /* @__PURE__ */ jsxs("div", { children: [
    /* @__PURE__ */ jsx("label", { className: "block text-sm font-semibold text-gray-600 mb-1", children: label }),
    /* @__PURE__ */ jsx("p", { className: "text-base font-medium text-gray-900 bg-gray-50 px-4 py-2 rounded-lg border border-gray-200", children: value })
  ] });
}
function StatItem({
  icon,
  label,
  count,
  color
}) {
  return /* @__PURE__ */ jsxs("div", { className: `flex items-center justify-between p-3 rounded-lg ${color}`, children: [
    /* @__PURE__ */ jsxs("div", { className: "flex items-center space-x-2", children: [
      /* @__PURE__ */ jsx("span", { className: "text-xl", children: icon }),
      /* @__PURE__ */ jsx("span", { className: "font-semibold", children: label })
    ] }),
    /* @__PURE__ */ jsx("span", { className: "text-2xl font-bold", children: count })
  ] });
}
function QuickActionButton({
  to,
  label,
  icon,
  color = "text-gray-700"
}) {
  return /* @__PURE__ */ jsxs(Link, { to, className: `flex items-center space-x-3 p-3 rounded-lg border-2 border-gray-200 hover:border-blue-400 hover:bg-blue-50 transition ${color}`, children: [
    /* @__PURE__ */ jsx("span", { className: "text-xl", children: icon }),
    /* @__PURE__ */ jsx("span", { className: "font-semibold", children: label })
  ] });
}
export {
  getUserProfile_createServerFn_handler
};
