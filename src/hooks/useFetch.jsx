import { useSession } from "@clerk/clerk-react";
import { useState } from "react";

const useJobs=(callback,(options={})=>{
    const [data,setData]=useState(undefined);
    const [loading,setLoading]=useState(null);
    const [error,setError]=useState(null);

    const {session}=useSession();

    const fetch=async(...args)=>{
        setLoading(true);
        setError(null);

        try {
            const superbaseAccessToken=await session.getToken({
                template:"supabase_jobPortal",
            });

           const response=await callback(superbaseAccessToken,options,...args);
           setData(response);
           setError(null)
        } catch (error) {
            setError(error)
        }
        finally{
            setLoading(false)
        }
    }
    return {fetch,data,loading,error}
})

export default useJobs;