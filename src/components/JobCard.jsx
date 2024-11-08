import { useUser } from '@clerk/clerk-react'
import React, { useEffect, useState } from 'react'
import { CardHeader,Card,CardTitle, CardContent, CardFooter } from './ui/card';
import { Heart, MapPinIcon, Trash2Icon } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from './ui';
import {deleteMyJobs, saveJobs} from "../utils/apiJobs.js";
import useGetJobs from '../hooks/useGetJobs.jsx';
import { BarLoader } from 'react-spinners';

const JobCard = ({
  job,
  isMyJob=false,
  savedInit=false,
  onJobSaved=()=>{}
}) => {

 
  const [saved,setSaved]=useState(savedInit);

 
  const {
    fetch:fnSaveJob,
    data:savedJobs,
    loading:loadedSavedJobs}=useGetJobs(saveJobs,{alreadySaved:saved});

    const {
      loading:loadingDeletingJobs,
      fetch:fnDeleteJob
    }=useGetJobs(deleteMyJobs,{job_id:job.id})
  const {user}=useUser();

  const handleSavedJobs=async()=>{
    await fnSaveJob({
      user_id: user.id,
      job_id: job.id
    })
    onJobSaved();
  }

  const handleDeleteJob=async()=>{
      await fnDeleteJob();
      onJobSaved()
  }

  useEffect(()=>{
    if(savedJobs!==undefined) setSaved(savedJobs?.length>0);
  },[savedJobs])

  return (
    <Card className="mb-4 flex flex-col justify-between">
     {
      loadingDeletingJobs && <BarLoader className='mt-4' width={"100%"} color='orange'/>
     }
      <CardHeader>
        <CardTitle className="flex justify-between font-bold">
          {job.title}
          { isMyJob && <Trash2Icon onClick={handleDeleteJob} fill="red" size={18} className=" text-red-300 cursor-pointer"/>}
        </CardTitle>
      </CardHeader>

      <CardContent>
          <div className='flex justify-between'>
            {job.company && <img src={job.company.logo_url} className='h-6 mb-1'/>}
            <div className='flex justify-center items-center'>
              <MapPinIcon fill="#722F37" stroke="red" size={15}/>{job.location}
            </div>
          </div>
          <hr />
          {job.description.substring(0,job.description.indexOf(".")).concat("...")}
      </CardContent>
      <CardFooter className="flex gap-2">
        <Link to={`/job/${job.id}`} className="flex-1">
            <Button variant="secondary" className="w-full">
              More Details
            </Button>
        </Link>

        {
          !isMyJob && 

          <Button
          variant="outline"
          className="w-15"
          onClick={handleSavedJobs}
          disabled={loadedSavedJobs}
          >
            {
            saved ?
            <Heart size={20} stroke='red' fill='red'/>:
            <Heart size={20} />
          }
          </Button>
        }
      </CardFooter>
    </Card>
  )
}

export default JobCard
