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

const ForgotPassword = () => {
	const [loading, setLoading] = useState<boolean>(false);

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
		<section className="relative flex flex-col h-screen mt-0 w-full">
			<nav className="absolute z-10 top-0 left-0 w-full h-[80px] px-[50px] flex items-center">
				<a href="/">{cartevoIconName}</a>
			</nav>
			<div className="w-full min-h-[70vh] grid grid-cols-12">
				<div className="relative col-span-5 pl-[60px] pt-[200px] bg-app-lightblue rounded-br-[50px] overflow-hidden">
					<div className="absolute bottom-[100px] left-0 w-full h-[90px]">
						<img
							src="/images/white-cartevo-logo-001.svg"
							alt="white-cartevo-logo"
						/>
					</div>
					<h1 className="font-bold text-4xl text-app-secondary">
						Forgot Password
					</h1>
					<span className="text-lg text-app-secondary">
						Enter your email address to receive a reset link.
					</span>
				</div>
				<div className="col-span-7 flex justify-center items-center px-[50px]">
					<div className="w-full max-w-[400px]">
						<FormProvider {...form}>
							<form onSubmit={form.handleSubmit(onSubmit)}>
								<FormField
									control={form.control}
									name="email"
									render={({ field }) => (
										<FormItem>
											<FormLabel className="text-gray-900 text-md tracking-tight">
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
								<div className="mt-[30px]">
									<CButton
										text="Send Reset Link"
										btnStyle="blue"
										type="submit"
									/>
								</div>
							</form>
						</FormProvider>

						<div className="mt-6 text-app-secondary text-sm">
							{`I remenber`},{" "}
							<a
								href="/signup"
								className="text-app-primary underline hover:text-app-secondary"
							>
								Back To Login
							</a>
						</div>
					</div>
				</div>
			</div>
			<Footer />
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
