import CartesCard from "@/components/cards/CartesCard/CartesCard";
import Doughnut from "@/components/charts/Doughnut";
import LegendItem from "@/components/shared/LegendItem";
import { HiLightBulb } from "react-icons/hi";
import { FaLock } from "react-icons/fa";
import {
	MdDeleteForever,
	MdLightbulbCircle,
	MdCheckCircle,
	MdRemoveCircle,
} from "react-icons/md";
import { IoIosCloseCircle } from "react-icons/io";
import { useSelector } from "react-redux";
import { selectCurrentCustomerDetails } from "@/redux/slices/customer";
import { getUserPaymentsGraphData } from "@/utils/graphs";
import { retrieveUSDAmount } from "@/utils/utils";
// import { doughnutData } from "@/constants/Index";

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

const CartesSide = ({ nbCards }: { nbCards: string | number }) => {
	const customerDetails: any = useSelector(selectCurrentCustomerDetails);

	const { userPaymentsGraphData, userPaymentsData } =
		getUserPaymentsGraphData(
			customerDetails?.payments?.groups ?? [],
			"Total des paiements"
		);

	return (
		<>
			<div className="w-60">
				<h1 className="text-sm font-semibold tracking-tight mb-1">
					Nombre de cartes
				</h1>
				<h1 className="text-2xl text-[#18BC7A] font-semibold ">
					{customerDetails?.cards?.stats?.count ?? 0}
				</h1>
				<div className="flex justify-between items-center gap-2 w-full my-5">
					<p
						title="Actives"
						className=" flex items-center gap-3 text-sm font-normal"
					>
						{/* Actives  */}
						<MdCheckCircle size={22} color="#1F66FF" />
						<span className="ml-1 font-bold">
							{customerDetails?.cards?.stats?.activeCount ?? 0}
						</span>
					</p>
					<p
						title="Bloquées"
						className=" flex items-center gap-3 text-sm font-normal"
					>
						{/* <MdRemoveCircle size={22} color="#FFDB5A"/> */}
						<MdRemoveCircle size={22} color="#777" />
						<span className="ml-1 font-bold">
							{customerDetails?.cards?.stats?.freezeCount ?? 0}
						</span>
					</p>
					<p
						title="Désactivées"
						className=" flex items-center gap-3 text-sm font-normal"
					>
						<IoIosCloseCircle size={22} color="#F85D4B" />
						<span className="ml-1 font-bold">
							{customerDetails?.cards?.stats?.disabledCount ?? 0}
						</span>
					</p>
					<p
						title="Supprimées"
						className=" flex items-center gap-3 text-sm font-normal"
					>
						<IoIosCloseCircle size={22} color="#000" />
						<span className="ml-1 font-bold">
							{customerDetails?.cards?.stats?.terminatedCount ??
								0}
						</span>
					</p>
					{/* <p className="text-xs font-normal">
            Bloquées 
            <span className=" text-[#444] ml-1 font-bold">2</span></p>
          <p className="text-xs font-normal">
            Supprimées 
            <span className=" text-[#F85D4B] ml-1 font-bold">3</span></p> */}
				</div>
				{/* <h1 className="text-sm font-semibold tracking-tight">
          Total solde Cartes

        </h1> */}
				<p className="text-gray-800 text-sm font-semibold tracking-tight">
					{`Total solde Cartes `}
					<span className="font-bold">{`($ ${retrieveUSDAmount({
						amount: customerDetails?.cards?.stats?.totalAmount,
						amountUSD: 0,
					})?.toLocaleString("fr-FR")})`}</span>
				</p>
				<h1 className="text-2xl text-[#18BC7A] font-semibold mb-5">
					{customerDetails?.cards?.stats?.totalAmount?.toLocaleString(
						"fr-FR"
					) ?? 0}{" "}
					XAF
				</h1>

				<h1 className="text-sm font-semibold tracking-tight">
					Total Paiements
				</h1>
				<h1 className="text-2xl text-[#18BC7A] font-semibold mb-5">
					{customerDetails?.payments?.stats?.total?.toLocaleString(
						"fr-FR"
					) ?? 0}{" "}
					XAF
				</h1>

				{/* <h1 
        style={{display:customerDetails?.payments?.groups?'block':'none'}} 
        className="text-sm font-semibold">
          Destination des paiements</h1>
        <div 
        style={{display:customerDetails?.payments?.groups?'block':'none'}} 
        className="relative  overflow-hidden">
            <Doughnut data={userPaymentsGraphData} />
            <div className='flex flex-wrap gap-x-10 gap-3'>
                {userPaymentsData?.map((item:any, index:any) => (
                  <LegendItem key={index} label={item.merchant?.name} color={item.color} value={`${item.percentageOfTotal?.toFixed(2)}%`}/>
                ))}
            </div>
        </div> */}
			</div>
		</>
	);
};

export default CartesSide;
