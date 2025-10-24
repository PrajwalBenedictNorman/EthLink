export function LogoIcon(){
  return (
   <svg width="58" height="58" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
  <circle cx="32" cy="32" r="32" fill="#1F1F2E"/>
  <path d="M32 10L20 32L32 26L44 32L32 10Z" fill="#8C8CFF"/>
  <path d="M32 54L44 36L32 42L20 36L32 54Z" fill="#4A4AFF"/>
</svg>
  )
}

function Logo2() {
  return (
    <div className="text-white flex items-center gap-2">
      <LogoIcon />
     <h1 className="sm:text-4xl text-5xl ">EthLink</h1>
    </div>
  )
}

export default Logo2
