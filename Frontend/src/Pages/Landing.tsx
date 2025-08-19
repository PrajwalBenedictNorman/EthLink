import Button from "../Components/Button";
import Logo from "../Components/Logo";
import gsap from 'gsap'
import {useGSAP} from '@gsap/react'
import ScrollTrigger from "gsap/ScrollTrigger"
import { Link, useNavigate } from "react-router";
import { useRef } from "react";

gsap.registerPlugin(ScrollTrigger)

function Landing() {
const navigate=useNavigate()

useGSAP(()=>{
  gsap.to(".hero-title",{opacity:1,delay:1,y:-50,duration:1})
  gsap.to(".hero-button",{opacity:1,delay:1.5,y:-30})

  gsap.fromTo(
      ".wallet-card",
      { opacity: 0, y: 100, scale: 0.9 },
      {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 1.2,
        ease: "power3.out",
        scrollTrigger: {
          trigger: ".wallet-card",
          start: "top 70%", 
          toggleActions: "play none none reverse",
        },
      }
    )

    // Floating animation (continuous subtle up & down)
    gsap.to(".wallet-card", {
      y: -10,
      duration: 3,
      ease: "sine.inOut",
      repeat: -1,
      yoyo: true,
    })

  const cards = ["#Card1", "#Card2", "#Card3", "#Card4"]

    cards.forEach((card, i) => {
      gsap.fromTo(
        card,
        { opacity: 0, y: 50 },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          delay: i * 0.3, // staggered timing
          scrollTrigger: {
            trigger: card,
            start: "top 50%", // when top of card hits 50% viewport height
            toggleActions: "play none none none", // play once
          },
        }
      )
    })
},[]) 


  return (
    <>
      {/* NavBar */}
      <div className="flex items-center justify-between sm:px-12 px-4 py-4  ">
        <div className="flex items-center gap-24 ">
          <Logo />
          <div className="lg:block hidden">
            <Link to={"/"} className="text-[#636878] ms-8 p-2 hover:underline">
              Home
            </Link>
            <Link to={"/"} className="text-[#636878] ms-8 p-2 hover:underline">
              About
            </Link>
            <Link to={"/"} className="text-[#636878] ms-8 p-2 hover:underline">
              Contact
            </Link>
            <Link to={"/"} className="text-[#636878] ms-8 p-2 hover:underline">
              Docs
            </Link>
          </div>
        </div>
        <div className="sm:flex hidden items-center gap-4">
          <Button variant="primary" content="Sign in" onClick={()=>{
            console.log("Clicked")
            navigate('/signin')}}/>
          <Button variant="primary" content="Sign up" onClick={()=>navigate('/signup')}/>
        </div>
        <div className="md:hidden">
          <button className="text-5xl text-white">&#x2630;</button>
        </div>
      </div>

      {/* Hero Section */}
      <div className="mt-44 text-center hero-title opacity-0">
        <h1 className="text-8xl text-white font-extrabold">Your Modern</h1>
        <h1 className="text-6xl text-white mt-4">
          <span className="bg-gradient-to-r from-purple-400 via-pink-500 to-blue-500 text-transparent bg-clip-text font-bold">
            Crypto
          </span>{" "}
          Wallet
        </h1>
        <p className="text-[#636878] text-xl mt-10">
          Securely manages your digital assets
        </p>
        <br />
        <div className="flex justify-center hero-button opacity-0">
           <Button
          variant="primary"
          content="Get Started"
          className="bg-gradient-to-tr from-violet-600 via-indigo-500 to-blue-500 text-white text-xl px-8 py-3  rounded-2xl  mt-8 hover:from-indigo-400 hover:to-violet-300 hover:transition-all duration-700"
          onClick={()=>navigate("/signup")}
        />
        </div>
      </div>

      {/* Scroll Section */}
      <div className="min-h-[200vh] mt-52 relative ">
        {/* Premium Tilt Card */}
        <div >
          <div

            className="
              relative mx-auto max-w-sm min-h-[420px] p-6 rounded-3xl
              bg-[#0f1118]/60 backdrop-blur-lg
              border border-transparent
              before:absolute before:inset-0 before:rounded-3xl
              before:bg-gradient-to-r before:from-purple-500/20 before:via-pink-500/20 before:to-blue-500/20 before:opacity-40
              after:absolute after:top-0 after:left-[-150%] after:w-[150%] after:h-full
              after:bg-gradient-to-r after:from-transparent after:via-white/20 after:to-transparent after:skew-x-12
              after:transition-all after:duration-700 hover:after:left-[150%]
              shadow-xl shadow-purple-900/30
              transition-transform duration-300 will-change-transform
              cursor-pointer overflow-hidden
              wallet-card
            "
          >
            <div className="relative z-10 space-y-6">
              {/* Header */}
              <div className="flex items-center justify-between">
                <h1 className="text-white text-3xl font-bold">Wallet</h1>
                <div className="bg-[#1a1c2c] px-3 py-1 rounded-xl flex items-center">
                  <img
                    src="EthereumCard.png"
                    alt="Ethereum"
                    className="h-8 w-8"
                  />
                  <p className="text-white ml-2">ETH</p>
                </div>
              </div>

              {/* Balance Section */}
              <div className="rounded-2xl  p-4 bg-gradient-to-r from-[#171731] to-[#212158]">
                <p className="text-[#999] text-sm">Balance</p>
                <p className="text-white text-3xl font-semibold">1.25 ETH</p>
                <p className="text-[#636878] text-sm">0x3689...9845</p>
              </div>

              {/* Token Section */}
              <div className="rounded-2xl p-4 bg-gradient-to-r from-purple-500/10 to-blue-500/10 border border-purple-500/30">
                <p className="text-[#999] text-sm">Raueuwt</p>
                <p className="text-white text-2xl  font-semibold">3.80 ETH</p>
                <p className="text-[#636878] text-sm">0x8I89...6945</p>
              </div>

              {/* USDC Section */}
              <div className="rounded-2xl  p-4 bg-[#121320]">
                <p className="text-white text-2xl  font-semibold">2,500 USDC</p>
                <p className="text-[#636878] text-sm">0x9a34...cr45</p>
              </div>
            </div>
          </div>
        </div>

        {/* Heading */}
        <div className="top-70 relative">
        <h1 className="text-white text-5xl text-center ">
          Everything in just one Click 
        </h1>
         {/* Placeholder Cards */}
        <div className="flex gap-8 mt-24 ms-14  overflow-x-auto pb-6" >
        <img src="Card1.png" alt="" className="md:h-[70vh] md:w-[40vw] h-[55vh] rounded-2xl " id="Card1"/>
        <img src="Card2.png" alt="" className="md:h-[70vh] md:w-[40vw] h-[55vh] rounded-2xl " id="Card2"/>
        <img src="Card3.png" alt="" className="md:h-[70vh] md:w-[40vw] h-[55vh] rounded-2xl " id="Card3"/>
        <img src="Card4.png" alt="" className="md:h-[70vh] md:w-[40vw] h-[55vh] rounded-2xl " id="Card4"/>
      </div>
        </div>

       <div className="min-h-[70svh] mt-[50svh]">
           <div className="text-center mt-20 px-6 relative ">
           <h2 className="text-4xl font-bold text-white">Security You Can Trust</h2>
           <p className="text-[#9da3b4] mt-3 text-lg">EthLink uses advanced encryption and never stores your private keys.</p>
  
          <div className="flex justify-center mt-10 gap-8 ">
           <div className="bg-white/10 backdrop-blur-lg p-6 rounded-2xl  max-w-sm">
           <img src="shield.png" alt="Shield" className="h-14 w-14 mx-auto"/>
            <h3 className="text-xl font-semibold text-white mt-4">Non-Custodial</h3>
             <p className="text-[#b5b8c5] mt-2 text-sm">You own your keys and assets. We never have access.</p>
           </div>
         <div className="bg-white/10 backdrop-blur-lg p-6 rounded-2xl  max-w-sm">
           <img src="lock.png" alt="Lock" className="h-14 w-14 mx-auto"/>
            <h3 className="text-xl font-semibold text-white mt-4">Bank-Grade Encryption</h3>
          <p className="text-[#b5b8c5] mt-2 text-sm">Data is secured with AES-256 encryption and HTTPS everywhere.</p>
         </div>
        </div>
      </div>
     </div>

     {/* Footer */}
  <footer className="bg-gradient-to-br from-[#2C2F48] to-[#1B1D2C] text-white py-10 px-8 min-h-[40svh] mt-4 md:mt-0">
  <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start gap-8">
    <div className="text-lg font-semibold">
      EthLink Presents
    </div>

    <div className="flex flex-col sm:flex-row gap-8 sm:gap-12">
      <div>
        <h1 className="text-md font-bold">PRODUCT</h1>
        <p className="text-xs py-2">Updates</p>
        <p className="text-xs py-2">Features</p>
        <p className="text-xs py-2">Reviews</p>
      </div>

      <div>
        <h1 className="text-md font-bold">ABOUT US</h1>
        <p className="text-xs py-2">Our Story</p>
        <p className="text-xs py-2">Made with Care</p>
        <p className="text-xs py-2">Blog</p>
      </div>

      <div>
        <h1 className="text-md font-bold">ASSISTANCE</h1>
        <p className="text-xs py-2">Terms & Conditions</p>
        <p className="text-xs py-2">Privacy Policy</p>
        <p className="text-xs py-2">Accessibility</p>
      </div>
    </div>
  </div>

  <div className="mt-12 pt-6 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-4">
    <p className="text-sm text-center md:text-left">
      © 2025 EthLink. Powered by Ethereum.
    </p>
    <button className="text-sm underline hover:text-blue-400">GitHub</button>
  </div>
</footer>
      </div>
    </>
  );
}

export default Landing;
