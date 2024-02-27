import { useState } from 'react'
import { Button } from './components/ui/button'
import { ComboboxDemo } from './components/menu/ComboboxDemo'
import { MdOutlineDashboard } from "react-icons/md";
import { GiWorld } from "react-icons/gi";
import { CiFilter } from "react-icons/ci";
import { BsArrowRight } from "react-icons/bs";

import Papa from 'papaparse';





function App() {

  const [open, setOpen] = useState(false);
  const [data, setData] = useState([]);
  
  const  Changer= () =>{
    setOpen(!open)
  }

  


   


  
  

  return (
    <>
      <div className='flex'>
        <div className="bg-gray-700	h-screen p-5 pt-8  w-20 z-20">
          {/* <button className='text-center bg-red-700 w-14 rounded' onClick={Changer}>Menu</button> */}
          <div className='flex flex-col'>
            <BsArrowRight className='bg-white text-4xl rounded mb-20' onClick={Changer}/>
            <MdOutlineDashboard className='bg-white text-4xl rounded mb-20'/>
            <GiWorld className='bg-white text-4xl rounded mb-20'/>
            <CiFilter className='bg-white text-4xl rounded'/>
          </div>

          
        </div>
        <Menuderoulant hidden= {!open}/>
        <div className='p-2 w-full'>
            <h1 className='text-2xl font-semibold'>Dashbord</h1>
        </div>
      </div>
    </>
  )
}

function Menuderoulant({hidden}){
  const translateClasses = hidden ? "-translate-x-full" : "translate-x-0";

  return (
    <div className='flex '>
      <div hidden= {hidden} className='bg-zinc-300	h-screen p-5 pt-8 w-76 transition-transform duration-700 ease-in-out '>
        <h1>filtre</h1>
        <ComboboxDemo/>
      </div>

    
    </div>
  )
}

export default App
