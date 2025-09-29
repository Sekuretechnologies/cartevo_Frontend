"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { PuffLoader } from "react-spinners";

interface ProtectedRouteProps {
	allowedClearances: string[];
	redirectTo?: string;
	children: React.ReactNode;
}

export default function ProtectedRoute({
	allowedClearances,
	redirectTo = "/login",
	children,
}: ProtectedRouteProps) {
	const router = useRouter();
	const clearance = useSelector(
		(state: RootState) => (state.auth.company as any)?.clearance
	);
	const [checked, setChecked] = useState(false);

	useEffect(() => {
		// On ne fait le check que si clearance est défini
		if (clearance) {
			if (!allowedClearances.includes(clearance)) {
				router.replace(redirectTo);
			} else {
				setChecked(true);
			}
		}
	}, [clearance, allowedClearances, router, redirectTo]);

	if (!checked) {
		return (
			<div className="bg-white w-full text-primary flex justify-center items-center h-full">
				<PuffLoader />
			</div>
		);
	}

	return <>{children}</>;
}
