import { useState } from "react"
import axios from 'axios'
import { useNavigate } from "react-router-dom"
import { Link } from "react-router-dom"
import Button from "../Components/Button"
import Logo from "../Components/Logo"
import generateKeyPair from "../Wallet_Standard/eth_wallet"
function Signup() {
  const [firstName,setFirstName]=useState("")
  const [lastName,setLastName]=useState("")
  const [username,setUsername]=useState("")
  const [email,setEmail]=useState("")
  const [pubkey,setPubkey]=useState("")
  const [privatekey,setPrivatekey]=useState("")
  const [mnemonic,setMnemonic]=useState("")
  const [password,setPassword]=useState("")
  const navigate=useNavigate()

    async function sign(){
      const acc=await generateKeyPair()
      console.log(acc.privateKey)
      console.log(acc.pubKey)
      console.log(acc.mnemonic)
      const user=await axios.post(`${import.meta.env.VITE_BACKEND_URL}/user/signup`,{firstName:firstName,lastName:lastName,username:username,password:password,email:email,privateKey:acc.privateKey,pubKey:acc.pubKey})
      console.log(user)
      if(!user) return alert("No user created")
      navigate("/signin")
    } 

  return (
    <>
  <div className="bg-[#0f111a] md:bg-linear-to-br md:from-[#0f111a] md:to-[#1a1c2e] min-h-screen min-w-screen fixed ">
    <div className="md:ms-12 ms-4 mt-8">
      <Logo />
    </div> 
    <div className="flex mt-12 justify-center ">
    <div className="bg-[#161823] rounded-2xl p-8 border border-[#2a2d3e] shadow-xl w-full max-w-4xl min-h-[70vh] relative flex  justify-between ">
      <div className="hidden md:block md:w-1/2">
          {/* Cards */}
      </div>
<div>                                                                                                                                                                                                                                                 
        <h2 className="text-3xl text-white font-semibold me-24">Create an account</h2>
        <div className="flex items-center mt-6"><p className="text-white text-sm ">Already have an account?</p><Link to={'/signin'} className="text-white text-sm px-2 underline hover:text-blue-400">Log in</Link></div>
        <form action="submit" className="mt-12 ">
           <div className="flex flex-col md:flex-row md:space-x-2">
            <input type="text" placeholder="First Name" className="text-white px-4 py-2 rounded bg-[#272b3e7c] shadow-xl w-full md:w-fit" onChange={(e)=>setFirstName(e.target.value)}/>
             <br className="block sm:hidden" /> 
            <input type="text" placeholder="Last Name" className="text-white px-4 py-2 rounded bg-[#272b3e7c]  w-full md:w-fit md:ms-2" onChange={(e)=>setLastName(e.target.value)}/>
           </div>
          <input type="text" placeholder="Username" className="text-white px-4 py-2 rounded bg-[#272b3e7c] mt-4 w-full" onChange={(e)=>setUsername(e.target.value)}/>
          <br />
          <input type="text" placeholder="Email" className="text-white px-4 py-2 rounded bg-[#272b3e7c] mt-4 w-full" onChange={(e)=>setEmail(e.target.value)}/>
          <br />
          <input type="password" placeholder="Enter your password" className="text-white px-4 py-2.5 rounded bg-[#272b3e7c] mt-4 w-full" onChange={(e)=>setPassword(e.target.value)}/>
          <br />
        </form>
        <div className="flex items-center mt-6">
        <input type="checkbox"  /> <p className="text-white text-sm px-2">I agree to the <Link to={'/'} className="underline ">Terms & Conditions</Link></p>
        </div>
        <div className="flex justify-center">
        <Button content="Create account" variant="primary" className="mt-6 text-center"  onClick={sign}/>
        </div>
        <div className="flex items-center gap-4 my-4">
          <div className="grow h-px bg-gray-300"></div>
          <span className="text-gray-500 text-sm">OR</span>
             <div className="grow h-px bg-gray-300"></div>
        </div>
        <div className="flex items-center justify-center">
          <img src="EthLa.png" alt="Ethereum icon" className="h-10 w-10 hover:-translate-y-2 duration-700"/>
          <img src="Metamask.png" alt="Metamask icon" className="h-10 w-10 ms-12  hover:-translate-y-2 duration-700"/>
        </div>

      </div>
    
    </div>
    </div>
  </div>
  </>
  )
}

export default Signup
