import { useState, useEffect } from "react";
import { g as getCurrentUserRole } from "./rbac-C9pGKYGe.js";
function useCurrentUserRole() {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  useEffect(() => {
    let mounted = true;
    const fetchUserRole = async () => {
      try {
        setIsLoading(true);
        const result = await getCurrentUserRole();
        if (mounted) {
          setData(result);
          setError(null);
        }
      } catch (err) {
        if (mounted) {
          setError(err);
        }
      } finally {
        if (mounted) {
          setIsLoading(false);
        }
      }
    };
    fetchUserRole();
    return () => {
      mounted = false;
    };
  }, []);
  return { data, isLoading, error };
}
function useIsAdmin() {
  const { data: userData } = useCurrentUserRole();
  return userData?.role === "ADMIN" || false;
}
export {
  useIsAdmin as a,
  useCurrentUserRole as u
};
