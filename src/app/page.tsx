"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { PuffLoader } from "react-spinners";

export default function RootPage() {
	const router = useRouter();

	useEffect(() => {
		// Rediriger vers la locale par défaut
		router.replace("/fr");
	}, [router]);

	return (
		<div className="flex items-center justify-center bg-white h-screen">
			<PuffLoader size={40} color="#1F66FF" />
		</div>
	);
}
