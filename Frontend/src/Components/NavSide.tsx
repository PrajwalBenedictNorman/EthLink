import Navbar from "./Navbar"
import SideBar from "./SIdebar"
import { useEffect, useState } from "react"
   
function NavSide() {
  return (
    <div>
      <div className="opacity-0 md:opacity-100">
        <SideBar />
      </div>

        <Navbar />
    </div>
  )
}

export default NavSide
