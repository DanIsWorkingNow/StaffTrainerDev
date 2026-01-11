import { jsx, jsxs, Fragment } from "react/jsx-runtime";
import { a as createServerRpc, c as createServerFn } from "../server.js";
import { createRootRoute, Outlet, HeadContent, Link, Scripts } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
import * as React from "react";
import { a as appCss, s as seo, N as NotFound, D as DefaultCatchBoundary } from "./seo-DlwJpbcL.js";
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
const Route = createRootRoute({
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
  } = Route.useRouteContext();
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
export {
  fetchUser_createServerFn_handler
};
