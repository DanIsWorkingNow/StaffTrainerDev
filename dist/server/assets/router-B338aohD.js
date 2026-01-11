import { createRootRoute, Outlet, HeadContent, Link, Scripts, createFileRoute, lazyRouteComponent, redirect, notFound, ErrorComponent, createRouter } from "@tanstack/react-router";
import { jsx, jsxs, Fragment } from "react/jsx-runtime";
import { c as createServerFn, a as createServerRpc } from "../server.js";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
import * as React from "react";
import { a as appCss, s as seo, N as NotFound, D as DefaultCatchBoundary } from "./seo-DlwJpbcL.js";
import { g as getSupabaseServerClient } from "./supabase-CLvfjSRp.js";
import { g as getCurrentUserRole } from "./rbac-C9pGKYGe.js";
import axios from "redaxios";
const fetchUser_createServerFn_handler = createServerRpc("1f41845ac3b65a581f73e88792eadc03859ad057285ba3f3d7dbd968fe09c1e3", (opts, signal) => {
  return fetchUser.__executeServer(opts, signal);
});
const fetchUser = createServerFn({
  method: "GET"
}).handler(fetchUser_createServerFn_handler, async () => {
  const supabase = getSupabaseServerClient();
  const {
    data: {
      user
    },
    error: _error
  } = await supabase.auth.getUser();
  if (!user?.email) {
    return null;
  }
  const {
    data: userData
  } = await supabase.from("users").select("id, email, name, role, rank, region, status").eq("email", user.email).single();
  if (userData) {
    return userData;
  }
  return {
    id: user.id,
    email: user.email
  };
});
const Route$i = createRootRoute({
  beforeLoad: async () => {
    const user = await fetchUser();
    return {
      user
    };
  },
  head: () => ({
    meta: [{
      charSet: "utf-8"
    }, {
      name: "viewport",
      content: "width=device-width, initial-scale=1"
    }, ...seo({
      title: "ABPM Trainer System - Manage Training Activities",
      description: "ABPM Trainer Management System for tracking schedules, events, dormitory, and activities"
    })],
    links: [{
      rel: "stylesheet",
      href: appCss
    }, {
      rel: "apple-touch-icon",
      sizes: "180x180",
      href: "/apple-touch-icon.png"
    }, {
      rel: "icon",
      type: "image/png",
      sizes: "32x32",
      href: "/favicon-32x32.png"
    }, {
      rel: "icon",
      type: "image/png",
      sizes: "16x16",
      href: "/favicon-16x16.png"
    }, {
      rel: "manifest",
      href: "/site.webmanifest",
      color: "#fffff"
    }, {
      rel: "icon",
      href: "/favicon.ico"
    }]
  }),
  errorComponent: (props) => {
    return /* @__PURE__ */ jsx(RootDocument, { children: /* @__PURE__ */ jsx(DefaultCatchBoundary, { ...props }) });
  },
  notFoundComponent: () => /* @__PURE__ */ jsx(NotFound, {}),
  component: RootComponent
});
function RootComponent() {
  return /* @__PURE__ */ jsx(RootDocument, { children: /* @__PURE__ */ jsx(Outlet, {}) });
}
function RootDocument({
  children
}) {
  const {
    user
  } = Route$i.useRouteContext();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);
  return /* @__PURE__ */ jsxs("html", { children: [
    /* @__PURE__ */ jsx("head", { children: /* @__PURE__ */ jsx(HeadContent, {}) }),
    /* @__PURE__ */ jsxs("body", { className: "bg-gray-50", children: [
      /* @__PURE__ */ jsx("nav", { className: "bg-gradient-to-r from-orange-600 to-red-700 text-white shadow-lg", children: /* @__PURE__ */ jsxs("div", { className: "max-w-7xl mx-auto px-4", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex justify-between items-center h-16", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-center space-x-3", children: [
            /* @__PURE__ */ jsx("span", { className: "text-2xl", children: "🔥" }),
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("h1", { className: "text-xl font-bold", children: "ABPM Trainer System" }),
              /* @__PURE__ */ jsx("p", { className: "text-xs text-orange-100", children: "Akademi Bomba dan Penyelamat Malaysia" })
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "hidden md:flex items-center space-x-1", children: [
            /* @__PURE__ */ jsx(NavLink, { to: "/", label: "Home", icon: "🏠" }),
            /* @__PURE__ */ jsx(NavLink, { to: "/schedule", label: "Schedule", icon: "📅" }),
            /* @__PURE__ */ jsx(NavLink, { to: "/events", label: "Events", icon: "📋" }),
            user?.role !== "TRAINER" && /* @__PURE__ */ jsx(Fragment, { children: /* @__PURE__ */ jsx(NavLink, { to: "/dormitory", label: "Dormitory", icon: "🏢" }) }),
            /* @__PURE__ */ jsx(NavLink, { to: "/physical-training", label: "PT", icon: "💪" }),
            /* @__PURE__ */ jsx(NavLink, { to: "/religious-activity", label: "Religious", icon: "📖" }),
            user?.role !== "TRAINER" && /* @__PURE__ */ jsx(Fragment, { children: /* @__PURE__ */ jsx(NavLink, { to: "/trainer-overview", label: "Overview", icon: "👥" }) })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "flex items-center space-x-4", children: [
            user ? /* @__PURE__ */ jsx(Fragment, { children: /* @__PURE__ */ jsxs("div", { className: "relative group", children: [
              /* @__PURE__ */ jsxs("button", { className: "flex items-center space-x-2 hover:bg-red-800 px-3 py-2 rounded-lg transition", children: [
                /* @__PURE__ */ jsx("div", { className: "w-8 h-8 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center border-2 border-white/30", children: /* @__PURE__ */ jsx("span", { className: "text-sm font-bold text-white", children: user.email?.charAt(0).toUpperCase() }) }),
                /* @__PURE__ */ jsx("span", { className: "hidden sm:inline text-sm font-medium", children: user.email }),
                /* @__PURE__ */ jsx("svg", { className: "w-4 h-4", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M19 9l-7 7-7-7" }) })
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-xl border border-gray-200 py-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50", children: [
                /* @__PURE__ */ jsxs("div", { className: "px-4 py-3 border-b border-gray-200", children: [
                  /* @__PURE__ */ jsx("p", { className: "text-sm font-semibold text-gray-900 truncate", children: user.email }),
                  /* @__PURE__ */ jsx("p", { className: "text-xs text-gray-500 mt-1", children: "Signed in" })
                ] }),
                /* @__PURE__ */ jsxs(Link, { to: "/profile", className: "flex items-center space-x-3 px-4 py-3 hover:bg-gray-100 transition text-gray-700", children: [
                  /* @__PURE__ */ jsx("span", { className: "text-xl", children: "👤" }),
                  /* @__PURE__ */ jsx("span", { className: "font-medium", children: "My Profile" })
                ] }),
                /* @__PURE__ */ jsx("div", { className: "border-t border-gray-200 my-2" }),
                /* @__PURE__ */ jsxs(Link, { to: "/logout", className: "flex items-center space-x-3 px-4 py-3 hover:bg-red-50 transition text-red-600", children: [
                  /* @__PURE__ */ jsx("span", { className: "text-xl", children: "🚪" }),
                  /* @__PURE__ */ jsx("span", { className: "font-medium", children: "Logout" })
                ] })
              ] })
            ] }) }) : /* @__PURE__ */ jsx(Link, { to: "/login", className: "bg-green-600 hover:bg-green-700 px-3 py-1.5 rounded text-sm", children: "Login" }),
            /* @__PURE__ */ jsx("button", { className: "md:hidden p-2", onClick: () => setIsMobileMenuOpen(!isMobileMenuOpen), children: /* @__PURE__ */ jsx("svg", { className: "w-6 h-6", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M4 6h16M4 12h16M4 18h16" }) }) })
          ] })
        ] }),
        isMobileMenuOpen && /* @__PURE__ */ jsx("div", { className: "md:hidden py-4 border-t border-red-800", children: /* @__PURE__ */ jsxs("div", { className: "flex flex-col space-y-2", children: [
          user && /* @__PURE__ */ jsxs(Fragment, { children: [
            /* @__PURE__ */ jsx("div", { className: "border-b border-red-800 pb-3 mb-3", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center space-x-3 px-4 py-2", children: [
              /* @__PURE__ */ jsx("div", { className: "w-10 h-10 bg-white/20 rounded-full flex items-center justify-center border-2 border-white/30", children: /* @__PURE__ */ jsx("span", { className: "text-white font-bold", children: user.email?.charAt(0).toUpperCase() }) }),
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx("p", { className: "font-semibold text-white text-sm", children: user.email }),
                /* @__PURE__ */ jsx("p", { className: "text-xs text-orange-200", children: "Signed in" })
              ] })
            ] }) }),
            /* @__PURE__ */ jsx(MobileNavLink, { to: "/profile", label: "My Profile", icon: "👤", onClick: () => setIsMobileMenuOpen(false) })
          ] }),
          /* @__PURE__ */ jsx(MobileNavLink, { to: "/", label: "Home", icon: "🏠", onClick: () => setIsMobileMenuOpen(false) }),
          /* @__PURE__ */ jsx(MobileNavLink, { to: "/schedule", label: "Schedule", icon: "📅", onClick: () => setIsMobileMenuOpen(false) }),
          /* @__PURE__ */ jsx(MobileNavLink, { to: "/events", label: "Events", icon: "📋", onClick: () => setIsMobileMenuOpen(false) }),
          user?.role !== "TRAINER" && /* @__PURE__ */ jsx(MobileNavLink, { to: "/dormitory", label: "Dormitory", icon: "🏢", onClick: () => setIsMobileMenuOpen(false) }),
          /* @__PURE__ */ jsx(MobileNavLink, { to: "/physical-training", label: "Physical Training", icon: "💪", onClick: () => setIsMobileMenuOpen(false) }),
          /* @__PURE__ */ jsx(MobileNavLink, { to: "/religious-activity", label: "Religious Activity", icon: "📖", onClick: () => setIsMobileMenuOpen(false) }),
          user?.role !== "TRAINER" && /* @__PURE__ */ jsx(MobileNavLink, { to: "/trainer-overview", label: "Trainer Overview", icon: "👥", onClick: () => setIsMobileMenuOpen(false) })
        ] }) })
      ] }) }),
      /* @__PURE__ */ jsx("main", { className: "max-w-7xl mx-auto px-4 py-6", children }),
      /* @__PURE__ */ jsx(TanStackRouterDevtools, { position: "bottom-right" }),
      /* @__PURE__ */ jsx(Scripts, {})
    ] })
  ] });
}
function NavLink({
  to,
  label,
  icon
}) {
  return /* @__PURE__ */ jsxs(Link, { to, activeProps: {
    className: "bg-red-800 text-white"
  }, activeOptions: {
    exact: to === "/"
  }, className: "px-3 py-2 rounded hover:bg-red-800 transition flex items-center space-x-2 text-sm", children: [
    /* @__PURE__ */ jsx("span", { children: icon }),
    /* @__PURE__ */ jsx("span", { children: label })
  ] });
}
function MobileNavLink({
  to,
  label,
  icon,
  onClick
}) {
  return /* @__PURE__ */ jsxs(Link, { to, activeProps: {
    className: "bg-red-900 text-white"
  }, activeOptions: {
    exact: to === "/"
  }, className: "px-4 py-3 rounded hover:bg-red-800 transition flex items-center space-x-3", onClick, children: [
    /* @__PURE__ */ jsx("span", { className: "text-xl", children: icon }),
    /* @__PURE__ */ jsx("span", { children: label })
  ] });
}
const $$splitComponentImporter$f = () => import("./signup-B7B4yUWN.js");
const signupFn_createServerFn_handler = createServerRpc("391e4fddd1127ccfb7d0d44594936a2e78a25b0239ffeab18aa9ec261f329199", (opts, signal) => {
  return signupFn.__executeServer(opts, signal);
});
const signupFn = createServerFn({
  method: "POST"
}).inputValidator((d) => d).handler(signupFn_createServerFn_handler, async ({
  data
}) => {
  const supabase = getSupabaseServerClient();
  const {
    error
  } = await supabase.auth.signUp({
    email: data.email,
    password: data.password
  });
  if (error) {
    return {
      error: true,
      message: error.message
    };
  }
  throw redirect({
    href: data.redirectUrl || "/"
  });
});
const Route$h = createFileRoute("/signup")({
  component: lazyRouteComponent($$splitComponentImporter$f, "component")
});
const logoutFn_createServerFn_handler = createServerRpc("566828ec21d0ccdce1df662ede59410e979248719d530394b6aca7f837fe7339", (opts, signal) => {
  return logoutFn.__executeServer(opts, signal);
});
const logoutFn = createServerFn().handler(logoutFn_createServerFn_handler, async () => {
  const supabase = getSupabaseServerClient();
  const {
    error
  } = await supabase.auth.signOut();
  if (error) {
    return {
      error: true,
      message: error.message
    };
  }
  throw redirect({
    href: "/"
  });
});
const Route$g = createFileRoute("/logout")({
  preload: false,
  loader: () => logoutFn()
});
const $$splitComponentImporter$e = () => import("./login-BwucnJfl.js");
const Route$f = createFileRoute("/login")({
  component: lazyRouteComponent($$splitComponentImporter$e, "component")
});
const $$splitErrorComponentImporter = () => import("./_authed-PnW93bpP.js");
const loginFn_createServerFn_handler = createServerRpc("c734b57656130e92f97e5895851097dba28c0c97bd955c5a94d61db533974b39", (opts, signal) => {
  return loginFn.__executeServer(opts, signal);
});
const loginFn = createServerFn({
  method: "POST"
}).inputValidator((d) => d).handler(loginFn_createServerFn_handler, async ({
  data
}) => {
  const supabase = getSupabaseServerClient();
  const {
    error
  } = await supabase.auth.signInWithPassword({
    email: data.email,
    password: data.password
  });
  if (error) {
    return {
      error: true,
      message: error.message
    };
  }
});
const Route$e = createFileRoute("/_authed")({
  beforeLoad: ({
    context
  }) => {
    if (!context.user) {
      throw new Error("Not authenticated");
    }
  },
  errorComponent: lazyRouteComponent($$splitErrorComponentImporter, "errorComponent")
});
const $$splitComponentImporter$d = () => import("./index-B5jIbbcI.js");
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
const Route$d = createFileRoute("/_authed/")({
  // Changed from '/' to '/_authed/'
  loader: async () => await getDashboardData(),
  component: lazyRouteComponent($$splitComponentImporter$d, "component")
});
const $$splitComponentImporter$c = () => import("./test-rbac-CKiDgies.js");
const testRBAC_createServerFn_handler = createServerRpc("5f48e44171901dc1a671475ef6da1e8b928f7270bc4205e3b18c506dde207d3e", (opts, signal) => {
  return testRBAC.__executeServer(opts, signal);
});
const testRBAC = createServerFn({
  method: "GET"
}).handler(testRBAC_createServerFn_handler, async () => {
  const userData = await getCurrentUserRole();
  if (!userData) {
    return {
      error: "Not authenticated"
    };
  }
  return {
    success: true,
    user: userData
  };
});
const Route$c = createFileRoute("/_authed/test-rbac")({
  loader: async () => await testRBAC(),
  component: lazyRouteComponent($$splitComponentImporter$c, "component")
});
const fetchPost_createServerFn_handler = createServerRpc("fcc606bc6a4391068ed708ee59e18e7e8c5685d0fa5f2f3f35a0d234c04f679f", (opts, signal) => {
  return fetchPost.__executeServer(opts, signal);
});
const fetchPost = createServerFn({
  method: "GET"
}).inputValidator((d) => d).handler(fetchPost_createServerFn_handler, async ({
  data: postId
}) => {
  console.info(`Fetching post with id ${postId}...`);
  const post = await axios.get(`https://jsonplaceholder.typicode.com/posts/${postId}`).then((r) => r.data).catch((err) => {
    console.error(err);
    if (err.status === 404) {
      throw notFound();
    }
    throw err;
  });
  return post;
});
const fetchPosts_createServerFn_handler = createServerRpc("9d2d75863ee5cc1769ed0162f4537aed3a4f16255a893cf6e946a857810a32df", (opts, signal) => {
  return fetchPosts.__executeServer(opts, signal);
});
const fetchPosts = createServerFn({
  method: "GET"
}).handler(fetchPosts_createServerFn_handler, async () => {
  console.info("Fetching posts...");
  await new Promise((r) => setTimeout(r, 1e3));
  return axios.get("https://jsonplaceholder.typicode.com/posts").then((r) => r.data.slice(0, 10));
});
const $$splitComponentImporter$b = () => import("./posts-CDzVPohZ.js");
const Route$b = createFileRoute("/_authed/posts")({
  loader: () => fetchPosts(),
  component: lazyRouteComponent($$splitComponentImporter$b, "component")
});
const $$splitComponentImporter$a = () => import("./index-BKHB7mPr.js");
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
const Route$a = createFileRoute("/_authed/trainer-overview/")({
  beforeLoad: ({
    context
  }) => {
    if (context.user?.role === "TRAINER") {
      throw new Error("Unauthorized Access: Trainers cannot access overview");
    }
  },
  loader: async () => {
    const now = /* @__PURE__ */ new Date();
    return await getTrainerOverviewData({
      data: {
        month: now.getMonth(),
        year: now.getFullYear()
      }
    });
  },
  component: lazyRouteComponent($$splitComponentImporter$a, "component")
});
const $$splitComponentImporter$9 = () => import("./index-Cz4dd9bF.js");
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
const Route$9 = createFileRoute("/_authed/schedule/")({
  loader: async () => await getScheduleData(),
  component: lazyRouteComponent($$splitComponentImporter$9, "component")
});
const $$splitComponentImporter$8 = () => import("./index-DejoLBsH.js");
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
const Route$8 = createFileRoute("/_authed/religious-activity/")({
  loader: async () => await getReligiousActivityData(),
  component: lazyRouteComponent($$splitComponentImporter$8, "component")
});
const $$splitComponentImporter$7 = () => import("./index-PgoO1kzB.js");
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
const Route$7 = createFileRoute("/_authed/profile/")({
  loader: async () => await getUserProfile(),
  component: lazyRouteComponent($$splitComponentImporter$7, "component")
});
const $$splitComponentImporter$6 = () => import("./posts.index-DU8oxB5n.js");
const Route$6 = createFileRoute("/_authed/posts/")({
  component: lazyRouteComponent($$splitComponentImporter$6, "component")
});
const $$splitComponentImporter$5 = () => import("./index-DxeaVUU4.js");
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
const Route$5 = createFileRoute("/_authed/physical-training/")({
  loader: async () => await getPhysicalTrainingData(),
  component: lazyRouteComponent($$splitComponentImporter$5, "component")
});
const $$splitComponentImporter$4 = () => import("./index-_MElpB-4.js");
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
const Route$4 = createFileRoute("/_authed/events/")({
  loader: async () => await getEventsWithTrainers(),
  component: lazyRouteComponent($$splitComponentImporter$4, "component")
});
const $$splitComponentImporter$3 = () => import("./index-Dx0ptizJ.js");
const getDormitoryData_createServerFn_handler = createServerRpc("754ca0bb9d6ecd2e92bdc9a08d5639f17766df4e6e6b7aa312a9513993a8b671", (opts, signal) => {
  return getDormitoryData.__executeServer(opts, signal);
});
const getDormitoryData = createServerFn({
  method: "GET"
}).handler(getDormitoryData_createServerFn_handler, async () => {
  const supabase = getSupabaseServerClient();
  const {
    data: assignments
  } = await supabase.from("dormitory_assignments").select(`
      *,
      trainer:trainers(id, name, rank)
    `).order("room_id", {
    ascending: true
  });
  const {
    data: trainers
  } = await supabase.from("trainers").select("*").eq("status", "active");
  const buildings = generateAllBuildings();
  const totalRooms = buildings.reduce((sum, building) => sum + building.floors.reduce((floorSum, floor) => floorSum + floor.rooms.length, 0), 0);
  const totalCapacity = buildings.reduce((sum, building) => sum + building.floors.reduce((floorSum, floor) => floorSum + floor.rooms.reduce((roomSum, room) => roomSum + room.capacity, 0), 0), 0);
  const occupiedRooms = new Set(assignments?.map((a) => a.room_id)).size;
  const currentOccupancy = assignments?.length || 0;
  return {
    assignments: assignments || [],
    trainers: trainers || [],
    stats: {
      totalRooms,
      occupiedRooms,
      availableRooms: totalRooms - occupiedRooms,
      totalCapacity,
      currentOccupancy,
      occupancyRate: Math.round(currentOccupancy / totalCapacity * 100)
    }
  };
});
const Route$3 = createFileRoute("/_authed/dormitory/")({
  beforeLoad: ({
    context
  }) => {
    if (context.user?.role === "TRAINER") {
      throw new Error("Unauthorized Access: Trainers cannot access dormitory management");
    }
  },
  loader: async () => await getDormitoryData(),
  component: lazyRouteComponent($$splitComponentImporter$3, "component")
});
function generateAllBuildings() {
  const buildings = [];
  const buildingColors = {
    "ANGGERIK": "bg-purple-100 border-purple-300",
    "BOUGANVILLA": "bg-pink-100 border-pink-300",
    "RAFLESIA": "bg-red-100 border-red-300",
    "SEROJA": "bg-yellow-100 border-yellow-300",
    "LESTARI_4": "bg-green-100 border-green-300",
    "LESTARI_5": "bg-teal-100 border-teal-300",
    "LESTARI_6": "bg-cyan-100 border-cyan-300"
  };
  const standardDorms = ["ANGGERIK", "BOUGANVILLA", "RAFLESIA"];
  standardDorms.forEach((dormName) => {
    const floors = [];
    const groundFloorRooms = [];
    for (let i = 1; i <= 8; i++) {
      groundFloorRooms.push({
        id: `${dormName}-G-${i}`,
        roomNumber: i,
        capacity: 2,
        building: dormName,
        floor: 0,
        type: "standard"
      });
    }
    floors.push({
      floorNumber: 0,
      floorName: "Ground Floor",
      rooms: groundFloorRooms
    });
    for (let floor = 1; floor <= 3; floor++) {
      const floorRooms = [];
      for (let i = 1; i <= 24; i++) {
        floorRooms.push({
          id: `${dormName}-F${floor}-${i}`,
          roomNumber: i,
          capacity: 2,
          building: dormName,
          floor,
          type: "standard"
        });
      }
      floors.push({
        floorNumber: floor,
        floorName: `Floor ${floor}`,
        rooms: floorRooms
      });
    }
    buildings.push({
      name: dormName,
      type: "standard",
      displayName: dormName,
      color: buildingColors[dormName],
      floors
    });
  });
  const serojaFloors = [];
  const serojaGroundRooms = [];
  for (let i = 1; i <= 8; i++) {
    serojaGroundRooms.push({
      id: `SEROJA-G-${i}`,
      roomNumber: i,
      capacity: 2,
      building: "SEROJA",
      floor: 0,
      type: "standard"
    });
  }
  serojaFloors.push({
    floorNumber: 0,
    floorName: "Ground Floor",
    rooms: serojaGroundRooms
  });
  const serojaVIPRooms = [];
  for (let i = 1; i <= 24; i++) {
    serojaVIPRooms.push({
      id: `SEROJA-F1-${i}`,
      roomNumber: i,
      capacity: 1,
      // VIP - 1 person only
      building: "SEROJA",
      floor: 1,
      type: "vip"
    });
  }
  serojaFloors.push({
    floorNumber: 1,
    floorName: "Floor 1 (VIP)",
    rooms: serojaVIPRooms
  });
  for (let floor = 2; floor <= 3; floor++) {
    const floorRooms = [];
    for (let i = 1; i <= 24; i++) {
      floorRooms.push({
        id: `SEROJA-F${floor}-${i}`,
        roomNumber: i,
        capacity: 2,
        building: "SEROJA",
        floor,
        type: "standard"
      });
    }
    serojaFloors.push({
      floorNumber: floor,
      floorName: `Floor ${floor}`,
      rooms: floorRooms
    });
  }
  buildings.push({
    name: "SEROJA",
    type: "vip",
    displayName: "SEROJA (VIP)",
    color: buildingColors["SEROJA"],
    floors: serojaFloors
  });
  const lestariBuildings = ["LESTARI_4", "LESTARI_5", "LESTARI_6"];
  lestariBuildings.forEach((lestariName, index) => {
    const floors = [];
    const houses = [];
    for (let i = 1; i <= 15; i++) {
      houses.push({
        id: `${lestariName}-H${i}`,
        roomNumber: i,
        capacity: 8,
        building: lestariName,
        floor: 0,
        // Quarters are single-story houses
        type: "quarters"
      });
    }
    floors.push({
      floorNumber: 0,
      floorName: "Houses",
      rooms: houses
    });
    buildings.push({
      name: lestariName,
      type: "quarters",
      displayName: `LESTARI ${index + 4}`,
      color: buildingColors[lestariName],
      floors
    });
  });
  return buildings;
}
const $$splitNotFoundComponentImporter = () => import("./posts._postId-BdmXwgCg.js");
const $$splitComponentImporter$2 = () => import("./posts._postId-DJ8GAx0G.js");
const Route$2 = createFileRoute("/_authed/posts/$postId")({
  loader: ({
    params: {
      postId
    }
  }) => fetchPost({
    data: postId
  }),
  errorComponent: PostErrorComponent,
  component: lazyRouteComponent($$splitComponentImporter$2, "component"),
  notFoundComponent: lazyRouteComponent($$splitNotFoundComponentImporter, "notFoundComponent")
});
function PostErrorComponent({
  error
}) {
  return /* @__PURE__ */ jsx(ErrorComponent, { error });
}
const $$splitComponentImporter$1 = () => import("./create-BJgPM7no.js");
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
const Route$1 = createFileRoute("/_authed/events/create")({
  loader: async () => await getTrainers(),
  component: lazyRouteComponent($$splitComponentImporter$1, "component")
});
const $$splitComponentImporter = () => import("./_id-BCUA6vti.js");
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
  component: lazyRouteComponent($$splitComponentImporter, "component")
});
const SignupRoute = Route$h.update({
  id: "/signup",
  path: "/signup",
  getParentRoute: () => Route$i
});
const LogoutRoute = Route$g.update({
  id: "/logout",
  path: "/logout",
  getParentRoute: () => Route$i
});
const LoginRoute = Route$f.update({
  id: "/login",
  path: "/login",
  getParentRoute: () => Route$i
});
const AuthedRoute = Route$e.update({
  id: "/_authed",
  getParentRoute: () => Route$i
});
const AuthedIndexRoute = Route$d.update({
  id: "/",
  path: "/",
  getParentRoute: () => AuthedRoute
});
const AuthedTestRbacRoute = Route$c.update({
  id: "/test-rbac",
  path: "/test-rbac",
  getParentRoute: () => AuthedRoute
});
const AuthedPostsRoute = Route$b.update({
  id: "/posts",
  path: "/posts",
  getParentRoute: () => AuthedRoute
});
const AuthedTrainerOverviewIndexRoute = Route$a.update({
  id: "/trainer-overview/",
  path: "/trainer-overview/",
  getParentRoute: () => AuthedRoute
});
const AuthedScheduleIndexRoute = Route$9.update({
  id: "/schedule/",
  path: "/schedule/",
  getParentRoute: () => AuthedRoute
});
const AuthedReligiousActivityIndexRoute = Route$8.update({
  id: "/religious-activity/",
  path: "/religious-activity/",
  getParentRoute: () => AuthedRoute
});
const AuthedProfileIndexRoute = Route$7.update({
  id: "/profile/",
  path: "/profile/",
  getParentRoute: () => AuthedRoute
});
const AuthedPostsIndexRoute = Route$6.update({
  id: "/",
  path: "/",
  getParentRoute: () => AuthedPostsRoute
});
const AuthedPhysicalTrainingIndexRoute = Route$5.update({
  id: "/physical-training/",
  path: "/physical-training/",
  getParentRoute: () => AuthedRoute
});
const AuthedEventsIndexRoute = Route$4.update({
  id: "/events/",
  path: "/events/",
  getParentRoute: () => AuthedRoute
});
const AuthedDormitoryIndexRoute = Route$3.update({
  id: "/dormitory/",
  path: "/dormitory/",
  getParentRoute: () => AuthedRoute
});
const AuthedPostsPostIdRoute = Route$2.update({
  id: "/$postId",
  path: "/$postId",
  getParentRoute: () => AuthedPostsRoute
});
const AuthedEventsCreateRoute = Route$1.update({
  id: "/events/create",
  path: "/events/create",
  getParentRoute: () => AuthedRoute
});
const AuthedEventsIdRoute = Route.update({
  id: "/events/$id",
  path: "/events/$id",
  getParentRoute: () => AuthedRoute
});
const AuthedPostsRouteChildren = {
  AuthedPostsPostIdRoute,
  AuthedPostsIndexRoute
};
const AuthedPostsRouteWithChildren = AuthedPostsRoute._addFileChildren(
  AuthedPostsRouteChildren
);
const AuthedRouteChildren = {
  AuthedPostsRoute: AuthedPostsRouteWithChildren,
  AuthedTestRbacRoute,
  AuthedIndexRoute,
  AuthedEventsIdRoute,
  AuthedEventsCreateRoute,
  AuthedDormitoryIndexRoute,
  AuthedEventsIndexRoute,
  AuthedPhysicalTrainingIndexRoute,
  AuthedProfileIndexRoute,
  AuthedReligiousActivityIndexRoute,
  AuthedScheduleIndexRoute,
  AuthedTrainerOverviewIndexRoute
};
const AuthedRouteWithChildren = AuthedRoute._addFileChildren(AuthedRouteChildren);
const rootRouteChildren = {
  AuthedRoute: AuthedRouteWithChildren,
  LoginRoute,
  LogoutRoute,
  SignupRoute
};
const routeTree = Route$i._addFileChildren(rootRouteChildren)._addFileTypes();
function getRouter() {
  const router2 = createRouter({
    routeTree,
    scrollRestoration: true
  });
  return router2;
}
const router = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  getRouter
}, Symbol.toStringTag, { value: "Module" }));
export {
  Route$d as R,
  Route$c as a,
  Route$b as b,
  Route$a as c,
  Route$9 as d,
  Route$8 as e,
  Route$7 as f,
  Route$5 as g,
  Route$4 as h,
  Route$3 as i,
  Route$2 as j,
  Route$1 as k,
  loginFn as l,
  Route as m,
  router as r,
  signupFn as s
};
