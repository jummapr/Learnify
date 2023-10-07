"use client"
import Hero from '@/components/Hero'
import Header from '@/components/header'
import Heading from '@/utils/Heading'
import { FC, useState } from 'react';


interface pageProps {
  
}

const page: FC<pageProps> = ({}) => {
  const [open,setOpen] = useState(false);
  const [activeItem, setActiveItem] = useState(0);
  const [route,setRoute] = useState("Login")
  return (
   <>
     <Heading 
      title='Learnify'
      description='Learnify is a platform for students to learn and get help from teachers'
      keyword='programming, MERN, Redux, Full stack developer, Frontend, Backend'
    />
    <Header 
      open={open}
      setOpen={setOpen}
      activeItem={activeItem}
      setRoute={setRoute}
      route={route}
    />
    <Hero />
    
   </>
    
  )
}

export default page