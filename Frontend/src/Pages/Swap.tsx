import React, { useState } from "react";
import { ArrowRight } from "lucide-react";

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
    <div className="flex justify-center mt-20">
      <div className="bg-[#0a0a16] rounded-2xl shadow-[0_0_30px_rgba(0,0,50,0.9)] border border-[#2c2c4a] h-[85vh] w-[44vw] flex flex-col items-center p-8">
        
        {/* Header */}
        <h1 className="text-white text-3xl font-bold mb-10">Swap</h1>

        {/* Dropdown Row */}
        <div className="flex items-center justify-center gap-12 w-full">
          {/* Left Select */}
          <select
            className="border border-white/40 rounded-2xl px-6 py-3 text-white bg-[#1a1a2e] focus:outline-none hover:bg-[#222240] transition"
            value={selectedLeft.name}
            onChange={(e) =>
              setSelectedLeft(coins.find((c) => c.name === e.target.value)!)
            }
          >
            {coins.map((coin) => (
              <option
                key={coin.name}
                value={coin.name}
                className="text-black"
              >
                {coin.name}
              </option>
            ))}
          </select>

          {/* Arrow */}
          <div className="flex justify-center items-center border rounded-full h-12 w-12 border-white bg-[#1a1a2e]">
            <ArrowRight className="text-white w-9 h-9" />
          </div>

          {/* Right Select */}
          <select
            className="border border-white/40 rounded-2xl px-6 py-3 text-white bg-[#1a1a2e] focus:outline-none hover:bg-[#222240] transition"
            value={selectedRight.name}
            onChange={(e) =>
              setSelectedRight(coins.find((c) => c.name === e.target.value)!)
            }
          >
            {coins.map((coin) => (
              <option
                key={coin.name}
                value={coin.name}
                className="text-black"
              >
                {coin.name}
              </option>
            ))}
          </select>
        </div>
        <div className="border-t-2 border-dotted border-gray-500 w-[34vw] mt-12"></div>
        <div>
          <div className="text-white/65 grid grid-cols-2 mt-4">
            <h1 className="text-xl text-center">Give</h1>
            <h1 className="text-xl text-center">Take</h1>
          </div>
          <div className="text-white/75 grid grid-cols-2 mt-4">
            <h1 className="flex justify-center text-2xl items-center px-9">
              <img
                src={selectedLeft.image}
                alt={selectedLeft.name}
                className="h-6 w-6 me-2"
              />
              124
            </h1>
            <h1 className="flex justify-center text-2xl items-center px-9">
              <img
                src={selectedRight.image}
                alt={selectedRight.name}
                className="h-6 w-6 me-2"
              />
              124
            </h1>
          </div>
        </div>
        <div className="border-t-2 border-dotted border-gray-500 w-[34vw] mt-10"></div>
        <div className="mt-10 space-y-3 w-[34vw]">
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
        <div className="border-t-2 border-dotted border-gray-500 w-[34vw] mt-10"></div>
        <button className="w-[25vw] text-white bg-white/15 p-3 rounded-2xl mt-6 border border-white hover:bg-white hover:text-black transition">
          Swap
        </button>
      </div>
    </div>
  );
}

export default Swap;
