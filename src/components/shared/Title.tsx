import React from 'react'

interface TitleProps {
    title: string;
    titleLine2?: string;
    subtitle?: string;
    size?: number;
}

const Title: React.FC<TitleProps> = ({ title, titleLine2, subtitle, size }) => {
  return (
    <div className='flex-1 flex flex-col gap-1'>
        <span style={{fontSize:`${size ?? 18}px`}} className={`text-md font-semibold text-black`}>{title}</span>
        <span style={{fontSize:`${size ?? 18}px`}} className={`text-md font-semibold text-black`}>{titleLine2}</span>
        <span className='text-sm text-gray-900'>{subtitle}</span>
    </div>
  )
}

export default Title;