
import React, { forwardRef } from 'react';
import { FaCircle } from 'react-icons/fa';

export interface CheckboxProps
    extends React.DetailedHTMLProps<
    React.InputHTMLAttributes<HTMLInputElement>,
    HTMLInputElement
    > {
        label:string;
    }

const TabCheckbox = forwardRef<HTMLInputElement, CheckboxProps>(
    ({label, ...props}) => {
    return (
        // <input type="checkbox" {...props} />
        <label htmlFor={`customCheckboxUsers`} className="flex items-center cursor-pointer">                
            <div className="relative">                
                <input
                // checked={checked}
                // onChange={(e)=>form.setValue('decreasingWalletOrder', e.target.checked)}
                type="checkbox" 
                id={`customCheckboxUsers`} 
                name={`customCheckboxUsers`} 
                className="customCheckbox sr-only"
                {...props}/>                
                <div 
                className="flex justify-center items-center text-center px-5 py-3 font-bold"
                style={{
                    borderBottom: props?.checked ? '3px solid #18BC7A' : '1px solid gray',
                    color: props?.checked ? 'black': 'gray',
                    // fontWeight: props?.checked ? 'bold': 'normal',
                }}>
                    {label}
                </div>
            </div>
        </label>
    );
    }
);

TabCheckbox.displayName = 'TabCheckbox';
export default TabCheckbox;
    