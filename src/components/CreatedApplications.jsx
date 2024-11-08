import useGetJobs from '@/hooks/useGetJobs'
import { getApplications } from '@/utils/apiApplications'
import { useUser } from '@clerk/clerk-react'
import React, { useEffect } from 'react'
import { BarLoader } from 'react-spinners'
import { ApplicationCard } from '.'

const CreatedApplications = () => {
    const {user}=useUser();

    const {
        loading:loadingApplications,
        data:applications,
        fetch:fnApplications
    }=useGetJobs(getApplications,{
        user_id:user.id,
    })

    useEffect(()=>{
      fnApplications() ; 
    },[]);

    if(loadingApplications){
        return <BarLoader width="100%" color='orange'/>
    }

  return (
    <div className='flex flex-col gap-2'>
         {
            applications?.map((app)=>{
                return <ApplicationCard 
                key={app.id} 
                application={app}
                isCandidate="true" />
              })
            }
    </div>
  )
}

export default CreatedApplications
