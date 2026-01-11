import { c as createServerFn, a as createServerRpc } from "../server.js";
import { g as getSupabaseServerClient } from "./supabase-CLvfjSRp.js";
const getCurrentUserRole_createServerFn_handler = createServerRpc("417281d1562713f78f32f249ac1e882b4eef5a907dc8a29ee2ded095c10158fb", (opts, signal) => {
  return getCurrentUserRole.__executeServer(opts, signal);
});
const getCurrentUserRole = createServerFn({
  method: "GET"
}).handler(getCurrentUserRole_createServerFn_handler, async () => {
  const supabase = getSupabaseServerClient();
  const {
    data: {
      user
    },
    error: authError
  } = await supabase.auth.getUser();
  if (authError || !user) {
    return null;
  }
  const {
    data: trainerData,
    error: trainerError
  } = await supabase.from("trainers").select("id, name, role_id").eq("user_id", user.id).single();
  if (trainerError || !trainerData) {
    console.error("Error fetching trainer data:", trainerError);
    return null;
  }
  const {
    data: roleData,
    error: roleError
  } = await supabase.from("roles").select("id, name, level").eq("id", trainerData.role_id).single();
  if (roleError || !roleData) {
    console.error("Error fetching role data:", roleError);
    return null;
  }
  const {
    data: permissionsData
  } = await supabase.from("role_permissions").select(`
        permission:permissions (
          resource,
          action
        )
      `).eq("role_id", roleData.id);
  const permissions = permissionsData?.map((rp) => ({
    resource: rp.permission.resource,
    action: rp.permission.action
  })) || [];
  return {
    userId: user.id,
    trainerId: trainerData.id,
    email: user.email || "",
    name: trainerData.name,
    role: roleData.name,
    roleLevel: roleData.level,
    permissions
  };
});
const requireRole_createServerFn_handler = createServerRpc("de9635657afaaa53bb7acadff122ff5c5787572fc19c279696f01a995223ba5e", (opts, signal) => {
  return requireRole.__executeServer(opts, signal);
});
const requireRole = createServerFn({
  method: "GET"
}).inputValidator((allowedRoles) => allowedRoles).handler(requireRole_createServerFn_handler, async ({
  data: allowedRoles
}) => {
  const userData = await getCurrentUserRole();
  if (!userData) {
    throw new Error("Not authenticated");
  }
  if (!allowedRoles.includes(userData.role)) {
    throw new Error(`Insufficient permissions. Required role: ${allowedRoles.join(" or ")}`);
  }
  return true;
});
const hasPermission_createServerFn_handler = createServerRpc("6188e96f9325eece7a751a0c19775eaa2b9d3c36ef6096699251858c52eefd24", (opts, signal) => {
  return hasPermission.__executeServer(opts, signal);
});
const hasPermission = createServerFn({
  method: "GET"
}).inputValidator((data) => data).handler(hasPermission_createServerFn_handler, async ({
  data
}) => {
  const userData = await getCurrentUserRole();
  if (!userData) {
    return false;
  }
  if (userData.role === "ADMIN") {
    return true;
  }
  return userData.permissions.some((p) => p.resource === data.resource && p.action === data.action);
});
const requirePermission_createServerFn_handler = createServerRpc("63c3ec1ff35e0ab489d3b542a1445e9cfe222a25988fe0d8286177869c74af7e", (opts, signal) => {
  return requirePermission.__executeServer(opts, signal);
});
const requirePermission = createServerFn({
  method: "GET"
}).inputValidator((data) => data).handler(requirePermission_createServerFn_handler, async ({
  data
}) => {
  const allowed = await hasPermission({
    data
  });
  if (!allowed) {
    throw new Error(`Insufficient permissions to ${data.action} ${data.resource}`);
  }
  return true;
});
const isAdmin_createServerFn_handler = createServerRpc("62a0ad59da3fb86a6b7824fdaf95a316110ec483a6b7b424ef6b4346a1be3f0e", (opts, signal) => {
  return isAdmin.__executeServer(opts, signal);
});
const isAdmin = createServerFn({
  method: "GET"
}).handler(isAdmin_createServerFn_handler, async () => {
  const userData = await getCurrentUserRole();
  return userData?.role === "ADMIN" || false;
});
const isCoordinatorOrAbove_createServerFn_handler = createServerRpc("936727e77449da92adf69a0a49f810950a923a84e26b23b4009227c895d9d7d3", (opts, signal) => {
  return isCoordinatorOrAbove.__executeServer(opts, signal);
});
const isCoordinatorOrAbove = createServerFn({
  method: "GET"
}).handler(isCoordinatorOrAbove_createServerFn_handler, async () => {
  const userData = await getCurrentUserRole();
  if (!userData) return false;
  return userData.role === "ADMIN" || userData.role === "COORDINATOR";
});
const isTrainer_createServerFn_handler = createServerRpc("be6b687903cdabc6c04429309385be10ae375fbcbee69db70c1f256b9d3a9016", (opts, signal) => {
  return isTrainer.__executeServer(opts, signal);
});
const isTrainer = createServerFn({
  method: "GET"
}).handler(isTrainer_createServerFn_handler, async () => {
  const userData = await getCurrentUserRole();
  return userData?.role === "TRAINER" || false;
});
export {
  getCurrentUserRole as g
};
