import { useEffect, useState } from "react"
import {jwtDecode} from 'jwt-decode'
import axios from "axios";
import Button from "../Components/Button";
import { ArrowUpRight,ArrowDownRight,Wallet,TrendingUp,Activity } from "lucide-react";
import Modal from "../Components/Modal";
import {QRCodeSVG} from 'qrcode.react'
import NavSide from "../Components/NavSide";
import { useRecoilValue } from "recoil";
import { visibleAtom } from "../store/atom/visible";
function Home() {

  type TokenPayload = {
  username: string;
  pubKey: string;
  userId:number
  firstName:string
  lastName:string  
};
  const [visible,setVisible]=useState(false)
  const [title,setTitle]=useState("")
  const [modalContent,setModalContent]=useState<React.ReactNode>(null)
  const [Balance,setBalance]=useState(0)
  const [ethAddress,setEthAddress]=useState("")
  const [verified,setverified]=useState(false)
  const [sendAddress,setSendAddress]=useState("")
  const [sendAmt,setSendAmt]=useState("")
  const [gasPrice,setGasPrice]=useState(0)
  const vsid=useRecoilValue(visibleAtom)
  
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
  function sendModal(){
    setVisible(true)
    setTitle("Send Eth to others")
    setModalContent(
      <>
      <div className="grid grid-cols-1 gap-4">
      <input type="text" className="rounded w-full h-10 bg-white" placeholder="Enter receiver address"/>
      <input type="text" className="rounded w-full h-10 bg-white" placeholder="Enter amount to send"/>
      </div>
      </>
    )
  }
  function receiveModal(){
    setVisible(true)
    setTitle("Receive Eth from others")
    setModalContent(
      <>
      <h1>THis for receiving</h1>
       <QRCodeSVG value="0x871C39752cBd7FBebB1E7dd71EBc12e8A19f9FA5" />
      </>
    )
  }

  return(
 <>
  <div className="bg-[#0B0C19]/65 min-h-screen w-full overflow-x-hidden">
    {/* Sidebar + Navbar */}
    <NavSide />

    {/* Hero Section */}
    <section className="text-center text-white mt-20 flex flex-col items-center justify-center px-4">
      <h1 className="text-white/65 text-3xl sm:text-4xl py-2">Balance</h1>
      <p className="text-4xl sm:text-6xl py-2 font-bold">0 ETH</p>

      <div className="flex flex-wrap items-center justify-center gap-4 mt-8">
        <Button
          content="Send"
          variant="tertiary"
          onClick={sendModal}
          frontIcon={<ArrowUpRight className="h-4 w-4" />}
          className="px-6 sm:px-8"
        />
        <Button
          content="Receive"
          variant="quaternary"
          frontIcon={<ArrowDownRight className="h-4 w-4" />}
          onClick={receiveModal}
          className="px-6 sm:px-8"
        />
      </div>
    </section>

    {/* Modal */}
    <Modal
      isOpen={visible}
      onClose={() => setVisible(false)}
      title={title}
      children={modalContent}
    />

    {/* Cards Section */}
    <section
      className={`mt-10 transition-all duration-300 ${
        vsid ? "md:ml-[22vw]" : "md:ml-[10vw]"
      } px-4`}
    >
      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Portfolio Value */}
        <div className="bg-[#0B0C19] rounded-xl border-2 border-[#1A1B28] p-4 h-40">
          <div className="flex items-center mt-2">
            <Wallet
              size={32}
              className="text-[#3C83F6] p-1 mr-2 bg-[#202132] rounded-md"
            />
            <p className="text-white">Portfolio Value</p>
          </div>
          <p className="text-white font-bold text-2xl py-2">$0.00</p>
          <p className="text-white/45">+0.00% (24h)</p>
        </div>

        {/* Total Transactions */}
        <div className="bg-[#0B0C19] rounded-xl border-2 border-[#1A1B28] p-4 h-40">
          <div className="flex items-center mt-2">
            <TrendingUp
              size={32}
              className="text-purple-500 p-1 mr-2 bg-[#202132] rounded-md"
            />
            <p className="text-white">Total Transactions</p>
          </div>
          <p className="text-white font-bold text-2xl py-2">0</p>
          <p className="text-white/45">All time</p>
        </div>

        {/* Network Status */}
        <div className="bg-[#0B0C19] rounded-xl border-2 border-[#1A1B28] p-4 h-40">
          <div className="flex items-center mt-2">
            <Activity
              size={32}
              className="text-[#3C83F6] p-1 mr-2 bg-[#202132] rounded-md"
            />
            <p className="text-white">Network Status</p>
          </div>
          <p className="text-green-500 font-bold text-2xl py-2">Active</p>
          <p className="text-white/45">Ethereum Mainnet</p>
        </div>
      </div>

      {/* Transaction History */}
      <div
        className={`bg-[#0B0C19] rounded-xl border-2 border-[#1A1B28] mt-6 p-6 transition-all duration-300 ${
          vsid ? "md:w-[77vw]" : "md:w-[85vw]"
        } w-full`}
      >
        <h1 className="font-bold text-lg sm:text-xl text-white mb-4">
          Transaction History
        </h1>
        <div className="flex flex-col items-center justify-center text-center mt-6">
          <Activity size={48} className="text-white/55" />
          <p className="text-white/55 py-2 text-sm sm:text-base">
            No transaction yet
          </p>
          <p className="text-white/45 text-xs sm:text-sm">
            Your transaction history will appear here once you start using
            EthLink
          </p>
        </div>
      </div>
    </section>
  </div>
</>

  )
}

export default Home
