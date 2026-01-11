import { jsx } from "react/jsx-runtime";
import { L as Login } from "./Login-NXKI1fjc.js";
import "@tanstack/react-router";
import "./Auth-Cx8hzXbc.js";
import "react";
import "./router-B338aohD.js";
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
import "./seo-DlwJpbcL.js";
import "./supabase-CLvfjSRp.js";
import "@supabase/ssr";
import "./rbac-C9pGKYGe.js";
import "redaxios";
const SplitErrorComponent = ({
  error
}) => {
  if (error.message === "Not authenticated") {
    return /* @__PURE__ */ jsx(Login, {});
  }
  throw error;
};
export {
  SplitErrorComponent as errorComponent
};
