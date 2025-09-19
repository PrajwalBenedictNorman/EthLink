import type { ReactElement } from "react"
import clsx from "clsx";

type Variant = "primary" | "secondary" | "tertiary" | "quaternary" |"pentanary";

interface buttonProps {
  content:string,
  variant:Variant,
  frontIcon?:ReactElement,
  backIcon?:ReactElement,
  className?:string,
  onClick:()=>void
}

const variantStyles: Record<Variant, string> = {
  primary: "border-transparent bg-[##131328] rounded-xl hover:bg-[#2a328c] text-white px-4 py-2 p-1 cursor-pointer",
  secondary: " border-gray-400 rounded-xl text-gray-700 hover:bg-gray-100 px-4 py-2 cursor-pointer",
  tertiary:"boder-transparent bg-[#3C83F6] rounded-xl text-black cursor-pointer px-4 py-2 hover:bg-[#3C83F6]/85 ",
  quaternary :"bg-[#0B0C19]/65 rounded-xl text-white px-4 py-2 hover:bg-[#0B0C19]/45 border-1 border-white/45 hover:border-white cursor-pointer",
  pentanary:"bg-[#2F246B] hover:bg-[#3C83F6] hover:text-black rounded-xl px-4 text-white cursor-pointer"
};


function Button(props:buttonProps) {
  return (
    <button className={clsx(props.className,variantStyles[props.variant],'flex items-center gap-2 transition duration-1000 ')} onClick={props.onClick}>{props.frontIcon}{props.content}{props.backIcon}</button>
  )
}

export default Button
