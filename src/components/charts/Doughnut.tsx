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
  }
}

const Doughnut = ({ data }: IDoughnutData) => {
  const options = {
    maintainAspectRatio: false,
    cutout: '60%',
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
    <div className="w-full h-52">
      <DoughnutChart data={data} options={options} updateMode="resize" />
      {/* redraw */}
    </div>
  )
}

export default Doughnut
