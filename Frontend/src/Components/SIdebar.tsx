import Logo2 from "../Components/Logo2";
import { useNavigate, } from "react-router";
import { useState,useEffect } from "react";
import {jwtDecode} from 'jwt-decode'
function SideBar() {
    const [firstName,setFirstName]=useState("")
    const [lastName,setLastName]=useState("")
    const [firstChar,setFirstChar]=useState("")
    const [lastChar,setLastChar]=useState("")
    const [visible,setVisible]=useState(true)
    let navigate=useNavigate()  

      type TokenPayload = {
  username: string;
  pubKey: string;
  userId:number
  firstName:string
  lastName:string  
};
    useEffect(()=>{const accessTokken=sessionStorage.getItem("accessTokken")
        console.log(accessTokken)
        try {
          if(!accessTokken) return 
           const decoded=jwtDecode<TokenPayload >(accessTokken)
        if (!decoded ) return
        setFirstName(decoded.firstName)
        setLastName(decoded.lastName)
        // console.log(ethAddress)
        } catch (error) {
          console.log("Error not got pubKey",error)
        }
      },[])

    useEffect(()=>{
  if(firstName && lastName){
    setFirstChar(firstName[0])
    setLastChar(lastName[0])
  }
 },[firstName,lastName])

  return (
    <div>
          {/* SideBar Section */}
    <div className={`bg-[#1a1d2a] min-h-screen w-[300px]  fixed ${visible ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-full"}`}>
      <div className="mt-4 px-1 flex items-center justify-between">
      <Logo2 />
      <button className="text-white text-xl me-4" onClick={()=>{setVisible(false)}}>&#x25C0;</button>
      
      </div>
      
      <div className="mt-10 px-7">
        <h1 className="text-[#636878] font-semibold">Overview</h1>
        <button className="text-white/65 py-2 flex items-center hover:underline  focus:text-white " onClick={()=>{navigate("/Home")}}><img src="home1.svg" alt="home icon" className="h-5 w-5 me-2" />Dashboard</button>
      </div>
      
    <div className="mt-10 px-7">
      <h1 className="text-[#636878] font-semibold">Functions</h1>
      <button className="text-white/65 py-2 flex items-center  hover:underline focus:text-white" onClick={()=>{navigate("/dapp")}}><img src="market.png" alt="home icon" className="h-5 w-5  me-2" />Dapp</button> <br />
      <button className="text-white/65 py-2 flex items-center hover:underline focus:text-white" onClick={()=>{navigate("/swap")}}><img src="swap.png" alt="home icon" className="h-5 w-5  me-2" />Swaps</button>
    </div>

    <div className="mt-10 px-7">
    <h1 className="text-[#636878] font-semibold">Settings</h1>
    <button className="text-white/65 py-4 flex items-center hover:underline focus:text-white" onClick={()=>{navigate("/accountSetting")}}><img src="setting.svg" alt="home icon" className="h-5 w-5 me-2" /> Account Settings</button>
    </div>
    <div className="mt-48">
        <div className="flex-grow h-px bg-gray-300 "></div>
        <button className="flex items-center mt-4 px-4 cursor-pointer">
         <div className="w-16 h-16 rounded-full bg-[#1F1F2E] text-white flex items-center justify-center text-xl font-semibold">
          {firstChar}{lastChar}
        </div>
        <h1 className="text-white text-xl ">{firstName} {lastName}</h1>
        </button> 
    </div>
   </div>
   {!visible && <button className="text-white text-2xl ms-4 mt-4" onClick={()=>setVisible(true)}>&#x25B6;</button>}
    </div>

  )
}

export default SideBar
