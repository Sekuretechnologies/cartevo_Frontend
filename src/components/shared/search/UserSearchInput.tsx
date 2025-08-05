import { useState, useEffect, useRef } from "react";
import debounce from "lodash.debounce";
import { useMutation } from "react-query";
import toast from "react-hot-toast";
import { isObject } from "@/utils/utils";
import { CustomerService } from "@/api/services/v2/customer";
import { useClickAway } from "react-use";

const getAllCustomers = async (queryData: any) => {
	const { searchTerm, filterContent } = queryData;
	let params: any = { nbPerPage: 5 };
	if (searchTerm) params.searchTerm = searchTerm;

	// if(isObject(params)){
	//     Object.entries(params).map(([key, value]:any[]) => {
	//         if(value && value!== 'all') params[key] = value;
	//     });
	// }
	console.log("getAllCustomers searchTerm : ", searchTerm);
	console.log("getAllCustomers filterContent : ", filterContent);
	console.log("getAllCustomers params : ", params);

	const response = await CustomerService.get_all_customers(params);
	const responseJson = await response.json();
	if (!response.ok) {
		throw new Error(responseJson.message || "Failed to get users");
	}
	console.log("responseJson.data : ", responseJson.data);

	return responseJson.data;
};

interface IProps {
	onSelected: (data: any) => void;
	// field?: any,
}

function SearchUserInput({ onSelected }: IProps) {
	const [showPicker, setShowPicker] = useState(false);
	const dropdownRef = useRef(null);
	useClickAway(dropdownRef, () => {
		setShowPicker(false);
	});
	const [query, setQuery] = useState("");
	const [results, setResults] = useState([]);

	const handleQueryChange = (e: any) => {
		setShowPicker(true);
		if (e.target.value?.length > 2) setQuery(e.target.value);
	};

	const debouncedHandleQueryChange = debounce(handleQueryChange, 300); // 300ms delay

	const mutation = useMutation({
		mutationFn: () => getAllCustomers({ searchTerm: query }),
		onError: (err: any) => {
			console.error("onError : ", err.message);
			toast.error(`Echec lors de la recherche : ` + err.message);
		},
		onSuccess: (data) => {
			console.log("onSuccess : ", data);
			setResults(data);
			// toast.success(`Fichier excel généré avec succes.`);
		},
	});

	useEffect(() => {
		if (query?.length > 2) mutation.mutate();
	}, [query]);

	const handleSelected = (value: any) => {
		setShowPicker(false);
		onSelected(value);
	};

	return (
		<div
			style={{
				width: "100%",
				position: "relative",
				height: "fit-content",
			}}
		>
			<input
				type="text"
				// value={query}
				onChange={debouncedHandleQueryChange}
				className={`w-full border border-gray-300 text-sm text-gray-900 font-normal rounded-md px-2 py-2`}
				placeholder={"Search..."}
			/>
			{showPicker && query?.length > 2 ? (
				<div
					ref={dropdownRef}
					className={`p-1 bg-white rounded-xl shadow-xl flex-flex-col gap-2`}
					style={{
						position: "absolute",
						zIndex: "1000",
						top: "50px",
						left: "0",
						width: "100%",
						display: results?.length ? "block" : "none",
					}}
				>
					{mutation.isLoading ? (
						<div className="flex justify-center w-full py-10">
							<div className={"loadingSpinner"}></div>
						</div>
					) : results?.length > 0 ? (
						<ul>
							{results
								?.slice(0, 5)
								?.map((result: any, index: number) => (
									<li
										key={result?.id}
										className={`p-1 flex flex-col hover:bg-gray-100 cursor-pointer`}
										onClick={() => handleSelected(result)}
										style={{
											borderTop:
												index > 0
													? "1px solid #eee"
													: "",
										}}
									>
										<span className="text-md">
											{result?.first_name}
										</span>
										<span className="text-sm text-gray-500">
											{result?.email}
										</span>
										<span className="text-sm text-gray-500">
											{result?.phone}
										</span>
									</li>
								))}
						</ul>
					) : (
						<span>{`Aucun resultat`}</span>
					)}
				</div>
			) : (
				<></>
			)}
		</div>
	);
}

export default SearchUserInput;
