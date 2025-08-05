import React from 'react'

const TransferType = ({ type, subtotal, total}: { type: string, subtotal: string, total: string}) => {
  return (
    <div className='ring-1 ring-[#898989] w-full h-[66px] px-2 py-4 rounded-md flex flex-col justify-between flex-1'>
      <div className='flex gap- justify-between items-center'>
        <h1 className='text-gray-900 text-[10px] font-bold'>
          Transferts vers {type}
        </h1>
        <h1 className='text-gray-900 text-[10px] font-bold'>
          {subtotal} F
        </h1>
      </div>
      <div className='flex gap-1 justify-between items-center'>
        <h1 className='text-gray-900 text-[10px] font-normal'>
          Total {type === "Sekure" && "retraits"}
        </h1>
        <h1 className='text-gray-900 text-[10px] font-bold'>
          {total} F
        </h1>
      </div>
    </div>
  )
}

export default TransferType;
