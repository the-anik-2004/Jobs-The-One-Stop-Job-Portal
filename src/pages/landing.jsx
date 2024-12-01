import React,{useRef} from 'react'
import { Link} from 'react-router-dom'
import { Button,Carousel,Card } from '../components/ui'
import companies from "../data/companies.json"
import faqs from "../data/faq.json"
import { CarouselItem,CarouselContent } from '@/components/ui/carousel'
import { CardContent,CardHeader,CardDescription,CardTitle} from '@/components/ui/card'
import Autoplay from "embla-carousel-autoplay"
import {useUser} from "@clerk/clerk-react"
import { Navigate } from 'react-router-dom'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useToast } from "@/components/hooks/use-toast"
import { ToastAction } from "@/components/ui/toast"

function LandingPage() {
  const { toast } = useToast();
  const autoplay = useRef(
    Autoplay({ delay: 2000, stopOnInteraction: false })
  );

  const {isSignedIn,user}=useUser()

  const getRole=()=>{
    if(isSignedIn){
      return user?.unsafeMetadata?.role;
    }
    return null;
  };

  const userRole=getRole()


  if (isSignedIn && userRole === undefined) {
    return <Navigate to="/onboarding" />;
  }
 

  const handleClick=(event,roleAllowed)=>{
      if(isSignedIn && userRole!==roleAllowed){
        event.preventDefault();
      }
  }

  const handleToastForInactiveButton = (role, buttonType) => {
    if (isSignedIn && userRole !== role) {
      toast({
        title: buttonType === 'find' ? "Find Jobs Disabled" : "Post Jobs Disabled",
        description: `You are not authorized to access this feature as a ${userRole}.`,
        action: (
          <ToastAction altText="Undo">Undo</ToastAction>
        ),
      });
    }
  };



  return (
    <main className='flex flex-col gap-10 sm:gap-20 py-10 sm:py-20'>
      <section className='text-center'>
        <h1 className='flex flex-col lg:flex-row items-center justify-center gradient-title text-4xl  sm:text-6xl lg:text-8xl tracking-tighter py-4 font-extrabold  '>Find Your Dream <span className='flex items-center gap-1 lg:gap-6'> <img src="/logo.png" alt="job" className='h-12 sm:h-24 lg:h-32'/></span></h1>
        <p className='text-gray-300 sm:mt-4 text-xs sm:text-xl'>Explore thousands of job listings or find the perfect candidate</p>
      </section>
      <div className='flex flex-col sm:flex-row gap-6 justify-center items-center'>
        {/* Buttons */}
        {/* <Link to={(user?.unsafeMetadata?.role==='candidate'?"/jobs" :"/")||"/jobs"}> */}
        <Link to={"/jobs"} onClick={(e)=>handleClick(e,'candidate')}>
          <Button
           variant="blue" 
           size="xl" 
           className={isSignedIn && userRole==='recruiter'?`cursor-not-allowed`:`cursor-pointer`} 
           onClick={() => {
            if (isSignedIn && userRole === 'recruiter') {
              handleToastForInactiveButton('candidate', 'find');
            }
          }}>Find Jobs</Button>
        </Link>
        <Link>
       
        </Link>

        <Link to={"/post-job"} onClick={(e)=>handleClick(e,'recruiter')}>
          <Button  
          variant="destructive" 
          size="xl" 
          className={isSignedIn && userRole==='candidate'?`cursor-not-allowed`:`cursor-pointer`}
          onClick={() => {
            if (isSignedIn && userRole === 'candidate') {
              handleToastForInactiveButton('recruiter', 'post');
            }
          }}
          >Post a Job</Button>
        </Link>
      </div>

       
        {/* Carousel */}
      

        <Carousel 
        plugins={[autoplay.current]}
        // onMouseEnter={() => autoplay.current.stop()}
        // onMouseLeave={() => autoplay.current.reset()}
        className="w-full py-10 cursor-none ">
      <CarouselContent className="flex gap-5 sm:gap-14  items-center">
          {
            companies.map(({name,id,path})=>{
              return(
                <CarouselItem key={id} className="basis-1/3 lg:basis-1/5">
                  <img src={path} alt={name} className="h-9 sm:h-14 object-contain" />
                </CarouselItem>
              )
            })
          }
      </CarouselContent>
      {/* <CarouselPrevious />
      <CarouselNext /> */}
    </Carousel>
        {/* Carousel */}

      {/* Banner */}
      <img src="/banner.png" alt="banner" />
        {/* cards */}
      <section className='grid grid-cols-1 md:grid-cols-2 gap-4'>
        <Card>
          <CardHeader>
            <CardTitle>For Job Seekers</CardTitle>
          </CardHeader>
            <CardContent>
              Search and apply for jobs,track applications, and more.
            </CardContent>
        </Card>



        <Card>
          <CardHeader>
            <CardTitle>For Employers</CardTitle>
          </CardHeader>
            <CardContent>
              Post jobs manage applications,and find the best candidates.
            </CardContent>
        </Card>

      </section>
      {/* Accordion */}
 
 <Accordion type="single" collapsible>
    {  faqs.map((faq,index)=>{
      return(
      <AccordionItem key={index} value={`${index+1}`}>
           <AccordionTrigger>{faq.question}</AccordionTrigger>
          <AccordionContent>
            {faq.answer}
          </AccordionContent>
        </AccordionItem>
      )
    })
  }
      </Accordion>
   


      
    </main>
  )
}

export default LandingPage
