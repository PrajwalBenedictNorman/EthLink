import { useEffect, useState } from "react"
import {jwtDecode} from 'jwt-decode'
import axios from "axios";
import Button from "../Components/Button";
import { useNavigate } from "react-router";
import SideBar from "../Components/SIdebar";
import Navbar from "../Components/Navbar";
import { ArrowUpRight,ArrowDownRight,Wallet,TrendingUp,Activity } from "lucide-react";
function Home() {

  type TokenPayload = {
  username: string;
  pubKey: string;
  userId:number
  firstName:string
  lastName:string  
};
  const [visible,setVisible]=useState(true)

  const [Balance,setBalance]=useState(0)
  const [ethAddress,setEthAddress]=useState("")
  const [verified,setverified]=useState(false)
  const  [showModal,setShowModal]=useState(false)
  const [sendAddress,setSendAddress]=useState("")
  const [sendAmt,setSendAmt]=useState("")

  const [gasPrice,setGasPrice]=useState(0)
  let navigate=useNavigate()  
  
  useEffect(()=>{const accessTokken=sessionStorage.getItem("accessTokken")
    console.log(accessTokken)
    try {
      if(!accessTokken) return 
       const decoded=jwtDecode<TokenPayload >(accessTokken)
    if (!decoded ) return
    setverified(true)
    setEthAddress(decoded.pubKey)
    } catch (error) {
      console.log("Error not got pubKey",error)
    }
  },[])
  
 useEffect(()=>{
  if (!ethAddress || typeof ethAddress !== 'string') return;
 setInterval(()=>{ async function getBalance(){
    const resp=await axios.post(`https://eth-sepolia.g.alchemy.com/v2/${import.meta.env.VITE_ALCHEMY_API_KEY}`,{
        "jsonrpc": "2.0",
  "method": "eth_getBalance",
  "params": [
    ethAddress,
    "latest"
  ],
  "id": 1
    })
    if(!resp) return;
    console.log(resp)
   const eth=parseInt(resp.data.result, 16) / Math.pow(10, 18)
    setBalance(eth)
  }
  getBalance()},2000)
 
 },[ethAddress])

async function sendTansaction(){
  const token=sessionStorage.getItem("accessTokken")
  // todo check if wallet exists and the amt is genuien 
  console.log("reached")
    console.log(sendAddress,sendAmt)
    const hash=await axios.post(`${import.meta.env.VITE_BACKEND_URL}/user/signAndSendTransaction`,{
      "receiverAddress":sendAddress,
      "amt":sendAmt
    },{
      headers:{
        Authorization:token
      }
    })
    console.log(hash)
    if(!hash) return 
    //todo remove this and use eth_getTransactionReceipt
    const txhash=hash.data.hash
    const resp=await getTransaction(txhash)
    if(!resp) return
    alert("Transaction successfull")
    setShowModal(false)

  }
 async function getTransaction(txhash:string)
  {
    const response=await axios.post(`https://eth-sepolia.g.alchemy.com/v2/${import.meta.env.VITE_ALCHEMY_API_KEY}`,{
      "jsonrpc": "2.0",
  "method": "eth_getTransactionByHash",
  "params": [txhash],
  "id": 1
    })  
    // if(!response || !response.data.blockNumber) return
    if(!response) return;
    return response
  }
  // return (
  // //   <div className="bg-[#25274D] min-h-screen fixed min-w-screen">
  // //     {verified && <> <div className="bg-[#AAABB8]  min-h-25  flex justify-between items-center">
  // //         <div>
  // //           <h1 className="text-6xl font-bold mx-10">EthLink</h1>
  // //         </div>
  // //         <div> 
  // //           <img src="profile.png" alt="User Profile" onClick={()=>{}} />
  // //         </div>
  // //       </div>
  // //       <div className="flex justify-between items-center">
  // //         <div>
  // //           <div className="mx-[95%]">
  // //            <h1 className="text-5xl font-medium text-white  mt-6">
  // //             Balance 
  // //             </h1>     
  // //           <p className=" mt-5 text-2xl text-white ">{Balance} Eth</p>
  // //        </div>
  // //        </div>
  // //         <div>
  // //           <p className="text-white text-xl me-20 "> Gas Price</p>
  // //           <p className="text-white mt-5">coming soon ...</p>
  // //         </div>
  // //       </div>

  // //       <div className="flex justify-evenly mt-32">
  // //         <div>
  // //           <button className="bg-[#464866] rounded-2xl p-4 cursor-pointer text-white text-xl  " onClick={()=>{setShowModal(true)}}>Send</button>
  // //           {showModal && <>
  // //           <div
  // //   className="fixed inset-0 z-50 bg-transparent bg-opacity-50 flex items-center justify-center"
  // //   onClick={() => setShowModal(false)} // close on background click
  // // >
  // //   {/* Prevent background click from closing when clicking inside modal */}
  // //   <div
  // //     className="bg-white rounded-xl p-6 w-96 shadow-xl"
  // //     onClick={(e) => e.stopPropagation()}
  // //   >
  // //     <div className="flex justify-between items-center mb-4">
  // //       <h2 className="text-xl font-bold">Send ETH</h2>
  // //       <button
  // //         onClick={() => setShowModal(false)}
  // //         className="text-gray-500 hover:text-black"
  // //       >
  // //         &times;
  // //       </button>
  // //     </div>
  // //    <input type="text" className="border rounded min-w-xs text-center mt-7" placeholder="Address to send" onChange={(e)=>{setSendAddress(e.target.value)}}/>
  // //    <input type="text" className="border rounded min-w-xs text-center mt-7" placeholder="Amount to send" onChange={(e)=>{setSendAmt(e.target.value)}}/>
  // //    <button className="bg-[#464866] rounded-2xl p-2 cursor-pointer text-white text-xl mt-7 " onClick={sendTansaction}>Send </button>
  // //   </div>
  // // </div>
  // //           </>}
  // //         </div>
  // //          <div>
  // //           <button className="bg-[#464866] rounded-2xl p-4 cursor-pointer text-white text-xl">Receive</button>
  // //         </div>
  // //          <div>
  // //           <button className="bg-[#464866] rounded-2xl p-4 cursor-pointer text-white text-xl">Withdraw</button>
  // //         </div>
  // //       </div>
  // //       <div className="mt-10 mx-40 bg-[#A8D0E6] rounded-3xl min-h-screen ">
  // //         <div>
  // //           <h1 className="text-2xl mt-16 mx-10 "> Transaction History</h1>
  // //         </div>
  // //       </div>
  // //        </>}

       
  // //   </div>
  // )
  return(
    <>
    <div className="bg-[#0B0C19]/65 h-[120vh] w-screen">
      <SideBar />
      <Navbar />

      {/* Hero Section */}
      <div className="text-center text-white mt-20 flex flex-col items-center justify-center">
        <h1 className="text-white/65 text-4xl py-2">Balance</h1>
        <p className="text-6xl py-2 font-bold">0 ETH</p>
        <div className="flex items-center justify-center mt-10">
        <Button content="Send" variant="tertiary" onClick={()=>{}} frontIcon={<ArrowUpRight className="h-4 w-4"/>} className="px-8 ms-4 me-4"/>
        <Button content="Receive" variant="quaternary" frontIcon={<ArrowDownRight className="h-4 w-4"/>} onClick={()=>{}} className="px-8 ms-4 me-4"/>
        </div>
      </div>
      {/* Cards */}
      <div className="ms-[22vw] mt-10">
        <div className="grid grid-cols-3 gap-6">
          <div className="bg-[#0B0C19] h-40 w-85 rounded-xl  border-2 border-[#1A1B28]">
            <div className="flex items-center justify-start mt-4">
              <Wallet size={32} className="text-[#3C83F6] p-1 ms-4 me-1 bg-[#202132] rounded-md"/>
              <p className="text-white ms-1 me-2">Portfolio Value</p>
            </div>
            <p className="text-white font-bold text-2xl py-2 px-4">$0.00</p>
            <p className="text-white/45 px-4">+0.00% (24h)</p>
          </div>
          <div className="bg-[#0B0C19] h-40 w-85 rounded-xl  border-2 border-[#1A1B28]">
            <div className="flex items-center justify-start mt-4">
              <TrendingUp size={32} className="text-purple-500 p-1 ms-4 me-1 bg-[#202132] rounded-md"/>
              <p className="text-white ms-1 me-2">Total Transactions</p>
            </div>
            <p className="text-white font-bold text-2xl py-2 px-4">0</p>
            <p className="text-white/45 px-4">All time</p>
          </div>
          <div className="bg-[#0B0C19] h-40 w-85 rounded-xl  border-2 border-[#1A1B28]">
            <div className="flex items-center justify-start mt-4">
              <Activity size={32} className="text-[#3C83F6] p-1 ms-4 me-1 bg-[#202132] rounded-md"/>
              <p className="text-white ms-1 me-2">Network Status</p>
            </div>
            <p className="text-green-500 font-bold text-2xl py-2 px-4">Active</p>
            <p className="text-white/45 px-4">Ethereum Mainnet</p>
          </div>
        </div>
        {/* Transaction History Card */}
        <div className="bg-[#0B0C19] h-85 w-[77vw] mt-4 border-2 border-[#1A1B28] rounded-xl ">
          <h1 className="font-bold text-xl text-white px-4 py-2">
            Transaction History
          </h1>
          <div className=" flex flex-col items-center justify-between mt-10">
            <Activity size={48} className="text-white/55 "/>
            <p className="text-white/55 py-3 ">No transaction yet</p>
            <p className="text-white/55">Your transaction history will appear here once you start using EthLink</p>
          </div>
        </div>  
      </div>
    </div>
     
    </>
  )
}

export default Home
