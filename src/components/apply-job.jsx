import React, { useState } from 'react'
import { Drawer,Button ,Input,RadioGroup,Label} from './ui';
import { RadioGroupItem } from './ui/radio-group';
import {
  
    DrawerClose,
    DrawerContent,
    DrawerDescription,
    DrawerFooter,
    DrawerHeader,
    DrawerTitle,
    DrawerTrigger,
  } from "@/components/ui/drawer"
import {z} from "zod";
import {Controller, useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod"
import useGetJobs from '@/hooks/useGetJobs';
import { applyToJob } from '@/utils/apiApplications';
import { BarLoader } from 'react-spinners';


const schema=z.object({
    experience:z
                .number()
                .min(0,{message:"Experience must be atleast 0"})
                .int() ,
            
    skills:z
            .string()
            .min(1,{message:"Skills are required(as comma serparated)"}),

    education:z
               .enum(["Post Garduate","Garduate","Intermidiate"],
                {message:"Education is required"}),
               
    resume:z
            .any()
            .refine(
                (file)=>
                    file[0] && (
                        file[0].type==="application/pdf"||
                        file[0].type==="application/msword"||
                        file[0].type==="application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                    ),
                    {message:"Only PDF or Word documents are allowed"})  
})



const ApplyJobDrawer = ({user,job,applied=false,fetchJob}) => {

    const [status,setStatus]=useState(job?.applications.find((ap) => ap.candidate_id === user.id)?.status ||"not applied");
const {
    register,
    handleSubmit,
    control,
    formState:{errors},reset
}= useForm({
        resolver:zodResolver(schema),
    })

const {
    loading:loadingApply,
    error:errorApply,
    fetch:fnApply
}=useGetJobs(applyToJob);

const onSubmit=(data)=>{
    fnApply({
        ...data,
        job_id:job.id,
        candidate_id:user.id,
        name:user.fullName,
        status:"applied",
        resume:data.resume[0]
    }).then(()=>{
        fetchJob();
        reset();
    });
};

console.log("Applied",status)
return (
<Drawer open={status==="applied" ?false:undefined}>
  <DrawerTrigger  asChild>
    <Button 
    className="m-4"
    size="lg"
    variant={job?.isOpen && !(status==="applied") ? "blue" :"destructive"}
    disabled={status==="applied"||!job?.isOpen}
    >
    {job?.isOpen ?(status==="applied"?"Applied":"Apply"):"Hiring Closed" }
    </Button>
  </DrawerTrigger>
  <DrawerContent >
    <DrawerHeader>
      <DrawerTitle>Apply for {job?.data?.title} at {job?.data?.company?.name} </DrawerTitle>
      <DrawerDescription>This action cannot be undone.</DrawerDescription>
    </DrawerHeader >
    <form onSubmit={handleSubmit(onSubmit)} className='flex flex-col gap-4 p-4 pb-0'>
        
        <Input asChild
        type="number"
        placeholder="Years of Experience"
        {...register("experience",{valueAsNumber:true})}
        />

        { errors.experience &&(
                <span className='text-red-500'>{errors.experience.message}</span>
        )}

        <Input asChild
        type="text"
        placeholder="Skills (Comma Separated)"
        {...register("skills")}
        />

        { errors.skills &&(
                <span className='text-red-500'>{errors.skills.message}</span>
        )}

        <Controller
        name="education"
        control={control}
        render={({field})=>(
            <RadioGroup 
                onValueChange={field.onChange}
                {...field}
            >
            <div className="flex items-center space-x-2">
                <RadioGroupItem value="Intermidiate" id="intermidiate" />
                <Label htmlFor="intermidiate">Intermidiate</Label>
            </div>
            <div className="flex items-center space-x-2">
                <RadioGroupItem value="Garduate" id="garduate" />
                <Label htmlFor="garduate">Graduate</Label>
            </div>
            <div className="flex items-center space-x-2">
                <RadioGroupItem value="Post Garduate" id="post-garduate" />
                <Label htmlFor="post-garduate">Post Graduate</Label>
            </div>
            </RadioGroup>
        )}
        />

        {
            errors.education && (
                <span className='text-red-500'>{errors.education.message}</span>
            )
        }

       

        <Input
        type="file"
        accept=".pdf, .doc, .docx"
        className="flex-1 file:text-gray-500"
        {...register("resume")}
        />

        { errors.resume && (
                <span className='text-red-500'>{errors.resume.message}</span>
            )
        }

        {
           errorApply?.message && (
            <span className='text-red-500'>{errorApply?.message}</span>
        ) }

        {
           loadingApply && (
            <BarLoader width="100%" color='orange'/>
           ) 
        }

        <Button variant="blue" type="submit" size="lg"> Apply</Button>
        

    </form>
    <DrawerFooter>
      
      <DrawerClose asChild>
        <Button variant="outline">Cancel</Button>
      </DrawerClose>
    </DrawerFooter>
  </DrawerContent>
</Drawer>

  )
}

export default ApplyJobDrawer
