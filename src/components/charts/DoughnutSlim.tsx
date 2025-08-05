import { Chart as Chartjs,
  DoughnutController,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js"
import  { Doughnut as DoughnutChart } from "react-chartjs-2"

Chartjs.register(
  DoughnutController,
  ArcElement,
  Tooltip,
  Legend
);

interface IDoughnutData {
  data: {
    labels: string[];
    datasets: { label: string, data: number[], backgroundColor: string[] }[];
  };
  size?: number;
  cutout?: string;
}

const DoughnutSlim = ({ data, size, cutout }: IDoughnutData) => {
  const options = {
    maintainAspectRatio: false,
    cutout: cutout ?? '80%',
    layout: {
      padding: {
        top: 20,
        left: 10,
        right: 10,
        bottom: 20
      },
    },
    plugins: {
      legend: {
        display: false,
      },
    },
  };

  return (
    <div 
    // className="w-full h-52"
    className={`w-[${size ? size+'px' : '200px'}] 
    h-[${size ? size+'px' : '80px'}] flex justify-start items-start 
    overflow-hidden object-cover`}
    >
      <DoughnutChart data={data} options={options} updateMode="resize" redraw style={{height:size+'px'}}/>
    </div>
  )
}

export default DoughnutSlim
