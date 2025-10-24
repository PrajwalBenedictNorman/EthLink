import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Buffer } from 'buffer';
import process from 'process';
window.Buffer = Buffer;
window.process = process;
import './index.css';
// import App from './App.tsx'
import { RouterProvider,createBrowserRouter } from 'react-router-dom'
import Signin from './Pages/Signin'
import Signup from './Pages/Signup'
import Landing from './Pages/Landing'
import Home from './Pages/Home'
import "./Wallet_Standard/RegisterWallet"
import Connect from './Pages/Connect'
import Dapp from './Pages/Dapp';
import Swap from './Pages/Swap';
import AccountSettting from './Pages/AccountSettting';
import Docs from './Pages/Docs';
import { RecoilRoot } from 'recoil';
const router=createBrowserRouter([
  {
    path:"/",
    element:<Landing />,
  },
      {
        path:"/signin",
        element:<Signin />
      },
      {
        path:"/signup",
        element:<Signup />
      },
      {
        path:"/Home",
        element:<Home />,
      },
      {
       path:"/Home/connect",
       element:<Connect />
     },{
      path:"/dapp",
      element:<Dapp />
     },
     {
      path:"/swap",
      element:<Swap />
     },
     {
      path:"/accountSetting",
      element:<AccountSettting />
     },
     {
      path:"/docs",
      element:<Docs />
     }

])

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RecoilRoot>
      <RouterProvider router={router} />
    </RecoilRoot>
  </StrictMode>,
)
