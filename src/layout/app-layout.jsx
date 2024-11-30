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
       <Footer/>

    </div>
  )
}

export default AppLayout
