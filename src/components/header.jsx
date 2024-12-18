import React, { useEffect, useState } from 'react';
import {Link, useSearchParams} from "react-router-dom";
import { Button } from './ui';
import { useUser } from '@clerk/clerk-react'; 
import { SignInButton,UserButton,SignedOut,SignedIn,SignIn } from '@clerk/clerk-react';
import { BriefcaseBusiness, PenBox, Heart } from 'lucide-react';
const Header = () => {

  const [showSignIn,setShowSignIn]=useState(false);
  const {user} =useUser();
  const[search,setSearch]=useSearchParams();
  useEffect(()=>{
    if(search.get('sign-in')){
      setShowSignIn(true);
    }
  })
  const handleOverlayClick=(e)=>{
      if(e.target===e.currentTarget){
        setShowSignIn(false)
        setSearch({})
      }
  }
  return (
    <>
      <nav className="py-2 px-0 flex justify-between items-center">
        <Link>
          <img src="/logo.png" className="h-20" alt="" />
        </Link>
        
        
        <div className='flex gap-2'>
          <SignedOut>
            <Button variant="outline" onClick={()=>setShowSignIn(true)}>Login</Button>
          </SignedOut>
          
          <SignedIn>
            {/* Add a condition */}
        {user?.unsafeMetadata?.role === 'recruiter'  && (<Link to="/post-job">
              <Button variant="destructive" className="rounded-full" >
                <PenBox size={20} className="mr-2"/>
                Post a Job</Button>
            </Link>)}
            <UserButton appearance={
              {
                elements:{
                  avatarBox:"w-10 h-10"
                }
              }
            }>
              <UserButton.MenuItems>
                  <UserButton.Link
                    label='My Jobs'
                    labelIcon={<BriefcaseBusiness size={15}/>}
                    href="/my-jobs"
                  />

                  <UserButton.Link
                    label='Saved Jobs'
                    labelIcon={<Heart  size={15}/>}
                    href='/saved-jobs'
                  />
              </UserButton.MenuItems>

            </UserButton> 
          </SignedIn>
        </div>
      </nav>

      {
        showSignIn && <div className="flex fixed inset-0 items-center justify-center bg-black bg-opacity-80 z-10" onClick={handleOverlayClick}>
          <SignIn 
          forceRedirectUrl="/onboarding"
          signUpForceRedirectUrl="/onboarding"
          fallbackRedirectUrl="/onboarding"
          />
        </div>
      }
    </>
  )
}

export default Header
