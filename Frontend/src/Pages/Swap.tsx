import Button from "../Components/Button"
import Navbar from "../Components/Navbar"
import NavSide from "../Components/NavSide"
import SideBar from "../Components/SIdebar"
import { ArrowUpDown,TrendingUp, Zap } from "lucide-react"
function Swap() {
  return (
    <div>
      <NavSide />
       <div className='bg-[#0B0C19]/65 h-screen w-full flex flex-col items-center'>
       <h1 className="text-3xl font-bold text-white mt-10">Swap Tokens</h1>
       <p className="text-white/55 py-2">Exchange tokens instantly with the best rates</p>

       {/* Main card */}
       <div className="bg-[#11121f] h-[62vh] md:w-[38vw] w-[90vw] mt-4 rounded-xl shadow-2xl border-2 border-white/10">
        <div className="px-10 py-6">
          <h1 className="text-white text-2xl font-bold py-1">Swap</h1>
          <div className="flex items-center justify-between py-1">
            <p className="text-white/45 py-1">From</p>
            <p className="text-white/45 py-1">Balance : 0.00 ETH</p>
          </div>
          <div className="">
            <input type="text" placeholder="0.0" className="bg-[#171826] w-full h-8 rounded-md text-white px-3 "/>
            {/* drop down */}
          </div>
          <div className="flex items-center justify-center h-12 mt-2">
          <ArrowUpDown size={32} className="text-white bg-[#171826] border-2 border-white/15 p-1 rounded-full" />
          </div>
          <div className="flex items-center justify-between py-1">
            <p className="text-white/45">To</p>
            <p className="text-white/45">Balance : 0.00 BTC</p>
          </div>
          <div className="mt-1.5">
            <input type="text" placeholder="0.0" className="bg-[#171826] w-full h-8 rounded-md text-white px-3"/>
            {/* drop down */}
          </div>

          {/*TODO: Appears after amount enter */}
          <div className="bg-[#171826] h-25 w-full rounded-xl mt-6">
            <div className="px-3 py-2">
            <div className="flex items-center justify-between py-1">
            <p className="text-white/45 text-sm">Exchange Rate</p>
            <p className="text-white/85 text-sm">1 ETH = 1.854.32 USDC</p>
            </div>
            <div className="flex items-center justify-between py-1">
            <p className="text-white/45 text-sm">Network Fee</p>
            <p className="text-white/85 text-sm">~$12.50</p>
            </div>
            <div className="flex items-center justify-between py-1">
            <p className="text-white/45 text-sm">Route</p>
            <p className="text-white/85 text-sm">ETH - USDC</p>
            </div>
            </div>
          </div>
          <div className="text-center flex items-center justify-center py-8">
            <Button content="Enter Amount" variant="tertiary" onClick={()=>{}} />
          </div>
        </div>
       </div>

        {/* Volume Cards */}
        <div className="flex items-center">
        <div className="bg-[#11121f] h-[10vh] md:w-[18vw] w-[40vw] mt-4 rounded-xl shadow-2xl border-2 border-white/10 me-4">
        <div className="flex items-center px-2 py-1">
        <TrendingUp className="text-green-500"/>
        <p className="text-white/75 ms-2">24h Volume</p>
        </div>
        <p className="text-white font-bold px-2 text-xl">$1.5B</p>
        </div>
        <div className="bg-[#11121f] h-[10vh] md:w-[18vw] w-[40vw] mt-4 rounded-xl shadow-2xl border-2 border-white/10 ms-4">
        <div className="flex items-center px-2 py-1">
          <Zap className="text-blue-500"/>
          <p className="text-white/75 ms-2">Avg. Time</p>
        </div>  
          <p className="text-white font-bold px-2 text-xl">~ 1.5s</p>
        </div>
        </div>


       </div>
    </div>
  )
}3

export default Swap
