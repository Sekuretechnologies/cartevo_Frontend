import { useTranslation } from "@/hooks/useTranslation";
import { RootState } from "@/redux/store";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { useEffect, useState } from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { useSelector } from "react-redux";
export interface ITableHeader {
	[key: string]: string;
}
export interface IGenericRow {
	[key: string]: any; //string | number | boolean | React.ReactNode; // Adjust according to your data types
}

export interface ISortState {
	keyToSort: string;
	order: "asc" | "desc";
}
export interface IMinMaxState {
	min: number;
	max: number;
}
type Props = {
	searchTerm?: string;
	data: IGenericRow[];
	headerData: ITableHeader;
	isLoading?: boolean;
};

const getSortedData = (arrayToSort: any[], sort: ISortState): any[] => {
	if (!Array.isArray(arrayToSort)) {
		throw new Error("arrayToSort must be an array");
	}
	if (
		typeof sort !== "object" ||
		!sort.hasOwnProperty("keyToSort") ||
		!sort.hasOwnProperty("order")
	) {
		throw new Error(
			"sort must be an object with properties keyToSort and order"
		);
	}

	let sortOrder: number;
	switch (sort.order) {
		case "asc":
			sortOrder = 1;
			break;
		case "desc":
			sortOrder = -1;
			break;
		default:
			throw new Error(`Unsupported sort order: ${sort.order}`);
	}

	return arrayToSort.sort((a, b) => {
		if (a[sort.keyToSort] && b[sort.keyToSort]) {
			// Handle JSX elements
			if (
				typeof a[sort.keyToSort] === "object" &&
				typeof b[sort.keyToSort] === "object"
			) {
				// Extract the underlying value using React.cloneElement to avoid unintended side effects
				console.log(sort.keyToSort);
				console.log(a[sort.keyToSort]);
				console.log(b[sort.keyToSort]);

				const aValue = React.cloneElement(
					a[sort.keyToSort] as React.ReactElement<any>
				).props.isActive
					? "Actif"
					: "Inactif";
				const bValue = React.cloneElement(
					b[sort.keyToSort] as React.ReactElement<any>
				).props.isActive
					? "Actif"
					: "Inactif";

				return (aValue > bValue ? 1 : -1) * sortOrder;
			}

			// Handle other data types (string comparison with numeric sorting)
			if (
				typeof a[sort.keyToSort] === "string" &&
				typeof b[sort.keyToSort] === "string"
			) {
				return (
					String(a[sort.keyToSort]).localeCompare(
						String(b[sort.keyToSort]),
						undefined,
						{ numeric: true }
					) * sortOrder
				);
			}
		}

		// Generic comparison for other data types
		return (a[sort.keyToSort] > b[sort.keyToSort] ? 1 : -1) * sortOrder;
	});
};

const filterData = (data: any[], searchTerm: string): any[] => {
	return data;
	// if (!searchTerm) {
	//   return data; // Return all items if no search term
	// }

	// return data.filter(item => {
	//   let found = false;
	//   Object.values(item).some(value => {
	//     if(value){
	//       if (typeof value === "object") {
	//         const val = React.cloneElement(value as React.ReactElement<any>).props.isActive ? 'Actif' : 'Inactif';
	//         if (val.toLowerCase().includes(searchTerm.toLowerCase())) {
	//             found = true;
	//         }
	//       } else if (typeof value === "string") {
	//         if (value.toLowerCase().includes(searchTerm.toLowerCase())) {
	//           found = true;
	//         }
	//       }
	//     }
	//   });
	//   return found;
	// });
};

const AdminTable: React.FC<Props> = ({
	searchTerm,
	data,
	headerData,
	isLoading,
}) => {
	console.log("headerData :: ", headerData);

	const [sort, setSort] = useState<ISortState>({
		keyToSort: "serial",
		order: "asc",
	});
	const [itemsPerPage, setItemsPerPage] = useState<number>(10);
	const [currentPage, setCurrentPage] = useState<number>(1);
	const [itemsRange, setItemsRange] = useState<IMinMaxState>({
		min: 1,
		max: currentPage * itemsPerPage,
	});

	const [sortedData, setSortedData] = useState<any[]>([]);
	const [filteredData, setFilteredData] = useState<any[]>([]);
	const [paginatedData, setPaginatedData] = useState<any[]>([]);
	const [totalPages, setTotalPages] = useState<number>(0);

	const handleHeaderClick = (headerKey: string | number) => {
		const { keyToSort, order } = sort;
		// Toggle the sorting order based on the current keyToSort and order
		const newOrder = order === "asc" ? "desc" : "asc";
		// Update the sorting state
		setSort({ keyToSort: String(headerKey), order: newOrder });
	};

	// const getSortedData = (arrayToSort: any[], sort: { keyToSort: string, order: 'asc' | 'desc' }): any[] => {

	useEffect(() => {
		setSortedData(getSortedData(data, sort));
	}, [data]);
	useEffect(() => {
		setFilteredData(
			filterData(sortedData, searchTerm?.toLowerCase() || "")
		);
	}, [sortedData]);
	useEffect(() => {
		setTotalPages(Math.ceil(filteredData.length / itemsPerPage)); // Calculate total pages
		setPaginatedData(
			filteredData.slice(itemsRange.min - 1, itemsRange.max)
		);
	}, [filteredData, itemsPerPage, itemsRange]);
	// useEffect(() => {
	//     // console.log("data-data-data : ", data);
	//     setSortedData(getSortedData(data, sort));
	//     setFilteredData(filterData(sortedData, searchTerm?.toLowerCase() || ''));
	//     setTotalPages(Math.ceil(filteredData.length / itemsPerPage)); // Calculate total pages
	//     setPaginatedData(filteredData.slice(itemsRange.min - 1, itemsRange.max));
	//     // console.log("data-data-data : ", data);
	//     // console.log("sortedData-sortedData : ", sortedData);
	//     // console.log("filteredData-filteredData : ", filteredData);
	//     // console.log("paginatedData-paginatedData : ", paginatedData);

	// }, [data])

	const handlePageChange = (e: any, page: number) => {
		e.preventDefault();
		if (page > 0 && page <= totalPages) {
			setCurrentPage(page);
			let max = page * itemsPerPage;
			max = max > filteredData.length ? filteredData.length : max;
			let min = (page - 1) * itemsPerPage + 1;
			// min = min < 1 ? 1 : min;
			setItemsRange({
				min: min,
				max: max,
			});
		}
	};

	const handleKeyPress = (e: any) => {
		if (e.key === "Enter" || e.key === " ") {
			const pageNumber = parseInt(e.target.value);
			if (pageNumber > 0 && pageNumber <= totalPages) {
				handlePageChange(e, pageNumber);
			}
		}
	};

	// const paginatedData = filteredData.slice(
	//   (currentPage - 1) * itemsPerPage,
	//   (currentPage - 1) * itemsPerPage + filteredData.length
	// );

	const prodMode = useSelector<RootState>((state) => state.settings.prodMode);
	const { t } = useTranslation();
	const pathname = usePathname();

	return (
		<div>
			<div className="w-full overflow-x-auto">
				{/* {JSON.stringify(Object.keys(headerData))} */}
				<table className="w-full">
					<thead className="bg-app-lightgray py-6">
						<tr key={"th0"} className="h-10 rounded-md">
							{Object.keys(headerData)?.length ? (
								Object.keys(headerData).map((key, index) => (
									<>
										<th
											key={index}
											style={{ whiteSpace: "nowrap" }}
											className="px-2 text-start text-black font-semibold text-sm cursor-pointer"
											onClick={() =>
												handleHeaderClick(key)
											}
										>
											<span className="flex gap-2 items-center justify-between">
												{headerData[key]}
												{/* {!key.includes("edit") &&
												!key.includes("action") ? (
													<span className="flex items-center cursor-pointer">
														{sort.keyToSort ==
														key ? (
															sort.order ==
															"asc" ? (
																<FaSortDown
																	size={15}
																	color={
																		"#fff"
																	}
																	className="mb-2"
																/>
															) : (
																<FaSortUp
																	size={15}
																	color={
																		"#fff"
																	}
																	className=""
																/>
															)
														) : (
															<FaSortDown
																size={15}
																color={"#fff"}
																className="mb-2"
															/>
														)}
													</span>
												) : (
													<></>
												)} */}
											</span>
										</th>
									</>
								))
							) : (
								<></>
							)}
						</tr>
					</thead>
					<tbody>
						{paginatedData.length !== 0 ? (
							paginatedData.map((row) => (
								<tr
									key={row.id}
									className="h-[50px] border-b border-gray-100 hover:bg-gray-50"
								>
									{Object.keys(row).map((key, cellIndex) => (
										<td
											key={cellIndex}
											className="px-2 text-sm"
											style={{ whiteSpace: "nowrap" }}
										>
											{row[key]}
										</td>
									))}
								</tr>
							))
						) : (
							<tr style={{ position: "relative" }}>
								<td
									colSpan={Object.keys(headerData)?.length}
									style={{
										display: "table-cell",
										margin: "auto",
										paddingLeft: "50%",
									}}
									className=""
								>
									{isLoading
										? ""
										: data.length > 0
										? `${data.length} pending results ...`
										: `No results`}
								</td>
							</tr>
						)}
					</tbody>
					<tfoot>{/* Footer content can be dynamic as well */}</tfoot>
				</table>
				{!prodMode &&
					(pathname.endsWith("/customers") ||
						pathname.endsWith("/customers/create")) && (
						<div
							className={`${
								isLoading
									? "hidden"
									: "ablsolute -bottom-10 w-full mt-7"
							} h-14 flex justify-center items-center bg-primary-50`}
						>
							<span className="font-semibold ">NOTE </span>
							<p>: {t.customers.note}</p>
						</div>
					)}
				<div className="py-10 flex w-full justify-center items-center">
					{isLoading ? (
						<div className={"loadingSpinner"}></div>
					) : (
						<></>
					)}
				</div>
			</div>
			<div className="py-10 text-sm flex flex-col md:flex-row  gap-10 md:gap-0 justify-between items-center">
				{filteredData ? (
					<>
						<div>
							Results:{" "}
							<strong>
								{itemsRange.min} - {itemsRange.max} /{" "}
								{filteredData.length}
							</strong>
						</div>
						<div className="flex items-center gap-3">
							<span>Go to page</span>
							<Link
								href=""
								style={{
									display: currentPage === 1 ? "none" : "",
								}}
								onClick={(e) =>
									handlePageChange(e, currentPage - 1)
								}
							>
								<FaChevronLeft />
							</Link>
							<div className="py-2 px-2 w-[70px] bg-gray-200 rounded-2xl text-center flex justify-center">
								<input
									value={currentPage} // Update input value with current page
									type="number"
									min={1}
									max={totalPages}
									className="w-full bg-gray-200 border-none outline-none text-center"
									// onChange={(e) => handlePageChange(parseInt(e.target.value))} // Update page on input change
									// ref={inputRef} // Assign the ref
									onKeyDown={(e) => handleKeyPress} // Add event handler for key press
								/>
							</div>
							<Link
								href=""
								style={{
									display:
										currentPage === totalPages
											? "none"
											: "",
								}}
								onClick={(e) =>
									handlePageChange(e, currentPage + 1)
								}
							>
								<FaChevronRight />
							</Link>
							<span>/ {totalPages}</span>
						</div>
					</>
				) : (
					<></>
				)}
			</div>
		</div>
	);
};

export default AdminTable;
