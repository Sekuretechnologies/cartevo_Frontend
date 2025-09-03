"use client";
import React, { useEffect, useState } from "react";
import AdminTable, {
	IGenericRow,
	ITableHeader,
} from "@/components/AdminTable/Table";
import SearchBar from "@/components/shared/SearchBar";
import Link from "next/link";
import { BsFileEarmarkExcel } from "react-icons/bs";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { IoCopyOutline, IoPrintOutline } from "react-icons/io5";
import { HiOutlineFilter } from "react-icons/hi";
import CustomDropdown from "./CustomDropdown";
import { RxDotsHorizontal } from "react-icons/rx";
import CButton from "./CButton";
import { useDispatch, useSelector } from "react-redux";
import { setSearchTerm, selectSearchTerm } from "@/redux/slices/search";
import CustomersFilterForm from "./CustomTableFilters/CustomersFilterForm";
import RegularisationFilterForm from "./CustomTableFilters/RegularisationFilterForm";
import TransactionsFilterForm from "./CustomTableFilters/TransactionsFilterForm";

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
}) => {
	const dispatch = useDispatch();
	const searchTerm: string = useSelector(selectSearchTerm);
	const [currentPage, setCurrentPage] = useState(1);
	const [filterDetails, setFilterDetails] = useState(false);
	const [usersPerPage] = useState(5);
	const [data, setData] = React.useState<IGenericRow[]>(); // Add type annotation for data and change initial state value to an empty object

	// useEffect(() => {
	//   const getUsers = async () => {
	//     const res = await fetch('api/users');
	//     const users = await res.json();
	//     setData(users);
	//   }

	//   getUsers();
	// }, []);

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

	// useEffect(() => {
	//   console.log("filter ::: ", filter);
	//   console.log("filterType ::: ", filterType);
	//   console.log("filterDetails ::: ", filterDetails);
	// }, []);

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
					) : (
						<></>
					)}

					{btn}

					{
						threeButtons ? (
							<div className={`flex gap-x-3`}>
								{/* <CButton
          text={'Copier'}
          icon={<IoCopyOutline/>}
          btnStyle={'lightGreen'}
          height={'32px'}
          /> */}

								{generateExcel ? (
									<CButton
										text={"Excel"}
										icon={<BsFileEarmarkExcel />}
										btnStyle={"lightGreen"}
										height={"32px"}
										onClick={() => generateExcel()}
									/>
								) : (
									<></>
								)}

								{/* <CButton
          text={'Imprimer'}
          icon={<IoPrintOutline/>}
          btnStyle={'lightGreen'}
          height={'32px'}
          /> */}
							</div>
						) : (
							<></>
						)
						// <CustomDropdown
						//   cstyle={'light-green'}
						//   iconSize={20}
						//   hasDropdownIcon={false}
						//   icon= {<RxDotsHorizontal/>}
						//   items={[
						//     <div key={'1'} className='flex justify-between gap-2'>
						//     <IoCopyOutline size={15} color={'#18BC7A'} />
						//     <span className='text-sm text-[#18BC7A]'>
						//       Copy
						//     </span>
						//   </div>,
						//   <div key={'2'} className='flex justify-between gap-2'>
						//     <BsFileEarmarkExcel size={15} color={'#18BC7A'} />
						//     <span className='text-sm text-[#18BC7A] h-fit'>
						//       Excel
						//     </span>
						//   </div>,
						//   <div key={'3'} className='flex justify-between gap-2'>
						//     <IoPrintOutline size={15} color={'#18BC7A'} />
						//     <span className='text-sm text-[#18BC7A]'>
						//       Print
						//     </span>
						//   </div>
						//   ]}
						// />
					}
				</div>
			</div>
			{filter && filterDetails ? (
				<div className="mt-3">
					{filterType === "user" ? (
						<CustomersFilterForm
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
					) : (
						<></>
					)}
				</div>
			) : (
				<></>
			)}

			<div className="mt-6 w-full">
				<AdminTable
					searchTerm={searchTerm}
					isLoading={isLoading}
					headerData={headerData}
					data={tableData || []}
				/>
			</div>

			{/* <div className='py-10 text-sm flex justify-end items-center'>
        <div className='flex items-center gap-3'>
            <span>Aller à la page</span>
            <Link href=""><FaChevronLeft/></Link>
            <div className="py-2 px-2 w-[70px] bg-gray-200 rounded-2xl text-center flex justify-center">
              <input
                defaultValue={'01'}
                type="number"
                min={'0'}
                className="w-full bg-gray-200 border-none outline-none text-center"
                placeholder="Enter a number"
              />
            </div>
            <Link href=""><FaChevronRight/></Link>
            <span>sur 254</span>
        </div>
    </div> */}
		</>
	);
};

export default CustomTable;
