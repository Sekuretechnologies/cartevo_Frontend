import React from 'react'

type TText = {
  text: string | number | React.ReactNode;
  fw?: string;
  color?: string;
  fs?: string;
  tooltip?: string;
  whiteSpace?: string;
  maxWidth?: string;
}
type TDataItem = {
  key?: string;
  visible?: boolean;
  label: TText;
  value: TText;
};
export type TDataList = TDataItem[][];

interface InfoCardProps {
  data: TDataList;
}
// interface IDataLine {
//   items: IDataItem[];
// };

// export type TDataList = {
//   lines: IDataLine[];
// };

const InfoCard: React.FC<InfoCardProps> = ({data}) => {
  return (
    <div className='ring-1 ring-[#444] px-2 py-4 rounded-md flex flex-col'>
      
      {data.map((line, index1) => (
        <div key={index1} className={`flex flex-wrap justify-between items-center mx-1`} 
        style={{
          // display: 'flex', 
          // gridTemplateColumns: `repeat(${line.length}, 1fr)` ,
          gap:`${line.length*5}px`}}>
          {line.map((item, index2) => (
            <div key={index2} className={`my-1 ${index1 == 0 ? 'mb-4':''} flex ${line.length>1 ? 'gap-3' : 'w-full'}  justify-between items-center`}>
              <span title={item.label.tooltip ?? ''} style={{fontSize: item.label.fs ?? '14px', color:item.label.color ?? '#444'}} className={`font-${item.label.fw ?? 'normal'}`}>
                {item.label.text}
              </span>
              <span title={item.value.tooltip ?? ''} style={{fontSize: item.value.fs ?? '14px', color:item.value.color ?? '#444'}} className={`font-${item.value.fw ?? 'normal'}`}>
                {item.value.text}
              </span>
            </div>
          ))}
        </div>
      ))}
    </div>
  )
}

export default InfoCard
