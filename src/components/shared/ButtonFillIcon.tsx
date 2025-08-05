import React from 'react'
import { Button } from '../ui/button'

const Button_Fill_Icon = ({ 
  type, text, bgColor, height, width, icon
}: { 
  type?: "button" | "submit" | "reset",
  text: string,
  bgColor: string,
  height?: string,
  width?: string,
  icon: React.ReactNode,
}) => {
  return (
    <Button type={type? type : 'button'} className={`bg-[#33E89C]/10 w-[${width ? width : '150px'}] h-[${height ? height : '30px'}] rounded-full text-xs text-[#33E89C] font-semibold cursor-pointer flex items-center gap-3 hover:bg-[#33E89C] hover:text-white transition-all`}>
      {icon}
      {text}
    </Button>
  )
}

export default Button_Fill_Icon;