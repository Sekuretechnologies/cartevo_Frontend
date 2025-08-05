import { Pie } from 'react-chartjs-2'
import { Chart as Chartjs, PieController, ArcElement, Tooltip } from 'chart.js';

Chartjs.register(
  PieController,
  ArcElement,
  Tooltip
);



const PieChart = ({ data, size }: {data: any, size?: number}) => {
  const options = {
    maintainAspectRatio: false,
    responsive: true,
    layout: {
      padding: {
        top: 0,
        left: 10,
        right: 10,
        bottom: 0
      },
    },
    plugins: {
      legend: {
        display: false,
      },
    },
  };
  return (
    <div className={`w-[${size ? size+'px' : '200px'}] 
    h-[${size ? size+'px' : '80px'}] flex justify-start items-start 
    overflow-hidden object-cover`}>
      <Pie data={data} options={options}  style={{height:size+'px'}}/>
    </div>
  )
}

export default PieChart
