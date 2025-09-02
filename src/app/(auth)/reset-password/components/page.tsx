"use client";

import CButton from "@/components/shared/CButton";
import { useRouter } from "next/navigation";

import React from "react";
import { FaCircleCheck } from "react-icons/fa6";

const SuccessModal = () => {
	const router = useRouter();

	const goToLogin = () => {
		router.push("/login");
	};
	return (
		<div className="fixed top-0 left-0 h-full w-full bg-black/40 backdrop-blur-sm flex justify-center items-center">
			<div className="bg-white w-96 h-80 rounded-xl flex flex-col items-center p-4 justify-center">
				<FaCircleCheck className="text-green-500 text-6xl" />
				<h1 className="text-3xl font-bold text-primary">Succès!</h1>
				<p className="text-black/70 mb-6">
					Mot de passe réinitialisé avec succès
				</p>
				<CButton
					text="Se connecter"
					btnStyle={"blue"}
					onClick={goToLogin}
				/>
			</div>
		</div>
	);
};

export default SuccessModal;
