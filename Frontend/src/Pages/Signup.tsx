import { useState } from "react"
import axios from 'axios'
import { useNavigate } from "react-router-dom"
import { Link } from "react-router-dom"
import Button from "../Components/Button"
function Signup() {
    const [username,setUsername]=useState("")
    const [password,setPassword]=useState("")
    const navigate=useNavigate()

    async function sign(){
      const user=await axios.post("http://localhost:3000/user/signup",{username,password})
      if(!user) return alert("No user created")
      navigate("/signin")
    } 
  return (
    <>
  <div className="bg-[#0f111a] md:bg-gradient-to-br md:from-[#0f111a] md:to-[#1a1c2e] min-h-screen min-w-screen fixed flex items-center justify-center">
    <div className="bg-[#161823] rounded-2xl p-8 border border-[#2a2d3e] shadow-xl w-full max-w-4xl min-h-[70vh] relative flex  justify-between ">
      <div>
        {/* Card */}
      </div>
      <div>
        <h2 className="text-3xl text-white font-semibold me-24">Create an account</h2>
        <div className="flex items-center mt-6"><p className="text-white text-sm ">Already have an account?</p><Link to={'/signin'} className="text-white text-sm px-2 underline hover:text-blue-400">Log in</Link></div>
        <form action="submit" className="mt-12 ">
           <input type="text" placeholder="First Name" className="text-white px-4 py-2 rounded bg-[#272b3e7c] shadow-xl "/> <input type="text" placeholder="Last Name" className="text-white px-4 py-2 rounded bg-[#272b3e7c] ms-2"/>
           <br />
          <input type="text" placeholder="Username" className="text-white px-4 py-2 rounded bg-[#272b3e7c] mt-4 w-full"/>
          <br />
          <input type="password" placeholder="Enter your password" className="text-white px-4 py-2.5 rounded bg-[#272b3e7c] mt-4 w-full"/>
          <br />
        </form>
        <div className="flex items-center mt-6">
        <input type="checkbox"  /> <p className="text-white text-sm px-2">I agree to the <Link to={'/'} className="underline ">Terms & Conditions</Link></p>
        </div>
        <div className="flex justify-center">
        <Button content="Create account" variant="primary" className="mt-8 text-center"/>
        </div>
      </div>
    </div>
  </div>
  </>
  )
}

export default Signup
