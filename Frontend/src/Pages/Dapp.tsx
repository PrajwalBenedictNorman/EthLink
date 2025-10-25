import React from 'react'
import SideBar from '../Components/SIdebar'
import Navbar from '../Components/Navbar'
import Button from '../Components/Button'
import { Zap } from 'lucide-react'
import NavSide from '../Components/NavSide'
import { useRecoilValue } from 'recoil'
import { visibleAtom } from '../store/atom/visible'
function Dapp() {
  const visible=useRecoilValue(visibleAtom)
  return (
    <div>
      <NavSide />
      <div className='bg-[#0B0C19]/65 md:h-screen h-[170vh] w-full'>
      <div className={`${visible?"md:ms-[20vw]":"md:ms-[12vw]"} ms-[6vw] py-5 transition-all duration-200`}>
        <h1 className='text-white text-4xl font-bold py-2'>DApps</h1>
        <p className='text-white/55'>Discover and connect to decentralized applications</p>
        <div className='flex items-center justify-start mt-6'>
          <Button content='All' variant='pentanary' onClick={()=>{}} className='me-2'/>
          <Button content='Defi' variant='pentanary' onClick={()=>{}} className='ms-2 me-2 text-md'/>
          <Button content='NFT' variant='pentanary' onClick={()=>{}} className='ms-2 me-2 text-md'/>
          <Button content='Social' variant='pentanary' onClick={()=>{}} className='ms-2 me-2 text-md'/>  
        </div>
        {/*  DApp Cards */}
        <div className='grid grid-cols-1 md:grid-cols-3 gap-4 mt-12'>
          <div className='bg-[#0B0C19] border-2 border-[#1A1B28] h-50 md:w-85 w-[90vw] rounded-xl flex flex-col justify-start'>
           <div className='px-4 mt-3'>
            <h1 className='text-white text-xl font-bold'>Aave</h1>
           </div>
           <p className='text-white/45 text-sm px-4'>Aave is a decentralised non-custodial liquidity protocol</p>
           <p className='text-white text-xs px-4 py-2 bg-sky-200 rounded w-fit'>Lending</p>
          </div>
           <div className='bg-[#0B0C19] border-2 border-[#1A1B28] h-50 md:w-85 w-[90vw] rounded-xl'>

          </div>
           <div className='bg-[#0B0C19] border-2 border-[#1A1B28] h-50 md:w-85 w-[90vw] rounded-xl'>
 
          </div>
           <div className='bg-[#0B0C19] border-2 border-[#1A1B28] h-50 md:w-85 w-[90vw] rounded-xl'>

          </div>
          <div className='bg-[#0B0C19] border-2 border-[#1A1B28] h-50 md:w-85 w-[90vw] rounded-xl'>

          </div>
          <div className='bg-[#0B0C19] border-2 border-[#1A1B28] h-50 md:w-85 w-[90vw] rounded-xl'>

          </div>

        </div>

      </div>
      </div>
    </div>
  )
}

export default Dapp
