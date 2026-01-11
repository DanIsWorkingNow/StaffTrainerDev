import { a as createServerRpc, c as createServerFn } from "../server.js";
import { notFound } from "@tanstack/react-router";
import axios from "redaxios";
import "@tanstack/history";
import "@tanstack/router-core/ssr/client";
import "@tanstack/router-core";
import "node:async_hooks";
import "@tanstack/router-core/ssr/server";
import "h3-v2";
import "tiny-invariant";
import "seroval";
import "react/jsx-runtime";
import "@tanstack/react-router/ssr/server";
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
export {
  fetchPost_createServerFn_handler,
  fetchPosts_createServerFn_handler
};
