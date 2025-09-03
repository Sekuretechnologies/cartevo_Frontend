import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { loginSchema } from "@/validation/FormValidation";
import { FaChevronRight, FaEye, FaEyeSlash } from "react-icons/fa";
import { Button } from "@/components/ui/button";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import CButton from "@/components/shared/CButton";
import { AuthService } from "@/api/services/cartevo-api/auth";
import { useMutation } from "react-query";
import { HashLoader, PuffLoader } from "react-spinners";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { setCredentials, setCurrentUserEmail } from "@/redux/slices/auth";
import { useRouter } from "next/navigation";
import classNames from "classnames";
import urls from "@/config/urls";
import urlsV2 from "@/config/urls_v2";
import { useState } from "react";

const handleLogin = async (data: z.infer<typeof loginSchema>) => {
	const response = await AuthService.login(data);
	if (!response.ok) {
		const responseBody = await response.json();
		// console.error(response);
		if (response.status === 403) {
			throw new Error(responseBody.message);
		} else {
			throw new Error(
				"Echec authentification. Veuillez indiquer votre email et votre mot de passe !"
			);
		}
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

			toast.success("Login successful! Redirecting...");
			//-----------------------------------
			dispatch(setCurrentUserEmail({ email: form.getValues("email") }));
			router.push("/verify-otp");
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

	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(onSubmit, onError)}>
				<div className="space-y-[20px] w-full">
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
								<FormMessage className="text-red-400" />
							</FormItem>
						)}
					/>
					<FormField
						control={form.control}
						name="password"
						render={({ field }) => (
							<FormItem>
								<FormLabel className="text-gray-900 text-md font-[500] tracking-tight">
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

				{/* <div className="text-right">
          <a href="#" className="inline-block w-[272px] text-md font-[400]">Mot de passe oublié ?</a>
        </div> */}
				{/* <Link href="#" className="text-gray-800 font-semibold text-righttext-md">Forgotten Password?</Link> */}
				<div className={`mt-[50px]`}>
					<CButton
						text={"Continue"}
						btnStyle={"blue"}
						type={"submit"}
						// href={`/`}
						// icon={<FaChevronRight />}
						width={"200px"}
						height={"40px"}
					/>
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
				{/* <Button type="submit" className="w-[272px] mt-[10vh] bg-[#18BC7A] hover:bg-[#FFDB5A] hover:text-[#18BC7A] rounded-full">Connexion</Button> */}
			</form>
		</Form>
	);
}
