import { Bell,User,PanelLeft } from "lucide-react"
import { useState } from "react"
import { useRecoilValue, useSetRecoilState } from "recoil";
import { visibleAtom } from "../store/atom/visible";

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
  return (
    <>
    <header className="bg-[#10111E]/85 border-white/10 h-16 border-1 flex items-center justify-between px-6 shadow-sm">
        <div>
            <PanelLeft className={`text-white/65 h-4 w-4 ${visible?"ms-[17vw]":"ms-[6vw]"}`} onClick={visibility}/>
        </div>
        <div className="flex justify-center text-white items-center ">
            <div className="px-2">
            <p className="text-white/65 text-sm">Current Gas Price</p>
            <p className="text-blue-500 text-xl">25 Gwei</p>
            </div>
            <Bell className="ms-3 me-3 text-white/65"/>
            <User className="ms-3 me-3 text-white/65" />
        </div>
    </header>
    </>
  )
}

export default Navbar
