import { AuthService } from "@/api/services/cartevo-api/auth";
import CButton from "@/components/shared/CButton";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import urlsV2 from "@/config/urls_v2";
import { setCredentials } from "@/redux/slices/auth";
import { loginSchema } from "@/validation/FormValidation";
import { zodResolver } from "@hookform/resolvers/zod";
import classNames from "classnames";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { useMutation } from "react-query";
import { useDispatch } from "react-redux";
import { HashLoader } from "react-spinners";
import { z } from "zod";

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

export default function NewsLetterForm() {
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
			const token = data.token;
			const getSekureApiToken = data.getSekureApiToken;
			const user = data.data.user;
			localStorage.setItem("sktoken", token);
			toast.success("Login successful! Redirecting...");
			dispatch(setCredentials({ token, getSekureApiToken, user }));
			// router.push("/verify-token");
			router.push(previousUrl || urlsV2.dashboardHome.root);
		},
	});

	const onSubmit = (data: any) => {
		// mutation.mutate(data);
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
								<FormControl>
									<Input
										className="px-6 w-full bg-app-lightgray"
										placeholder="your@email.com"
										{...field}
									/>
								</FormControl>
								<FormMessage className="text-red-400" />
							</FormItem>
						)}
					/>
				</div>
				<div className={`mt-[20px]`}>
					<CButton
						text={"Recevoir Newsletter"}
						btnStyle={"blue"}
						type={"submit"}
						width={"100%"}
						height={"40px"}
					/>
				</div>
				<div
					className={classNames(
						"transition-all invisible z-20 bg-blue-900/30 opacity-0 absolute top-0 left-0 h-full w-full flex items-center justify-center",
						{
							"!opacity-100 !visible z-20": mutation.isLoading,
						}
					)}
				>
					<HashLoader
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
