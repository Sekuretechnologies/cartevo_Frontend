"use client";
import { NairapayService } from "@/api/services/v2/nairapay";
import Layout from "@/components/shared/Layout";
import { useTitle } from "@/hooks/useTitle";
import { setCurrentNairaPayment } from "@/redux/slices_v2/nairapay";
import { useParams, useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { useQuery } from "react-query";
import { useDispatch } from "react-redux";
import Index from "./components";

const getOneNairapayment = async ({ queryKey }: any) => {
	const [_key, id] = queryKey;
	// console.log("getCustomers searchTerm : ", st, queryKey);

	const response = await NairapayService.get_one_trx(id);
	const responseJson = await response.json();
	if (!response.ok) {
		throw new Error(responseJson.message || "Failed to get user " + id);
	}
	return responseJson.data;
};

export default function Edit() {
	useTitle("NairaPay", true);
	const { id } = useParams();
	const dispatch = useDispatch();
	const router = useRouter();

	const nairaPaymentQueryRes = useQuery({
		queryKey: ["nairaPayment", id],
		queryFn: getOneNairapayment,
		onError: (err) => {
			toast.error("Failed to get nairaPayment : " + id);
		},
		// enabled: false,
		// refetchInterval: 50000, // Fetches data every 60 seconds
	});
	dispatch(setCurrentNairaPayment(nairaPaymentQueryRes.data));
	console.log("nairaPaymentQueryRes.data : ", nairaPaymentQueryRes.data);

	return (
		<Layout
			title={"Details transfert nigeria"}
			backLink={"/dashboard/v2/payment_services/nairapay"}
		>
			{nairaPaymentQueryRes.data ? (
				<Index />
			) : (
				<div className="flex justify-center w-full py-10">
					<div className={"loadingSpinner"}></div>
				</div>
			)}
		</Layout>
	);
	// else {
	//   return (
	//   <>
	//   <div className="flex justify-center w-full py-10">
	//       <div className={'loadingSpinner'}></div>
	//   </div>
	//   </>
	//   )
	// }
}
