import { useEffect, useState } from "react"
import {jwtDecode} from 'jwt-decode'
import axios from "axios";
import Button from "../Components/Button";
import { ArrowUpRight,ArrowDownRight,Wallet,TrendingUp,Activity,Copy } from "lucide-react";
import Modal from "../Components/Modal";
import {QRCodeSVG} from 'qrcode.react'
import NavSide from "../Components/NavSide";
import { useRecoilValue } from "recoil";
import { visibleAtom } from "../store/atom/visible";
import { networkAtom } from "../store/atom/network";
function Home() {

  type TokenPayload = {
  username: string;
  pubKey: string;
  userId:number
  firstName:string
  lastName:string  
};

type Tx = {
  from: string;
  to: string;
  hash: string;
  value: string;
  incoming:boolean
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
  const[portfolioValue,setPortfolioValue]=useState(0)
  const [showHistory,setShowHistory]=useState(false)
  const [sender,setSender]=useState<string[]>([])
  const [receiver,setReceiver]=useState<string[]>([])
  const [hash,setHash]=useState<string[]>([])
  const [amount,setAmount]=useState<number[]>([])
  const [incoming,setIncoming]=useState<boolean[]>([])
  const vsid=useRecoilValue(visibleAtom)
  const network=useRecoilValue(networkAtom)
  
  
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
  getBalance()},20000)
 
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
    setTitle("Send Ethereum to others")
    setModalContent(
      <>
      <div className="grid grid-cols-1 gap-6">
      <input type="text" className="rounded w-full h-12 bg-white pl-3" placeholder="Enter receiver address"/>
      <input type="text" className="rounded w-full h-12 bg-white pl-3" placeholder="Enter ethereums to send"/>
      </div>
      </>
    )
  }
  function receiveModal(){
    setVisible(true)
    setTitle("Receive Ethereum from others")
    setModalContent(
      <>
  <h1 className="text-white/55 text-center">This for receiving</h1>
  <div className="mt-1.5 flex justify-center">
    <QRCodeSVG value={ethAddress} />
  </div>
</>
    )
  }


  async function txHistory(){
    const transaction=await axios.post(`${import.meta.env.VITE_BACKEND_URL_DEV}/user/txHistory`,{network:network},{headers:{
      authorization:sessionStorage.getItem("accessTokken")
      }})
      console.log(transaction)
      if (transaction?.data.length>0) {
        const txs = transaction.data; 
        setSender(txs.map((tx:Tx) => tx.from));
        setReceiver(txs.map((tx:Tx) => tx.to));
        setHash(txs.map((tx:Tx) => tx.hash));
        setAmount(txs.map((tx:Tx) => tx.value));
        setIncoming(txs.map((tx:Tx)=>tx.incoming))
  setShowHistory(true);

      console.log(sender)
      console.log(receiver)
}
  }

  useEffect(()=>{
    setInterval(()=>{
      txHistory()
    },30000)
  },[])

  function short(val: string) {
  return `${val.slice(0, 6)}…${val.slice(-4)}`;
}
type rate={
  ethereum:{
    usd:number
  }
}
async function portfolio(){
  // if(network=="mainnet"){
    const usdRate:rate=await axios.get("https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd")
  if(!usdRate) return alert("Usd rates not found")
    console.log(usdRate)
    // const usd:number=usdRate.ethereum.usd
    // console.log(usd)
    // const value=Balance*usd
    // console.log(value)
    //  setPortfolioValue(value)
  // }
  
}




function copyText(){

}
  return(
 <>
  <div className="bg-[#0B0C19]/65 min-h-screen w-full overflow-x-hidden">
    {/* Sidebar + Navbar */}
    <NavSide />

    {/* Hero Section */}
    <section className="text-center text-white mt-20 flex flex-col items-center justify-center px-4">
      <h1 className="text-white/65 text-3xl sm:text-4xl py-2">Balance</h1>
      <p className="text-4xl sm:text-6xl py-2 font-bold">{Balance.toFixed(3)} ETH</p>

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
          <p className="text-white font-bold text-2xl py-2">${portfolioValue.toFixed(2)}</p>
          <p className="text-white/45">+0.00% (24h)</p>
        </div>

        {/* Total Transactions */}
        <div className="bg-[#0B0C19] rounded-xl border-2 border-[#1A1B28] p-4 h-40">
          <div className="flex items-center mt-2">
            <TrendingUp
              size={32}
              className="text-purple-500 p-1 mr-2 bg-[#202132] rounded-md"
            />
            <p className="text-white">Activity (24 hrs)</p>
          </div>
          <p className="text-white font-bold text-2xl py-2">3 transactions</p>
          <p className="text-green-300/70">+0.15 net</p>
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
          <p className="text-white/45">Ethereum {network}</p>
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

        {!showHistory && <div className="flex flex-col items-center justify-center text-center mt-6">
          <Activity size={48} className="text-white/55" />
          <p className="text-white/55 py-2 text-sm sm:text-base">
            No transaction yet
          </p>
          <p className="text-white/45 text-xs sm:text-sm">
            Your transaction history will appear here once you start using
            EthLink
          </p>
        </div>
        }
        {showHistory && (
  <div className="mt-6 rounded-xl bg-[#0b0f1a] p-4">
    {/* Header */}
    <div className="grid grid-cols-4 text-xs text-white/50 pb-2 border-b border-white/10">
      <div>From</div>
      <div>To</div>
      <div>Amount</div>
      <div>Signature</div>
    </div>

    {/* Rows */}
    {sender.map((_, i) => (
      <div
        key={i}
        className="grid grid-cols-4 items-center py-2 text-xs text-white/80 border-b border-white/5 hover:bg-white/5 transition"
      >
        <div className="font-mono flex items-center">{short(sender[i])} <span><Copy className="text-white/65 mx-3" size={16} onClick={copyText}/></span></div>
        <div className="font-mono flex items-center">{short(receiver[i])} <span><Copy className="text-white/65 mx-3" size={16} onClick={copyText}/></span></div> 
        <div className="font-semibold"><span className={incoming[i]==true ? "text-green-400" : "text-red-400"}>
  {incoming[i]==true ? "+" : "-"}{amount[i]} ETH
</span></div>
        <div className="font-mono text-blue-400 flex items-center">
          {short(hash[i])}
          <span><Copy className="text-white/65 mx-3" size={16} onClick={copyText}/></span>
        </div>
      </div>
    ))}
  </div> 
)}

      </div>
    </section>
  </div>
</>

  )
}

export default Home
