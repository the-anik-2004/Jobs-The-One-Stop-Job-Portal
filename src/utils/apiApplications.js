import supabaseClient, { supabaseUrl } from "./superbase";  

export async function applyToJob(token,_,jobData) {
    try {
        const supabase = await supabaseClient(token);

        const random=Math.floor(Math.random()*90000);
        const fileName=`resume-${random}-${jobData.candidate_id}`;

        const {error:storageError}=await supabase.storage.from("resumes").upload(fileName,jobData.resume);

        if (storageError) {
            console.error("Error fetching jobs:", error.message);
            return { data: null, error };
        }

        const resume=`${supabaseUrl}/storage/v1/object/public/resumes/${fileName}`;

        const {data,error}=await supabase.from("applications").insert([{
                ...jobData,resume
            }
          ]).select("*");

            if (storageError) {
                console.error("Error Submitting Applications:", error.message);
                return { data: null, error };
            }

    } catch (err) {
        console.error("Unexpected error fetching companies:", err);
        return { data: null, error: err };
    }
}

// update applications
export async function updateApplications(token,{job_id,},status){
  try {
    const supabase=await supabaseClient(token);
    const {data,error}=await supabase.from("applications")
                                     .update({status})
                                     .eq("job_id",job_id)
                                    .select()
    if(error) {
        console.error("Error updating Applications:",error);
    }
    return data;

  } catch (error) {
    console.error("Error updating Applications:",error);
  }

}
// get applications
export async function getApplications(token,{user_id,}){
  try {
    const supabase=await supabaseClient(token);
    const {data,error}=await supabase.from("applications")
                                      .select("*,job:jobs(title,company:companies(name))")
                                     .eq("candidate_id",user_id)
    if(error) {
        console.error("Error fetching Applications:",error);
    }
    return data;

  } catch (error) {
    console.error("Error updating Applications:",error);
  }

}