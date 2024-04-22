import React, { useState } from 'react';
import { MdOutlineDashboard } from "react-icons/md";
import { GiWorld } from "react-icons/gi";
import { CiFilter } from "react-icons/ci";
import { BsArrowRight } from "react-icons/bs";
import { MenuDropdown } from './components/menu/MenuDropdown';
import { Cssgrid } from './components/menu/Cssgrid';
import { Maps } from './components/menu/Maps';
import Dashboardrecup from './components/Dashboardrecup';


import Teste from './components/teste';






function App() {
  const [open, setOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState('cssgrid');
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(false);



  const handleChange = () => {
    setOpen(!open);
  }

  return (
    <div className='flex'> {/* Ensure your outer div uses flex layout */}
      {/* <div className={`bg-gray-700 h-screen p-5 pt-4 ${isSidebarExpanded ? "w-32" : "w-18"} z-20`}>
        <div className='flex flex-col'>
          <div className='mb-20'>
            <BsArrowRight className={`bg-white text-2xl rounded mb-4 ${!isSidebarExpanded && "rotate-180"}`} onClick={() => setIsSidebarExpanded(!isSidebarExpanded)}/>
            <p hidden={!isSidebarExpanded} className='text-slate-300' >Close</p>
          </div>
          <div className='mb-20'>
            <MdOutlineDashboard className='bg-white text-2xl rounded mb-4' onClick={() => setCurrentPage('cssgrid')}/>
            <p hidden={!isSidebarExpanded} className='text-slate-300' >Dashboard</p>
          </div>
          <div className='mb-20'>
            <GiWorld className='bg-white text-2xl rounded mb-4' onClick={() => setCurrentPage('maps')}/>
            <p hidden={!isSidebarExpanded} className='text-slate-300' >Maps</p>
          </div>
          <div className='mb-20'>
            <CiFilter className='bg-white text-2xl rounded mb-4' onClick={handleChange}/>
            <p hidden={!isSidebarExpanded}  className='text-slate-300'>Filter</p>
          </div>
        </div>
      </div>
      <MenuDropdown hidden={!open}/> */}
      <div className='flex-grow h-screen overflow-auto'>
        {/* {currentPage === 'cssgrid' ? <Cssgrid /> : <Maps />} */}

        {/* <Cssgrid/> */}

        <Dashboardrecup/>
        {/* <Teste/> */}



      </div>
    </div>
  );
}

export default App;




