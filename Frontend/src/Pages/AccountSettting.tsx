import React, { useEffect, useState } from 'react'
import SideBar from '../Components/SIdebar'
import { User2,Lock,Trash2,Key,Link, User, Shield,Eye } from 'lucide-react'
import Button from '../Components/Button'
import { jwtDecode } from 'jwt-decode'
import Navbar from '../Components/Navbar'


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
    // useEffect(()=>{
    //     const accessTokken=sessionStorage.getItem("accessTokken") as string
    //     const decoded=jwtDecode<TokenPayload>(accessTokken)
    //     setFirstName(decoded.firstName)
    //     setLastName(decoded.lastName)
    //     setUsername(decoded.username)
    // },[])

    function sumit(){

    }

    
  return (
    <>
        <SideBar />
        <Navbar />
        <div className='bg-[#0B0C19]/65 h-[200vh] w-full'>
        <div className='ms-[27vw] py-1'>
            <h1 className='text-white font-bold text-3xl mt-10'>Account Settings</h1>
            <p className='text-white/45 py-2'>Manage your account preferences and security settings</p>
            
            <div className='flex items-start'>

             {/* left Section */}
            <div className='grid grid-cols-1 gap-3'>
            <div className='bg-[#0B0C19] h-[50vh] w-[40vw] rounded-xl mt-4 border border-white/10  '>
            <div className='px-5 py-3'>
                <div className='flex items-center justify-start '>
                    <User className='text-blue-500'/>
                    <h1 className='text-white text-xl font-bold px-2'>Profile Information</h1>
                </div>
                <div className='flex items-center justify-between'>
                    <div>
                    <p className='text-white/85 mt-9 '>First Name</p>
                    <input type="text" className='bg-[#171826] mt-2 w-full rounded-xl border border-white/10 h-9 text-white/45 px-3' placeholder='FirstName'/>
                    </div>
                    <div className=''>
                    <p className='text-white/85 mt-9 '>Last Name</p>
                    <input type="text" className='bg-[#171826] mt-2 w-full rounded-xl border border-white/10 h-9 text-white/45 px-3' placeholder='LastName'/>
                    </div>
            
                </div>
                <p className='text-white/85 mt-5 '>Wallet Name</p>
                <input type="text" className='bg-[#171826] mt-2 w-full rounded-xl border border-white/10 h-9 text-white/45 px-3' placeholder='My Ethereum Wallet'/>
                <p className='text-white/85 mt-5 '>Email Address</p>
                <input type="text" className='bg-[#171826] mt-2 w-full rounded-xl border border-white/10 h-9 text-white/45 px-3' placeholder='your.email@example.com'/>
                <Button content='Save Changes' variant='tertiary' onClick={()=>{}} className='mt-5'/>
            </div>
            </div>

            <div className='bg-[#0B0C19] h-[50vh] w-[40vw] rounded-xl mt-4 border-2 border-white/10  '>
                <div className='px-5 py-3'>
                    <div className='flex items-center justify-start '>
                    <Shield className='text-blue-500'/>
                    <h1 className='text-white text-xl font-bold px-2'>Security</h1>
                </div>
                <div className='flex items-center justify-between py-4'>
                    <p className='text-white/85'>Seed Phrase</p>
                    <Button content='Show' variant='quaternary' onClick={()=>{}} frontIcon={<Eye />}/>
                </div>
                <p className='bg-[#171826] w-full h-15 rounded-xl text-white/65 text-center py-5'>Click 'Show' to revel the seed phase</p>
                </div>
            </div>
            <div className='bg-[#0B0C19] h-[50vh] w-[40vw] rounded-xl mt-4 border-2 border-white/10  '>
                svdfs
            </div>
            </div>

            {/* Right Section */}
            <div className='grid grid-cols-1 gap-5 px-10 mt-4'>
                <div className='bg-[#0B0C19] h-[30vh] w-[20vw] rounded-xl border border-white/10 ' >

                </div>
                <div className='bg-[#0B0C19] h-[30vh] w-[20vw] rounded-xl  border border-white/10 ' >

                </div>
                <div className='bg-[#0B0C19] h-[30vh] w-[20vw] rounded-xl border border-white/10 ' >

                </div>
            </div>


            </div>
        </div>
        </div>
    </>
  )
}

export default AccountSettting
