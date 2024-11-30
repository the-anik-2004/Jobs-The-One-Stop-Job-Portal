import React from 'react'
import { Outlet } from 'react-router-dom'
import {Header,Footer} from '../components'

function AppLayout() {
  return (
    <div>
        <div className='grid-background'></div>
        <main className = "container min-h-screen">
          <Header/>
          <Outlet/>
        </main>
        {/* 
                          <footer className='p-5 text-center bg-slate-900 text-orange-500 '>
    Made with love by &nbsp;
    <Popover>
      <PopoverTrigger><Button variant="orange">anikpal_</Button></PopoverTrigger>
      <PopoverContent className="flex justify-between">
        <Link to="https://www.instagram.com" target='_blank'><img src="/instagram.png"/></Link>
        <Link to="https://www.facebook.com/" target='_blank'><img src="/facebook.png"/></Link>
        <Link to="https://discord.com/" target='_blank'><img src="/dicord.png"/></Link>
        <Link to="https://github.com/"target='_blank'><img src="/github.png" /></Link>
        <Link to="https://www.linkedin.com/"target='_blank'><img src="/linkedIn.png" /></Link>
        <Link to="https://x.com/" target='_blank'><img src="/x.png"/></Link>
      </PopoverContent>
    </Popover>
    🍊
</footer>       
        */}
       <Footer/>

    </div>
  )
}

export default AppLayout
