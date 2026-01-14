import React, { useEffect, useState } from 'react'
import SideBar from '../Components/SIdebar'
import { User2,Lock,Trash2,Key,Link, User, Shield,Eye,Tablet, Bell, Download, Globe } from 'lucide-react'
import Button from '../Components/Button'
import { jwtDecode } from 'jwt-decode'
import Navbar from '../Components/Navbar'
import NavSide from '../Components/NavSide'
import { useRecoilValue, useSetRecoilState } from 'recoil'
import { visibleAtom } from '../store/atom/visible'
import { networkAtom } from '../store/atom/network'
import Modal from '../Components/Modal'
import axios from "axios"


function AccountSettting() {
    const [firstName,setFirstName]=useState("")
    const [lastName,setLastName]=useState("")
    const [email,setEmail]=useState("")
    const [walletName,setWalletName]=useState("")
    const [pubKey,setPubKey]=useState("")
    const [privateKey,setPrivateKey]=useState("")
    const [activeTab,setActiveTab]=useState("basic")
    const [acitveStauts,setActiveStatus]=useState("Disabled")
    const [createdAt,setCreatedAt]=useState<Date>()
    const [modalVisible,setModalVisible]=useState(false)
    const [title,setTitle]=useState("")
    const [password,setPassword]=useState("")
    const [newPassword,setNewPassword]=useState("")
    const [modalContent,setModalContent]=useState<React.ReactNode>(null)
    const visibile=useRecoilValue(visibleAtom)
    const setNetwork=useSetRecoilState(networkAtom)
    const network=useRecoilValue(networkAtom)
    type jwtDecoded={
        pubKey:string
        createdAt:Date
    }
    async function getDetails(){
        try {
        const accessTokken=sessionStorage.getItem("accessTokken") as string
        const user=await axios.post(`${import.meta.env.VITE_BACKEND_URL}/user/userDetails`,{},{
            headers:{
                Authorization:accessTokken
            }
        })
        if(!user) return alert("user not found")
        
        setFirstName(user.data.user.firstName)
        setLastName(user.data.user.lastName)
        setEmail(user.data.user.email)
        setWalletName(user.data.user.wallet_name)
        
        } catch (error) {
            throw error
        }
       
    }
    useEffect(()=>{
        getDetails()
    })

    useEffect(()=>{
        const accessTokken=sessionStorage.getItem("accessTokken")
        if(!accessTokken) return 
        const decode=jwtDecode<jwtDecoded>(accessTokken)
        const createdAtDate=new Date(decode.createdAt)
        setPubKey(decode.pubKey)
        setCreatedAt(createdAtDate)
        console.log(createdAt)
    },[])

    function sumit(){

    }


    function networkChange(){
       setModalVisible(true)
       setTitle("Select the network")
       setModalContent(
        <>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
  
  {/* Ethereum Mainnet */}
  <button
    onClick={()=>{
        setNetwork("mainnet")
        setModalVisible(false)
    }}
    className="group rounded-2xl bg-[#0b0f1a]/90 border border-white/10
               p-6 h-36 flex flex-col items-center justify-center
               hover:bg-[#0b0f1a]/50 hover:-translate-y-1
               transition-all duration-300 ease-out"
  >
    <img src="Eth.png" alt="Ethereum" className="h-8 w-8 mb-3" />
    <h1 className="text-sm font-medium text-white">
      Ethereum Mainnet
    </h1>
    <span className="text-xs text-white/50 mt-1">
      Live network
    </span>
  </button>

  {/* Sepolia */}
  <button
    className="group rounded-2xl bg-[#0b0f1a]/90 border border-white/10
               p-6 h-36 flex flex-col items-center justify-center
               hover:bg-[#0b0f1a]/50 hover:-translate-y-1
               transition-all duration-300 ease-out"
    onClick={()=>{
        setNetwork("sepolia")
        setModalVisible(false)
    }}
  >
    <img src="Eth.png" alt="Sepolia" className="h-8 w-8 mb-3 opacity-80" />
    <h1 className="text-sm font-medium text-white">
      Sepolia Testnet
    </h1>
    <span className="text-xs text-white/50 mt-1">
      Test network
    </span>
  </button>

  {/* Solana – Disabled */}
  <div
    className="rounded-2xl bg-[#0b0f1a]/40 border border-white/5
               p-6 h-36 flex flex-col items-center justify-center
               cursor-not-allowed"
  >
    <img src="solana.svg" alt="Solana" className="h-7 w-7 mb-3 opacity-40" />
    <h1 className="text-sm font-medium text-white/40">
      Solana
    </h1>
    <span className="text-xs text-white/30 mt-1">
      Coming soon
    </span>
  </div>
</div>
        </>
       )

    }
    
function privateKeyModal() {
  setModalVisible(true)
  setTitle("Private Key")

  setModalContent(
    <div className="flex flex-col gap-3 h-">
      
      {/* Warning */}
      <div className="rounded-lg border border-red-500/30 bg-red-500/10 p-3">
        <p className="text-sm text-red-400">
          Never share your private key with anyone. Anyone with access can steal your funds.
        </p>
      </div>

      {/* Instruction */}
      <h1 className="text-white/80 text-sm">
        Enter your password to reveal your private key
      </h1>

      {/* Password Input */}
      <div className="relative">
        <input
          type="password"
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Enter password"
          className="
            w-full h-12 rounded-lg
            bg-[#0B0C19]
            border border-white/10
            px-4
            text-white
            placeholder:text-white/40
            focus:outline-none
            focus:ring-2 focus:ring-blue-500/60
          "
        />
      </div>

      {/* Action Button */}
      <button
        className="
          mt-2 h-12 rounded-lg
          bg-blue-600 hover:bg-blue-700
          transition
          text-white font-medium
        "
        onClick={fetchPrivateKey}
      >
        Copy Private Key
      </button>
    </div>
  )
}

async function fetchPrivateKey(){
    const response=await axios.post(`${import.meta.env.VITE_BACKEND_URL_DEV}/user/getPrivateKey`,{
        password
    },{
        headers:{
            Authorization:sessionStorage.getItem("accessTokken")
        }
    })
    if(!response) return
    setPrivateKey(response.data.privateKey)
     navigator.clipboard.writeText(privateKey)
}


function supportModal(){
  setModalVisible(true)
  setTitle("Create a New Support ticket")
  setModalContent(
    <>
  <div className="flex flex-col gap-6">

    {/* Intro */}

    <p className="text-white/55 text-sm">
      Fill in the details below to raise a new support ticket.
    </p>

    <div className="grid grid-cols-1 gap-5">

      <div className="flex flex-col gap-1 items-start">
        <label className="text-white/75 text-sm">
          Subject
        </label>

        <input
          type="text"
          placeholder="Enter a short title for your issue"
          className="w-full h-10 rounded-md bg-white/90 px-3 text-sm text-black placeholder:text-black/40 border border-white/20 focus:outline-none focus:ring-2 focus:ring-blue-500/60"/>
      </div>

      {/* Description */}
      <div className="flex flex-col gap-1 items-start">
        <label className="text-white/75 text-sm">
          Description
        </label>

        <textarea
          placeholder="Describe your issue in detail..."
          className="
            w-full min-h-[160px] rounded-md
            bg-white/90
            px-3 py-2
            text-sm text-black
            placeholder:text-black/40
            border border-white/20
            resize-none
            focus:outline-none
            focus:ring-2 focus:ring-blue-500/60
          "
        />
      </div>

    </div>
  </div>
</>

  )
}

async function deleteModal(){
  setTitle("Delete Wallet")
  setModalVisible(true)
  setModalContent(
    <>
    <div className="flex flex-col gap-5">

  <div className="rounded-lg border border-red-500/40 bg-red-500/10 p-4">
    <p className="text-sm text-red-400 font-medium">
      This action is permanent and cannot be undone.
    </p>
    <p className="text-xs text-red-400/80 mt-1">
      All wallet data, keys, and access will be permanently deleted.
    </p>
  </div>

  <div className="flex flex-col gap-2">
    <label className="text-white/70 text-sm">
      Type <span className="font-semibold text-red-400">DELETE WALLET</span> to confirm
    </label>

    <input
      type="text"
      placeholder="DELETE WALLET"
      className="
        h-11 rounded-md
        bg-[#0B0C19]
        px-3
        text-white
        placeholder:text-white/30
        border border-red-500/30
        focus:outline-none
        focus:ring-2 focus:ring-red-500/60
      "
    />
  </div>

  <button
    className="
      mt-2 h-11 rounded-md
      bg-red-600/90 hover:bg-red-700
      text-white font-medium
      transition
      disabled:opacity-40 disabled:cursor-not-allowed
    "
  >
    Delete Wallet
  </button>

</div>

    </>
  )
}

function passwordModal(){
  setModalVisible(true)
  setTitle("Change Password")
  setModalContent(
   <>
  <div className="flex flex-col gap-6">

    <div className="flex flex-col gap-1">
      <p className="text-sm text-white/60">
        Protect your account with a strong, secure password.
      </p>
      <p className="text-sm text-white/40">
        Make sure it’s hard to guess and easy for you to remember.
      </p>
    </div>

    <div className="grid grid-cols-1 gap-5">

      <div className="flex flex-col gap-1 items-start">
        <label className="text-white/75 text-sm">
          Current password
        </label>
        <input
          type="password"
          onChange={(e)=>{
            setPassword(e.target.value)
          }}  
          className="
            h-11 rounded-md
            bg-[#0B0C19]
            w-full
            px-3
            text-white
            border border-white/15
            focus:outline-none
            focus:ring-2 focus:ring-blue-500/60
          "
        />
      </div>

      <div className="flex flex-col gap-1 items-start">
        <label className="text-white/75 text-sm">
          New password
        </label>
        <input
          type="password"
          placeholder="At least 6 characters"
          className="
            h-11 rounded-md
            bg-[#0B0C19]
            px-3
            w-full
            text-white
            placeholder:text-white/30
            border border-white/15
            focus:outline-none
            focus:ring-2 focus:ring-blue-500/60
          "
        />
      </div>

      <div className="flex flex-col gap-1 items-start">
        <label className="text-white/75 text-sm">
          Confirm new password
        </label>
        <input
          type="password"
          className="
            h-11 rounded-md
            bg-[#0B0C19]
            px-3
            w-full
            text-white
            border border-white/15
            focus:outline-none
            focus:ring-2 focus:ring-blue-500/60
          "
        />
      </div>

    </div>

    <button
      onClick={changePass}
      className="
        mt-2 h-11 rounded-md
        bg-blue-600 hover:bg-blue-700
        transition
        text-white font-medium
        disabled:opacity-40 disabled:cursor-not-allowed
      "
    >
      Change password
    </button>

  </div>
</>

  )
}

async function changePass(){
  const response=await axios.post(`${import.meta.env.VITE_BACKEND_URL_DEV}/user/passwordChange`,{

  })
}






  return (
    <>
        <NavSide />
        <div className='bg-[#0B0C19]/65 md:h-[200vh] h-[260vh] w-full'>
        <div className={`${visibile?"md:ms-[27vw]":"md:ms-[22vw]"} py-1 transition-all duration-300 ms-[5vw]`}>
            <h1 className='text-white font-bold text-3xl mt-10'>Account Settings</h1>
            <p className='text-white/45 py-2'>Manage your account preferences and security settings</p>
            
            <div className=' flex flex-col md:flex-row items-start'>

             {/* left Section */}
            <div className='grid grid-cols-1 gap-4'>
            <div className='bg-[#0B0C19] h-[50vh] md:w-[40vw] w-[90vw] rounded-xl mt-4 border border-white/10  '>
            <div className='px-5 py-4'>
                <div className='flex items-center justify-start '>
                    <User className='text-blue-500'/>
                    <h1 className='text-white text-xl font-bold px-2'>Profile Information</h1>
                </div>
                <div className='flex items-center justify-between'>
                    <div>
                    <p className='text-white/85 mt-9 '>First Name</p>
                    <p className='bg-[#171826] mt-2 w-[13vw] rounded-xl border border-white/10 h-9 text-white/45 px-4 flex items-center'>{firstName || 'FirstName'}</p>
                    </div>
                    <div className=''>
                    <p className='text-white/85 mt-9 '>Last Name</p>
                    <p  className='bg-[#171826] mt-2 w-[13vw] rounded-xl border border-white/10 h-9 text-white/45 px-4 flex items-center'>{lastName}</p>
                    </div>
            
                </div>
                <p className='text-white/85 mt-5 '>Wallet Name</p>
                <p className='bg-[#171826] mt-2 w-full rounded-xl border border-white/10 h-9 text-white/45 px-4 items-center flex'>{walletName}</p>
                <p className='text-white/85 mt-5 '>Email Address</p>
                <p className='bg-[#171826] mt-2 w-full rounded-xl border border-white/10 h-9 text-white/45 px-4 items-center flex'>{email}</p>
            </div>
            </div>

            <div className='bg-[#0B0C19] h-[50vh] md:w-[40vw] w-[90vw] rounded-xl mt-4 border-2 border-white/10  '>
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
                <Button content='Change' variant='quaternary' onClick={passwordModal} className='text-xs'/>
                </div>

                </div>
            </div>
            <div className='bg-[#0B0C19] h-[50vh] md:w-[40vw] w-[90vw] rounded-xl mt-4 border-2 border-white/10  '>
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
            <div className='grid grid-cols-1 gap-4 md:gap-5 md:px-10 mt-4'>
                <div className='bg-[#0B0C19] h-[30vh] md:w-[20vw] w-[90vw] rounded-xl border border-white/10 py-3 px-5' >
                    <h1 className='font-bold text-white'>Quick Actions</h1>
                    <div className='px-2 py-4 grid grid-cols-1 gap-4'>
                        <Button variant='quaternary' content='Export Private Key' frontIcon={<Download className='h-4 w-4'/>} className='text-sm' onClick={privateKeyModal}/>
                        <Button variant='quaternary' content='Network Settings'  frontIcon={<Globe className='h-4 w-4'/>} className='text-sm' onClick={networkChange}/>
                        <Button variant='quaternary' content='Contact Support' onClick={supportModal} frontIcon={<User className='h-4 w-4'/>} className='text-sm'/>
                        <Modal isOpen={modalVisible} onClose={()=>{setModalVisible(false)}} title={title} children={modalContent}/>
                    </div>
                </div>
                <div className='bg-[#0B0C19] h-[25vh] md:w-[20vw] w-[90vw] rounded-xl  border border-white/10 py-3 px-5' >
                    <h1 className='text-bold text-white '>Wallet Information</h1>
                    <div className='px-4 py-5 grid grid-cols-1 gap-4'>
                        <div className='flex items-center justify-between'>
                            <p className='text-sm text-white/45'>Address</p>
                            <p className='text-sm text-white/85'>{pubKey.slice(0,6)}...{pubKey.slice(-4)}</p>
                        </div>
                         <div className='flex items-center justify-between'>
                            <p className='text-sm text-white/45'>Network</p>
                            <p className='text-sm text-white/85'>Ethereum {network}</p>
                        </div>
                         <div className='flex items-center justify-between'>
                            <p className='text-sm text-white/45'>Created At</p>
                            <p className='text-sm text-white/85 '>{createdAt?.toLocaleString()}</p>
                        </div>
                    </div>
                </div>
                <div className='bg-[#0B0C19] h-[20vh] md:w-[20vw] w-[90vw] rounded-xl border border-red-500  py-3 px-5' >
                    <h1 className='text-red-500 font-bold'>Danger Zone</h1>
                    <button className='text-red-400 w-full border border-red-400 rounded-xl py-2 mt-3' onClick={deleteModal}><span className='flex items-center justify-start'><Trash2 className='h-4 w-4 text-red-400 me-2 ms-4'/>Delete Wallet</span></button>
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
