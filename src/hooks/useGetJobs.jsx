import { useSession } from "@clerk/clerk-react";
import { useState } from "react";

const useGetJobs = (callback, options = {}) => {
  const [data, setData] = useState(undefined);
  const [loading, setLoading] = useState(null);
  const [error, setError] = useState(null);

  const { session } = useSession();

  const fetch = async (...args) => {
    setLoading(true);
    setError(null);

    try {
      if (!session) {
        throw new Error("Session is not available.");
      }

      // Retrieve Supabase access token
      const supabaseAccessToken = await session.getToken({
        template: "supabase_jobPortal",
      });

      // Execute the provided callback function with the token and other options
      const response = await callback(supabaseAccessToken, options, ...args);
      setData(response);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  return { fetch, data, loading, error };
};

export default useGetJobs;
