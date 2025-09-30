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
import { useTranslation } from "@/hooks/useTranslation";
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
	const { t } = useTranslation();
	const contactTranslation = t.contact;
	const btnTranslate = t.btn;

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
			<div className="font-poppins mb-8 text-center lg:text-start">
				<h1 className="text-[35px] font-bold leading-10 mb-4">
					{contactTranslation.title}
				</h1>
				<p className="text-[12px]">{contactTranslation.description}</p>
			</div>

			<Form {...form}>
				<form onSubmit={form.handleSubmit(onSubmit, onError)}>
					<div className="flex flex-col gap-4">
						<div className=" flex flex-col md:flex-row items-center gap-4 w-full ">
							<FormField
								control={form.control}
								name="name"
								render={({ field }) => (
									<FormItem className="flex flex-col w-full">
										<FormLabel className="text-[#101010] font-poppins text-[12px] ">
											{contactTranslation.form.name}
										</FormLabel>
										<FormControl>
											<input
												{...field}
												type="text"
												id="name"
												placeholder={
													contactTranslation.form
														.namePlaceholder
												}
												className="px-6 font-poppins border-1  focus:outline-primary text-[14px] py-3 rounded-[7px] "
											/>
										</FormControl>
										<FormMessage className="text-red-400 font-poppins" />
									</FormItem>
								)}
							/>

							<FormField
								control={form.control}
								name="entrepriseName"
								render={({ field }) => (
									<FormItem className="flex flex-col w-full">
										<FormLabel className="text-[#101010] font-poppins text-[12px] ">
											{contactTranslation.form.legalName}
										</FormLabel>
										<FormControl>
											<input
												{...field}
												type="text"
												id="email"
												placeholder={
													contactTranslation.form
														.legalNamePlaceholder
												}
												className="px-6 font-poppins border-1  focus:outline-primary text-[14px] py-3 rounded-[7px] "
											/>
										</FormControl>
										<FormMessage className="text-red-400 font-poppins" />
									</FormItem>
								)}
							/>
						</div>
						<div className="flex flex-col md:flex-row items-center gap-4">
							<FormField
								control={form.control}
								name="whatsapp"
								rules={{
									required: "whatsapp number is required",
								}}
								render={({ field }) => (
									<FormItem className="w-full">
										<FormLabel className="text-[#101010] font-poppins text-[12px] ">
											{
												contactTranslation.form
													.PhoneNumber
											}
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
															String(code)
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
										<FormMessage className="text-red-400 font-poppins" />
									</FormItem>
								)}
							/>

							<FormField
								control={form.control}
								name="email"
								render={({ field }) => (
									<FormItem className="flex flex-col w-full">
										<FormLabel className="text-[#101010] font-poppins text-[12px] ">
											{contactTranslation.form.email}
										</FormLabel>
										<FormControl>
											<input
												{...field}
												type="text"
												id="email"
												placeholder={
													contactTranslation.form
														.emailPlaceholder
												}
												className="px-6 font-poppins border-1  focus:outline-primary text-[14px] py-3 rounded-[7px] "
											/>
										</FormControl>
										<FormMessage className="text-red-400 font-poppins" />
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
										{
											contactTranslation.form
												.secteurActivite
										}
									</FormLabel>
									<FormControl>
										<Select
											{...field}
											placeholder={
												contactTranslation.form
													.secteurActivitePlaceholder
											}
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
									<FormMessage className="text-red-400 font-poppins" />
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
										{contactTranslation.form.service}
									</FormLabel>
									<FormControl>
										<div className="flex sm:flex-row flex-col gap-6">
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
													{
														contactTranslation.form
															.serviceCard
													}
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
													{
														contactTranslation.form
															.servicePayment
													}
												</span>
											</label>
										</div>
									</FormControl>
									<FormMessage className="text-red-400 font-poppins" />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="subject"
							render={({ field }) => (
								<FormItem className="flex flex-col">
									<FormLabel className="text-[#101010] font-poppins text-[12px] ">
										{contactTranslation.form.mailObject}
									</FormLabel>
									<FormControl>
										<input
											{...field}
											type="text"
											id="subject"
											placeholder={
												contactTranslation.form
													.mailObjectMessage
											}
											className="px-6 font-poppins border-1 focus:outline-primary text-[14px] py-3 rounded-[7px] "
										/>
									</FormControl>
									<FormMessage className="text-red-400 font-poppins" />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="message"
							render={({ field }) => (
								<FormItem className="flex flex-col">
									<FormLabel className="text-[#101010] font-poppins text-[12px] ">
										{contactTranslation.form.message}
									</FormLabel>
									<FormControl>
										<textarea
											{...field}
											id="subject"
											rows={7}
											placeholder={
												contactTranslation.form
													.messagePlaceholder
											}
											className="px-6 font-poppins border-1 focus:outline-primary text-[14px] py-3 rounded-[7px] "
										/>
									</FormControl>
									<FormMessage className="text-red-400 font-poppins" />
								</FormItem>
							)}
						/>
						<button
							type="submit"
							className="bg-primary font-poppins  text-white text-[13px] font-semibold h-[52px] w-[215px] mt-4  flex justify-between px-10 items-center rounded-[18px]"
						>
							<span>{btnTranslate.buttonText}</span>{" "}
							<ChevronRight />
						</button>
					</div>
				</form>
			</Form>
		</div>
	);
};

export default ContactForm;
