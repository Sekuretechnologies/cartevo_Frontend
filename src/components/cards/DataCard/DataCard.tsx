import CustomDropdown from "@/components/shared/CustomDropdown";
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
import { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import { FaArrowDown } from "react-icons/fa6";

ChartJS.register(
	LineController,
	LinearScale,
	LineElement,
	CategoryScale,
	PointElement,
	Tooltip
);

const DataCard = ({
	title,
	change_per,
	chartData,
	mainData,
	data,
	width,
	withPeriods,
	withDailyStats,
}: {
	title: string;
	change_per: string;
	chartData: any;
	mainData?: any;
	width?: number;
	withPeriods?: boolean;
	withDailyStats?: boolean;
	data: {
		today?: string;
		total?: string;
		average?: string;
		periodStats?: any;
		dailyStats?: any;
	};
}) => {
	const periods: any = {
		all: "Tous",
		today: "Aujourd'hui",
		last24hours: "Dernières 24h",
		last7days: "7 derniers jours",
		last30days: "30 derniers jours",
		fev20: "Depuis 20 Fev.",
	};
	const dailyStats: any = {
		amounts: "Montants",
		counts: "Quantités",
	};

	const [currentPeriod, setCurrentPeriod] = useState<string>("today");
	const [currentDailyStat, setCurrentDailyStat] = useState<string>("amounts");

	useEffect(() => {
		console.log("dailyStats :: ", dailyStats);
		console.log("currentDailyStat :: ", currentDailyStat);
		console.log("data?.dailyStats :: ", data?.dailyStats);
		console.log(
			"dailyStats[currentDailyStat] :: ",
			dailyStats[currentDailyStat]
		);
		console.log(
			"data?.dailyStats?.[currentDailyStat] :: ",
			data?.dailyStats?.[currentDailyStat]
		);
	}, [data?.dailyStats]);

	const chartOptions = {
		responsive: true,
		plugins: {
			legend: {
				display: false,
			},
		},
		scales: {
			x: {
				display: false, // This hides the X axis
				grid: {
					display: false,
				},
			},
			y: {
				display: false, // This hides the Y axis
				grid: {
					display: false,
				},
			},
		},
		tooltip: {
			callbacks: {
				label: (context: any) => {
					const dataPoint = context.dataset.data[context.dataIndex];
					console.log(
						"mainData?.[context.dataIndex]?.transaction_count ::: ",
						mainData?.[context.dataIndex]?.transaction_count
					);

					// ${context.dataset.label}
					return mainData
						? `(${
								mainData?.[context.dataIndex]?.transaction_count
						  }) : ${dataPoint}`
						: `${dataPoint} XAF`;
				},
			},
		},
	};

	return (
		<div
			className={`p-4 border outline-1 rounded-xl ${
				width ? "max-w-[" + width + "px]" : ""
			}`}
		>
			{" "}
			{/* max-w-[270px] */}
			<div className="flex justify-between items-start">
				<h1 className="text-xs font-semibold">{title}</h1>
				{/* <div className='px-4 py-2 border border-gray-300 rounded-full flex gap-3'>
          <span className='text-xs text-gray-800'>{change_per}</span><FaArrowDown />
        </div> */}
			</div>
			<div className="w-full mb-4">
				<Line data={chartData} height={100} options={chartOptions} />
			</div>
			{withPeriods && data?.periodStats ? (
				<>
					<div className="mt-2">
						<CustomDropdown
							title={currentPeriod && periods[currentPeriod]}
							cstyle={"outline"}
							iconSize={20}
							position={"left"}
							items={[
								...Object.keys(data?.periodStats).map(
									(pkey, pindex) => (
										<div
											key={pkey}
											className="flex w-full justify-between gap-2"
											onClick={() =>
												setCurrentPeriod(pkey)
											}
										>
											<span
												className={`text-nowrap text-sm w-full ${
													currentPeriod === pkey
														? "text-[#18BC7A]"
														: ""
												}`}
											>
												{periods[pkey]}
											</span>
										</div>
									)
								),
							]}
						/>
					</div>
					<div className="flex flex-col gap-1 mt-2">
						<div className="flex justify-between items-center gap-3">
							<p className="text-xs">{`Montant total`}</p>
							<h1 className="text-sm font-semibold">{`${data?.periodStats?.[
								currentPeriod
							]?.totalAmount?.toLocaleString("fr-FR")} XAF`}</h1>
						</div>
						<div className="flex justify-between items-center gap-3">
							<p className="text-xs">{`Montant moyen`}</p>
							<p className="text-xs text-right">{`${data?.periodStats?.[
								currentPeriod
							]?.avgAmount
								?.toFixed(2)
								?.toLocaleString("fr-FR")} XAF`}</p>
						</div>
						<div className="flex justify-between items-center gap-3">
							<p className="text-xs">{"Quantité"}</p>
							<p className="text-xs text-right">{`${data?.periodStats?.[
								currentPeriod
							]?.count?.toLocaleString("fr-FR")}`}</p>
						</div>
					</div>
				</>
			) : withDailyStats && data?.dailyStats ? (
				<>
					<div className="mt-2">
						<CustomDropdown
							title={
								currentDailyStat && dailyStats[currentDailyStat]
							}
							cstyle={"outline"}
							iconSize={20}
							position={"left"}
							items={[
								...Object.keys(data?.dailyStats)?.map(
									(pkey, pindex) => (
										<div
											key={pkey}
											className="flex w-full justify-between gap-2"
											onClick={() =>
												setCurrentDailyStat(pkey)
											}
										>
											<span
												className={`text-nowrap text-sm w-full ${
													currentDailyStat === pkey
														? "text-[#18BC7A]"
														: ""
												}`}
											>
												{dailyStats[pkey]}
											</span>
										</div>
									)
								),
							]}
						/>
					</div>
					<div className="flex flex-col gap-1 mt-2">
						<div className="flex justify-between items-center gap-3">
							<p className="text-xs">{`Aujourd'hui`}</p>
							<h1 className="text-sm font-semibold">{`${data?.dailyStats?.[
								currentDailyStat
							]?.today?.toLocaleString("fr-FR")} ${
								currentDailyStat === "amounts" ? "XAF" : ""
							}`}</h1>
						</div>
						<div className="flex justify-between items-center gap-3">
							<p className="text-xs">{`Moy. jour`}</p>
							<p className="text-xs text-right">{`${data?.dailyStats?.[
								currentDailyStat
							]?.dailyAvg
								?.toFixed(2)
								?.toLocaleString("fr-FR")}  ${
								currentDailyStat === "amounts" ? "XAF" : ""
							}`}</p>
						</div>
						<div className="flex justify-between items-center gap-3">
							<p className="text-xs">{"Max jour"}</p>
							<p className="text-xs text-right">{`${data?.dailyStats?.[
								currentDailyStat
							]?.dailyMax?.toLocaleString("fr-FR")}  ${
								currentDailyStat === "amounts" ? "XAF" : ""
							}`}</p>
						</div>
						<div className="flex justify-between items-center gap-3">
							<p className="text-xs">{"Min jour"}</p>
							<p className="text-xs text-right">{`${data?.dailyStats?.[
								currentDailyStat
							]?.dailyMin?.toLocaleString("fr-FR")}  ${
								currentDailyStat === "amounts" ? "XAF" : ""
							}`}</p>
						</div>
						<div className="flex justify-between items-center gap-3">
							<p className="text-xs">{"Total"}</p>
							<p className="text-xs text-right">{`${data?.dailyStats?.[
								currentDailyStat
							]?.total?.toLocaleString("fr-FR")}  ${
								currentDailyStat === "amounts" ? "XAF" : ""
							}`}</p>
						</div>
					</div>
				</>
			) : (
				<>
					<div className="flex flex-col gap-1">
						<div className="flex justify-between items-center gap-3">
							<p className="text-xs">{`Aujourd'hui`}</p>
							<h1 className="text-sm font-semibold">
								{data.today}
							</h1>
						</div>
						<div className="flex justify-between items-center gap-3">
							<p className="text-xs">Total</p>
							<p className="text-xs text-right">{data.total}</p>
						</div>
						<div className="flex justify-between items-center gap-3">
							<p className="text-xs">Moyenne</p>
							<p className="text-xs text-right">{data.average}</p>
						</div>
					</div>
				</>
			)}
		</div>
	);
};

export default DataCard;
