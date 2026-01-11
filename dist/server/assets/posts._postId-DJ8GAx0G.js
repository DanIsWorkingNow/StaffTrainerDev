import { jsxs, jsx } from "react/jsx-runtime";
import { j as Route } from "./router-B338aohD.js";
import "@tanstack/react-router";
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
import "@tanstack/react-router-devtools";
import "react";
import "./seo-DlwJpbcL.js";
import "./supabase-CLvfjSRp.js";
import "@supabase/ssr";
import "./rbac-C9pGKYGe.js";
import "redaxios";
function PostComponent() {
  const post = Route.useLoaderData();
  return /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
    /* @__PURE__ */ jsx("h4", { className: "text-xl font-bold underline", children: post.title }),
    /* @__PURE__ */ jsx("div", { className: "text-sm", children: post.body })
  ] });
}
export {
  PostComponent as component
};
