import CButton from "@/components/shared/CButton";
import Title from "@/components/shared/Title";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { FaX } from "react-icons/fa6";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { loginSchema } from "@/validation/FormValidation";
import { FaChevronRight } from "react-icons/fa";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useMutation } from "react-query";
import { HashLoader } from "react-spinners";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import {
	selectCurrentGetSekureApiToken,
	selectCurrentUser,
	setCredentials,
} from "@/redux/slices/auth";
import { useRouter } from "next/navigation";
import classNames from "classnames";
import { Textarea } from "@/components/ui/textarea";
import {
	Autocomplete,
	Box,
	Chip,
	MenuItem,
	OutlinedInput,
	TextField,
} from "@mui/material";
import _ from "lodash";
import { TransactionService } from "@/api/services/transaction";
import {
	selectCurrentCustomerDetails,
	setCurrentCustomerDetails,
} from "@/redux/slices/customer";
import { useRef } from "react";
import { GabonService } from "@/api/services/gabon";
import { getCurrentDateTime } from "@/utils/utils";
import { UserService } from "@/api/services/user";
import { CustomerService } from "@/api/services/v2/customer";
import { Select, SelectItem } from "@nextui-org/select";
// import { useNavigate } from 'react-router-dom';
export const formSchema = z.object({
	status: z.string({ message: "Veuillez choisir un statut" }),
	phone: z.string({ message: "Entrez un numero de telephone" }),
	method: z.string({ message: "Veuillez choisir une methode" }),
});

const handleUpdateRegStatus = async (queryData: any) => {
	const { data, userId, adminUserId } = queryData;
	console.log("handleUpdateRegStatus : ", { userId, adminUserId });
	// return {currentUserId, customerId, label, body}
	const response = await CustomerService.update_one_customer({
		userId: adminUserId,
		customerId: userId,
		body: {
			regularisation_status: data.status,
			regularisation_phone: data.phone,
			regularisation_method: data.method,
			id: userId,
		},
	});
	if (!response.ok) {
		const responseBody = await response.json();
		throw new Error(responseBody.message);
	}
	const responseJson = await response.json();
	return responseJson;
};

const methodData = [
	{
		key: "MOMO",
		label: "MOMO",
	},
	{
		key: "SEKURE",
		label: "SEKURE",
	},
];

const statusData = [
	{
		key: "VERIFIED",
		label: "VERIFIED",
	},
	{
		key: "QUEUED",
		label: "QUEUED",
	},
	{
		key: "PROCESSING",
		label: "PROCESSING",
	},
	{
		key: "PAID",
		label: "PAID",
	},
];

interface TransferModalProps {
	customer?: any;
	setIsOpen?: (data?: any) => void;
}
export default function EditRegStatusModalForm({
	customer,
	setIsOpen,
}: TransferModalProps) {
	const pathname = usePathname();
	const redirectRef: any = useRef();

	const router = useRouter();
	// const navigate = useNavigate();
	const dispatch = useDispatch();
	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			method: customer?.regularisation_method,
			phone: customer?.regularisation_phone,
			status: customer?.regularisation_status,
		},
	});
	const currentUser = useSelector(selectCurrentUser);
	const customerDetails: any = useSelector(selectCurrentCustomerDetails);

	const mutation = useMutation({
		mutationFn: (data: any) =>
			handleUpdateRegStatus({
				data,
				userId: customer.id,
				adminUserId: currentUser.id,
			}),
		onError: (err: any) => {
			console.error("onError : ", err.message);
			toast.error(
				`Une erreur est survenue lors de la Modification de statut de regularisation : ${err.message}`
			);
		},
		onSuccess: (data) => {
			console.log("onSuccess : ", data);
			toast.success(
				`Modification de statut de regularisation effectué avec SUCCES !`
			);
			redirectRef.current.href = window.location.pathname;
			redirectRef.current.click();
		},
	});

	const onSubmit = (data: any) => {
		console.log("pathname : ", pathname);
		mutation.mutate(data);
	};
	const onError = (err: any) => {
		console.error("any", err);
	};

	const handleMethodChange = (data: any) => {
		const value = data.target.value;
		form.setValue("method", value);
	};

	const handleStatusChange = (data: any) => {
		const value = data.target.value;
		form.setValue("status", value);
	};

	return (
		<div className="bg-white m-auto p-8 rounded-md min-w-[350px] max-w-[700px]">
			<div className="flex justify-between mb-5 gap-10">
				<Title title={`Modification de statut de regularisation`} />
				{/* <Link href={pathname}>
					<FaX size={16} color={"#444"} />
				</Link> */}
				<div
					className="cursor-pointer"
					onClick={() => setIsOpen && setIsOpen(false)}
				>
					<FaX size={16} color={"#444"} />
				</div>
			</div>

			<Form {...form}>
				<form onSubmit={form.handleSubmit(onSubmit, onError)}>
					<div className="space-y-[20px]">
						<FormField
							control={form.control}
							name="status"
							render={({ field }) => (
								<FormItem>
									<FormLabel className="text-gray-900 text-sm font-[500] tracking-tight">
										Statut de regularisation
									</FormLabel>
									<FormControl>
										<Select
											{...field}
											placeholder="Sélectionner le statut"
											style={{
												width: "100%",
												background: "#F4EFE3",
											}}
											className={`rounded-xs text-gray-900 font-normal`}
											defaultSelectedKeys={[field.value]}
											onChange={(data) =>
												handleStatusChange(data)
											}
										>
											{statusData.map((item, idx) => (
												<SelectItem
													key={item.key}
													value={item.key}
												>
													{item.label}
												</SelectItem>
											))}
										</Select>
									</FormControl>
									<FormMessage className="text-red-400" />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="method"
							render={({ field }) => (
								<FormItem>
									<FormLabel className="text-gray-900 text-sm font-[500] tracking-tight">
										Methode de regularisation
									</FormLabel>
									<FormControl>
										<Select
											{...field}
											placeholder="Sélectionner la methode"
											style={{
												width: "100%",
												background: "#F4EFE3",
											}}
											className={`rounded-xs text-gray-900 font-normal`}
											defaultSelectedKeys={[field.value]}
											onChange={(data) =>
												handleMethodChange(data)
											}
										>
											{methodData.map((item, idx) => (
												<SelectItem
													key={item.key}
													value={item.key}
												>
													{item.label}
												</SelectItem>
											))}
										</Select>
									</FormControl>
									<FormMessage className="text-red-400" />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="phone"
							render={({ field }) => (
								<FormItem>
									<FormLabel className="text-gray-900 text-sm font-[500] tracking-tight">
										Numero de telephone de regularisation
									</FormLabel>
									<FormControl>
										<Input
											type="text"
											className="px-2 w-full bg-[#F4EFE3]"
											{...field}
										/>
									</FormControl>
									<FormMessage className="text-red-400" />
								</FormItem>
							)}
						/>
					</div>

					<div
						// style={{display: (getFormLabels()?.max && getFormLabels()?.max !== 0)? 'block':'none'}}
						className={`mt-[10vh]`}
					>
						<CButton
							text={`Modifier`}
							btnStyle={`green`}
							type={"submit"}
							width={"100%"}
							height={"35px"}
						/>
					</div>
					<div
						className={classNames(
							"transition-all invisible z-20 bg-blue-900/30 opacity-0 absolute top-0 left-0 h-full w-full flex items-center justify-center",
							{
								"!opacity-100 !visible z-20":
									mutation.isLoading,
							}
						)}
					>
						<HashLoader
							className="shrink-0"
							size={50}
							color="#1F66FF"
						/>
					</div>
				</form>
			</Form>
			<a ref={redirectRef} hidden href="#"></a>
		</div>
	);
}
