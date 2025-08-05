"use client";
import { CustomerService } from "@/api/services/v2/customer";
import Title from "@/components/shared/Title";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { nairapaymentSchema } from "@/validation/FormValidation";
import { zodResolver } from "@hookform/resolvers/zod";
import classNames from "classnames";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import { HashLoader } from "react-spinners";
import { z } from "zod";
import { FaExternalLinkAlt, FaFile } from "react-icons/fa";
import CButton from "@/components/shared/CButton";
import UpdateProofModalForm from "./modals/UpdateProofModalForm";
import { selectCurrentNairaPayment } from "@/redux/slices_v2/nairapay";

export default function Details() {
	const pathname = usePathname();
	const redirectRef: any = useRef();
	const nairaPaymentData: any = useSelector(selectCurrentNairaPayment);
	const [isUpdateProofModalFormOpen, setIsUpdateProofModalFormOpen] =
		useState(false);
	const MAX_TAGS = 5;
	//Retrieve all the returned items from the hook
	// const { tags, handleAddTag, handleRemoveTag } = useTags(MAX_TAGS); // pass the maximum tags

	const form = useForm<z.infer<typeof nairapaymentSchema>>({
		resolver: zodResolver(nairapaymentSchema),
		defaultValues: {
			bank_name: nairaPaymentData?.bank_name,
			bank_code: nairaPaymentData?.bank_code,
			amount_xaf: nairaPaymentData?.amount_xaf,
			amount_with_fee_xaf: nairaPaymentData?.amount_with_fee_xaf,
			amount_ngn: nairaPaymentData?.currency_amount,
			fee_xaf: nairaPaymentData?.fee_xaf,
			account_name: nairaPaymentData?.account_name,
			account_number: nairaPaymentData?.account_number,
			reason: nairaPaymentData?.reason,
			user_name: `${nairaPaymentData?.user?.last_name} ${nairaPaymentData?.user?.first_name}`,
			user_phone: nairaPaymentData?.user?.phone,
			user_email: nairaPaymentData?.user?.email,
			user_country: nairaPaymentData?.user?.country,
			user_city: nairaPaymentData?.user?.city,
		},
	});

	// const mutation = useMutation({
	// 	mutationFn: (data)=>handleUpdateUser({currentUserId:currentUser?._id, customerId:customerDetails?.customer?._id, body:data}),
	// 	onError: (err:any) => {
	//           console.error("onError : ", err.message);
	//           toast.error(`Erreur lors de la modification des informations du compte : ${err.message}`);
	// 	},
	// 	onSuccess: (data) => {
	//           console.log("onSuccess : ", data);
	//           toast.success(`Modification des informations du compte effectué avec succès`);
	//           redirectRef.current.href = window.location.pathname;
	//           redirectRef.current.click();
	//       }
	// });

	const onSubmit = (data: any) => {
		// console.log(form.getValues("tags"));
		// setIsConfirmSubmitModalOpen(true);
		console.log("onSubmit data : ", data, { formValues: form.getValues() });
		// mutation.mutate(data);
	};
	const onError = (err: any) => {
		console.error("onError", err);
	};

	/** ------------------------------------------------- */
	const [shiftDown, setShiftDown] = useState(false);
	useEffect(() => {
		const handleKeyDown = (event: KeyboardEvent) => {
			if (event.shiftKey) {
				setShiftDown(true);
			}
		};
		const handleKeyUp = () => {
			setShiftDown(false);
		};
		window.addEventListener("keydown", handleKeyDown);
		window.addEventListener("keyup", handleKeyUp);
		return () => {
			window.removeEventListener("keydown", handleKeyDown);
			window.removeEventListener("keyup", handleKeyUp);
		};
	}, []);
	/** ------------------------------------------------- */

	return (
		<div className="flex-1">
			<Form {...form}>
				<form
					onSubmit={form.handleSubmit(onSubmit)}
					className="space-y-3 mt-5 w-full"
				>
					<div className="pr-6 flex-1 w-full">
						<Title title="Informations personnelles de l'utilisateur" />
						<FormField
							control={form.control}
							name="user_name"
							render={({ field }) => (
								<FormItem>
									<FormLabel className="text-gray-900 text-sm font-semibold tracking-tight mb-3">
										<span className="flex gap-3 pb-3">
											{`Nom complet`}
											<a
												className="flex gap-3 text-xl font-bold text-[#18BC7A]"
												href={`/dashboard/v2/users_accounts/manage/${nairaPaymentData?.user?.id}`}
											>
												{`${nairaPaymentData?.user?.last_name} ${nairaPaymentData?.user?.first_name}`}
												<FaExternalLinkAlt color="#1F66FF" />
											</a>
										</span>
									</FormLabel>
									<FormControl>
										<Input
											className="px-6 font-normal bg-gray-200"
											{...field}
										/>
									</FormControl>
								</FormItem>
							)}
						/>
						<div className="grid grid-cols-2 gap-x-7 gap-y-7 mt-5">
							<FormField
								control={form.control}
								name="user_phone"
								render={({ field }) => (
									<FormItem>
										<FormLabel className="text-gray-900 text-sm font-semibold tracking-tight">
											Téléphone
										</FormLabel>
										<FormControl>
											<Input
												className="px-6 bg-gray-200"
												{...field}
											/>
										</FormControl>
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name="user_email"
								render={({ field }) => (
									<FormItem>
										<FormLabel className="text-gray-900 text-sm font-semibold tracking-tight">
											Email
										</FormLabel>
										<FormControl>
											<Input
												placeholder="abc@sekure.xyz"
												className="px-6 font-normal bg-gray-200"
												{...field}
											/>
										</FormControl>
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name="user_country"
								render={({ field }) => (
									<FormItem>
										<FormLabel className="text-gray-900 text-sm font-semibold tracking-tight">
											Pays de résidence
										</FormLabel>
										<FormControl>
											<Input
												className="px-6 bg-gray-200"
												{...field}
											/>
										</FormControl>
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name="user_city"
								render={({ field }) => (
									<FormItem>
										<FormLabel className="text-gray-900 text-sm font-semibold tracking-tight">
											Ville
										</FormLabel>
										<FormControl>
											<Input
												className="px-6 bg-gray-200"
												{...field}
											/>
										</FormControl>
									</FormItem>
								)}
							/>
						</div>
					</div>

					<div className="pr-6 py-3 flex-1 w-full">
						<Title title="Informations de paiement" />
						<div className="w-full flex flex-col gap-7">
							<div className="grid grid-cols-2 gap-x-7 gap-y-7">
								<FormField
									control={form.control}
									name="bank_name"
									render={({ field }) => (
										<FormItem>
											<FormLabel className="text-gray-900 text-sm font-semibold tracking-tight">{`Nom banque`}</FormLabel>
											<FormControl>
												<Input
													className="px-6 font-normal bg-gray-200"
													{...field}
												/>
											</FormControl>
										</FormItem>
									)}
								/>
								<FormField
									control={form.control}
									name="bank_code"
									render={({ field }) => (
										<FormItem>
											<FormLabel className="text-gray-900 text-sm font-semibold tracking-tight">{`Code banque`}</FormLabel>
											<FormControl>
												<Input
													className="px-6 font-normal bg-gray-200"
													{...field}
												/>
											</FormControl>
										</FormItem>
									)}
								/>
								<FormField
									control={form.control}
									name="account_name"
									render={({ field }) => (
										<FormItem>
											<FormLabel className="text-gray-900 text-sm font-semibold tracking-tight">{`Nom de compte bancaire`}</FormLabel>
											<FormControl>
												<Input
													className="px-6 font-normal bg-gray-200"
													{...field}
												/>
											</FormControl>
										</FormItem>
									)}
								/>
								<FormField
									control={form.control}
									name="account_number"
									render={({ field }) => (
										<FormItem>
											<FormLabel className="text-gray-900 text-sm font-semibold tracking-tight">{`Numero de banque bancaire`}</FormLabel>
											<FormControl>
												<Input
													className="px-6 font-normal bg-gray-200"
													{...field}
												/>
											</FormControl>
										</FormItem>
									)}
								/>
								<FormField
									control={form.control}
									name="reason"
									render={({ field }) => (
										<FormItem>
											<FormLabel className="text-gray-900 text-sm font-semibold tracking-tight">{`Motif`}</FormLabel>
											<FormControl>
												<Input
													className="px-6 font-normal bg-gray-200"
													{...field}
												/>
											</FormControl>
										</FormItem>
									)}
								/>

								<FormField
									control={form.control}
									name="amount_xaf"
									render={({ field }) => (
										<FormItem>
											<FormLabel className="text-gray-900 text-sm font-semibold tracking-tight">{`Montant XAF`}</FormLabel>
											<FormControl>
												<Input
													className="px-6 font-normal bg-gray-200"
													{...field}
												/>
											</FormControl>
										</FormItem>
									)}
								/>
								<FormField
									control={form.control}
									name="fee_xaf"
									render={({ field }) => (
										<FormItem>
											<FormLabel className="text-gray-900 text-sm font-semibold tracking-tight">{`Frais SEKURE XAF`}</FormLabel>
											<FormControl>
												<Input
													className="px-6 font-normal bg-gray-200"
													{...field}
												/>
											</FormControl>
										</FormItem>
									)}
								/>
								<FormField
									control={form.control}
									name="amount_ngn"
									render={({ field }) => (
										<FormItem>
											<FormLabel className="text-gray-900 text-sm font-semibold tracking-tight">{`Montant en Naira`}</FormLabel>
											<FormControl>
												<Input
													className="px-6 font-normal bg-gray-200"
													{...field}
												/>
											</FormControl>
										</FormItem>
									)}
								/>
							</div>
						</div>
					</div>
				</form>
			</Form>
			<div
				style={{ zIndex: 9000 }}
				className={classNames(
					"transition-all invisible z-20 bg-blue-900/30 opacity-0 fixed top-0 left-0 h-full w-full flex items-center justify-center",
					{
						// "!opacity-100 !visible z-20": mutation.isLoading,
					}
				)}
			>
				<HashLoader className="shrink-0" size={50} color="#1F66FF" />
			</div>
			<a ref={redirectRef} hidden href="#"></a>
		</div>
	);
}
