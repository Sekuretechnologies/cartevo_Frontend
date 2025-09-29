import { AuthService } from "@/api/services/cartevo-api/auth";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useLocalizedNavigation } from "@/hooks/useLocalizedNavigation";
import { setCredentials, setCurrentUserEmail } from "@/redux/slices/auth";
import { setCompagnies } from "@/redux/slices/companySlice";
import { loginSchema } from "@/validation/FormValidation";
import { zodResolver } from "@hookform/resolvers/zod";
import classNames from "classnames";
import { ChevronRight } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useMutation } from "react-query";
import { useDispatch } from "react-redux";
import { PuffLoader } from "react-spinners";
import { z } from "zod";

const handleLogin = async (data: z.infer<typeof loginSchema>) => {
	const response = await AuthService.login(data);
	if (!response.ok) {
		const responseBody = await response.json();
		// console.error(response);

		throw new Error(responseBody.message);
	}
	const responseJson = await response.json();
	return responseJson;
};

export default function LoginForm() {
	const [passwordVisible, setPasswordVisible] = useState<boolean>();
	const previousUrl = window.sessionStorage.getItem("previousUrl");
	const router = useRouter();
	const dispatch = useDispatch();
	const form = useForm<z.infer<typeof loginSchema>>({
		resolver: zodResolver(loginSchema),
		defaultValues: {
			email: "",
			password: "",
		},
	});

	const mutation = useMutation({
		mutationFn: handleLogin,
		onError: (err: any) => {
			console.error("Login onError : ", err.message);
			toast.error(err.message);
		},
		onSuccess: (data) => {
			console.log("Login onSuccess : ", data);
			const token = data.access_token;
			const user = data.user;
			const company = data.company;
			dispatch(setCredentials({ token, company, user }));
			dispatch(setCurrentUserEmail({ email: form.getValues("email") }));

			toast.success("Login successful! Redirecting...");
			//-----------------------------------
			// dispatch(setCurrentUserEmail({ email: form.getValues("email") }));
			console.log("data", data);

			dispatch(setCompagnies(data.companies)); // -->> sauvegarde dans le  store

			navigateTo("/verify-otp");

			//-----------------------------------
			// if (!company?.onboarding_is_completed) {
			// 	router.push(urls.onboarding.root);
			// } else {
			// 	router.push(urls.wallets.root);
			// }
			//-----------------------------------
		},
	});

	const onSubmit = (data: any) => {
		mutation.mutate(data);
	};
	const onError = (err: any) => {
		console.error("any", err);
	};

	const { createLocalizedLink, navigateTo } = useLocalizedNavigation();

	return (
		<Form {...form}>
			<form
				onSubmit={form.handleSubmit(onSubmit, onError)}
				className="px-3 lg:pl-10 lg:pr-[90px] 2xl:pr-[150px] lg:w-full max-w-[700px] mx-auto lg:mx-0"
			>
				<div className="w-full pt-20 lg:pt-0 font-poppins">
					<div>
						<h1 className="text-[30px] font-poppins tracking-tight font-bold">
							Connectez-vous
						</h1>
						<p className="text-[12px] mb-8">
							Bon retour ! Veuillez saisir vos informations.
						</p>
					</div>
					<FormField
						control={form.control}
						name="email"
						render={({ field }) => (
							<FormItem className="mb-2">
								<FormLabel className=" text-[12px] font-semibold tracking-tight">
									Adresse Mail
								</FormLabel>
								<FormControl>
									<Input
										className="px-6 w-full bg-app-lightgray"
										placeholder="Entrez votre adresse e-mail"
										{...field}
									/>
								</FormControl>
								<FormMessage className="text-red-400" />
							</FormItem>
						)}
					/>
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
														setPasswordVisible(true)
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
				</div>

				<div className="mt-2 text-app-secondary text-sm flex justify-end">
					<a
						href={createLocalizedLink("/forgot-password")}
						className="text-app-primary text-[12px] font-bold hover:text-app-secondary"
					>
						Mot de passe oublié ?
					</a>
				</div>

				<div
					className={`mt-[45px] flex flex-col md:flex-row gap-4 items-center`}
				>
					<button
						type="submit"
						className="bg-primary flex gap-8 text-white text-[13px] font-bold  justify-center items-center w-[175px] h-[49px] rounded-[10px]"
					>
						Continue <ChevronRight />
					</button>

					<a
						className="bg-[#F3F3F3] text-black text-[12px] font-bold flex gap-1 items-center justify-center w-[325px] h-[52px] rounded-[18px]"
						href={createLocalizedLink("/signup")}
					>
						<span> Pas encore de compte ?</span>{" "}
						<span className="text-primary">Inscrivez vous</span>
					</a>
				</div>
				<div
					className={classNames(
						"transition-all invisible z-[1000] bg-blue-900/30 opacity-0 absolute top-0 left-0 h-full w-full flex items-center justify-center",
						{
							"!opacity-100 !visible z-[1000]":
								mutation.isLoading,
						}
					)}
				>
					<PuffLoader
						className="shrink-0"
						size={50}
						color="#1F66FF"
					/>
				</div>
			</form>
		</Form>
	);
}
