import React, { useEffect, useState } from 'react'
import { useUser,useSession } from '@clerk/clerk-react'
import {getJobs} from '../utils/apiJobs.js';
import { getCompanies } from '@/utils/apiCompanies.js';
import { BarLoader } from 'react-spinners';
import useGetJobs from '../hooks/useGetJobs.jsx';
import { JobCard } from '@/components/index.js';
import { Button, Input } from '@/components/ui/index.js';
import { Filter, MoveLeft, MoveLeftIcon, Search } from 'lucide-react';
import { Select,SelectGroup,SelectValue,SelectLabel,SelectItem,SelectTrigger,SelectContent } from '@/components/ui/select.jsx';
import { State,City } from 'country-state-city';
import { IconLeft, IconRight } from 'react-day-picker';

function JobListing() {

  const [searchQuery,setSearchQuery]=useState("");
  const [location,setLocation]=useState("");
  const [company_id,setCompany_id]=useState("");
  const [page,setPage]=useState(1);
  const [totalPage,setTotalPage]=useState(0);
  const {isLoaded}=useUser();


  const {fetch:fetchingJobs,
    data:jobData,
    loading:loadedJobs}=useGetJobs(getJobs,{location,company_id,searchQuery});
  
  const {fetch:fnCompanies,
    data:companies}=useGetJobs(getCompanies);
    
   
  
    console.log(jobData);
  
  const doClearFilters=()=>{
      setSearchQuery("");
      setCompany_id("");
      setLocation("");
  }

  const jobsPerPage=9;
  const startIndex = (page - 1) * jobsPerPage;
  const endIndex = startIndex + jobsPerPage;


  const handleSearch=(e)=>{
      e.preventDefault();
      let formData= new FormData(e.target);

      const query=formData.get("search-query");
      if(query) setSearchQuery(query)
  }

  const selectPageHandler = (selectedPage) => {
    if (selectedPage >= 1 && selectedPage <= totalPage) {
      setPage(selectedPage);
    }
  };

  useEffect(()=>{
    if(isLoaded){
      fnCompanies();
    }
  },[isLoaded,location,company_id,searchQuery]);
  
  useEffect(()=>{
    if(isLoaded){
      fetchingJobs();
    }
  },[isLoaded,location,company_id,searchQuery]);
  
  useEffect(()=>{
    if(jobData && jobData.length>0)
    setTotalPage(Math.ceil(jobData.length/jobsPerPage))//------------------------------------
  },[jobData])

  
  if(!isLoaded){
    return <BarLoader className='mb-4' width={"100%"} color='orange'/>
  }



 
  return (
    <div>
      <h1 className="gradient-title font-extrabold text-6xl sm:text-7xl text-center pb-8">Latest Jobs</h1>

      {/* Add filters */}
      <form onSubmit={handleSearch} className='h-14 flex w-full gap-2 items-center mb-3'>
        <Input
          type="text"
          placeholder="Search Jobs by title..."
          name="search-query"
          className="h-full flex-1 px-4 text-md"        
        />
        <Button type="submit" className="h-full sm:w-28 text-lg flex justify-center items-center" variant="blue">
            Search<Search/>
        </Button>
      </form>

      <div className='flex flex-col sm:flex-row gap-2'>
          <Select value={location} onValueChange={(value)=>setLocation(value)}>
          <SelectTrigger >
            <SelectValue placeholder="Filter By Location" />
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

        <Select value={company_id} onValueChange={(value)=>setCompany_id(value)}>
          <SelectTrigger >
            <SelectValue placeholder="Filter By Company" />
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
        <Button onClick={doClearFilters} variant="destructive" className='sm:w-1/2 '>Clear Fliter<Filter/></Button>
      </div>

      {loadedJobs && (
        <BarLoader className='mt-4' width={"100%"} color='orange' />
      )}


      {!loadedJobs && (
        <div className='mt-8 grid md:grid-cols-2 lg:grid-cols-3 gap-4'>
          {jobData?.length ?(
            jobData.slice(startIndex, endIndex).map((job)=>{
              return <JobCard key={job?.id} job={job} savedInit={job?.saved?.length>0} />
            })

          ):
          (
            <div> No Jobs found 😞</div>
          )
          }
        </div>
      )

      }
      {/* Pagination */}
      <div className='flex justify-center gap-2 mb-4'>
        <Button
           onClick={() => {
            selectPageHandler(page - 1);
          }}
          className={`${page>1?"":"opacity-0"}  hover:bg-blue-700 hover:text-white`}
        ><IconLeft/>Previous</Button>
      {[...Array(totalPage)].map((_, index) => {
            return (
              <Button 
                className={page === index+1 ? "bg-blue-600 text-white rounded-lg hover:bg-blue-800" : "" + "rounded-full "}
                onClick={() => {
                  selectPageHandler(index + 1);
                }}
                key={index+1}
              >
                {index +1}
              </Button>
            );
          })}
          <Button
             onClick={() => {
              selectPageHandler(page + 1);
            }}
            className={`${page < totalPage ? "" : "opacity-0"} hover:bg-blue-700 hover:text-white`}

          >Next<IconRight/></Button>
      </div>
    </div>
  )
}

export default JobListing
