import React from 'react'
import InfoCard from './InfoCard';
import cstyle from './styles/style.module.scss';

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
  label: TText;
  value: TText;
};
export type TDataList = TDataItem[][];

interface InfoCardProps {
  infoData: TDataList[];
}
// interface IDataLine {
//   items: IDataItem[];
// };

// export type TDataList = {
//   lines: IDataLine[];
// };

const InfoCardGrid: React.FC<InfoCardProps> = ({infoData}) => {
  return (
    <div 
    className={`mb-10 ${cstyle['infoCardGrid']}`}>
        {infoData.map((data, index) => (
            <InfoCard key={index} data={data} />
        ))}
    </div>
  )
}

export default InfoCardGrid
