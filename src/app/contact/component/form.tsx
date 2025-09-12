"use client";

import ActivityInput from "@/components/shared/activityInput";
import CButton from "@/components/shared/CButton";
import PhoneInput from "@/components/shared/PhoneInput";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { contactSchema } from "@/validation/FormValidation";
import { zodResolver } from "@hookform/resolvers/zod";
import { Select, SelectItem } from "@nextui-org/select";
import { Check, ChevronRight } from "lucide-react";

import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import PhoneInputWithCountrySelect from "react-phone-number-input";
import { useMutation } from "react-query";
import { z } from "zod";

const handleSubmit = async (data: z.infer<typeof contactSchema>) => {};

const ContactForm = () => {
	const form = useForm<z.infer<typeof contactSchema>>({
		resolver: zodResolver(contactSchema),
		defaultValues: {
			country_code: "",
			whatsapp: "",
			email: "",
			subject: "",
			message: "",
			name: "",
			entrepriseName: "",
			activity: "",
		},
	});

	const mutation = useMutation({
		mutationFn: handleSubmit,
		onError: (err: any) => {
			console.error("error", err.message);
			toast.error(err.message);
		},
		onSuccess: (data) => {
			form.reset();
			toast.success("Message sned successfully");
		},
	});

	const onSubmit = (data: any) => {
		console.log("soumission", data);
		mutation.mutate(data);
	};

	const onError = (err: any) => {
		console.error("error", err);
	};

	const activities = [
		{ key: "E-commerce", label: "E-commerce" },
		{ key: "Marketplaces", label: "Marketplaces" },
		{ key: "Telecommunications", label: "Télécommunications" },
		{ key: "BanquesCommerciales", label: "Banques commerciales" },
		{ key: "MicroFinances", label: "Micro-finances" },
		{ key: "Fintechs", label: "Fintechs" },
		{ key: "TransportUrbain", label: "Transport urbain" },
		{ key: "Logistique", label: "Logistique" },
		{ key: "StartupsTechnologiques", label: "Startups technologiques" },
		{ key: "Freelance", label: "Freelance" },
		{ key: "AgencesDigitales", label: "Agences digitales" },
		{ key: "Assurance", label: "Assurance" },
		{ key: "ONGInternationales", label: "ONG internationales" },
		{ key: "InstitutionsPubliques", label: "Institutions publiques" },
		{ key: "IndustrieImportExport", label: "Industrie import-export" },
		{
			key: "DivertissementStreaming",
			label: "Divertissement et streaming",
		},
		{ key: "TourismeVoyages", label: "Tourisme et voyages" },
		{ key: "Immobilier", label: "Immobilier" },
		{ key: "Energie", label: "Énergie" },
		{ key: "Agriculture", label: "Agriculture" },
		{ key: "Autres", label: "Autres" },
	];

	return (
		<div>
			<div className="font-poppins mb-8">
				<h1 className="text-[35px] font-bold leading-10">
					Contactez le service client
				</h1>
				<p className="text-[12px]">
					Un projet ? Une question ? Partagez-les avec nous via le
					formulaire, et notre équipe commerciale vous recontactera
					rapidement pour vous accompagner dans ce que vous souhaitez
					lancer.
				</p>
			</div>

			<Form {...form}>
				<form onSubmit={form.handleSubmit(onSubmit, onError)}>
					<div className="flex flex-col gap-4">
						<div className=" flex items-center gap-4 w-full ">
							<FormField
								control={form.control}
								name="name"
								render={({ field }) => (
									<FormItem className="flex flex-col w-full">
										<FormLabel className="text-[#101010] font-poppins text-[12px] ">
											Entrez votre Nom Complet
										</FormLabel>
										<FormControl>
											<input
												{...field}
												type="text"
												id="name"
												placeholder="Votre nom"
												className="px-6 font-poppins border-1  focus:outline-primary text-[14px] py-3 rounded-[7px] "
											/>
										</FormControl>
										<FormMessage className="text-red-400" />
									</FormItem>
								)}
							/>

							<FormField
								control={form.control}
								name="entrepriseName"
								render={({ field }) => (
									<FormItem className="flex flex-col w-full">
										<FormLabel className="text-[#101010] font-poppins text-[12px] ">
											Nom Legal de votre entreprise
										</FormLabel>
										<FormControl>
											<input
												{...field}
												type="text"
												id="email"
												placeholder="Nom de l’entreprise"
												className="px-6 font-poppins border-1  focus:outline-primary text-[14px] py-3 rounded-[7px] "
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
						</div>
						<div className="flex items-center gap-4">
							<FormField
								control={form.control}
								name="whatsapp"
								rules={{
									required: "whatsapp number is required",
								}}
								render={({ field }) => (
									<FormItem className="w-full">
										<FormLabel className="text-[#101010] font-poppins text-[12px] ">
											Numéro Whatsapp / Téléphone
										</FormLabel>
										<div className="flex gap-1 items-center w-full">
											<FormControl>
												<PhoneInput
													value={field.value}
													onChange={(
														number,
														code
													) => {
														form.setValue(
															"country_code",
															code
														);
													}}
												/>
											</FormControl>
											<FormControl>
												<input
													{...field}
													type="text"
													id="whatsappNumber"
													placeholder="ex: 688778894"
													className="px-6 font-poppins border-1 focus:outline-primary text-[14px] py-3 rounded-[7px] w-full"
													required
												/>
											</FormControl>
										</div>
										<FormMessage />
									</FormItem>
								)}
							/>

							<FormField
								control={form.control}
								name="email"
								render={({ field }) => (
									<FormItem className="flex flex-col w-full">
										<FormLabel className="text-[#101010] font-poppins text-[12px] ">
											adresse mail Professionelle
										</FormLabel>
										<FormControl>
											<input
												{...field}
												type="text"
												id="email"
												placeholder="contact@votreentreprise.com"
												className="px-6 font-poppins border-1  focus:outline-primary text-[14px] py-3 rounded-[7px] "
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
						</div>
						<FormField
							control={form.control}
							name="activity"
							render={({ field }) => (
								<FormItem className="flex flex-col w-full">
									<FormLabel className="text-[#101010] font-poppins text-[12px] ">
										Secteur d’acrifvité
									</FormLabel>
									<FormControl>
										<Select
											{...field}
											placeholder="Veuillez selectionner un secteur d'activité"
											style={{
												width: "100%",
											}}
											className="bg-app-lightgray text-gray-900 font-normal"
											defaultSelectedKeys={[
												field.value ?? "",
											]}
											selectedKeys={
												field.value ? [field.value] : []
											}
										>
											{activities.map((item) => (
												<SelectItem
													key={item.key}
													value={item.key}
												>
													{item.label}
												</SelectItem>
											))}
										</Select>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						{/* Sélection du service */}

						<FormField
							control={form.control}
							name="service"
							render={({ field }) => (
								<FormItem className="flex flex-col">
									<FormLabel className="text-[#101010] font-poppins text-[12px] mb-2">
										Sélectionnez le service souhaité
									</FormLabel>
									<FormControl>
										<div className="flex gap-6">
											{/* Option 1 */}
											<label
												className={`flex items-center gap-3 px-4 py-4 rounded-full cursor-pointer transition border 
              ${
					field.value === "virtualCard"
						? "bg-blue-50 border-blue-500"
						: "bg-[#F3F3F3] border-transparent"
				}`}
											>
												{/* input radio caché */}
												<input
													type="radio"
													value="virtualCard"
													checked={
														field.value ===
														"virtualCard"
													}
													onChange={() =>
														field.onChange(
															"virtualCard"
														)
													}
													className="hidden"
												/>

												{/* cercle custom */}
												<span
													className={`w-5 h-5 flex items-center justify-center rounded-full border 
                ${
					field.value === "virtualCard"
						? "bg-blue-500 border-blue-500"
						: "bg-white border-gray-300"
				}`}
												>
													{field.value ===
														"virtualCard" && (
														<Check
															size={12}
															className="text-white"
														/>
													)}
												</span>

												<span className="text-[14px] font-poppins">
													Cartes bancaires virtuelles
												</span>
											</label>

											{/* Option 2 */}
											<label
												className={`flex items-center gap-3 px-4 py-4 rounded-full cursor-pointer transition border 
              ${
					field.value === "collect"
						? "bg-blue-50 border-blue-500"
						: "bg-[#F3F3F3] border-transparent"
				}`}
											>
												<input
													type="radio"
													value="collect"
													checked={
														field.value ===
														"collect"
													}
													onChange={() =>
														field.onChange(
															"collect"
														)
													}
													className="hidden"
												/>
												<span
													className={`w-5 h-5 flex items-center justify-center rounded-full border 
                ${
					field.value === "collect"
						? "bg-blue-500 border-blue-500"
						: "bg-white border-gray-300"
				}`}
												>
													{field.value ===
														"collect" && (
														<Check
															size={12}
															className="text-white"
														/>
													)}
												</span>
												<span className="text-[14px] font-poppins">
													Collecte de paiements
												</span>
											</label>
										</div>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="subject"
							render={({ field }) => (
								<FormItem className="flex flex-col">
									<FormLabel className="text-[#101010] font-poppins text-[12px] ">
										Objet du mail
									</FormLabel>
									<FormControl>
										<input
											{...field}
											type="text"
											id="subject"
											placeholder="Titre du message ici "
											className="px-6 font-poppins border-1 focus:outline-primary text-[14px] py-3 rounded-[7px] "
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="message"
							render={({ field }) => (
								<FormItem className="flex flex-col">
									<FormLabel className="text-[#101010] font-poppins text-[12px] ">
										Laissez un message
									</FormLabel>
									<FormControl>
										<textarea
											{...field}
											id="subject"
											placeholder="votre message ici "
											className="px-6 font-poppins border-1 focus:outline-primary text-[14px] py-3 rounded-[7px] "
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<button
							type="submit"
							className="bg-primary font-poppins  text-white text-[13px] font-semibold h-[52px] w-[215px] mt-4  flex justify-between px-10 items-center rounded-[18px]"
						>
							<span>Commencer</span> <ChevronRight />
						</button>
					</div>
				</form>
			</Form>
		</div>
	);
};

export default ContactForm;
