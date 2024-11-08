import React,{useState} from 'react'
import { Card} from './ui'
import { CardContent, CardFooter, CardHeader, CardTitle } from './ui/card'
import { Briefcase, BriefcaseBusiness, Download, Laptop, School } from 'lucide-react'
import useGetJobs from '@/hooks/useGetJobs'
import { updateApplications } from '@/utils/apiApplications'
import { BarLoader } from 'react-spinners'
import { SelectContent,SelectItem, SelectTrigger, SelectValue ,Select } from './ui/select'


const ApplicationCard = ({application,isCandidate=false}) => {

     // State to track the status locally for each application
     const [status, setStatus] = useState(application?.status || 'applied');


    // anchor tag->insert link->insert target->make clickable
    const handleDownload=()=>{
        const link=document.createElement("a");
        link.href=application?.resume;
        link.target="_blank"
        link.click();
    }

    //take the status as parameter and update in the db
    const handleStatusChange=(status)=>{
        // fnStatus(status);
        setStatus(status);
        fnStatus(status);
    }

    const {
        loading:loadingStatus,fetch:fnStatus
    }=useGetJobs(updateApplications,{job_id:application?.job_id})

    console.log("candidate:",isCandidate)
    console.log("Application status:", application?.status);
  return (
    <Card>
        {loadingStatus && <BarLoader width="100%" color="orange"/>}
        <CardHeader>
            <CardTitle className="flex justify-between font-bold">
                {
                    (isCandidate )? `${application?.job?.title} at ${application?.job?.company?.name}`:
                                `${application?.name}`
                }
                <Download
                    className="bg-white text-black rounded-full h-8 w-8  p-1.5 cursor-pointer"
                    onClick={handleDownload}
                />
            </CardTitle>
        </CardHeader>
            
        <CardContent className="flex flex-col flex-1">
            <div className='flex flex-col md:flex-row justify-between mb-4'>

                <div className='flex gap-2 items-center'>
                    <BriefcaseBusiness size={20}/> {application.experience} of years
                </div>
                <div className='flex gap-2 items-center'>
                    <School size={20}/> {application.education} 
                </div>
                <div className='flex gap-2 items-center'>
                    <Laptop size={20}/> Skills : {application.skills} 
                </div>
               

            </div>
            <hr />
        </CardContent>
        <CardFooter className="flex justify-between">
            <span>{new Date(application?.created_at).toLocaleString()}</span>
            {
                (isCandidate) ? (<span className='capitalize font-bold'>Status : {status}</span>)
                :
                (
                <Select onValueChange={handleStatusChange} defaultValue={status}>
                    <SelectTrigger className='w-52'>
                        <SelectValue 
                        placeholder="Application Status"
                        />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="applied">Applied</SelectItem>
                        <SelectItem value="interviewing">Interviewing</SelectItem>
                        <SelectItem value="hired">Hired</SelectItem>
                        <SelectItem value="rejected">Rejected</SelectItem>
                    </SelectContent>
                </Select>
                )
            }
        </CardFooter>
    </Card>
  )
}

export default ApplicationCard
