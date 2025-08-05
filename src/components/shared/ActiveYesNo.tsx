import React from 'react'
import { Button } from '../ui/button'
import LabelWithBadge from './LabelWithBadge';

const ActiveYesNo = ({ 
  isActive, colorActive, colorInactive, label, labelActive, labelInactive, color, textColor, className
}: {   
  isActive: boolean | React.ReactNode,  
  label?: string,
  labelActive?: string,
  colorActive?:string,
  labelInactive?: string,
  colorInactive?: string,
  color?: string,
  textColor?: string,
  className?: string,
}) => {
  return (
    <>
    {isActive ? 
    <LabelWithBadge 
    label={label ?? labelActive ?? 'Actif'}
    badgeColor={color ?? colorActive ?? '#18BC7A'}
    className={className}
    textColor={textColor ?? '#444'}
    />
    :
    <LabelWithBadge 
    label={label ?? labelInactive ?? 'Inactif'}
    badgeColor={color ?? colorInactive ?? '#444'}
    className={className}
    textColor={textColor ?? '#444'}
    />
    }
    </>
  )
}

export default ActiveYesNo;