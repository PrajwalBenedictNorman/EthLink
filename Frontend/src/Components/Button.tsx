import type { ReactElement } from "react"
import clsx from "clsx";

type Variant = "primary" | "secondary";

interface buttonProps {
  content:string,
  variant:Variant,
  frontIcon?:ReactElement,
  backIcon?:ReactElement,
  className?:string,
}

const variantStyles: Record<Variant, string> = {
  primary: "border-transparent bg-[##131328] rounded-xl hover:bg-[#2a328c] text-white px-4 py-2 p-1 cursor-pointer",
  secondary: " border-gray-400 rounded-xl text-gray-700 hover:bg-gray-100 px-4 py-2 cursor-pointer",
};


function Button(props:buttonProps) {
  return (
    <button className={clsx(props.className,variantStyles[props.variant],'flex items-center gap-2 transition duration-1000 ')}>{props.content}</button>
  )
}

export default Button
