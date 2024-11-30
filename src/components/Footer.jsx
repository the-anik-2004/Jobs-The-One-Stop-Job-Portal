import React from 'react';
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"



const Footer = () => {
  return (
    <footer className='p-5 text-center bg-slate-900 text-orange-500 '>
    Made with love by &nbsp;
    <Popover>
      <PopoverTrigger><Button variant="orange">anikpal_</Button></PopoverTrigger>
      <PopoverContent className="flex justify-between">
        <Link to="https://www.instagram.com/anikpal_/" target='_blank'><img src="/instagram.png"/></Link>
        <Link to="https://www.facebook.com/profile.php?id=100085955671264" target='_blank'><img src="/facebook.png"/></Link>
        <Link to="https://discordapp.com/users/1281487457958891605" target='_blank'><img src="/dicord.png"/></Link>
        <Link to="https://github.com/the-anik-2004"target='_blank'><img src="/github.png" /></Link>
        <Link to="https://www.linkedin.com/in/the-anik-pal/"target='_blank'><img src="/linkedIn.png" /></Link>
        <Link to="https://x.com/anikpal_?t=7LjD7Cimo8GY5xOKuSQ_cQ&s=08" target='_blank'><img src="/x.png"/></Link>
      </PopoverContent>
    </Popover>
    🍊
</footer>
  )
}

export default Footer;
