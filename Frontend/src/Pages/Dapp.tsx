import React from 'react'
import SideBar from '../Components/SIdebar'
import Navbar from '../Components/Navbar'
import Button from '../Components/Button'
import { Zap } from 'lucide-react'
function Dapp() {
  return (
    <div>
      <SideBar />
      <Navbar />
      <div className='bg-[#0B0C19]/65 h-screen w-full'>
      <div className='ms-[23vw] mt-5'>
        <h1 className='text-white text-4xl font-bold py-2'>DApps</h1>
        <p className='text-white/55'>Discover and connect to decentralized applications</p>
        <div className='flex items-center justify-start mt-6'>
          <Button content='All' variant='pentanary' onClick={()=>{}} className='me-2'/>
          <Button content='Defi' variant='pentanary' onClick={()=>{}} className='ms-2 me-2 text-md'/>
          <Button content='NFT' variant='pentanary' onClick={()=>{}} className='ms-2 me-2 text-md'/>
          <Button content='Social' variant='pentanary' onClick={()=>{}} className='ms-2 me-2 text-md'/>  
        </div>
        {/*  DApp Cards */}
        <div className='grid grid-cols-3 gap-4 mt-12'>
          <div className='bg-[#0B0C19] border-2 border-[#1A1B28] h-50 w-85 rounded-xl flex flex-col items-center justify-start'>
           
          </div>
           <div className='bg-[#0B0C19] border-2 border-[#1A1B28] h-50 w-85 rounded-xl'>

          </div>
           <div className='bg-[#0B0C19] border-2 border-[#1A1B28] h-50 w-85 rounded-xl'>
 
          </div>
           <div className='bg-[#0B0C19] border-2 border-[#1A1B28] h-50 w-85 rounded-xl'>

          </div>
        </div>
         <div className='bg-[#0B0C19] border-2 border-[#1A1B28] h-40 w-[75vw] rounded-xl mt-4'>
        <div className='flex items-center justify-start mt-4'>
          <Zap size={38} className='text-blue-400 ms-2 bg-sky-950 rounded-md p-2'/>
          <h1 className='text-white ms-2 font-bold'>How to Connect</h1>
        </div>
        <div className='flex items-center justify-center'>
          <div></div>
        </div>
        </div>
      </div>
      </div>
    </div>
  )
}

export default Dapp
