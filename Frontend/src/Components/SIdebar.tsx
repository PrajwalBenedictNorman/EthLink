import Logo2, { LogoIcon } from "../Components/Logo2";
import { useNavigate, } from "react-router-dom";
import { useState,useEffect } from "react";
import {jwtDecode} from 'jwt-decode'
import { ChartColumn,Layers,ArrowLeftRight,Settings } from "lucide-react";
import { useRecoilValue } from "recoil";
import { visibleAtom } from "../store/atom/visible";

function SideBar() {
    const [firstName,setFirstName]=useState("")
    const [lastName,setLastName]=useState("")
    const [firstChar,setFirstChar]=useState("")
    const [lastChar,setLastChar]=useState("")
    const visible=useRecoilValue(visibleAtom)
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
    <>
      <div>
          {/* SideBar Section */}
    {visible && <div className={`bg-[#0B0C19] min-h-screen w-[260px] fixed`}>
      <div className="mt-4 px-1 flex items-center justify-between">
      <Logo2 />
      </div>
      
      <div className="mt-10 px-7">
        <h1 className="text-[#636878] font-semibold">Overview</h1>
        <button className="text-white/65 py-2 flex items-center hover:underline focus:text-white " onClick={()=>{navigate("/Home")}}><ChartColumn className="h-5 w-5 me-2"/>Dashboard</button>
      </div>
      
    <div className="mt-10 px-7">
      <h1 className="text-[#636878] font-semibold">Functions</h1>
      <button className="text-white/65 py-2 flex items-center  hover:underline focus:text-white" onClick={()=>{navigate("/dapp")}}><Layers className="h-5 w-5 me-2"/>Dapp</button> <br />
      <button className="text-white/65 py-2 flex items-center hover:underline focus:text-white" onClick={()=>{navigate("/swap")}}><ArrowLeftRight className="h-5 w-5 me-2"/>Swaps</button>
    </div>

    <div className="mt-10 px-7">
    <h1 className="text-[#636878] font-semibold">Settings</h1>
    <button className="text-white/65 py-4 flex items-center hover:underline focus:text-white" onClick={()=>{navigate("/accountSetting")}}><Settings className="h-5 w-5 me-2"/>Account Settings</button>
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
   }
   {
    !visible &&
    <div className="bg-[#0B0C19] min-h-screen w-[90px] fixed border-r-2 border-white/10 ">
      <div className="flex flex-col items-center gap-10 mt-6">
        <LogoIcon />
        <hr className="border-white/15 -my-5 w-full "/>
        <ChartColumn className="h-6  w-6  text-white/65" onClick={()=>{navigate("/Home")}}/>
        <Layers className="h-6 w-6  text-white/65" onClick={()=>{navigate("/dapp")}}/>
        <ArrowLeftRight className="h-6 w-6 text-white/65" onClick={()=>{navigate("/swap")}}/>
        <Settings className="h-6 w-6 text-white/65" onClick={()=>{navigate("/accountSetting")}}/>
      </div>
    </div>
   }
    </div>
    </>
  )
}

export default SideBar
