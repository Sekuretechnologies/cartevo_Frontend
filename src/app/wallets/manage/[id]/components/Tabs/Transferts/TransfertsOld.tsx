"use client";
import { DataTable } from "@/components/Tables/DataTable";
import { data } from "@/constants/Index";
import { columns } from "@/components/Tables/Column";
import BtnTrio from "@/components/shared/BtnTrio";
import SearchBar from "@/components/shared/SearchBar";
import { Separator } from "@/components/ui/separator";
import Title from "@/components/shared/Title";
import CustomTable from "@/components/shared/CustomTable";
import { headerUserAccountData, tableUserAccountData } from "@/constants/Index";
import CButton from "@/components/shared/CButton";
import { FaLock } from "react-icons/fa";
import { FourDots } from "@/components/shared/icons";
import ActiveYesNo from "@/components/shared/ActiveYesNo";
import { IoMdCloseCircle } from "react-icons/io";
import { FaCheckCircle } from "react-icons/fa";
import { MdChangeCircle } from "react-icons/md";
import { MdCheckCircle } from "react-icons/md";
const Transferts = () => {
	const rearrangedTableData = tableUserAccountData.map((item, index) => {
		const rearrangedItem = {
			serial: index + 1,
			name: item.name,
			country: item.country,
			phone: item.phone,
			email: item.email,
			solde: item.solde,
			totalTrx: item.totalTrx,
			avgTrx: item.avgTrx,
			status: <ActiveYesNo isActive={item.status} />,
			date: item.date,
			actions: (
				<>
					<div className="flex gap-5">
						<CButton
							text={"Manager"}
							href={`users_accounts/manage/${index + 1}`}
							btnStyle={"dark"}
							icon={<FourDots />}
						/>
						{item.locked ? (
							<CButton
								text={"Debloquer"}
								btnStyle={"lightYellow"}
								icon={<FaLock />}
							/>
						) : (
							<CButton
								text={"Bloquer"}
								btnStyle={"yellow"}
								icon={<FaLock />}
								width={"100%"}
							/>
						)}
					</div>
				</>
			),
		};
		item = rearrangedItem;
		return item;
	});

	return (
		<section className="p-6">
			<div className="w-full flex justify-start items-center">
				<div className="pr-10">
					<h1 className="text-sm font-semibold mb-2">
						Nombre de transferts{" "}
						<span className="text-base font-semibold text-[#18BC7A] ml-5">
							88
						</span>
					</h1>
					<div className="flex justify-start items-center gap-10 w-full">
						<p
							title="Réussis"
							className=" flex items-center gap-2 text-sm font-normal"
						>
							<MdCheckCircle size={24} color="#1F66FF" />
							<span className="ml-1 font-bold">3</span>
						</p>
						<p
							title="En cours"
							className=" flex items-center gap-2 text-sm font-normal"
						>
							<MdChangeCircle size={24} color="#777" />
							<span className="ml-1 font-bold">5</span>
						</p>
						<p
							title="Echoués"
							className=" flex items-center gap-2 text-sm font-normal"
						>
							<IoMdCloseCircle size={24} color="#F85D4B" />
							<span className="ml-1 font-bold">2</span>
						</p>
					</div>
				</div>
				{/* <Separator orientation="vertical" className="h-10 mr-10" /> */}
				<div className="h-full pt-2 border-l-1 px-10">
					<h1 className="text-sm font-bold mb-2">Total transferts</h1>
					<p className="text-xl font-bold text-[#18BC7A]">
						2 500 750 Fcfa
					</p>
				</div>
				{/* <Separator orientation="vertical" className="h-10 mr-10" /> */}
				<div className="h-full border-l-1 px-10">
					<h1 className="text-sm font-bold mb-2">
						moyenne par semaine
					</h1>
					<p className="text-xl font-bold text-[#18BC7A]">
						45 450 Fcfa / sem
					</p>
				</div>
			</div>
			<div className="my-[50px]">
				<div className="mb-5">
					<Title title={"Liste des transferts"} />
				</div>
				<CustomTable
					headerData={headerUserAccountData}
					tableData={rearrangedTableData}
					threeButtons
				/>
			</div>
		</section>
	);
};

export default Transferts;
