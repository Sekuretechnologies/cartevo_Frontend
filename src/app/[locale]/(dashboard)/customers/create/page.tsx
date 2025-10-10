"use client";
import Layout from "@/components/shared/Layout";
import { useTitle } from "@/hooks/useTitle";
import { useParams, useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
// import PersonalInfoForm from "./components/PersonalInfoForm";

import dynamic from "next/dynamic";
const PersonalInfoForm = dynamic(
	() => import("./components/PersonalInfoForm"),
	{
		ssr: false,
	}
);

export default function ManageUserAccount() {
	useTitle("Cartevo | New Customer", true);
	const { id } = useParams();
	const dispatch = useDispatch();
	const router = useRouter();

	return (
		<Layout
			title={"Add new customer"}
			// backLink={URLConfig.usersAccounts.root}
			// goBack={() => router.back()} //urls.cards.manage
		>
			<div className="flex flex-col px-3 py-4 bg-white rounded-lg shadow-md">
				<PersonalInfoForm />
			</div>
		</Layout>
	);
}
