import React from 'react'

interface IData {
  reuse: string;
  encurs: string;
};

const Transfers = ({ data }: { data: IData }) => {
  return (
    <div className='ring-1 ring-[#898989] w-full h-[66px] px-2 py-4 rounded-md flex flex-col justify-between '>
      <div className='flex gap- justify-between items-center'>
        <h1 className='text-gray-900 text-[10px] font-bold'>
          {`Transferts aujourd'hui`}
        </h1>
        <h1 className='text-gray-900 text-[10px] font-bold'>
          {data.reuse}F
        </h1>
      </div>
      <div className='flex gap-1 justify-between items-center'>
        <h1 className='text-gray-900 text-[10px] font-normal'>
          Mayenne de transferts
        </h1>
        <h1 className='text-gray-900 text-[10px] font-bold'>
          {data.encurs} F/jour
        </h1>
      </div>
    </div>
  )
}

export default Transfers
