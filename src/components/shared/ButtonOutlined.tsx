import React from 'react'
import { Button } from '../ui/button';
import Link from 'next/link';

const ButtonOutlined = ({
  text, color, height, width, icon, href, px, py, 
  hoverBgColor, iconSize, fontWeight, type, textWrap
}: {
  text: string;
  color: string;
  height?: string;
  width?: string;
  href?: string;
  px?: string;
  py?: string;
  textWrap?: boolean;
  type?: "button" | "submit" | "reset";
  hoverBgColor?: string;
  iconSize?: string;
  fontWeight?: 'normal' | 'semibold' | 'bold';
  icon?: React.ReactNode;
}) => {
  
  const iconElement = icon ? React.cloneElement(icon as React.ReactElement<any>, { size: iconSize ?? 15, color }) : null;

  return (
    <>
    { href ?
      <Link 
      href={href}
      className={`border border-solid border-2 border-[${color}] rounded-full text-sm ${textWrap?? 'text-nowrap'}
      ${px ? 'px-['+px+']':'px-4'} ${py ? 'py-['+py+']':'py-2'} bg-transparent 
      hover:bg-${hoverBgColor ? `[${hoverBgColor}]`:`[${color}]/20`} 
      font-${fontWeight ?? ''} flex items-center gap-2 text-[${color}] 
      ${width ? `w-[${width}]` : ''} ${height ? `h-[${height}]` : ''} `}
      >
        {iconElement}
        {text}
      </Link>
      :
      <>
      <Button
      type={type ? type : 'button'}  
      className={`border border-solid border-2 border-[${color}] rounded-full text-sm ${textWrap?? 'text-nowrap'}
      ${px ? 'px-['+px+']':'px-4'} ${py ? 'py-['+py+']':'py-2'} bg-transparent 
      hover:bg-${
        color === 'gray' || color === '#202020' || color === '#444' ? 
          hoverBgColor ?
            '['+hoverBgColor+']' : 'gray-300/50'
          :`[${color}]/20`
      } 
      font-${fontWeight ?? ''} flex items-center gap-2 text-[${color}] outline-none
      ${width ? `w-[${width}]` : ''} ${height ? `h-[${height}]` : ''} `}
      >
        {iconElement}
        {text}
      </Button>
      {/* <Button className='border border-solid border-2 border-[#444] font-semibold 
      rounded-full px-6 bg-transparent text-[#202020] hover:bg-gray-300
      flex gap-2'>
        {color}
      </Button> */}
      </>
    }
    </>

  )
}

export default ButtonOutlined
