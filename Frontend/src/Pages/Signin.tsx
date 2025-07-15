import { useEffect, useRef, useState } from "react"
import { useNavigate, useSearchParams } from "react-router-dom"
import axios from "axios"
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
  <div className="bg-gray-600 min-h-screen min-w-screen fixed">
        <div className="flex mt-48 justify-center">
        <div className="bg-white min-h-96 rounded-xl   min-w-xl">
        SignIn
        <div>
        <input type="text" className="border mt-10 max-h-7 min-w-xs mx-[22%] text-center text-xl" placeholder="Username"  ref={usernameRef}/>
        </div>
        <div>
        <input type="text" className="border mt-10 max-h-7 min-w-xs mx-[22%] text-center text-xl" placeholder="Password" ref={passwordRef}/>
        </div>
        <div>
        {!navigation && <button className="border mt-10 max-h-7 min-w-xs  mx-[22%] cursor-pointer hover:bg-sky-500" onClick={signinn}>Submit</button>}  
        {navigation && <button className="border mt-10 max-h-7 min-w-xs  mx-[22%] cursor-pointer hover:bg-sky-500" onClick={dappSignin}>Submit</button>}  
        </div>
      </div> 
        </div>
      
    </div>
  )
}

export default Signin
