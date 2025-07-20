import { useEffect, useRef, useState } from "react"
import { useNavigate, useSearchParams } from "react-router-dom"
import axios from "axios"
import Logo from "../Components/Logo"
import Button from "../Components/Button"
function Signin() {
  const navigate=useNavigate()
  const [searchParam,setSearchParam]=useSearchParams()
  const [navigation,setNavigation]=useState(false)
  const redirectUri=searchParam.get('redirect_uri') 
  const functionParam=searchParam.get("function") as string
  const usernameRef=useRef<HTMLInputElement>(null)
  const passwordRef=useRef<HTMLInputElement>(null)

  useEffect(()=>{
    if(functionParam) setNavigation(true)
  },[functionParam])

   async function signinn(){
        const username=usernameRef.current?.value
        const password=passwordRef.current?.value
        console.log(username,password)
        const user=await axios.post("http://localhost:3000/user/signin",{username,password})
        if (!user) return alert("User not found") 
        else{console.log(user); navigate("/Home"); sessionStorage.setItem("accessTokken",user.data.accessTokken)} 
    }

    async function dappSignin(){
         const username=usernameRef.current?.value
        const password=passwordRef.current?.value
        console.log(username,password)
        const user=await axios.post("http://localhost:3000/user/signin",{username,password})
        if (!user){
          return alert("User not found") 
          //todo redirect to dapp with no user
        } else{
          if(redirectUri){
             sessionStorage.setItem("accessTokken",user.data.accessTokken)
             navigate(`/Home/connect?redirect_uri=${encodeURIComponent(redirectUri)}&function=${functionParam}`)
          }else{
            alert('no redirect')
          }
        }

    }
  return (
  <>
   <div className="bg-[#0f111a] md:bg-gradient-to-br md:from-[#0f111a] md:to-[#1a1c2e] min-h-screen min-w-screen fixed">
  <div className="md:ms-12 ms-4 mt-8">
    <Logo />
  </div>

  <div className="flex justify-center items-center mt-12 md:mt-0 min-h-[85vh]">
    <div className="bg-[#161823] rounded-2xl p-8 border border-[#2a2d3e] shadow-xl w-full max-w-4xl min-h-[70vh] flex flex-col md:flex-row justify-between gap-8">
      <div className="md:w-1/2 flex flex-col justify-center">
        <h2 className="text-3xl text-white font-semibold">Welcome Back!</h2>
        <p className="text-white text-sm mt-6 text-left">
          Securely connect to the decentralized world with <span className="animate-pulse text-indigo-400 font-medium">EthLink</span>,<br />
          your trusted bridge to Web3.
        </p>

        <div className="mt-8 space-y-5">
          <input
            type="text"
            name="username"
            placeholder="Username"
            className="text-white px-4 py-2 rounded bg-[#272b3e7c] w-full"
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            className="text-white px-4 py-2 rounded bg-[#272b3e7c] w-full"
          />
        </div>

        <div className="flex justify-center">
          <Button variant="primary" content="Sign in" className="mt-8 text-center" />
        </div>

        <div className="flex items-center gap-4 my-6">
          <div className="flex-grow h-px bg-gray-600" />
          <span className="text-gray-400 text-sm">OR</span>
          <div className="flex-grow h-px bg-gray-600" />
        </div>

        <div className="flex items-center justify-center gap-12">
          <img src="EthLa.png" alt="Ethereum icon" className="h-10 w-10 hover:-translate-y-2 duration-700" />
          <img src="Metamask.png" alt="Metamask icon" className="h-10 w-10 hover:-translate-y-2 duration-700" />
        </div>
      </div>


      <div className="hidden md:block md:w-1/2">

      </div>
    </div>
  </div>
</div>

  </>
  )
}

export default Signin
