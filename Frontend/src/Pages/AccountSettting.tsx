import React, { useEffect, useState } from 'react'
import SideBar from '../Components/SIdebar'
import { User2,Lock,Trash2,Key,Link, User, Shield,Eye,Tablet, Bell, Download, Globe } from 'lucide-react'
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
            <div className='grid grid-cols-1 gap-4'>
            <div className='bg-[#0B0C19] h-[50vh] w-[40vw] rounded-xl mt-4 border border-white/10  '>
            <div className='px-5 py-4'>
                <div className='flex items-center justify-start '>
                    <User className='text-blue-500'/>
                    <h1 className='text-white text-xl font-bold px-2'>Profile Information</h1>
                </div>
                <div className='flex items-center justify-between'>
                    <div>
                    <p className='text-white/85 mt-9 '>First Name</p>
                    <input type="text" className='bg-[#171826] mt-2 w-full rounded-xl border border-white/10 h-9 text-white/45 px-4' placeholder='FirstName'/>
                    </div>
                    <div className=''>
                    <p className='text-white/85 mt-9 '>Last Name</p>
                    <input type="text" className='bg-[#171826] mt-2 w-full rounded-xl border border-white/10 h-9 text-white/45 px-4' placeholder='LastName'/>
                    </div>
            
                </div>
                <p className='text-white/85 mt-5 '>Wallet Name</p>
                <input type="text" className='bg-[#171826] mt-2 w-full rounded-xl border border-white/10 h-9 text-white/45 px-4' placeholder='My Ethereum Wallet'/>
                <p className='text-white/85 mt-5 '>Email Address</p>
                <input type="text" className='bg-[#171826] mt-2 w-full rounded-xl border border-white/10 h-9 text-white/45 px-4' placeholder='your.email@example.com'/>
                <Button content='Save Changes' variant='tertiary' onClick={()=>{}} className='mt-5'/>
            </div>
            </div>

            <div className='bg-[#0B0C19] h-[50vh] w-[40vw] rounded-xl mt-4 border-2 border-white/10  '>
                <div className='px-5 py-4'>
                    <div className='flex items-center justify-start '>
                    <Shield className='text-blue-500'/>
                    <h1 className='text-white text-xl font-bold px-2'>Security</h1>
                </div>
                <div className='flex items-center justify-between py-4'>
                    <p className='text-white/85'>Seed Phrase</p>
                    <Button content='Show' variant='quaternary' onClick={()=>{}} frontIcon={<Eye className='h-4 w-4'/>} className='text-sm'/>
                </div>
                <p className='bg-[#171826] w-full h-15 rounded-xl text-white/65 text-center py-5'>Click 'Show' to revel the seed phase</p>

                <div className='flex items-center justify-between mt-8'>
                <div className='flex items-center'>
                    <Tablet size={18} className='text-white/85 '/>
                    <div className='flex flex-col items-start justify-start px-2'>
                        <p className='text-white text-sm'>Two-Factor Authentication</p>
                        <p className='text-white/45 text-sm'>Add an extra layer of security</p>
                    </div>
                </div>
                <Button content='Enable' variant='quaternary' onClick={()=>{}} className='text-xs'/>
                </div>
                
                <div className='flex items-center justify-between mt-8'>
                <div className='flex items-center'>
                    <Key size={18} className='text-white/85 '/>
                    <div className='flex flex-col items-start justify-start px-2'>
                        <p className='text-white text-sm'>Change Password</p>
                        <p className='text-white/45 text-sm'>Update your account password</p>
                    </div>
                </div>
                <Button content='Change' variant='quaternary' onClick={()=>{}} className='text-xs'/>
                </div>

                </div>
            </div>
            <div className='bg-[#0B0C19] h-[50vh] w-[40vw] rounded-xl mt-4 border-2 border-white/10  '>
            <div className='px-5 py-4'>
                <div className='flex items-center'>
                    <Bell className='text-blue-500 '/>
                    <h1 className='text-white font-bold px-2 text-xl'>Notifications</h1>
                </div>
                <div className='mt-4'>   
                    <div className='flex items-center justify-between'>
                    <div className='flex flex-col items-start py-4'>
                        <p className='text-white font-bold text-sm'>Transactions</p>
                        <p className='text-white/45 text-xs'>Get notified about your transactions</p>
                    </div>
                   <div className="relative inline-block w-11 h-5">
                     <input checked id="switch-component" type="checkbox" className="peer appearance-none w-11 h-5 bg-slate-100 rounded-full checked:bg-slate-800 cursor-pointer transition-colors duration-300" />
                    <label id="switch-component" className="absolute top-0 left-0 w-5 h-5 bg-white rounded-full border border-slate-300 shadow-sm transition-transform duration-300 peer-checked:translate-x-6 peer-checked:border-slate-800 cursor-pointer">
                     </label>
                    </div>
                </div>
                 <div>
                    <div className='flex flex-col items-start py-4'>
                        <p className='text-white font-bold text-sm'>Security</p>
                        <p className='text-white/45 text-xs'>Important security alerts and warnings</p>
                    </div>
                  
                </div>
                 <div>
                    <div className='flex flex-col items-start py-4'>
                        <p className='text-white font-bold text-sm'>Marketing</p>
                        <p className='text-white/45 text-xs'>Product updates and promotional offers</p>
                    </div>
                  
                </div>
                 <div>
                    <div className='flex flex-col items-start py-4'>
                        <p className='text-white font-bold text-sm'>Updates</p>
                        <p className='text-white/45 text-xs'>New features and system updates</p>
                    </div>
                  
                </div>

                </div>
            </div>
            </div>
            </div>

            {/* Right Section */}
            <div className='grid grid-cols-1 gap-5 px-10 mt-4'>
                <div className='bg-[#0B0C19] h-[30vh] w-[20vw] rounded-xl border border-white/10 py-3 px-5' >
                    <h1 className='font-bold text-white'>Quick Actions</h1>
                    <div className='px-2 py-4 grid grid-cols-1 gap-4'>
                        <Button variant='quaternary' content='Export Private Key' onClick={()=>{}} frontIcon={<Download className='h-4 w-4'/>} className='text-sm'/>
                        <Button variant='quaternary' content='Network Settings' onClick={()=>{}} frontIcon={<Globe className='h-4 w-4'/>} className='text-sm'/>
                        <Button variant='quaternary' content='Contact Support' onClick={()=>{}} frontIcon={<User className='h-4 w-4'/>} className='text-sm'/>
                    </div>
                </div>
                <div className='bg-[#0B0C19] h-[25vh] w-[20vw] rounded-xl  border border-white/10 py-3 px-5' >
                    <h1 className='text-bold text-white '>Wallet Information</h1>
                    <div className='px-4 py-5 grid grid-cols-1 gap-4'>
                        <div className='flex items-center justify-between'>
                            <p className='text-sm text-white/45'>Address</p>
                            <p className='text-sm text-white/85'>0x742...7a9c</p>
                        </div>
                         <div className='flex items-center justify-between'>
                            <p className='text-sm text-white/45'>Network</p>
                            <p className='text-sm text-white/85'>Ethereum Mainnet</p>
                        </div>
                         <div className='flex items-center justify-between'>
                            <p className='text-sm text-white/45'>Created</p>
                            <p className='text-sm text-white/85'>Oct 30,2025</p>
                        </div>
                    </div>
                </div>
                <div className='bg-[#0B0C19] h-[20vh] w-[20vw] rounded-xl border border-red-500  py-3 px-5' >
                    <h1 className='text-red-500 font-bold'>Danger Zone</h1>
                    <button className='text-red-400 w-full border border-red-400 rounded-xl py-2 mt-3'><span className='flex items-center justify-start'><Trash2 className='h-4 w-4 text-red-400 me-2 ms-4'/>Delete Wallet</span></button>
                    <p className='text-white/45 text-xs py-2'>This action cannot be undone. Make sure you have backed up your seed phrase.</p>
                </div>
            </div>


            </div>
        </div>
        </div>
    </>
  )
}

export default AccountSettting
