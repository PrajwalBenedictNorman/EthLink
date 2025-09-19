import React, { useEffect, useState } from 'react'
import SideBar from '../Components/SIdebar'
import { User2,Lock,Trash2,Key,Link } from 'lucide-react'
import Button from '../Components/Button'
import { jwtDecode } from 'jwt-decode'


interface TokenPayload{
    firstName:string,
    lastName:string,
    username:string,

}

function AccountSettting() {
    const [firstName,setFirstName]=useState("")
    const [lastName,setLastName]=useState("")
    const [username,setUsername]=useState("")
    const [email,setEmail]=useState("")
    const [activeTab,setActiveTab]=useState("basic")
    const [acitveStauts,setActiveStatus]=useState("Disabled")
    useEffect(()=>{
        const accessTokken=sessionStorage.getItem("accessTokken") as string
        const decoded=jwtDecode<TokenPayload>(accessTokken)
        setFirstName(decoded.firstName)
        setLastName(decoded.lastName)
        setUsername(decoded.username)
    },[])

    function sumit(){

    }

    
  return (
    <div>
      <SideBar />
      <div className='flex justify-center'>
        <div className='bg-[#1a2234] h-[83vh] w-[20vw] mt-14 rounded-2xl ms-[20vw] text-white/85'>
            <div className='flex flex-col gap-2 justify-start ms-10 mt-10'>
                <button className='flex cursor-pointer hover:underline-offset-2 hover:underline py-9' onClick={()=>setActiveTab("basic")}>
                     <User2 />
                    <h1 className='text-md font-semibold px-1'>Basic Information</h1>
                </button>
                <button className='flex cursor-pointer hover:underline-offset-2 hover:underline py-9' onClick={()=>setActiveTab("password")}>
                     <Lock />
                    <h1 className='text-md font-semibold px-1'>Password</h1>
                </button>             
                <button className='flex cursor-pointer hover:underline-offset-2 hover:underline py-9' onClick={()=>setActiveTab("wallets")}>
                     <Link />
                    <h1 className='text-md font-semibold px-1'>Connected Wallets</h1>
                </button>      
                <button className='flex cursor-pointer hover:underline-offset-2 hover:underline py-9' onClick={()=>setActiveTab("blockChain")}>
                     <Key />
                    <h1 className='text-md font-semibold px-1'>BlockChain</h1>
                </button>      
                <button className='flex cursor-pointer hover:underline-offset-2 hover:underline py-9' onClick={()=>setActiveTab("delete")}>
                     <Trash2 />
                    <h1 className='text-md font-semibold px-1'>Delete Account</h1>
                </button>      
            </div>
         </div>
        <div>
            {/* Right top */}
            <div className='bg-[#202a3b] h-[20vh] w-[50vw] mt-14 ms-10 rounded-2xl text-white/55'>
                {/* Basic Informantion Details */}
               {activeTab==="basic" && <div className='text-center py-2'>
                    <button className='bg-white rounded-full h-12 w-12'></button>
                    <h1 className='text-xl font-semibold'>{`${firstName} ${lastName}`}</h1>
                    <div className='flex justify-between'>
                        <h1 className='ms-10'>Profile Completion</h1>
                        <h1 className='me-10'>Joined</h1>
                    </div>
                </div>
                } 
                {activeTab==='password' && <div className='py-8'>
                    <div className='flex justify-center'>
                        <div>
                            <h1 className='px-14'>Password Strength</h1>

                        </div>
                        <div>
                             <h1 className='px-14'>Two Factor Authentication : <span className='text-red-400'>{acitveStauts}</span></h1>
                            <button></button>
                        </div>
                    </div>

                    </div>}
                {activeTab==='wallets' && <div>This is for wallet</div>}
                {activeTab==='blockChain' && <div>This is for blockChain</div>}
                {activeTab==='delete' && <div>This is for delete</div>}    

            </div>

            {/* Right bottom */}
            <div className='bg-[#151d2a] h-[60vh] w-[50vw] mt-6 ms-10 rounded-2xl text-white/85'>
                {/* Basic Information */}
                {activeTab==="basic" && <div className='py-6 ms-10'>
                    <h1>Edit Your account details</h1>
                    <input type="text" className="bg-[#1c2536] text-white placeholder-gray-400 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 w-[22vw] mt-6" placeholder='First Name' value={firstName}/>
                    <input type="text" className="bg-[#1c2536] text-white placeholder-gray-400 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 w-[22vw] mt-6 ms-9" onClick={()=>setActiveTab("basic")} placeholder='Last Name' value={lastName}/>
                    <input type="text" className="bg-[#1c2536] text-white placeholder-gray-400 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 w-[45vw] mt-6 " placeholder='Username' value={username}/>
                    <input type="text" className="bg-[#1c2536] text-white placeholder-gray-400 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 w-[45vw] mt-6 " placeholder='Email'/>
                    <h1 className='mt-6'>Upload Image</h1> 
                    <button>upload here</button>
                    <Button content='Make Changes' variant='primary' onClick={sumit} className='ms-[18vw] mt-10'/>
                </div>}
                {activeTab==='password' && <div>This is for password</div>}
                {activeTab==='wallets' && <div>This is for wallet</div>}
                {activeTab==='blockChain' && <div>This is for blockChain</div>}
                {activeTab==='delete' && <div>This is for delete</div>}    
            </div>
        </div>
      </div>
    </div>
  )
}

export default AccountSettting
