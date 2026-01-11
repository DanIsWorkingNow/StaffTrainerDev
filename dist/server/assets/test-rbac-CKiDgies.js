import { jsx, jsxs } from "react/jsx-runtime";
import { u as useCurrentUserRole, a as useIsAdmin } from "./useRBAC-B7UEJAKJ.js";
import { a as Route } from "./router-B338aohD.js";
import "react";
import "./rbac-C9pGKYGe.js";
import "../server.js";
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
import "./supabase-CLvfjSRp.js";
import "@supabase/ssr";
import "@tanstack/react-router-devtools";
import "./seo-DlwJpbcL.js";
import "redaxios";
function TestRBACPage() {
  const loaderData = Route.useLoaderData();
  const {
    data: userData,
    isLoading
  } = useCurrentUserRole();
  const isAdmin = useIsAdmin();
  if (isLoading) {
    return /* @__PURE__ */ jsx("div", { className: "p-6", children: "Loading..." });
  }
  return /* @__PURE__ */ jsxs("div", { className: "p-6 max-w-4xl mx-auto", children: [
    /* @__PURE__ */ jsx("h1", { className: "text-3xl font-bold mb-6", children: "RBAC Test Page" }),
    /* @__PURE__ */ jsxs("div", { className: "bg-green-50 border border-green-200 rounded-lg p-4 mb-4", children: [
      /* @__PURE__ */ jsx("h2", { className: "font-bold mb-2", children: "✅ Server Function Test:" }),
      /* @__PURE__ */ jsx("pre", { className: "text-sm bg-white p-3 rounded overflow-auto", children: JSON.stringify(loaderData, null, 2) })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4", children: [
      /* @__PURE__ */ jsx("h2", { className: "font-bold mb-2", children: "✅ Client Hook Test:" }),
      userData && /* @__PURE__ */ jsxs("div", { className: "space-y-2 text-sm", children: [
        /* @__PURE__ */ jsxs("p", { children: [
          /* @__PURE__ */ jsx("strong", { children: "Name:" }),
          " ",
          userData.name
        ] }),
        /* @__PURE__ */ jsxs("p", { children: [
          /* @__PURE__ */ jsx("strong", { children: "Role:" }),
          " ",
          userData.role
        ] }),
        /* @__PURE__ */ jsxs("p", { children: [
          /* @__PURE__ */ jsx("strong", { children: "Level:" }),
          " ",
          userData.roleLevel
        ] }),
        /* @__PURE__ */ jsxs("p", { children: [
          /* @__PURE__ */ jsx("strong", { children: "Is Admin:" }),
          " ",
          isAdmin ? "Yes" : "No"
        ] }),
        /* @__PURE__ */ jsxs("p", { children: [
          /* @__PURE__ */ jsx("strong", { children: "Permissions:" }),
          " ",
          userData.permissions.length
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "bg-white border rounded-lg p-4", children: [
      /* @__PURE__ */ jsx("h2", { className: "font-bold mb-2", children: "Permissions:" }),
      /* @__PURE__ */ jsx("div", { className: "grid grid-cols-2 gap-2 text-sm", children: userData?.permissions.map((p, i) => /* @__PURE__ */ jsxs("div", { className: "bg-gray-50 p-2 rounded", children: [
        p.resource,
        ": ",
        p.action
      ] }, i)) })
    ] })
  ] });
}
export {
  TestRBACPage as component
};
