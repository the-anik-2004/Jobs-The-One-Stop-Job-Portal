import { useUser } from '@clerk/clerk-react'
import React, { useEffect } from 'react'
import { Button } from '../components/ui';
import {BarLoader} from 'react-spinners'
import { useNavigate } from 'react-router-dom';
function OnBoarding() {

  const { user,isLoaded } = useUser();
  const navigate=useNavigate();

  const handelRoleSelection= async (role) => {
      await user
      .update({
        unsafeMetadata:{role},
      })
      .then(()=>{
        navigate(role==='recruiter'?"/post-job":"/jobs")
      })
      .catch(err=>{
        return<i>Internal error:{err.message}</i>
      });
  };

  useEffect(()=>{
    if(user?.unsafeMetadata?.role){
      navigate(user?.unsafeMetadata?.role==='recruiter'?'/post-job':'/jobs')
    }
  },[user]);

  if(!isLoaded){
    return <BarLoader className="mb-4" width={"100%"} color='orange'/>;
  }
  console.log(user);

  return (
  <div className='flex flex-col items-center justify-center '>
    <h2 className='gradient-title font-extrabold text-7xl sm:text-8xl tracking-tighter'>I am a...</h2>
    <div className='mt-16 grid grid-cols-2 gap-4 w-full md:px-40'>
      <Button 
      variant="blue" 
      className="h-36 text-2xl" 
      onClick={()=>handelRoleSelection('candidate')}>Candidate</Button>

      <Button 
      variant="destructive" 
      className="h-36 text-2xl" 
      onClick={()=>handelRoleSelection('recruiter')}>Recruiter</Button>
    </div>
  </div>);
  
}

export default OnBoarding
