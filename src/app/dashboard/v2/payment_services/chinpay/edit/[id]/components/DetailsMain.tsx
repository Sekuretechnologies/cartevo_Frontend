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
import { selectCurrentChnPayment } from "@/redux/slices_v2/chinpay";
import { chnpaymentSchema } from "@/validation/FormValidation";
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

export default function Details() {
	const pathname = usePathname();
	const redirectRef: any = useRef();
	const chnPaymentData = useSelector(selectCurrentChnPayment);
	const [isUpdateProofModalFormOpen, setIsUpdateProofModalFormOpen] =
		useState(false);
	const MAX_TAGS = 5;
	//Retrieve all the returned items from the hook
	// const { tags, handleAddTag, handleRemoveTag } = useTags(MAX_TAGS); // pass the maximum tags

	const form = useForm<z.infer<typeof chnpaymentSchema>>({
		resolver: zodResolver(chnpaymentSchema),
		defaultValues: {
			platform_name: chnPaymentData?.chnpayment?.platform?.name,
			amount_xaf: chnPaymentData?.amount_xaf,
			amount_with_fee_xaf: chnPaymentData?.amount_with_fee_xaf,
			amount_usd: chnPaymentData?.amount_usd,
			fee_xaf: chnPaymentData?.fee_xaf || 1000,
			delivery_address: chnPaymentData?.chnpayment?.delivery_address,
			platform_profile_id:
				chnPaymentData?.chnpayment?.platform_profile_id,
			provider_payment_link:
				chnPaymentData?.chnpayment?.provider_payment_link,
			proof: chnPaymentData?.chnpayment?.proof,
			product_link: chnPaymentData?.chnpayment?.product?.link,
			user_name: `${chnPaymentData?.user?.last_name} ${chnPaymentData?.user?.first_name}`,
			user_phone: chnPaymentData?.user?.phone,
			user_email: chnPaymentData?.user?.email,
			user_country: chnPaymentData?.user?.country,
			user_city: chnPaymentData?.user?.city,
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
									<FormLabel className="text-gray-900 text-sm font-semibold tracking-tight">
										Nom complet
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
									name="platform_name"
									render={({ field }) => (
										<FormItem>
											<FormLabel className="text-gray-900 text-sm font-semibold tracking-tight">{`Plateforme`}</FormLabel>
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
									name="platform_profile_id"
									render={({ field }) => (
										<FormItem>
											<FormLabel className="text-gray-900 text-sm font-semibold tracking-tight">{`Identifiant du profil sur la plateforme`}</FormLabel>
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
									name="delivery_address"
									render={({ field }) => (
										<FormItem>
											<FormLabel className="text-gray-900 text-sm font-semibold tracking-tight">{`Adresse de livraison`}</FormLabel>
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
									name="product_link"
									render={({ field }) => (
										<FormItem>
											<div className="flex gap-5">
												<FormLabel className="text-gray-900 text-sm font-semibold tracking-tight">{`Lien de produit`}</FormLabel>
												{form
													.getValues("product_link")
													?.startsWith("http") && (
													<a
														href={form.getValues(
															"product_link"
														)}
														target="_blank"
														rel="noopener noreferrer"
													>
														<FaExternalLinkAlt color="#1F66FF" />
													</a>
												)}
											</div>
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
									name="provider_payment_link"
									render={({ field }) => (
										<FormItem>
											<div className="flex gap-5">
												<FormLabel className="text-gray-900 text-sm font-semibold tracking-tight">{`Lien de paiement du fournisseur`}</FormLabel>
												{form
													.getValues(
														"provider_payment_link"
													)
													?.startsWith("http") && (
													<a
														href={form.getValues(
															"provider_payment_link"
														)}
														target="_blank"
														rel="noopener noreferrer"
													>
														<FaExternalLinkAlt color="#1F66FF" />
													</a>
												)}
											</div>
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
									name="amount_usd"
									render={({ field }) => (
										<FormItem>
											<FormLabel className="text-gray-900 text-sm font-semibold tracking-tight">{`Montant USD`}</FormLabel>
											<FormControl>
												<Input
													className="px-6 font-normal bg-gray-200"
													{...field}
												/>
											</FormControl>
										</FormItem>
									)}
								/>

								<FormItem>
									<FormLabel className="text-gray-900 text-sm font-semibold tracking-tight">{`Preuve de paiement`}</FormLabel>
									<div style={{ position: "relative" }}>
										{chnPaymentData?.chnpayment?.proof?.startsWith(
											"http"
										) ? (
											<>
												{chnPaymentData?.chnpayment?.proof?.includes(
													"proof-image"
												) ? (
													<div
														className="mt-3"
														style={{
															width: 400,
															height: 400,
															borderRadius:
																"20px",
															position:
																"relative",
															overflow: "hidden",
														}}
													>
														<Image
															alt="vector background"
															src={
																chnPaymentData
																	?.chnpayment
																	?.proof
															}
															layout="fill"
															objectFit="cover"
														/>
														<a
															style={{
																top: 0,
																left: 0,
																width: 400,
																height: 400,
																borderRadius:
																	"20px",
																position:
																	"absolute",
																overflow:
																	"hidden",
															}}
															href={
																chnPaymentData
																	?.chnpayment
																	?.proof
															}
															target="_blank"
															rel="noopener noreferrer"
														></a>
													</div>
												) : (
													<a
														className={`my-5 ml-[100px]`}
														href={
															chnPaymentData
																?.chnpayment
																?.proof
														}
														target="_blank"
														rel="noopener noreferrer"
													>
														<FaFile
															size={60}
															color="#1F66FF"
														/>
													</a>
												)}
												<div
													className="mt-3"
													style={{
														display: shiftDown
															? "block"
															: "none",
													}}
												>
													<CButton
														text={
															"Mettre a jour la preuve de paiement"
														}
														btnStyle={"outlineDark"}
														onClick={() =>
															setIsUpdateProofModalFormOpen(
																true
															)
														}
													/>
												</div>
											</>
										) : (
											<>
												{/* <span className="pl-5 pt-5">Pas de preuve de paiement</span>} */}
												<CButton
													text={
														"Inserer une preuve de paiement"
													}
													btnStyle={"green"}
													onClick={() =>
														setIsUpdateProofModalFormOpen(
															true
														)
													}
												/>
											</>
										)}
										<UpdateProofModalForm
											isOpen={isUpdateProofModalFormOpen}
											setIsOpen={
												setIsUpdateProofModalFormOpen
											}
											chnPayment={
												chnPaymentData?.chnpayment
											}
										/>
									</div>
								</FormItem>
							</div>
						</div>
					</div>
				</form>
			</Form>
			<div
				style={{ zIndex: 9000 }}
				className={classNames(
					"transition-all invisible z-20 bg-blue-900/30 opacity-0 absolute top-0 left-0 h-full w-full flex items-center justify-center",
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
