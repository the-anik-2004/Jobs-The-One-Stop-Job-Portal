import React from 'react'
import { useUser } from '@clerk/clerk-react'
import { BarLoader } from 'react-spinners';
import { CreatedApplications,CreatedJobs } from '@/components';


function MyJobs() {
  const{user,isLoaded}=useUser();

  if (!isLoaded ) {
    return <BarLoader className="mb-4" width="100%" color="orange" />;
  }
  return (
    <div>
      <h1 className='gradient-title font-extrabold text-6xl sm:text-7xl text-center pb-8'>
      {
        user?.unsafeMetadata?.role==="candidate"?"My Applications" : "My Jobs"
      }
      </h1> 

      {
        user?.unsafeMetadata?.role==="candidate"?(<CreatedApplications/>) :(<CreatedJobs/>) 
      }
        
    </div>
  )
}

export default MyJobs
