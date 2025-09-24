"use client";

import { useTitle } from "@/hooks/useTitle";
import Image from "next/image";
import Footer from "@/components/shared/Footer/Footer";
import WebsiteFooter from "@/components/websiteComponents/WebsiteFooter";
import { data } from "@/constants/Index";
import { z } from "zod";
import { AcceptInvitationSchema } from "@/validation/FormValidation";
import { AuthService } from "@/api/services/cartevo-api/auth";
import { useSearchParam } from "react-use";
import { useRouter, useSearchParams } from "next/navigation";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
	useFormField,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "react-query";
import toast from "react-hot-toast";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import CButton from "@/components/shared/CButton";
import { PuffLoader } from "react-spinners";

const handleSubmit = async (data: z.infer<typeof AcceptInvitationSchema>) => {
	const response = await AuthService.acceptInvitation(data);
	if (!response.ok) {
		const responseBody = await response.json();
		// console.error(response);

		throw new Error(responseBody.message);
	}
	const responseJson = await response.json();
	return responseJson;
};

const InvitationPage = () => {
	useTitle("Cartevo | Accept-invitation");
	const [passwordVisible, setPasswordVisible] = useState<boolean>();
	const searchParams = useSearchParams();
	const token = searchParams.get("token");
	const router = useRouter();

	const form = useForm<z.infer<typeof AcceptInvitationSchema>>({
		resolver: zodResolver(AcceptInvitationSchema),
		defaultValues: {
			token: token ?? undefined,
			password: "",
		},
	});

	const mutation = useMutation({
		mutationFn: handleSubmit,
		onError: (err: any) => {
			toast.error(err.message);
		},
		onSuccess: (data) => {
			toast.success("Invitation accepted successfully! Redirecting...");
			router.push("/login");
		},
	});

	const onSubmit = (data: any) => {
		mutation.mutate(data);
	};

	const onError = (err: any) => {
		console.error("error", err);
	};
	return (
		<section className="relative flex flex-col h-screen mt-0  w-full">
			<nav className="absolute z-10 top-0 lg:left-[150px]  h-[80px] flex items-center">
				<a href="/">
					<img src="/website/logos/logo_full.png" alt="logo" />
				</a>
			</nav>
			<div className="w-full grid-cols-1  grid lg:grid-cols-2 font-poppins ">
				<div
					style={{
						backgroundImage:
							"url('/website/home/heroBackground.png')",
						backgroundSize: "cover",
						backgroundPosition: "center",
						backgroundRepeat: "no-repeat",
					}}
					className="font-poppins hidden bg-primary/10 rounded-br-[50px] h-[750px] pr-28 pl-[150px]  lg:flex flex-col justify-center gap-4   text-center lg:text-left"
				>
					<h1 className="font-bold text-[35px] leading-10 max-w-[500px] tracking-tight text-app-secondary">
						Vous avez reçu une invitation
					</h1>
					<p className="text-app-secondary">
						Pour rejoindre l’entreprise, merci de saisir votre mot
						de passe.
					</p>
				</div>
				<div className=" flex justify-center items-center px-6 lg:px-[50px] mt-28 lg:mt-0">
					<div className="w-full max-w-[500px]">
						<div className="mb-8 text-center space-y-4 lg:hidden">
							<h1 className="font-bold text-[35px] leading-10 max-w-[500px] tracking-tight text-app-secondary lg:hidden">
								Vous avez reçu une invitation
							</h1>
							<p className="text-app-secondary">
								Pour rejoindre l’entreprise, merci de saisir
								votre mot de passe.
							</p>
						</div>

						<h1>Entrez votre mot de passe</h1>
						<Form {...form}>
							<form
								onSubmit={form.handleSubmit(onSubmit, onError)}
							>
								<FormField
									control={form.control}
									name="password"
									render={({ field }) => (
										<FormItem>
											<FormLabel className="text-[12px] font-semibold tracking-tight">
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
														className="px-6 w-full bg-app-lightgray"
														{...field}
														placeholder="Entrez votre mot de passe"
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
											<FormMessage className="text-red-400" />
										</FormItem>
									)}
								/>

								<div className="mt-8 flex justify-center lg:justify-start">
									<CButton
										btnStyle="blue"
										text="Soumettre"
										width="175px"
										height="49px"
										type="submit"
									/>
								</div>
							</form>

							{mutation.isLoading && (
								<div className="fixed top-0 left-0 w-full h-full flex justify-center items-center bg-black/40 backdrop-blur-sm  z-[1000]">
									<PuffLoader
										className="shrink-0"
										size={50}
										color="#1F66FF"
									/>
								</div>
							)}
						</Form>
					</div>
				</div>
			</div>
			{/* <Footer /> */}
			<WebsiteFooter />
		</section>
	);
};

export default InvitationPage;
