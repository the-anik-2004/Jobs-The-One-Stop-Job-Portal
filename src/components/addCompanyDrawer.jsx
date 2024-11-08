import React, { useEffect } from 'react'
import { z } from 'zod'
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Button ,Input} from './ui';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import useGetJobs from '@/hooks/useGetJobs';
import { addNewCompany } from '@/utils/apiCompanies';
import { BarLoader } from 'react-spinners';
//schema
const schema =z.object({
    name:z.string().min(1,{message:"Company Name is required"}),

    logo:z.any()
          .refine(
            (file)=> file[0] &&
            (file[0].type ==="image/png"|| file[0].type ==="image/jpeg"),
            {message:"Only Images are allowed"}
          )

})

const AddCompanyDrawer = ({fetchCompanies}) => {
  
  const {register,handleSubmit,formState:{errors}} = useForm({
    resolver:zodResolver(schema)
  })

  const{
    loading:loadingAddCompany,
    error:errorAddCompany,
    data:dataAddCompany,
    fetch:fnAddCompnay
  }=useGetJobs(addNewCompany)

  // onSubmit fn
const onSubmit=async(data)=>{
  fnAddCompnay({
    ...data,
    logo:data.logo[0]
  })
  fetchCompanies()
}

  useEffect(()=>{
    if(dataAddCompany?.length>0)fetchCompanies()
  },[loadingAddCompany]);

  return (
    <div>
    <Drawer>
      <DrawerTrigger  className="w-full">
            <Button type="button" size="sm" variant="orange">Add New Company</Button>
      </DrawerTrigger>
      <DrawerContent>
      <DrawerHeader>
          <DrawerTitle>Add a new company...</DrawerTitle>
      </DrawerHeader>

          <form className='flex gap-2 p-4 pb-0 flex-col md:flex-row'>
            <Input
            placeholder="company name"
            {...register("name")}
            />

            <Input
            type="file"
            accept="image/*"
            className="file:text-orange-300"
            {...register("logo")}
            />

            <Button
            type="button"
            onClick={handleSubmit(onSubmit)}
            variant="destructive"
            
            >Add</Button>

          </form>
          { errors?.name && <span className='text-red-500'>{errors?.name?.message}</span>}
          { errors?.logo && <span className='text-red-500'>{errors?.logo?.message}</span>}
          {
            errorAddCompany?.message && <span className='text-red-500'>{errorAddCompany?.message}</span>
          }

          {loadingAddCompany && <BarLoader width="100%" color="orange"/>}
      <DrawerFooter>
          <DrawerClose asChild>
            <Button variant="outline" className="w-full">Cancel</Button>
          </DrawerClose>
      </DrawerFooter>
      </DrawerContent>
    </Drawer>
    </div>
  )
}

export default AddCompanyDrawer
