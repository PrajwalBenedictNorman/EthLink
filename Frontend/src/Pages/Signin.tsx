import { useEffect, useRef, useState } from "react"
import { useNavigate, useSearchParams } from "react-router-dom"
import axios from "axios"
import Logo from "../Components/Logo"
import Button from "../Components/Button"
import { seedEncrypt } from "../Wallet_Standard/seedEncryption"
import { useRecoilValue } from 'recoil'
import { mnemonicAtom } from "../store/atom/mnemonic"

function Signin() {
  const navigate=useNavigate()
  const [searchParam,setSearchParam]=useSearchParams()
  const [navigation,setNavigation]=useState(false)
  const redirectUri=searchParam.get('redirect_uri') 
  const functionParam=searchParam.get("function") as string
  const usernameRef=useRef<HTMLInputElement>(null)
  const passwordRef=useRef<HTMLInputElement>(null)
  const mnemonic = useRecoilValue(mnemonicAtom)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string>("")
  const [fieldErrors, setFieldErrors] = useState<{username?: string, password?: string}>({})

  useEffect(()=>{
    if(functionParam) setNavigation(true)
  },[functionParam])

  const validateInputs = () => {
    const username = usernameRef.current?.value?.trim()
    const password = passwordRef.current?.value?.trim()
    const errors: {username?: string, password?: string} = {}

    if (!username) {
      errors.username = "Username is required"
    } else if (username.includes(" ")) {
      errors.username = "Username cannot contain spaces"
    }

    if (!password) {
      errors.password = "Password is required"
    } else if (password.length < 6) {
      errors.password = "Password must be at least 6 characters"
    }

    setFieldErrors(errors)
    return Object.keys(errors).length === 0
  }

   async function signinn(){
        setError("")
        setFieldErrors({})
        
        if (!validateInputs()) {
          return
        }

        const username=usernameRef.current?.value?.trim()
        const password=passwordRef.current?.value?.trim()
        
        setLoading(true)
        try {
          const user=await axios.post(`${import.meta.env.VITE_BACKEND_URL}/user/signin`,{username,password})
          if (!user?.data?.accessTokken) {
            setError(user?.data?.message || "User not found")
            return
          }
          if (mnemonic) {
            await seedEncrypt(password as string, mnemonic)
          }
          sessionStorage.setItem("accessTokken", user.data.accessTokken);
          navigate("/Home");
        } catch (err: any) {
          if (axios.isAxiosError(err)) {
            const errorMessage = err.response?.data?.message || err.message || "An error occurred during sign in"
            setError(errorMessage)
          } else {
            setError("An unexpected error occurred")
          }
        } finally {
          setLoading(false)
        }
    }

    async function dappSignin(){
         setError("")
         setFieldErrors({})
         
         if (!validateInputs()) {
           return
         }

         const username=usernameRef.current?.value?.trim()
         const password=passwordRef.current?.value?.trim()
         
         setLoading(true)
         try {
           const user=await axios.post(`${import.meta.env.VITE_BACKEND_URL_DEV}/user/signin`,{username,password})
           if (!user?.data?.accessTokken) {
             setError(user?.data?.message || "User not found")
             return
           }
           if(redirectUri){
              sessionStorage.setItem("accessTokken",user.data.accessTokken)
              navigate(`/Home/connect?redirect_uri=${encodeURIComponent(redirectUri)}&function=${functionParam}`)
           }else{
             setError('No redirect URI provided')
           }
         } catch (err: any) {
           if (axios.isAxiosError(err)) {
             const errorMessage = err.response?.data?.message || err.message || "An error occurred during sign in"
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
   <div className="bg-[#0f111a] md:bg-gradient-to-br md:from-[#0f111a] md:to-[#1a1c2e] min-h-screen min-w-screen fixed">
  <div className="md:ms-12 ms-4 mt-8">
    <Logo />
  </div>

  <div className="flex justify-center items-center mt-12 md:mt-0 min-h-[85vh]">
    <div className="bg-[#161823] rounded-2xl p-8 border border-[#2a2d3e] shadow-xl w-full max-w-4xl min-h-[70vh] flex flex-col md:flex-row justify-between gap-8">
      <div className="md:w-1/2 flex flex-col justify-center">
        <h2 className="text-3xl text-white font-semibold">Welcome Back!</h2>
        <p className="text-white text-sm mt-6 text-left">
          Securely connect to the decentralized world with <span className="animate-pulse text-indigo-400 font-medium">EthLink</span>,<br />
          your trusted bridge to Web3.
        </p>

        <div className="mt-8 space-y-5">
          <div>
            <input
              type="text"
              ref={usernameRef}
              name="username"
              placeholder="Username"
              className={`text-white px-4 py-2 rounded bg-[#272b3e7c] w-full border ${
                fieldErrors.username ? 'border-red-500' : 'border-transparent'
              }`}
              onChange={() => {
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
          <div>
            <input
              type="password"
              ref={passwordRef}
              name="password"
              placeholder="Password"
              className={`text-white px-4 py-2 rounded bg-[#272b3e7c] w-full border ${
                fieldErrors.password ? 'border-red-500' : 'border-transparent'
              }`}
              onChange={() => {
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
        </div>

        {error && (
          <div className="mt-4 p-3 bg-red-500/20 border border-red-500 rounded-lg">
            <p className="text-red-400 text-sm">{error}</p>
          </div>
        )}

        <div className="flex justify-center">
          <Button 
            variant="primary" 
            content={loading ? "Signing in..." : "Sign in"} 
            className="mt-8 text-center" 
            onClick={signinn}
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

        <div className="flex items-center gap-4 my-6">
          <div className="flex-grow h-px bg-gray-600" />
          <span className="text-gray-400 text-sm">OR</span>
          <div className="flex-grow h-px bg-gray-600" />
        </div>

        <div className="flex items-center justify-center gap-12">
          <img src="EthLa.png" alt="Ethereum icon" className="h-10 w-10 hover:-translate-y-2 duration-700" />
          <img src="Metamask.png" alt="Metamask icon" className="h-10 w-10 hover:-translate-y-2 duration-700" />
        </div>
      </div>


      <div className="hidden md:block md:w-1/2">

      </div>
    </div>
  </div>
</div>

  </>
  )
}

export default Signin
