import React from 'react'
import { Button } from '../ui/button'

const LabelWithBadge = ({ 
  label, badgeColor, textColor, className, icon
}: {   
  label: string,
  badgeColor?: string,
  textColor?: string,
  className?: string,
  icon?:React.ReactNode,
}) => {
  return (
    <div className="relative flex items-center gap-2">
      {icon ? 
      icon
      :
      <div style={{background:badgeColor}} className={`w-[10px] h-[10px] bg-[${badgeColor}] rounded-full 
      text-center flex justify-center items-center text-[10px] font-bold text-white`}>                
      </div>
      }
      <span 
      className={`${className}`}
      style={{color:textColor ?? '#444'}}>{label}</span>
    </div>
  )
}

export default LabelWithBadge;