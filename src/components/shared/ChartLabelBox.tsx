const ChartLabelBox = (
  { title, rate, size, bgColor, textColor }: { 
    size?: string; 
    bgColor?: string;
    textColor?: string;
    title: string; 
    rate: string;
  }) => {
  return (
    <div 
    style={{background:bgColor ?? '#ECECEC', color: textColor ?? '#000'}}
    className="my-3 px-3 py-2 rounded-md flex justify-around items-center gap-2 min-w-[164px]">
      <span style={{fontSize:size ?? '12px'}} className="font-normal">{title}</span>
      <span style={{fontSize:size ?? '12px'}} className="font-semibold">{rate}</span>
    </div>
  )
}

export default ChartLabelBox;
