import useGetJobs from '@/hooks/useGetJobs';
import { getMyJobs } from '@/utils/apiJobs';
import { useUser } from '@clerk/clerk-react'
import React, { useEffect } from 'react'
import { JobCard } from '.';
import { BarLoader } from 'react-spinners';

const CreatedJobs = () => {
    const{user}=useUser();

    const{
        loading:loadingCreatedJobs,
        data:createdJobs,
        fetch:fnCreatedjobs
    }=useGetJobs(getMyJobs,{recruiter_id:user.id})
  
    useEffect(()=>{
        fnCreatedjobs();
    },[])
    
    if(loadingCreatedJobs){
        return <BarLoader width="100%" color='orange'/>
    }
    return (
    <div>
      <div className='mt-8 grid md:grid-cols-2 lg:grid-cols-3 gap-4'>
        {
            createdJobs?.data?.length?
            (
                createdJobs?.data?.map((job)=>{
                    return <JobCard
                            key={job.id}
                            job={job}
                            onJobSaved={fnCreatedjobs}
                            isMyJob
                    />
                })
            )
            :
            (
              <div>You haven't Post any Job yet as a Recruiter</div>  
            )
        }
      </div>
    </div>
  )
}

export default CreatedJobs
