"use client";
import AdminTable, {
	IGenericRow,
	ITableHeader,
} from "@/components/AdminTable/Table";
import SearchBar from "@/components/shared/SearchBar";
import { selectSearchTerm } from "@/redux/slices/search";
import { RootState } from "@/redux/store";
import React, { useEffect, useState } from "react";
import { BsFileEarmarkExcel } from "react-icons/bs";
import { HiOutlineFilter } from "react-icons/hi";
import { useDispatch, useSelector } from "react-redux";
import CButton from "./CButton";
import Cards from "./CustomTableFilters/Cards";
import CompanyFilterForm from "./CustomTableFilters/CompanyFilterForm";
import RegularisationFilterForm from "./CustomTableFilters/RegularisationFilterForm";
import TransactionsFilterForm from "./CustomTableFilters/TransactionsFilterForm";
import TransactionsForm from "./CustomTableFilters/TransactionsForm";
import UserFilterForm from "./CustomTableFilters/userFilterForm";

interface CustomTableProps {
	btn?: React.ReactNode;
	filter?: boolean;
	filterType?: string;
	isLoading?: boolean;
	threeButtons?: boolean;
	headerData: ITableHeader;
	tableData: IGenericRow[];
	search?: string;
	setSearch?: (data?: any) => void;
	filterContent?: any;
	setFilterContent?: (data?: any) => void;
	generateExcel?: (data?: any) => void;
	prodMode?: boolean;
}

const CustomTable: React.FC<CustomTableProps> = ({
	search,
	setSearch,
	filterContent,
	setFilterContent,
	generateExcel,
	headerData,
	tableData,
	btn,
	filter,
	filterType,
	isLoading,
	threeButtons,
	prodMode,
}) => {
	const dispatch = useDispatch();
	const searchTerm: string = useSelector(selectSearchTerm);
	const [currentPage, setCurrentPage] = useState(1);
	const [filterDetails, setFilterDetails] = useState(false);
	const [usersPerPage] = useState(5);
	const [data, setData] = React.useState<IGenericRow[]>(); // Add type annotation for data and change initial state value to an empty object

	// --- Nouveau state pour les companies ---
	const [companiesList, setCompaniesList] = useState<string[]>([]);

	// --- Mettre à jour la liste des companies si filterContent change ---
	useEffect(() => {
		if (filterContent?.companies) {
			setCompaniesList(filterContent.companies);
		}
	}, [filterContent]);

	const indexOfLastUser = currentPage * usersPerPage;
	const indexOfFirstUser = indexOfLastUser - usersPerPage;
	const currentUsers = data?.slice(indexOfFirstUser, indexOfLastUser) ?? [];

	const paginate = (pageNumber: number) => {
		setCurrentPage(pageNumber);
	};
	const handleFilterOpen = () => {
		setFilterDetails(!filterDetails);
		console.log("filterDetails ::: ", filterDetails);
	};

	const settings = useSelector((state: RootState) => state.settings);
	return (
		<>
			<div className="flex flex-col md:flex-row justify-between items-center">
				<SearchBar
					search={search}
					setSearch={setSearch}
					searchTerm={searchTerm}
				/>
				<div className="flex items-center gap-5 ml-0 md:ml-[100px] mt-5 md:mt-0">
					{filter ? (
						<CButton
							text={"Filter"}
							icon={<HiOutlineFilter />}
							btnStyle={"blue"}
							height={"33px"}
							onClick={() => handleFilterOpen()}
						/>
					) : null}

					{btn}

					{threeButtons ? (
						<div className={`flex gap-x-3`}>
							{generateExcel ? (
								<CButton
									text={"Excel"}
									icon={<BsFileEarmarkExcel />}
									btnStyle={"lightGreen"}
									height={"32px"}
									onClick={() => generateExcel()}
								/>
							) : null}
						</div>
					) : null}
				</div>
			</div>

			{/* --- Section filtre --- */}

			{filter && filterDetails ? (
				<div className="mt-3">
					{/* Filtre par company uniquement pour les users */}

					{filterType === "user" ? (
						<UserFilterForm
							filterContent={filterContent}
							setFilterContent={setFilterContent}
						/>
					) : filterType === "regularisation" ? (
						<RegularisationFilterForm
							filterContent={filterContent}
							setFilterContent={setFilterContent}
						/>
					) : filterType === "transaction" ? (
						<TransactionsFilterForm
							filterContent={filterContent}
							setFilterContent={setFilterContent}
						/>
					) : filterType === "company" ? (
						<CompanyFilterForm
							filterContent={filterContent}
							setFilterContent={setFilterContent}
						/>
					) : filterType === "cards" ? (
						<Cards
							filterContent={filterContent}
							setFilterContent={setFilterContent}
						/>
					) : filterType === "companyTransactions" ? (
						<TransactionsForm
							filterContent={filterContent}
							setFilterContent={setFilterContent}
						/>
					) : null}
				</div>
			) : null}

			<div className="mt-6 w-full">
				<AdminTable
					searchTerm={searchTerm}
					isLoading={isLoading}
					headerData={headerData}
					data={tableData || []}
				/>
			</div>
		</>
	);
};

export default CustomTable;
