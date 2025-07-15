import { useState } from "react"
import axios from 'axios'
import { useNavigate } from "react-router-dom"
import { Link } from "react-router-dom"
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
    <div className="bg-gray-600 min-h-screen min-w-screen fixed">
        <div className="flex mt-48 justify-center">
        <div className="bg-white min-h-96 rounded-xl   min-w-xl">
        SignUp
        <div>
        <input type="text" className="border mt-10 max-h-7 min-w-xs mx-[22%] text-center text-xl" placeholder="Username" value={username} onChange={(e)=>{setUsername((e.target as HTMLInputElement).value)}}/>
        </div>
        <div>
        <input type="text" className="border mt-10 max-h-7 min-w-xs mx-[22%] text-center text-xl" placeholder="Password" value={password} onChange={(e)=>{setPassword((e.target as HTMLInputElement).value)}}/>
        </div>
        <div>
        <button className="border mt-10 max-h-7 min-w-xs  mx-[22%] cursor-pointer hover:bg-sky-500" onClick={sign}>Submit</button>
        </div>
        <div>
          Already a user <Link to={"/signin"}>Signin</Link>
        </div>
      </div> 
        </div>
      
    </div>
  )
}

export default Signup
