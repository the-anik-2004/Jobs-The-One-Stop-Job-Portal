import supabaseClient from "./superbase";

async function getJobs(token,{location,company_id,searchQuery}) {
    const superbase=await supabaseClient(token);

    let query=superbase.from("jobs")
    .select("*, company:companies(name,logo_url),saved:saved_jobs!saved_jobs_job_id_fkey(id)");

    if(location){
        query=query.eq("location",location)
    }
    if(company_id){
        query=query.eq("company_id",company_id)
    }
    if(searchQuery){
        query=query.ilike("title",`%${searchQuery}%`)
    }

    const {data,error} = await query;

    if(error){
        console.error("Error fetching jobs in superbase",error);
        return null;
    }
    return data;
}

 async function saveJobs(token,{alreadySaved},saveData) {
    const superbase=await supabaseClient(token);

    if(alreadySaved){
        const {data,error:deleteError}=await superbase
        .from("saved_jobs")
        .delete()
        .eq("job_id",saveData.job_id);

        if(deleteError){
            console.error("Error Deleting saved jobs:",deleteError);
            return null;
        }
        return data;
    }
    
    else{
        const {data,error:insertError}=await superbase
        .from("saved_jobs")
        .insert([saveData])
        .select()

        if(insertError){
            console.error("Error while fetching Jobs",insertError);
            return null;
        }
        return data;
    }

  
}

async function getSingleJob(token,{job_id}) {
    try {
        const supabase = await supabaseClient(token);

        const { data, error } = await supabase
            .from("jobs")
            .select(`*, company:companies(name,logo_url) ,applications:applications(*)`)
            .eq("id",job_id)
            .single();

        if (error) {
            console.error("Error fetching single Job:", error.message);
            return { data: null, error };
        }

        return { data, error: null };
    } catch (err) {
        console.error("Unexpected error fetching companies:", err);
        return { data: null, error: err };
    }
}



async function updateHiringStatus(token,{job_id},isOpen) {
    try {
        const supabase = await supabaseClient(token);

        const { data, error } = await supabase
            .from("jobs")
            .update({isOpen})
            .eq("id",job_id)
            .select("*");

        if (error) {
            console.error("Error updating Job:", error.message);
            return { data: null, error };
        }

        return { data, error: null };
    } catch (err) {
        console.error("Unexpected error fetching companies:", err);
        return { data: null, error: err };
    }
}

//add new job
async function addNewJob(token,_,jobData) {
    try {
        const supabase = await supabaseClient(token);

        const { data, error } = await supabase
            .from("jobs")
            .insert([jobData])
            .select("*");
         

        if (error) {
            console.error("Error adding new Job:", error.message);
            return { data: null, error };
        }

        return { data, error: null,message: "Job added successfully!"  };
    } catch (err) {
        console.error("Unexpected error fetching companies:", err);
        return { data: null, error: err };
    }
}

//get Saved jobs
async function getSavedJobs(token) {
    try {
        const supabase = await supabaseClient(token);

        const { data, error } = await supabase
            .from("saved_jobs")
            .select("*, job:jobs(*, company:companies(name, logo_url))");

        if (error) {
            console.error("Error fetching saved jobs:", error.message);
            return { data: null, error };
        }

        return { data, error: null };
    } catch (err) {
        console.error("Unexpected error fetching saved jobs:", err);
        return { data: null, error: err };
    }
}

//get my jobs
async function getMyJobs(token,{recruiter_id}) {
    try {
        const supabase = await supabaseClient(token);

        const { data, error } = await supabase
            .from("jobs")
            .select("* ,company:companies(name, logo_url)")
            .eq("recruiter_id",recruiter_id)
        if (error) {
            console.error("Error fetching  jobs:", error.message);
            return { data: null, error };
        }

        return { data, error: null };
    } catch (err) {
        console.error("Unexpected error fetching saved jobs:", err);
        return { data: null, error: err };
    }
}

//delete my jobs
async function deleteMyJobs(token,{job_id}) {
    try {
        const supabase = await supabaseClient(token);

        const { data, error } = await supabase
            .from("jobs")
            .delete()
            .eq("id",job_id)
            .select("*");

        if (error) {
            console.error("Error deleting  jobs:", error.message);
            return { data: null, error };
        }

        return { data, error: null };
    } catch (err) {
        console.error("Unexpected error deleting saved jobs:", err);
        return { data: null, error: err };
    }
}


export {getJobs,saveJobs,getMyJobs,getSingleJob,deleteMyJobs,updateHiringStatus,addNewJob,getSavedJobs}
