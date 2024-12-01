import React from 'react'
import { Outlet } from 'react-router-dom'
import {Header,Footer} from '../components'
import { Toaster } from "@/components/ui/toaster";

function AppLayout() {
  return (
    <div>
        <div className='grid-background'></div>
        <main className = "container min-h-screen">
          <Header/>
          <Outlet/>
        </main>
       <Footer/>
        <Toaster />

    </div>
  )
}

export default AppLayout
