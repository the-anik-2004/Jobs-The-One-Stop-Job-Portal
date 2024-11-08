import React, { useEffect ,useState} from 'react';
import { getSingleJob, updateHiringStatus } from '@/utils/apiJobs';
import { useUser } from '@clerk/clerk-react';
import { useParams } from 'react-router-dom';
import useGetJobs from '@/hooks/useGetJobs';
import { BarLoader } from 'react-spinners';
import { Briefcase, DoorClosed, DoorOpen, MapPinIcon } from 'lucide-react';
import MDEditor from "@uiw/react-md-editor"
import { Select,SelectGroup,SelectValue,SelectLabel,SelectItem,SelectTrigger,SelectContent } from '@/components/ui/select.jsx';
import { ApplyJobDrawer,ApplicationCard } from '@/components';


function JobPage() {
  const {user,isLoaded}=useUser();
  const {id}=useParams();
 

  const {
    loading:loadingJob,
    data:job,
    fetch:fnJob
  }=useGetJobs(getSingleJob,{job_id:id})

  const {
    loading:loadingHiringStatus,
    fetch:fnHiringStatus}=useGetJobs(updateHiringStatus,{job_id:id});


  const handleStatusChange=(value)=>{
    const isOpen= value==="open";
    fnHiringStatus(isOpen).then(()=>fnJob())
  }
  useEffect(()=>{
    if(isLoaded) {
      fnJob();
    }
  },[isLoaded])


  if(!isLoaded||loadingJob){
    return (<BarLoader color='orange' width={"100%"} className="mb-4"/>)
  }
//get applications
 console.log("Application",job?.data?.applications[0])
  return (
    <div className='flex flex-col flex-1 m-2 gap-y-4'>

      <div className='flex flex-col-reverse gap-6 md:flex-row justify-between items-center'>
        <h1 className='gradient-title font-extrabold pb-3 text-4xl sm:text-6xl'>{job?.data?.title}</h1>
        <img src={job?.data?.company?.logo_url} className='h-12' alt={job?.data?.company.name} />
      </div>

      <div className='flex justify-between'>
          <div className='flex gap-2'>
              <MapPinIcon/>{job?.data?.location}
          </div>
          <div className='flex gap-2' >
              <Briefcase/>{job?.data?.applications?.length } Applicants
          </div>
          <div className='flex gap-2' >
                {job?.data?.isOpen?<><DoorOpen/>Open</>:<><DoorClosed/>Closed</>} 
          </div>
      </div>

      {/* Hiring Status */}
      {loadingHiringStatus && <BarLoader width="100%" color="orange"/>}
      {
        job?.data?.recruiter_id===user?.id &&

        <Select onValueChange={(value)=>handleStatusChange(value)}>
        <SelectTrigger className={`w-full mt-4 ${job?.data?.isOpen?"bg-green-950":"bg-red-950"}`} >
          <SelectValue placeholder={
            "Hiring Status "+(job?.data?.isOpen===true ?"(Open)":"(Closed)")
          } />
        </SelectTrigger>
        <SelectContent>
          
         
            <SelectItem  value="open">Open</SelectItem>
            <SelectItem  value="close">Closed</SelectItem>
            
         
        </SelectContent>
      </Select>
      }

      <h2 className=' text-2xl sm:text-3xl font-bold mt-4 mb-2'>About the job</h2>
      <article className='sm:text-lg'>{job?.data?.description}</article>

      <h2 className=' text-2xl sm:text-3xl font-bold mt-4 mb-2'>What we are looking for</h2>
      <MDEditor.Markdown source={job?.data?.requirments.split('.').filter(Boolean).map(req=>`${req}`.replace('-',"📌")).join('\n')} className='"bg-transparent sm:text-lg'/>
    
      {/* render Application Candidate Side */}

     {
        job?.data?.recruiter_id !==user?.id &&
        <ApplyJobDrawer   
        job={job?.data}
        user={user}
        fetchJob={fnJob}
       applied={job?.applications?.find((ap) => ap.candidate_id === user.id)}
        />
      }

      {/*render Application Recruiter Side  */}
      
      {
        job?.data?.applications?.length>0 && job?.data?.recruiter_id===user.id &&
        (
          <div className='flex flex-col gap-2'>
            <h2 className='text-2xl sm:text-3xl font-bold mt-4 mb-2'>Applications</h2>
            {
              job?.data?.applications?.map((app)=>{
                return <ApplicationCard key={app.id} application={app} />
              })
            }
          </div>
        )

      }
  
      
    </div>
  )
}

export default JobPage
