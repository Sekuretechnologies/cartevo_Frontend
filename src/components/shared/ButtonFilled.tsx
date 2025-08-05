import React from 'react'
import { Button } from '../ui/button'
import Link from 'next/link';


const ButtonFilled = ({
  text, color, height, width, icon, href, px, py, 
  hoverBgColor, iconSize, fontWeight, type,
  textColor, hoverTextColor, textWrap, mode, btnStyle
}: {
  text: string;
  btnStyle: "outlined" | "outlinedGreen" | "green" | "lightGreen";
  color?: string;
  height?: string;
  width?: string;
  href?: string;
  px?: string;
  py?: string;
  type?: "button" | "submit" | "reset";
  hoverBgColor?: string;
  textColor?: string;
  hoverTextColor?: string;
  textWrap?: boolean; 
  iconSize?: string;  
  mode?: string;
  fontWeight?: 'normal' | 'semibold' | 'bold';
  icon?: React.ReactNode;
}) => {
  
  const iconElement = icon ? React.cloneElement(icon as React.ReactElement<any>, { size: iconSize ?? 15, color }) : null;

  const btnStyles = {
    outlined: `flex items-center gap-2 outline-none font-semibold border border-solid border-2 border-[#444] rounded-full text-sm text-nowrap
      bg-transparent hover:bg-[#444]/30`,
    outlinedGreen: `flex items-center gap-2 outline-none font-semibold border border-solid border-2 border-[#18BC7A] rounded-full text-sm text-nowrap
      bg-transparent hover:bg-[#18BC7A]/30`,
    green: `flex items-center gap-2 outline-none font-semibold border border-solid border-2 rounded-full text-sm text-nowrap 
      border-[#18BC7A] hover:border-[#18BC7A]/80   bg-[#18BC7A] hover:bg-[#18BC7A]/80
      text-white`,
    lightGreen:`flex items-center gap-2 outline-none font-semibold border border-solid border-2 rounded-full text-sm text-nowrap 
      border-[#18BC7A]/20 hover:border-[#18BC7A]/30   bg-[#18BC7A]/20 hover:bg-[#18BC7A]/30
      text-[#18BC7A]`,

  }
  const btnClassZero = `${px ? 'px-['+px+']':'px-4'} ${py ? 'py-['+py+']':'py-1'}
      ${width ? `w-[${width}]` : ''} ${height ? `h-[${height}]` : ''}`
  // const btnClass = `border border-solid border-2 border-${mode == 'light' ?  `[${color}]/30` : `[${color}]`} 
  //     rounded-full text-sm ${textWrap?? 'text-nowrap'}
  //     hover:border-${
  //       color === 'gray' || color === '#202020' || color === '#444' ? 
  //         hoverBgColor ?
  //           '['+hoverBgColor+']' : 'gray-300'
  //         :
  //         hoverBgColor ?
  //           '['+hoverBgColor+']' 
  //           : mode == 'light' ?
  //           `[${color}]/30` : `[${color}]/80`
  //     }
  //     ${px ? 'px-['+px+']':'px-4'} ${py ? 'py-['+py+']':'py-2'} 
  //     bg-${mode == 'light' ?  `[${color}]/30` : `[${color}]`} 
  //     hover:bg-${
  //       color === 'gray' || color === '#202020' || color === '#444' ? 
  //         hoverBgColor ?
  //           '['+hoverBgColor+']' : 'gray-300'
  //         :
  //         hoverBgColor ?
  //           '['+hoverBgColor+']' 
  //           : mode == 'light' ?
  //           `[${color}]/20` : `[${color}]/80`
  //     } 
  //     font-${fontWeight ?? ''} flex items-center gap-2 
  //     text-[${textColor ?? '#444'}] 
  //     hover:text-[${hoverTextColor ?? textColor ?? '#444'}]  
  //     outline-none
  //     ${width ? `w-[${width}]` : ''} ${height ? `h-[${height}]` : ''}`

      
  return (
    <>
    { href ?
      <Link 
      href={href} 
      className={btnClassZero +' ' +btnStyles[btnStyle]}
      >
        {iconElement}
        {text}
      </Link>
      :
      <>
      <button
      type={type ? type : 'button'}   
      className={btnClassZero +' ' +btnStyles[btnStyle]}

      // style={{
      //   background: mode == 'light' ? color+'33' : color,
      //   color: mode == 'light' ? color : textColor ?? '#444',
      // }}
      >
        {iconElement}
        {text}
      </button>
      </>
    }
    </>
  )
}
export default ButtonFilled



// const ButtonFilled = ({ 
//   type, text, bgColor, height, width
// }: { 
//   type?: "button" | "submit" | "reset",
//   text: string,
//   bgColor: string,
//   height?: string,
//   width?: string,
// }) => {
//   return (
//     <Button 
//     type={type? type : 'button'} 
//     className={`${bgColor} w-[${width ? width : '221px'}] h-[${height ? height : '44px'}] 
//     rounded-full text-md text-white font-normal hover:${bgColor}`}>
//       {text}
//     </Button>
//   )
// }

// export default ButtonFilled
