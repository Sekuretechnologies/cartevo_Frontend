"use client";

//---------------------------------------
import { useTitle } from "@/hooks/useTitle";
import Image from "next/image";
import LoginForm from "./components/form/Form";
import NewsLetterForm from "./components/form/NewsLetterForm";
import Footer from "./components/Footer";
import Link from "next/link";
//---------------------------------------

const LoginPage = () => {
	useTitle("Cartevo | Login");
	return (
		<section className="relative flex flex-col h-screen mt-0  w-full">
			<nav className="absolute z-10 top-0 left-0 w-full h-[80px] px-[150px] flex items-center">
				<div className="max-w-[1250px] ">
					<img
						src="/images/cartevo-logo.svg"
						alt="cartevo-logo"
						className=""
					/>
				</div>
			</nav>
			<div className="w-full h-[90vh] grid grid-cols-12">
				<div className="relative col-span-5 pl-[150px] pt-[200px] bg-app-lightblue rounded-br-[50px] overflow-hidden">
					<h1 className="font-bold text-4xl text-app-secondary">
						Sign in
					</h1>
					<span className="text-lg text-app-secondary">
						Innovative Payments for a Digital World.
					</span>
					<div className="absolute bottom-[100px] left-0 w-full h-[200px]">
						<img
							src="/images/white-cartevo-logo-001.svg"
							alt="white-cartevo-logo"
							className=""
						/>
					</div>
				</div>
				<div className="col-span-7 flex justify-center items-center px-[50px]">
					<div className="w-full max-w-[400px]">
						<LoginForm />
						<div className="mt-6 text-app-secondary text-sm">
							{`Don't have an account?`}{" "}
							<a
								href="/signup"
								className="text-app-primary underline hover:text-app-secondary"
							>
								Sign up here
							</a>
						</div>
					</div>
				</div>
			</div>
			<Footer />
		</section>
	);
};

export default LoginPage;
