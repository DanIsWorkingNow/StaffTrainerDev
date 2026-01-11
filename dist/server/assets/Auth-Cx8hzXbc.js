import * as React from "react";
import { useRouter, isRedirect } from "@tanstack/react-router";
import { jsx, jsxs } from "react/jsx-runtime";
function useServerFn(serverFn) {
  const router = useRouter();
  return React.useCallback(
    async (...args) => {
      try {
        const res = await serverFn(...args);
        if (isRedirect(res)) {
          throw res;
        }
        return res;
      } catch (err) {
        if (isRedirect(err)) {
          err.options._fromLocation = router.state.location;
          return router.navigate(router.resolveRedirect(err).options);
        }
        throw err;
      }
    },
    [router, serverFn]
  );
}
function useMutation(opts) {
  const [submittedAt, setSubmittedAt] = React.useState();
  const [variables, setVariables] = React.useState();
  const [error, setError] = React.useState();
  const [data, setData] = React.useState();
  const [status, setStatus] = React.useState("idle");
  const mutate = React.useCallback(
    async (variables2) => {
      setStatus("pending");
      setSubmittedAt(Date.now());
      setVariables(variables2);
      try {
        const data2 = await opts.fn(variables2);
        await opts.onSuccess?.({ data: data2 });
        setStatus("success");
        setError(void 0);
        setData(data2);
        return data2;
      } catch (err) {
        setStatus("error");
        setError(err);
      }
    },
    [opts.fn]
  );
  return {
    status,
    variables,
    submittedAt,
    mutate,
    error,
    data
  };
}
function Auth({
  actionText,
  onSubmit,
  status,
  afterSubmit
}) {
  return /* @__PURE__ */ jsx("div", { className: "fixed inset-0 bg-white dark:bg-black flex items-start justify-center p-8", children: /* @__PURE__ */ jsxs("div", { className: "bg-white dark:bg-gray-900 p-8 rounded-lg shadow-lg", children: [
    /* @__PURE__ */ jsx("h1", { className: "text-2xl font-bold mb-4", children: actionText }),
    /* @__PURE__ */ jsxs(
      "form",
      {
        onSubmit: (e) => {
          e.preventDefault();
          onSubmit(e);
        },
        className: "space-y-4",
        children: [
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("label", { htmlFor: "email", className: "block text-xs", children: "Username" }),
            /* @__PURE__ */ jsx(
              "input",
              {
                type: "email",
                name: "email",
                id: "email",
                className: "px-2 py-1 w-full rounded-sm border border-gray-500/20 bg-white dark:bg-gray-800"
              }
            )
          ] }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("label", { htmlFor: "password", className: "block text-xs", children: "Password" }),
            /* @__PURE__ */ jsx(
              "input",
              {
                type: "password",
                name: "password",
                id: "password",
                className: "px-2 py-1 w-full rounded-sm border border-gray-500/20 bg-white dark:bg-gray-800"
              }
            )
          ] }),
          /* @__PURE__ */ jsx(
            "button",
            {
              type: "submit",
              className: "w-full bg-cyan-600 text-white rounded-sm py-2 font-black uppercase",
              disabled: status === "pending",
              children: status === "pending" ? "..." : actionText
            }
          ),
          afterSubmit ? afterSubmit : null
        ]
      }
    )
  ] }) });
}
export {
  Auth as A,
  useServerFn as a,
  useMutation as u
};
