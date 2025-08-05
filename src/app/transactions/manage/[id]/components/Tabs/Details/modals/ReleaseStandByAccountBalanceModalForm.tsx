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
// import { useNavigate } from 'react-router-dom';
export const formSchema = z.object({
	amount: z.number({ message: "Entrez un montant" }),
	// phone: z.string(
	//     {message:'Entrez un numero de telephone'}
	// ),
});

const handleReleaseStandByBalance = async (queryData: any) => {
	const { userId, adminUserId } = queryData;
	console.log("handleReleaseStandByBalance : ", { userId, adminUserId });
	// return {currentUserId, customerId, label, body}
	const response = await CustomerService.handle_release_standby_balance({
		body: { id: userId },
		adminUserId,
	});
	if (!response.ok) {
		const responseBody = await response.json();
		throw new Error(responseBody.message);
	}
	const responseJson = await response.json();
	return responseJson;
};

interface TransferModalProps {
	customer?: any;
	setIsOpen?: (data?: any) => void;
}
export default function ReleaseStandByAccountBalanceModalForm({
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
			amount: customer.old_balance_xaf || 0,
			// phone: "66192325",
		},
	});
	const currentUser = useSelector(selectCurrentUser);
	const customerDetails: any = useSelector(selectCurrentCustomerDetails);

	const mutation = useMutation({
		mutationFn: (data) =>
			handleReleaseStandByBalance({
				userId: customer.id,
				adminUserId: currentUser.id,
			}),
		onError: (err: any) => {
			console.error("onError : ", err.message);
			toast.error(
				`Une erreur est survenue lors du Reversement vers solde actif : ${err.message}`
			);
		},
		onSuccess: (data) => {
			console.log("onSuccess : ", data);
			toast.success(
				`Reversement de ${form.getValues(
					"amount"
				)} vers solde actif effectué avec SUCCES !`
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

	const getFormLabels = (amount?: string | number) => {
		return {
			title: "Retirer du compte courant de",
			btnText: "Retirer du compte courant",
			btnStyle: "red",
			label: "withdrawAccount",
			toastTextSuccess: "Retrait du compte courant effectué avec succès",
			toastTextError: "Erreur lors du retrait du compte courant",
			note: `(Montant maximal à retirer : ${amount})`,
			min: 0,
			max: customer?.old_balance_xaf,
		};
	};

	return (
		<div className="bg-white m-auto p-8 rounded-md min-w-[350px] max-w-[700px]">
			<div className="flex justify-between mb-5 gap-10">
				<Title
					title={`Regularisation`} //{`Reversement vers solde actif`}
				/>
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
						<div>
							<p className="text-gray-800 text-sm font-normal tracking-tight">
								Statut regularisation
							</p>
							<span className="">
								{customer?.regularisation_status}
							</span>
						</div>

						<div>
							<p className="text-gray-800 text-sm font-normal tracking-tight">
								Methode regularisation
							</p>
							<span className="">
								{customer?.regularisation_method}
							</span>
						</div>

						<div>
							<p className="text-gray-800 text-sm font-normal tracking-tight">
								Numero telephone regularisation
							</p>
							<span className="">
								{customer?.regularisation_phone}
							</span>
						</div>
						<FormField
							control={form.control}
							name="amount"
							render={({ field }) => (
								<FormItem>
									<FormLabel className="text-gray-900 text-sm font-[500] tracking-tight">
										Montant à reverser
									</FormLabel>
									&nbsp;&nbsp;&nbsp;
									<span className="text-xs text-gray-500">{`(Montant maximal à retirer : ${(
										customer.old_balance_xaf || 0
									)?.toLocaleString("fr-FR")})`}</span>
									<FormControl>
										<Input
											type="number"
											min={0}
											max={
												Math.floor(
													customer.old_balance_xaf
												) ?? 1000000000000000000000000
											}
											value={field.value}
											className="px-2 w-full bg-[#F4EFE3]"
											disabled
										/>
									</FormControl>
									<FormMessage className="text-red-400" />
								</FormItem>
							)}
						/>
					</div>

					<div
						style={{
							display:
								getFormLabels()?.max &&
								getFormLabels()?.max !== 0
									? "block"
									: "none",
						}}
						className={`mt-[10vh]`}
					>
						<CButton
							text={`Reverser`}
							btnStyle={`red`}
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
