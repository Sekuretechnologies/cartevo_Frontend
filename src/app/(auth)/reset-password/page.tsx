"use client";

import { authUrls } from "@/api/urls";
import Footer from "@/components/shared/Footer/Footer";
import {
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { cartevoIconName } from "@/constants/icons";
import { data } from "@/constants/Index";
import { resetPsswordSchema } from "@/validation/FormValidation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSearchParams } from "next/navigation";
import React, { useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { z } from "zod";
import SuccessModal from "./components/page";
import { PuffLoader } from "react-spinners";
import WebsiteFooter from "@/components/websiteComponents/WebsiteFooter";

const ResetPassword = () => {
	const [passwordVisible, setPasswordVisible] = useState<boolean>();
	const [confirmPasswordVisible, setConfirmPasswordVisible] =
		useState<boolean>();
	const [showSuccessModal, setShowSuccessModal] = useState<boolean>(false);
	const [loading, setLoading] = useState<boolean>(false);
	const searchParams = useSearchParams();
	const token = searchParams.get("token");

	// Verification de l'existance du token dans l'url

	const form = useForm<z.infer<typeof resetPsswordSchema>>({
		resolver: zodResolver(resetPsswordSchema),
		defaultValues: {
			password: "",
			confirmPassword: "",
		},
	});

	const onSubmit = async (data: {
		password: string;
		confirmPassword: string;
	}) => {
		try {
			setLoading(true);
			const res = await fetch(authUrls.RESET_PASSWORD, {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					token: token,
					newPassword: data.password,
				}),
			});

			if (!res.ok) {
				throw new Error(
					"erreur survenue lors le réinitialisation du mot de passe"
				);
			}

			setShowSuccessModal(true);
		} catch (error) {
			toast.error(
				"Erreur survenue lors le réinitialisation du mot de passe"
			);
		} finally {
			setLoading(false);
		}
	};

	if (!token) {
		return (
			<div>
				<p className="text-center text-4xl font-bold mt-96">
					404 Not found
				</p>
			</div>
		);
	}

	return (
		<section className="relative flex flex-col mt-0 ">
			<nav className="absolute z-10 top-0 left-0 lg:left-[150px] md:left-[120px]  h-[80px] flex items-center">
				<a href="/">
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
					className="font-poppins hidden   bg-primary/10 rounded-br-[50px] h-[750px] pr-28 pl-[150px]  lg:flex flex-col justify-center gap-4  text-center lg:text-left"
				>
					<h1 className="font-bold text-[30px] leading-8 max-w-[500px] tracking-tight">
						Créez un nouveau{" "}
						<span className="text-primary">mot de passe</span>{" "}
					</h1>
					<p>
						Entrez un nouveau mot de passe pour sécuriser votre
						compte
					</p>
				</div>
				<div className=" flex items-center px-[50px]">
					<div className="w-full ">
						<FormProvider {...form}>
							<form
								onSubmit={form.handleSubmit(onSubmit)}
								className="px-3 lg:pl-10 lg:pr-[90px] 2xl:pr-[150px] lg:w-full max-w-[700px] mx-auto lg:mx-0 space-y-4"
							>
								<FormField
									control={form.control}
									name="password"
									render={({ field }) => (
										<FormItem>
											<FormLabel className="text-gray-900 text-md tracking-tight">
												Password
											</FormLabel>
											<FormControl className="relative">
												<div>
													<Input
														type={`${
															passwordVisible
																? "text"
																: "password"
														}`}
														placeholder="Entrez le mot de passe"
														className="px-6 w-full bg-app-lightgray"
														{...field}
													/>
													<div className="absolute text-gray-500 cursor-pointer right-[10px] top-[12px]">
														{passwordVisible ? (
															<FaEyeSlash
																onClick={() =>
																	setPasswordVisible(
																		false
																	)
																}
															/>
														) : (
															<FaEye
																onClick={() =>
																	setPasswordVisible(
																		true
																	)
																}
															/>
														)}
													</div>
												</div>
											</FormControl>
											<FormMessage className="text-red-500 text-sm mt-1">
												{
													form.formState.errors
														.password?.message
												}
											</FormMessage>
										</FormItem>
									)}
								/>

								<FormField
									control={form.control}
									name="confirmPassword"
									render={({ field }) => (
										<FormItem>
											<FormLabel className="text-gray-900 text-md tracking-tight">
												Confirm Password
											</FormLabel>
											<FormControl className="relative">
												<div>
													<Input
														type={`${
															confirmPasswordVisible
																? "text"
																: "password"
														}`}
														placeholder="Confirmez le mot de passe"
														className="px-6 w-full bg-app-lightgray"
														{...field}
													/>
													<div className="absolute text-gray-500 cursor-pointer right-[10px] top-[12px]">
														{confirmPasswordVisible ? (
															<FaEyeSlash
																onClick={() =>
																	setConfirmPasswordVisible(
																		false
																	)
																}
															/>
														) : (
															<FaEye
																onClick={() =>
																	setConfirmPasswordVisible(
																		true
																	)
																}
															/>
														)}
													</div>
												</div>
											</FormControl>
											<FormMessage className="text-red-500 text-sm mt-1">
												{
													form.formState.errors
														.password?.message
												}
											</FormMessage>
										</FormItem>
									)}
								/>

								<div className="flex justify-center">
									<button
										type="submit"
										className=" py-2 px-8 bg-app-primary text-white rounded hover:bg-app-secondary"
									>
										Rénitialiser le mot de passe
									</button>
								</div>
							</form>
						</FormProvider>
					</div>
				</div>
			</div>
			<WebsiteFooter />
			{showSuccessModal && <SuccessModal />}
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

export default ResetPassword;
