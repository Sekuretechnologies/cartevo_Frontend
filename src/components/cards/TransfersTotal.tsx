import React from 'react'

interface IData {
  total: string;
  details: {reuse: string, encurs: string, bloques: string};
};

const TransfersTotal = ({ total, details }: IData) => {
  return (
    <div className='ring-1 ring-[#898989] w-full h-[66px] px-2 py-4 rounded-md flex flex-col justify-between '>
      <div className='flex gap- justify-between items-center'>
        <h1 className='text-gray-900 text-[10px] font-semibold'>
          Transferts total
        </h1>
        <h1 className='text-gray-900 text-[10px] font-semibold'>
          {total}F
        </h1>
      </div>
      <div className='flex gap-1 justify-between items-center'>
        <span className='text-[9px] font-thin'>Reussiers: <span className='text-[#33E89C] font-bold'>{details.reuse}</span></span>
        <span className='text-[9px] font-thin'>En cours: <span className='text-faded-yellow font-bold'>{details.encurs}</span></span>
        <span className='text-[9px] font-thin'>Bloques: <span className='text-[#F85D4B] font-bold'>{details.bloques}</span></span>
      </div>
    </div>
  )
}

export default TransfersTotal;
