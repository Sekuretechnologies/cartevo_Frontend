"use client";
import { FaArrowRight } from "react-icons/fa";
import { Input } from "../ui/input";
import { IoIosSearch } from "react-icons/io";
import { IoArrowForward } from "react-icons/io5";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { useMutation } from "react-query";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { selectSearchTerm, setSearchTerm } from "@/redux/slices/search";
import { useDispatch } from "react-redux";
import { useEffect } from "react";

export const searchSchema = z.object({
	search: z.string(),
});

interface SearchProps {
	searchTerm?: string;
	search?: string;
	setSearch?: (data?: any) => void;
}

const SearchBar: React.FC<SearchProps> = ({
	search,
	setSearch,
	searchTerm,
}) => {
	const dispatch = useDispatch();
	// const searchTerm:string = useSelector(selectSearchTerm);
	const form = useForm<z.infer<typeof searchSchema>>({
		resolver: zodResolver(searchSchema),
		defaultValues: {
			search: setSearch ? search : searchTerm,
		},
	});

	const onSubmit = (data: any) => {
		if (setSearch) {
			setSearch(data.search);
		} else {
			dispatch(setSearchTerm(data.search));
		}
	};

	const onError = (err: any) => {
		console.error("any", err);
	};

	return (
		<div className="flex bg-gray-100 w-full rounded-md">
			<span className="flex justify-center items-center px-4">
				<IoIosSearch size={25} color="#d1d1d1" />
			</span>
			<Form {...form}>
				<form
					onSubmit={form.handleSubmit(onSubmit, onError)}
					className="w-full flex"
				>
					<FormField
						control={form.control}
						name="search"
						render={({ field }) => (
							<FormItem className="w-full">
								<FormControl>
									<Input
										type="search"
										defaultValue={
											setSearch ? search : searchTerm
										}
										placeholder="Search ..."
										className="bg-inherit text-sm text-gray-700 font-medium ring ring-transparent h-[33px] w-full border-none"
										aria-label="search"
										{...field}
									/>
									{/* <Input className="px-6 w-[272px] bg-[#F4EFE3]" {...field} /> */}
								</FormControl>
								{/* <FormMessage className="text-red-400"/> */}
							</FormItem>
						)}
					/>

					<button
						type="submit"
						className="btn px-2 opacity-50 hover:opacity-100"
					>
						<IoArrowForward size={24} color="#7e7e7e" />
					</button>
				</form>
			</Form>
		</div>
	);
};

export default SearchBar;
