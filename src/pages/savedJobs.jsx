import React, { useEffect ,useState} from 'react'
import useGetJobs from '@/hooks/useGetJobs'
import { getSavedJobs } from '@/utils/apiJobs'
import { useUser } from '@clerk/clerk-react'
import { BarLoader } from 'react-spinners';
import { Button } from '@/components/ui';
import { IconLeft,IconRight } from 'react-day-picker';
import { JobCard } from '@/components';

function SavedJobs() {
  const [page, setPage] = useState(1);
  const [totalPage, setTotalPage] = useState(0);
  const { user, isLoaded } = useUser();
  const jobsPerPage = 12;

  const {
    loading: loadingSavedJobs,
    data: savedJobs,
    fetch: fnSavedJobs,
  } = useGetJobs(getSavedJobs);

  useEffect(() => {
    if (isLoaded) fnSavedJobs();
  }, [isLoaded, user]);

  useEffect(() => {
    if (savedJobs && savedJobs?.length > 0) {
      setTotalPage(Math.ceil(savedJobs.length / jobsPerPage));
    } else {
      setTotalPage(1); // Reset totalPage if no saved jobs
    }
  }, [savedJobs]);

  if (!isLoaded || loadingSavedJobs) {
    return <BarLoader className="mb-4" width="100%" color="orange" />;
  }

  const startIndex = (page - 1) * jobsPerPage;
  const endIndex = startIndex + jobsPerPage;

  const selectPageHandler = (selectedPage) => {
    if (selectedPage >= 1 && selectedPage <= totalPage) {
      setPage(selectedPage);
    }
  };
  console.log("Saved jobs",savedJobs)
  return (
    <div>
      <h1 className="gradient-title font-extrabold text-6xl sm:text-7xl text-center pb-8">Saved Jobs</h1>
  
  

    {loadingSavedJobs===false && (
        <div className='mt-8 grid md:grid-cols-2 lg:grid-cols-3 gap-4'>
          {savedJobs?.data?.length ?(
            savedJobs?.data?.slice(startIndex, endIndex).map((saved)=>{
              return (
              <JobCard 
              key={saved?.id} 
              job={saved.job} 
              onJobSaved={fnSavedJobs}
              savedInit={true} />)
            })

          ):
          (
            <div> No Saved Jobs found 😞</div>
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
                className={page === index+1 ? "bg-blue-700 text-white rounded-full" : "" + "rounded-full "}
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

export default SavedJobs
