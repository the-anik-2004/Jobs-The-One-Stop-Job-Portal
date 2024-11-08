import React from 'react'
import { Outlet } from 'react-router-dom'
import {Header} from '../components'
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui'
function AppLayout() {
  return (
    <div>
        <div className='grid-background'></div>
        <main className = "container min-h-screen">
          <Header/>
          <Outlet/>
        </main>
        <footer className='p-5 text-center bg-slate-900 text-orange-500 '>Made with love by <Link to="https://www.instagram.com/anikpal_/" target="_blank"><Button variant="orange">anikpal_</Button></Link> 🍊 </footer>
    </div>
  )
}

export default AppLayout
