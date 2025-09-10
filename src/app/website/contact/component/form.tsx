"use client";

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
import { ChevronRight } from "lucide-react";

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
						<FormField
							control={form.control}
							name="whatsapp"
							rules={{ required: "whatsapp number is required" }}
							render={({ field }) => (
								<FormItem>
									<FormLabel className="text-[#101010] font-poppins text-[12px] ">
										Entrez votre Numéro Whatsapp
									</FormLabel>
									<div className="flex gap-4 items-center ">
										<FormControl>
											<PhoneInput
												value={field.value}
												onChange={(number, code) => {
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
								<FormItem className="flex flex-col">
									<FormLabel className="text-[#101010] font-poppins text-[12px] ">
										Entrez votre adresse mail
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
							className="bg-primary font-poppins  text-white text-[13px] font-semibold h-[52px] w-[215px] mt-8  flex justify-between px-10 items-center rounded-[18px]"
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
