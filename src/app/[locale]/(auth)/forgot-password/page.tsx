"use client";

import { authUrls } from "@/api/urls";
import Footer from "@/components/shared/Footer/Footer";
import {
	FormControl,
	FormField,
	FormItem,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { cartevoIconName } from "@/constants/icons";
import { forgotPasswordSchema } from "@/validation/FormValidation";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormLabel } from "@mui/material";
import React, { useState } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { useTitle } from "react-use";
import { z } from "zod";
import toast from "react-hot-toast";
import { PuffLoader } from "react-spinners";
import CButton from "@/components/shared/CButton";
import WebsiteFooter from "@/components/websiteComponents/WebsiteFooter";
import { useLocalizedNavigation } from "@/hooks/useLocalizedNavigation";

const ForgotPassword = () => {
	const [loading, setLoading] = useState<boolean>(false);
	const { createLocalizedLink } = useLocalizedNavigation();

	const form = useForm<z.infer<typeof forgotPasswordSchema>>({
		resolver: zodResolver(forgotPasswordSchema),
		defaultValues: {
			email: "",
		},
	});

	// Soumission du formulaire
	const onSubmit = async (email: z.infer<typeof forgotPasswordSchema>) => {
		try {
			setLoading(true);
			const res = await fetch(authUrls.FORGOT_PASSWORD, {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(email),
			});

			if (!res.ok) throw new Error("Erreur lors de l'envoi du lien");
			toast.success("Lien de réinitialisation envoyé avec succès");
		} catch (error) {
			console.error("erreur", error);
			toast.error("Erreur lors de l'envoi du lien");
		} finally {
			setLoading(false);
		}
	};

	useTitle("Cartevo | Forgot Password");

	return (
		<section className="relative flex flex-col mt-0 ">
			<nav className="absolute z-10 top-0 left-0 lg:left-[150px] md:left-[120px]  h-[80px] flex items-center">
				<a href={createLocalizedLink("/")}>
					<img src="/website/logos/logo_full.png" alt="logo" />
				</a>
			</nav>
			<div className="w-full  grid grid-cols-1  lg:grid-cols-2 font-poppins ">
				<div
					style={{
						backgroundImage:
							"url('/website/home/heroBackground.png')",
						backgroundSize: "cover",
						backgroundPosition: "center",
						backgroundRepeat: "no-repeat",
					}}
					className="font-poppins hidden   bg-primary/10 rounded-br-[50px] h-[750px] pr-28 pl-[150px]  lg:flex flex-col justify-center gap-4   text-center lg:text-left"
				>
					<h1 className="font-bold text-[30px] -mt-10 leading-8 max-w-[500px] tracking-tight">
						Mot de passe{" "}
						<span className="text-primary">oublié ?</span>
					</h1>
					<p>
						Veuillez saisir votre adresse e-mail pour recevoir le
						lien de réinitalisation
					</p>
				</div>

				<div className="flex  items-center px-[50px] mt-32 lg:mt-0 font-poppins">
					<div className="w-full flex flex-col items-center mx-auto lg:mx-0 lg:items-start max-w-[500px] font-poppins">
						<div className="text-center lg:hidden">
							<h1 className="font-bold text-[30px] -mt-10 leading-8 max-w-[500px] tracking-tight">
								Mot de passe{" "}
								<span className="text-primary">{`oublié ?`}</span>
							</h1>
							<p>
								Veuillez saisir votre adresse e-mail pour
								recevoir le lien de réinitalisation
							</p>
						</div>
						<FormProvider {...form}>
							<form
								onSubmit={form.handleSubmit(onSubmit)}
								className="w-full"
							>
								<FormField
									control={form.control}
									name="email"
									render={({ field }) => (
										<FormItem>
											<FormLabel className="font-poppins text-gray-900 text-md tracking-tight">
												Email
											</FormLabel>
											<FormControl>
												<Input
													className="px-6 w-full bg-app-lightgray"
													{...field}
												/>
											</FormControl>

											<FormMessage className="text-red-500 text-sm mt-1">
												{
													form.formState.errors.email
														?.message
												}
											</FormMessage>
										</FormItem>
									)}
								/>
								<div className="mt-[30px] flex flex-col gap-4 items-center sm:flex-row justify-center lg:justify-start">
									<CButton
										text="Envoyer le lien"
										btnStyle="blue"
										type="submit"
										width="175px"
										height="49px"
									/>
									<a
										className="bg-[#F3F3F3] text-black text-[12px] font-bold flex gap-1 items-center justify-center w-[325px] h-[52px] rounded-[18px]"
										href={createLocalizedLink("/login")}
									>
										<span>{`Je me souviens`},</span>{" "}
										<span className="text-primary">
											{`Retourner au login`}
										</span>
									</a>
								</div>
							</form>
						</FormProvider>

						<div className="mt-6 text-app-secondary text-sm"></div>
					</div>
				</div>
			</div>
			<WebsiteFooter />
			{loading && (
				<div className="fixed top-0 left-0 w-full h-full flex justify-center items-center bg-black/40 backdrop-blur-sm ">
					<PuffLoader
						className="shrink-0"
						size={50}
						color="#1F66FF"
					/>
				</div>
			)}
		</section>
	);
};

export default ForgotPassword;
