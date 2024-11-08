import { zodResolver } from '@hookform/resolvers/zod'
import { Button, Input, Textarea } from '../components/ui'
import React, { useEffect } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { z } from 'zod'
import useGetJobs from '@/hooks/useGetJobs'
import { addNewJob } from '@/utils/apiJobs'
import { Select,SelectGroup,SelectValue,SelectLabel,SelectItem,SelectTrigger,SelectContent } from '@/components/ui/select.jsx';
import { State,City } from 'country-state-city';
import { getCompanies } from '@/utils/apiCompanies'
import { useUser } from '@clerk/clerk-react'
import { BarLoader } from 'react-spinners'
import { Navigate } from 'react-router-dom'
import MDEditor from '@uiw/react-md-editor'
import { useNavigate } from 'react-router-dom'
import AddCompanyDrawer from '@/components/addCompanyDrawer'

//Schema
const schema=z.object({
  title:z.string()
         .min(1,{message:"Title is required"}),
         
  description:z.string()
         .min(1,{message:"Description is required"}),

  location:z.string()
         .min(1,{message:"Select a Location "}),

  company_id:z.string()
         .min(1,{message:"Select or Add a New Company"}),

  requirments:z.string()
         .min(1,{message:"Requirements are required"})
  
})

function PostJob() {

  const {isLoaded,user}=useUser();
  const navigate=useNavigate();
  const {register,control,handleSubmit,formState:{errors}}=useForm({
    defaultValues:{
        location:"",
        company_id:"",
        requirments:"",
    },
    resolver:zodResolver(schema)
  })

  //fetching companies
  const {
    fetch:fnCompanies,
    data:companies,
    loading:loadingCompanies
  }=useGetJobs(getCompanies);

  useEffect(()=>{
    if(isLoaded)fnCompanies();
  },[isLoaded]);
  

  const onSubmit=(data)=>{
    console.log("Submitting data:", data); 
    fnCreateJob({...data,
      recruiter_id:user.id,
      isOpen:true
    });
  }
  //Adding Job
  const {
    fetch:fnCreateJob,
    data:createJobData,
    loading:loadingCreateJob,
    error:createJobError
  }=useGetJobs(addNewJob);

  
  //After submission navigation
  useEffect(()=>{
    if(createJobData)navigate("/jobs")
  },[loadingCreateJob])


  if(!isLoaded || loadingCompanies){
    return <BarLoader className='mb-4' width="100%" color='orange'/>
  }


  //Access permission
  if(user?.unsafeMetadata?.role!=="recruiter"){
    return <Navigate to="/jobs"/>
  }

  return (
    <div>
      <h1 className='gradient-title font-extrabold text-5xl sm:text-7xl text-center pb-8'>Post a Job</h1>

      <form 
      onSubmit={handleSubmit(onSubmit)}
      className='flex flex-col p-4 gap-4' >
        <Input placeholder="Job Title" {...register("title")}/>
        {errors.title && <span className='text-red-500'>{errors.title.message}</span>}


    

      <Textarea placeholder='Job Description' {...register("description")}/>
      {errors.description && <span className='text-red-500'>{errors.description.message}</span>}

    <div className='flex gap-1 justify-center flex-col md:flex-row'>

      <Controller
      name="location"
      control={control}
      render={({field})=>(
        <Select 
      value={field.value} onValueChange={field.onChange}
      >
          <SelectTrigger >
            <SelectValue placeholder="Select Job Location" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              {State.getStatesOfCountry("IN").map(({name})=>{
                return(
              <SelectItem key={name} value={name}>{name}</SelectItem>)
              })}
            </SelectGroup>
          </SelectContent>
        </Select>
      )}
      />
    
      <Controller
      name="company_id"
      control={control}
      render={({field})=>(
        <Select 
        value={field.value} onValueChange={field.onChange}
        >
          <SelectTrigger >
            <SelectValue placeholder="Select Company" >
              {field.value
               ? companies?.data?.find((comp)=>comp.id===Number(field.value))?.name:"Company"}
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              {companies?.data?.length>0 ?(
                companies.data.map(({name , id})=>{return(
              <SelectItem key={id} value={id}>{name}</SelectItem>
              )})):
              (
                <SelectItem disabled>No companies available</SelectItem>
              )
              }
            </SelectGroup>
          </SelectContent>
        </Select>

      )}/>
      <AddCompanyDrawer fetchCompanies={fnCompanies}/>

    </div>
    {errors.location && <span className='text-red-500'>{errors.location.message}</span>}
    {errors.company && <span className='text-red-500'>{errors.company.message}</span>}

    <Controller
    name="requirments"
    control={control}
    render={({field})=>(
        <MDEditor value={field.value} onChange={field.onChange}/> 
    )}/>
    {errors.requirments && <span className='text-red-500'>{errors.requirments.message}</span>}
    {createJobError?.message && <span className='text-red-500'>{createJobError?.message}</span>}

    {loadingCreateJob && <BarLoader width="100%" color='orange'/>}
    <Button type="submit" variant="blue" size="lg" className="mt-2">Submit</Button>

     {/* Add application */}
    </form>

    </div>
  )
}

export default PostJob
