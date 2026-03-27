import { Bell,User,PanelLeft } from "lucide-react"
import { useEffect, useState } from "react"
import { useRecoilValue, useSetRecoilState } from "recoil";
import { visibleAtom } from "../store/atom/visible";
import axios from "axios";

export interface NavProps{
visible:boolean;
setVisible: React.Dispatch<React.SetStateAction<boolean>>;
}


function Navbar() {

const setVisible=useSetRecoilState(visibleAtom)
const visible=useRecoilValue(visibleAtom)
function visibility(){
    console.log("Clicked")
    setVisible(visible=>!visible)
}
const [price,setPrice]=useState(0)
 async function gasPrice(){
        const response=await axios.post(`${import.meta.env.VITE_BACKEND_URL_DEV}/user/gasPrice`)
        if(!response) return alert("Gas price not fetched")
            console.log(response)
        const hexValue=response.data.result
        console.log(hexValue)
        const wei=BigInt(hexValue)
        console.log(wei)
        const gwei=Number(wei)/1e9
        console.log(gwei) 
        setPrice(Math.round(gwei*10)/10)
    }
useEffect(()=>{
   gasPrice()
},[])
  return (
    <>
    <header className="bg-[#10111E]/85 border-white/10 h-16 border-1 flex items-center justify-between px-6 shadow-sm">
        <div>
            <PanelLeft className={`text-white/65 h-4 w-4 ${visible?"ms-[17vw]":"ms-[6vw]"}`} onClick={visibility}/>
        </div>
        <div className="flex justify-center text-white items-center ">
            <div className="px-2">
            <p className="text-white/65 text-sm">Current Gas Price</p>
            <p className="text-blue-500 text-xl">{price} Gwei</p>
            </div>
            <Bell className="ms-3 me-3 text-white/65"/>
            <User className="ms-3 me-3 text-white/65" />
        </div>
    </header>
    </>
  )
}

export default Navbar
