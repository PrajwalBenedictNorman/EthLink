import React, { useState } from "react";
import { ArrowRight,ArrowDown } from "lucide-react";
import SideBar from "../Components/SIdebar";

type Coin = {
  name: string;
  image: string;
};

function Swap() {
  const coins: Coin[] = [
    { name: "Ethereum", image: "/ethSwap.png" },
    { name: "Bitcoin", image: "/Btc.png" },
    { name: "Solana", image: "/swapSol.png" },
  ];

  const [selectedLeft, setSelectedLeft] = useState<Coin>(coins[0]);
  const [selectedRight, setSelectedRight] = useState<Coin>(coins[1]);

  return (
    <>
    <SideBar />
    <div className="flex justify-center md:py-1 py-4 px-4 mt-12 ms-42 items-center">
      <div className="bg-[#0a0a16] rounded-2xl shadow-[0_0_30px_rgba(0,0,50,0.9)] border border-[#2c2c4a] 
        h-auto md:h-[85vh] w-full max-w-[800px] flex flex-col items-center p-6 sm:p-8">
        

        <h1 className="text-white text-2xl sm:text-3xl font-bold mb-8">Swap</h1>


        <div className="flex flex-col sm:flex-row items-center justify-center gap-6 sm:gap-12 w-full">

          <select
            className="border border-white/40 rounded-2xl px-4 sm:px-6 py-3 text-white bg-[#1a1a2e] 
              focus:outline-none hover:bg-[#222240] transition w-full sm:w-auto"
            value={selectedLeft.name}
            onChange={(e) =>
              setSelectedLeft(coins.find((c) => c.name === e.target.value)!)
            }
          >
            {coins.map((coin) => (
              <option key={coin.name} value={coin.name} className="text-black">
                {coin.name}
              </option>
            ))}
          </select>


          <div className="flex justify-center items-center border rounded-full h-10 w-10 sm:h-12 sm:w-12 border-white bg-[#1a1a2e]">
            <ArrowRight className="text-white w-6 h-6 sm:w-9 sm:h-9 md:block hidden" />
             <ArrowDown className="text-white w-10 h-10 block md:hidden " />
          </div>


          <select
            className="border border-white/40 rounded-2xl px-4 sm:px-6 py-3 text-white bg-[#1a1a2e] 
              focus:outline-none hover:bg-[#222240] transition w-full sm:w-auto"
            value={selectedRight.name}
            onChange={(e) =>
              setSelectedRight(coins.find((c) => c.name === e.target.value)!)
            }
          >
            {coins.map((coin) => (
              <option key={coin.name} value={coin.name} className="text-black">
                {coin.name}
              </option>
            ))}
          </select>
        </div>

        <div className="border-t-2 border-dotted border-gray-500 w-full max-w-[600px] mt-10"></div>
        <div className="w-full max-w-[600px]">
          <div className="text-white/65 grid grid-cols-2 mt-4 text-sm sm:text-base">
            <h1 className="text-center">Give</h1>
            <h1 className="text-center">Take</h1>
          </div>
          <div className="text-white/75 grid grid-cols-2 mt-4">
            <h1 className="flex justify-center text-lg sm:text-2xl items-center px-4 sm:px-9">
              <img src={selectedLeft.image} alt={selectedLeft.name} className="h-5 w-5 sm:h-6 sm:w-6 me-2" />
              124
            </h1>
            <h1 className="flex justify-center text-lg sm:text-2xl items-center px-4 sm:px-9">
              <img src={selectedRight.image} alt={selectedRight.name} className="h-5 w-5 sm:h-6 sm:w-6 me-2" />
              124
            </h1>
          </div>
        </div>
        <div className="border-t-2 border-dotted border-gray-500 w-full max-w-[600px] mt-10"></div>
        <div className="mt-8 space-y-3 w-full max-w-[600px] text-sm sm:text-base">
          <div className="flex justify-between text-white/60">
            <span>Price Per Share</span>
            <span>1 Stakely Ethereum</span>
          </div>
          <div className="flex justify-between text-white/60">
            <span>Pool Health</span>
            <span>90%</span>
          </div>
          <div className="flex justify-between text-white/60">
            <span>Internal Price</span>
            <span>1 Stakely Ethereum</span>
          </div>
          <div className="flex justify-between text-white/60">
            <span>Transaction Cost</span>
            <span>$4.50</span>
          </div>
        </div>
        <div className="border-t-2 border-dotted border-gray-500 w-full max-w-[600px] mt-10"></div>
        <button className="w-full sm:w-[70%] text-white bg-white/15 p-3 rounded-2xl mt-6 border border-white 
          hover:bg-white hover:text-black transition">
          Swap
        </button>
      </div>
    </div>
    </>
  );
}

export default Swap;
