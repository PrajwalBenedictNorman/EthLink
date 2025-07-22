import { useEffect, useState } from "react"
import {jwtDecode} from 'jwt-decode'
import axios from "axios";
import Logo from "../Components/Logo";
import Button from "../Components/Button";
import { useNavigate } from "react-router";
function Home() {

  type TokenPayload = {
  username: string;
  pubKey: string;
  userId:number
};
  const [firstName,setFirstName]=useState("Prajwal")
  const [lastName,setLastName]=useState("Norman")
  const [Balance,setBalance]=useState(0)
  const [ethAddress,setEthAddress]=useState("")
  const [verified,setverified]=useState(false)
  const  [showModal,setShowModal]=useState(false)
  const [sendAddress,setSendAddress]=useState("")
  const [sendAmt,setSendAmt]=useState("")
  const [firstChar,setFirstChar]=useState("")
  const [lastChar,setLastChar]=useState("")
  const [gasPrice,setGasPrice]=useState(0)
  let navigate=useNavigate()  
  
  useEffect(()=>{const accessTokken=sessionStorage.getItem("accessTokken")
    try {
      if(!accessTokken) return 
       const decoded=jwtDecode<TokenPayload >(accessTokken)
    if (!decoded ) return
    console.log(decoded)
    setverified(true)
    console.log(decoded.pubKey)
    setEthAddress(decoded.pubKey)
    // console.log(ethAddress)
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

 useEffect(()=>{
  
  if(firstName && lastName){
    setFirstChar(firstName[0])
    setLastChar(lastName[0])
  }
 },[])


async function sendTansaction(){
  const token=sessionStorage.getItem("accessTokken")
  // todo check if wallet exists and the amt is genuien 
  console.log("reached")
    console.log(sendAddress,sendAmt)
    const hash=await axios.post("http://localhost:3000/user/signAndSendTransaction",{
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
    {/* SideBar Section */}
    <div className="bg-[#1a1d2a] min-h-screen w-[320px]  fixed ">
      <div className="mt-4 px-1">
      <Logo />
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
    <button className="text-white/65 py-4 flex items-center hover:underline focus:text-white"><img src="setting.svg" alt="home icon" className="h-5 w-5 me-2" /> Account Settings</button>
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
     {/* Main DAashboard */}
    <div className="ms-[321px]">
      <div className="flex items-center justify-between mt-24">
          <div className=" px-24">
          <h1 className="text-white/55 text-5xl font-light "> Balance</h1>
          <p className="text-white mt-9 text-2xl">{Balance} ETH</p>
         </div>
         <div>
          <h1 className="text-white/55 me-24">Current Gas Price ...</h1>
          <p className="text-white mt-9 ">{gasPrice} ETH</p>
         </div>
      </div>
    

      <div className="flex items-center mt-18 ms-24">
        <Button variant="primary" content="Send" className="px-6 me-2" onClick={()=>{}}/>
        <Button variant="primary" content="Receive" className="px-6 ms-2" onClick={()=>{}}/>
      </div>

      <div className="mt-24 px-24">
        <h1 className="text-white text-xl">Transaction History</h1>
      </div>
    </div>
    

    
    
    </>
  )
}

export default Home
