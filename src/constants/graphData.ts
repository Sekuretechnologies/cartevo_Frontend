import { ScriptableContext } from "chart.js";

export const gradientData1 = {
	// labels: ['Mon1', 'Mon2', 'Mon3', 'Mon4', 'Mon5', 'Mon6', 'Mon7', 'Mon8', 'Mon9', 'Mon10', 'Mon11', 'Mon12'],
	labels: [
		"J1",
		"J2",
		"J3",
		"J4",
		"J5",
		"J6",
		"J7",
		"J8",
		"J9",
		"J10",
		"J11",
		"J12",
		"J13",
		"J14",
		"J15",
		"J16",
		"J17",
		"J18",
		"J19",
		"J20",
		"J21",
		"J22",
		"J23",
		"J24",
		"J25",
		"J26",
		"J27",
		"J28",
		"J29",
		"J30",
	],
	datasets: [
		{
			label: "Total Transactions",
			// data: [410, 300, 200, 400, 400, 300, 210, 100, 300, 200, 120, 100], // Example data for total transactions
			data: Array.from(
				{ length: 30 },
				() => Math.floor(Math.random() * 100) + 80
			),
			// backgroundColor: '#18BC7Ac3',
			borderColor: "rgba(75, 192, 192, 1)",
			borderWidth: 1,
			fill: true,
			pointStyle: false,
			backgroundColor: (context: ScriptableContext<"line">) => {
				const ctx = context.chart.ctx;
				const gradient = ctx.createLinearGradient(0, 0, 500, 200);
				gradient.addColorStop(0, "#1F66FF");
				gradient.addColorStop(1, "#FFDB5A");
				return gradient;
			},
		},
	],
};

export const gradientData2 = {
	// labels: ['Mon1', 'Mon2', 'Mon3', 'Mon4', 'Mon5', 'Mon6', 'Mon7', 'Mon8', 'Mon9', 'Mon10', 'Mon11', 'Mon12'],
	labels: [
		"J1",
		"J2",
		"J3",
		"J4",
		"J5",
		"J6",
		"J7",
		"J8",
		"J9",
		"J10",
		"J11",
		"J12",
		"J13",
		"J14",
		"J15",
		"J16",
		"J17",
		"J18",
		"J19",
		"J20",
		"J21",
		"J22",
		"J23",
		"J24",
		"J25",
		"J26",
		"J27",
		"J28",
		"J29",
		"J30",
	],
	datasets: [
		{
			label: "Total Transactions",
			// data: [410, 300, 200, 400, 400, 300, 210, 100, 300, 200, 120, 100], // Example data for total transactions
			data: Array.from(
				{ length: 30 },
				() => Math.floor(Math.random() * 100) + 80
			),
			// backgroundColor: '#18BC7Ac3',
			borderColor: "rgba(75, 192, 192, 1)",
			borderWidth: 1,
			fill: true,
			pointStyle: false,
			backgroundColor: (context: ScriptableContext<"line">) => {
				const ctx = context.chart.ctx;
				const gradient = ctx.createLinearGradient(0, 0, 500, 200);
				gradient.addColorStop(0, "#1F66FF");
				gradient.addColorStop(1, "#FFDB5A");
				return gradient;
			},
		},
	],
};

export const gradientData3 = {
	// labels: ['Mon1', 'Mon2', 'Mon3', 'Mon4', 'Mon5', 'Mon6', 'Mon7', 'Mon8', 'Mon9', 'Mon10', 'Mon11', 'Mon12'],
	labels: [
		"J1",
		"J2",
		"J3",
		"J4",
		"J5",
		"J6",
		"J7",
		"J8",
		"J9",
		"J10",
		"J11",
		"J12",
		"J13",
		"J14",
		"J15",
		"J16",
		"J17",
		"J18",
		"J19",
		"J20",
		"J21",
		"J22",
		"J23",
		"J24",
		"J25",
		"J26",
		"J27",
		"J28",
		"J29",
		"J30",
	],
	datasets: [
		{
			label: "Total Transactions",
			// data: [410, 300, 200, 400, 400, 300, 210, 100, 300, 200, 120, 100], // Example data for total transactions
			data: Array.from(
				{ length: 30 },
				() => Math.floor(Math.random() * 100) + 80
			),
			// backgroundColor: '#18BC7Ac3',
			borderColor: "rgba(75, 192, 192, 1)",
			borderWidth: 1,
			fill: true,
			pointStyle: false,
			backgroundColor: (context: ScriptableContext<"line">) => {
				const ctx = context.chart.ctx;
				const gradient = ctx.createLinearGradient(0, 0, 500, 200);
				gradient.addColorStop(0, "#33E89C");
				gradient.addColorStop(1, "#0F7980");
				return gradient;
			},
		},
	],
};

export const gradientDualData = {
	labels: [
		"Mon1",
		"Mon2",
		"Mon3",
		"Mon4",
		"Mon5",
		"Mon6",
		"Mon7",
		"Mon8",
		"Mon9",
		"Mon10",
		"Mon11",
		"Mon12",
	],
	datasets: [
		{
			label: "Recharges",
			data: Array.from(
				{ length: 30 },
				() => Math.floor(Math.random() * 100) + 80
			),
			borderColor: "rgba(75, 192, 192, 1)",
			borderWidth: 1,
			fill: true,
			pointStyle: false,
			backgroundColor: (context: ScriptableContext<"line">) => {
				const ctx = context.chart.ctx;
				const gradient = ctx.createLinearGradient(0, 0, 500, 200);
				gradient.addColorStop(0, "#18BC7Add");
				gradient.addColorStop(1, "#FFDB5Add");
				return gradient;
			},
		},
		{
			label: "Retraits",
			data: Array.from(
				{ length: 30 },
				() => Math.floor(Math.random() * 100) + 80
			),
			borderColor: "rgba(75, 192, 192, 1)",
			borderWidth: 1,
			fill: true,
			pointStyle: false,
			backgroundColor: (context: ScriptableContext<"line">) => {
				const ctx = context.chart.ctx;
				const gradient = ctx.createLinearGradient(0, 0, 500, 200);
				gradient.addColorStop(0, "#0F7980dd");
				gradient.addColorStop(1, "#33E89Cdd");
				return gradient;
			},
		},
	],
};

export const dualData = {
	labels: [
		"Mon1",
		"Mon2",
		"Mon3",
		"Mon4",
		"Mon5",
		"Mon6",
		"Mon7",
		"Mon8",
		"Mon9",
		"Mon10",
		"Mon11",
		"Mon12",
	],
	datasets: [
		{
			label: "Total Transactions",
			data: [410, 300, 200, 400, 400, 300, 210, 100, 300, 200, 120, 100], // Example data for total transactions
			backgroundColor: "#18BC7Ac3",
			borderColor: "rgba(75, 192, 192, 1)",
			borderWidth: 1,
			fill: true,
			pointStyle: false,
		},
		{
			label: "Failed Transactions",
			data: [310, 200, 100, 40, 100, 100, 400, 190, 210, 300, 210, 180], // Example data for total transactions
			backgroundColor: "#FFDB5A",
			borderColor: "rgba(75, 192, 192, 1)",
			borderWidth: 1,
			fill: true,
			pointStyle: false,
		},
	],
};

export const trxData = {
	labels: [
		"J1",
		"J2",
		"J3",
		"J4",
		"J5",
		"J6",
		"J7",
		"J8",
		"J9",
		"J10",
		"J11",
		"J12",
		"J13",
		"J14",
		"J15",
		"J16",
		"J17",
		"J18",
		"J19",
		"J20",
		"J21",
		"J22",
		"J23",
		"J24",
		"J25",
		"J26",
		"J27",
		"J28",
		"J29",
		"J30",
	],
	datasets: [
		{
			label: "Total Transactions",
			data: Array.from(
				{ length: 30 },
				() => Math.floor(Math.random() * 301) + 100
			),
			backgroundColor: "#FFDB5Aaa",
			borderColor: "#FFDB5Aaa",
			borderWidth: 1,
			fill: true,
			pointStyle: false,
		},
		{
			label: "Total Transactions",
			data: Array.from(
				{ length: 30 },
				() => Math.floor(Math.random() * 301) + 100
			),
			backgroundColor: "#3870C0aa",
			borderColor: "#3870C0aa",
			borderWidth: 1,
			fill: true,
			pointStyle: false,
		},
		{
			label: "Total Transactions",
			data: Array.from(
				{ length: 30 },
				() => Math.floor(Math.random() * 301) + 100
			),
			backgroundColor: "#33E89Caa",
			borderColor: "#33E89Caa",
			borderWidth: 1,
			fill: true,
			pointStyle: false,
		},
	],
};

export const doughnutData = {
	labels: ["Red", "Blue", "Yellow", "Green", "Purple", "Orange"],
	datasets: [
		{
			label: "My First Dataset",
			// data: [300, 50, 100, 40, 120, 80],
			data: Array.from(
				{ length: 6 },
				() => Math.floor(Math.random() * 301) + 100
			),
			backgroundColor: [
				"#FFDB5A",
				"#F85D4B",
				"#6200EE",
				"#FD8A49",
				"#33E89C",
				"#5BCEFF",
			],
			hoverOffset: 4,
		},
	],
};

export const pieData = {
	labels: ["Red", "Blue", "Yellow", "Green"],
	datasets: [
		{
			label: "# of Votes",
			//  data: [9, 10, 17, 5],
			data: Array.from(
				{ length: 4 },
				() => Math.floor(Math.random() * 301) + 100
			),
			backgroundColor: ["#33E89C", "#FFDB5A", "#FD8A49", "#6200EE"],
			borderColor: ["#33E89C", "#FFDB5A", "#FD8A49", "#6200EE"],
			borderWidth: 1,
		},
	],
};

export const pieData2 = {
	labels: ["Red", "Blue", "Yellow", "Green"],
	datasets: [
		{
			label: "# of Votes",
			//  data: [9, 10, 17, 5],
			data: Array.from(
				{ length: 2 },
				() => Math.floor(Math.random() * 301) + 100
			),
			backgroundColor: ["#33E89C", "#FFDB5A"],
			borderColor: ["#33E89C", "#FFDB5A"],
			borderWidth: 1,
		},
	],
};

export const pieDataTwo = {
	labels: ["Yellow", "Brown"],
	datasets: [
		{
			label: "# of Votes",
			//  data: [9, 10, 17, 5],
			data: Array.from(
				{ length: 2 },
				() => Math.floor(Math.random() * 301) + 100
			),
			backgroundColor: ["#FFDB5A", "#B8A16B"],
			borderColor: ["#FFDB5A", "#B8A16B"],
			borderWidth: 1,
		},
	],
};
export const pieDataThree = {
	labels: ["Yellow", "Red", "Brown"],
	datasets: [
		{
			label: "# of Votes",
			//  data: [9, 10, 17, 5],
			data: Array.from(
				{ length: 3 },
				() => Math.floor(Math.random() * 301) + 100
			),
			backgroundColor: ["#FFDB5A", "#F85D4B", "#B8A16B"],
			borderColor: ["#FFDB5A", "#F85D4B", "#B8A16B"],
			borderWidth: 1,
		},
	],
};

export const pieDataFour = {
	labels: ["Yellow", "Red", "Brown", "Green"],
	datasets: [
		{
			label: "# of Votes",
			//  data: [9, 10, 17, 5],
			data: Array.from(
				{ length: 4 },
				() => Math.floor(Math.random() * 301) + 100
			),
			backgroundColor: ["#FFDB5A", "#F85D4B", "#B8A16B", "#33E89C"],
			borderColor: ["#FFDB5A", "#F85D4B", "#B8A16B", "#33E89C"],
			borderWidth: 1,
		},
	],
};

export const pieDataSix = {
	labels: ["#33E89C", "#FFDB5A", "#FD8A49", "#6200EE", "#5BCEFF", "#F85D4B"],
	datasets: [
		{
			label: "# of Votes",
			//  data: [9, 10, 17, 5],
			data: Array.from(
				{ length: 6 },
				() => Math.floor(Math.random() * 301) + 100
			),
			backgroundColor: [
				"#33E89C",
				"#FFDB5A",
				"#FD8A49",
				"#6200EE",
				"#5BCEFF",
				"#F85D4B",
			],
			borderColor: [
				"#33E89C",
				"#FFDB5A",
				"#FD8A49",
				"#6200EE",
				"#5BCEFF",
				"#F85D4B",
			],
			borderWidth: 1,
		},
	],
};

export const pieDataNine = {
	labels: [
		"#33E89C",
		"#FFDB5A",
		"#FD8A49",
		"#6200EE",
		"#5BCEFF",
		"#F85D4B",
		"#D18E6F",
		"#FC9F92",
		"#D0D06F",
	],
	datasets: [
		{
			label: "# of Votes",
			//  data: [9, 10, 17, 5],
			data: Array.from(
				{ length: 9 },
				() => Math.floor(Math.random() * 301) + 100
			),
			backgroundColor: [
				"#33E89C",
				"#FFDB5A",
				"#FD8A49",
				"#6200EE",
				"#5BCEFF",
				"#F85D4B",
				"#D18E6F",
				"#FC9F92",
				"#D0D06F",
			],
			borderColor: [
				"#33E89C",
				"#FFDB5A",
				"#FD8A49",
				"#6200EE",
				"#5BCEFF",
				"#F85D4B",
				"#D18E6F",
				"#FC9F92",
				"#D0D06F",
			],
			borderWidth: 1,
		},
	],
};
