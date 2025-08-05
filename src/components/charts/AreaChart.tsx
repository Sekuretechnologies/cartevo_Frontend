import {
	Chart as ChartJS,
	Tooltip,
	Legend,
	LineController,
	LinearScale,
	PointElement,
	LineElement,
	Filler,
	CategoryScale,
} from "chart.js";
// import { useState } from 'react';
import { Line } from "react-chartjs-2";
// import Dropdown from '../shared/Dropdown/Dropdown';

ChartJS.register(
	Tooltip,
	Legend,
	LineController,
	LinearScale,
	PointElement,
	LineElement,
	Filler,
	CategoryScale
);

type TLegend = {
	label: string;
	color: string;
	fw?: string;
	fs?: string;
};

const AreaChart = ({
	data,
	options,
	legend,
	width,
}: {
	data: any;
	options?: any;
	legend?: TLegend[];
	width?: number;
}) => {
	// const [timeframe, setTimeframe] = useState("");

	// const handleChange = (e: any) => {
	//   setTimeframe(e.target.value);
	// }

	const chartOptions = {
		responsive: true,
		maintainAspectRatio: false,
		plugins: {
			legend: {
				display: false,
			},
			tooltip:options?.tooltip ?? {},			
		},
		animation: options?.animation ?? {},
		scales: {
			x: {
				ticks: {
					padding: 5,
					fontSize: 1,
				},
				grid: {
					display: false,
				},
			},
			y: {
				beginAtZero: true,
				ticks: {
					padding: 5,
					fontSize: 1,
				},
				grid: {
					display: false,
				},
			},
		},
	};

	return (
		<div className="h-[250px] w-full flex flex-col justify-between items-center">
			<div className="w-full flex justify-center items-center gap-3">
				{legend &&
					legend.map((item, index) => (
						<div key={index} className="flex items-center gap-2">
							<span
								className={`rounded-full p-[7px]`}
								style={{ background: item.color }}
							/>
							<span className="text-xs font-normal text-gray-900">
								{item.label}
							</span>
						</div>
					))}
			</div>
			{/* )} */}
			<Line data={data} height={250} width={width ?? 680} redraw={false} options={chartOptions} />
		</div>
	);
};

export default AreaChart;
