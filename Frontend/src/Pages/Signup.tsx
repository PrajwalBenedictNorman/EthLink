import { useState } from "react"
import axios from 'axios'
import { useNavigate } from "react-router-dom"
import { Link } from "react-router-dom"
import Button from "../Components/Button"
import Logo from "../Components/Logo"
import generateKeyPair from "../Wallet_Standard/eth_wallet"
import { mnemonicAtom } from "../store/atom/mnemonic"
import { useSetRecoilState } from "recoil"
function Signup() {
  const [firstName,setFirstName]=useState("")
  const [lastName,setLastName]=useState("")
  const [username,setUsername]=useState("")
  const [email,setEmail]=useState("")
  const [pubkey,setPubkey]=useState("")
  const [privatekey,setPrivatekey]=useState("")
  const [password,setPassword]=useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string>("")
  const [fieldErrors, setFieldErrors] = useState<{
    firstName?: string
    lastName?: string
    username?: string
    email?: string
    password?: string
  }>({})
  const navigate=useNavigate()
  const setMemonic=useSetRecoilState(mnemonicAtom)
  
  const validateInputs = () => {
    const errors: {
      firstName?: string
      lastName?: string
      username?: string
      email?: string
      password?: string
    } = {}

    if (!firstName.trim()) {
      errors.firstName = "First name is required"
    }

    if (!lastName.trim()) {
      errors.lastName = "Last name is required"
    }

    if (!username.trim()) {
      errors.username = "Username is required"
    } else if (username.includes(" ")) {
      errors.username = "Username cannot contain spaces"
    }

    if (!email.trim()) {
      errors.email = "Email is required"
    } else if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email)) {
      errors.email = "Please enter a valid email address"
    }

    if (!password.trim()) {
      errors.password = "Password is required"
    } else if (password.length < 6) {
      errors.password = "Password must be at least 6 characters"
    }

    setFieldErrors(errors)
    return Object.keys(errors).length === 0
  }

    async function sign(){
      setError("")
      setFieldErrors({})
      
      if (!validateInputs()) {
        return
      }

      setLoading(true)
      try {
        const acc=await generateKeyPair()
        console.log(acc.privateKey)
        console.log(acc.pubKey)
        console.log(acc.mnemonic)
        setMemonic(acc.mnemonic)
        const user=await axios.post(`${import.meta.env.VITE_BACKEND_URL}/user/signup`,{
          firstName:firstName.trim(),
          lastName:lastName.trim(),
          username:username.trim(),
          password:password,
          email:email.trim(),
          privateKey:acc.privateKey,
          pubKey:acc.pubKey
        })
        console.log(user)
        if(!user?.data) {
          setError(user?.data?.message || "Failed to create user")
          return
        }
        navigate("/signin")
      } catch (err: any) {
        if (axios.isAxiosError(err)) {
          const errorMessage = err.response?.data?.message || err.message || "An error occurred during sign up"
          setError(errorMessage)
        } else {
          setError("An unexpected error occurred")
        }
      } finally {
        setLoading(false)
      }
    } 

  return (
    <>
  <div className="bg-[#0f111a] md:bg-linear-to-br md:from-[#0f111a] md:to-[#1a1c2e] min-h-screen min-w-screen fixed ">
    <div className="md:ms-12 ms-4 mt-8">
      <Logo />
    </div> 
    <div className="flex mt-12 justify-center ">
    <div className="bg-[#161823] rounded-2xl p-8 border border-[#2a2d3e] shadow-xl w-full max-w-4xl min-h-[70vh] relative flex  justify-between ">
      <div className="hidden md:block md:w-1/2">
          {/* Cards */}
      </div>
<div>                                                                                                                                                                                                                                                 
        <h2 className="text-3xl text-white font-semibold me-24">Create an account</h2>
        <div className="flex items-center mt-6"><p className="text-white text-sm ">Already have an account?</p><Link to={'/signin'} className="text-white text-sm px-2 underline hover:text-blue-400">Log in</Link></div>
        <form action="submit" className="mt-12 ">
           <div className="flex flex-col md:flex-row md:space-x-2">
            <div className="w-full md:w-fit">
              <input 
                type="text" 
                placeholder="First Name" 
                className={`text-white px-4 py-2 rounded bg-[#272b3e7c] shadow-xl w-full md:w-fit border ${
                  fieldErrors.firstName ? 'border-red-500' : 'border-transparent'
                }`} 
                onChange={(e)=>{
                  setFirstName(e.target.value)
                  if (fieldErrors.firstName) {
                    setFieldErrors(prev => ({ ...prev, firstName: undefined }))
                  }
                  if (error) setError("")
                }}
              />
              {fieldErrors.firstName && (
                <p className="text-red-500 text-sm mt-1">{fieldErrors.firstName}</p>
              )}
            </div>
             <br className="block sm:hidden" /> 
            <div className="w-full md:w-fit md:ms-2">
              <input 
                type="text" 
                placeholder="Last Name" 
                className={`text-white px-4 py-2 rounded bg-[#272b3e7c] w-full md:w-fit border ${
                  fieldErrors.lastName ? 'border-red-500' : 'border-transparent'
                }`} 
                onChange={(e)=>{
                  setLastName(e.target.value)
                  if (fieldErrors.lastName) {
                    setFieldErrors(prev => ({ ...prev, lastName: undefined }))
                  }
                  if (error) setError("")
                }}
              />
              {fieldErrors.lastName && (
                <p className="text-red-500 text-sm mt-1">{fieldErrors.lastName}</p>
              )}
            </div>
           </div>
          <div className="mt-4">
            <input 
              type="text" 
              placeholder="Username" 
              className={`text-white px-4 py-2 rounded bg-[#272b3e7c] w-full border ${
                fieldErrors.username ? 'border-red-500' : 'border-transparent'
              }`} 
              onChange={(e)=>{
                setUsername(e.target.value)
                if (fieldErrors.username) {
                  setFieldErrors(prev => ({ ...prev, username: undefined }))
                }
                if (error) setError("")
              }}
            />
            {fieldErrors.username && (
              <p className="text-red-500 text-sm mt-1">{fieldErrors.username}</p>
            )}
          </div>
          <div className="mt-4">
            <input 
              type="text" 
              placeholder="Email" 
              className={`text-white px-4 py-2 rounded bg-[#272b3e7c] w-full border ${
                fieldErrors.email ? 'border-red-500' : 'border-transparent'
              }`} 
              onChange={(e)=>{
                setEmail(e.target.value)
                if (fieldErrors.email) {
                  setFieldErrors(prev => ({ ...prev, email: undefined }))
                }
                if (error) setError("")
              }}
            />
            {fieldErrors.email && (
              <p className="text-red-500 text-sm mt-1">{fieldErrors.email}</p>
            )}
          </div>
          <div className="mt-4">
            <input 
              type="password" 
              placeholder="Enter your password" 
              className={`text-white px-4 py-2.5 rounded bg-[#272b3e7c] w-full border ${
                fieldErrors.password ? 'border-red-500' : 'border-transparent'
              }`} 
              onChange={(e)=>{
                setPassword(e.target.value)
                if (fieldErrors.password) {
                  setFieldErrors(prev => ({ ...prev, password: undefined }))
                }
                if (error) setError("")
              }}
            />
            {fieldErrors.password && (
              <p className="text-red-500 text-sm mt-1">{fieldErrors.password}</p>
            )}
          </div>
        </form>
        
        {error && (
          <div className="mt-4 p-3 bg-red-500/20 border border-red-500 rounded-lg">
            <p className="text-red-400 text-sm">{error}</p>
          </div>
        )}
        <div className="flex items-center mt-6">
        <input type="checkbox"  /> <p className="text-white text-sm px-2">I agree to the <Link to={'/'} className="underline ">Terms & Conditions</Link></p>
        </div>
        <div className="flex justify-center">
        <Button 
          content={loading ? "Creating account..." : "Create account"} 
          variant="primary" 
          className="mt-6 text-center"  
          onClick={sign}
          disabled={loading}
        />
        </div>
        
        {loading && (
          <div className="flex justify-center mt-4">
            <div className="w-full max-w-xs bg-[#272b3e7c] rounded-full h-2 overflow-hidden">
              <div className="h-full bg-indigo-500 animate-pulse" style={{ width: '100%' }}></div>
            </div>
          </div>
        )}
        <div className="flex items-center gap-4 my-4">
          <div className="grow h-px bg-gray-300"></div>
          <span className="text-gray-500 text-sm">OR</span>
             <div className="grow h-px bg-gray-300"></div>
        </div>
        <div className="flex items-center justify-center">
          <img src="EthLa.png" alt="Ethereum icon" className="h-10 w-10 hover:-translate-y-2 duration-700"/>
          <img src="Metamask.png" alt="Metamask icon" className="h-10 w-10 ms-12  hover:-translate-y-2 duration-700"/>
        </div>

      </div>
    
    </div>
    </div>
  </div>
  </>
  )
}

export default Signup
