"use client";

import Layout from "@/components/shared/Layout";
// import TabsComponent from "@/components/shared/TabsComponent";
import { CustomerService } from "@/api/services/v2/customer";
import { useTitle } from "@/hooks/useTitle";
import { usePathname, useRouter } from "next/navigation";
import { FaRegCreditCard, FaYenSign } from "react-icons/fa";
import { FaMoneyBillWheat, FaNairaSign } from "react-icons/fa6";
import { BsWallet2, BsWalletFill } from "react-icons/bs";
import { RiHandCoinFill } from "react-icons/ri";
import { IoCardOutline } from "react-icons/io5";
import { MdAddCard } from "react-icons/md";

const getAllKYC = async ({ queryKey }: any) => {
	const [_key, filter, st] = queryKey;
	let params: any = {};
	if (st) params.searchTerm = st;
	if (filter?.kyc_result) params.kyc_result = filter?.kyc_result;
	if (filter?.kyc_status) params.kyc_status = filter?.kyc_status;

	const response = await CustomerService.get_all_customers(params);
	const responseJson = await response.json();
	if (!response.ok) {
		throw new Error(responseJson.message || "Failed to get users");
	}

	return responseJson.data;
};
const getKYCStats = async () => {
	const response = await CustomerService.get_kyc_stats();
	const responseJson = await response.json();
	if (!response.ok) {
		throw new Error(
			responseJson.message || "Failed to get users statistics"
		);
	}
	// console.log("getKYCStats.data : ", responseJson.data);
	return responseJson.data;
};

export default function KYC() {
	useTitle("Services de paiement", true);
	const pathname = usePathname();
	const router = useRouter();

	const paymentServices: any = [
		{
			title: "Recharge de compte",
			slug: "wallet-topup",
			icon: <BsWalletFill size={35} color="#1F66FF" />,
		},
		{
			title: "Retrait de compte",
			slug: "wallet-withdrawal",
			icon: <BsWallet2 size={35} color="#1F66FF" />,
		},
		{
			title: "Achat de carte",
			slug: "card-purchase",
			icon: <MdAddCard size={35} color="#1F66FF" />,
		},
		{
			title: "Recharge de carte",
			slug: "card-topup",
			icon: <FaRegCreditCard size={35} color="#1F66FF" />,
		},
		{
			title: "Retrait de carte",
			slug: "card-withdrawal",
			icon: <IoCardOutline size={35} color="#1F66FF" />,
		},
		{
			title: "Reception de paiement",
			slug: "wallet-receive",
			icon: <RiHandCoinFill size={35} color="#1F66FF" />,
		},
		{
			title: "NairaPay",
			slug: "nairapay",
			icon: <FaNairaSign size={35} color="#1F66FF" />,
		},
		{
			title: "Services factures et credit communication",
			slug: "all-payservice",
			icon: <FaMoneyBillWheat size={35} color="#1F66FF" />,
		},
		{
			title: "ChinPay",
			slug: "chinpay",
			icon: <FaYenSign size={35} color="#1F66FF" />,
		},
	];

	const handlePaymentServiceSelect = (payservice: any) => {
		router.push(`${pathname}/${payservice.slug}`);
	};

	return (
		<Layout title={"Services de paiement"}>
			<>
				<section className="px-2">
					<div className="pl-[30px] grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-10">
						{paymentServices.map((paymentService: any) => {
							return (
								<div
									key={paymentService.slug}
									onClick={() =>
										handlePaymentServiceSelect(
											paymentService
										)
									}
									className="flex flex-col justify-center items-center gap-3 w-[200px] cursor-pointer rounded-xl p-[10px] hover:bg-gray-100"
								>
									<div className="img-container bg-white border rounded-lg h-[120px] w-[120px] overflow-hidden flex justify-center items-center">
										{paymentService.icon}
									</div>
									{/* <div className="text-sm text-gray-400 text-center w-full">{payservice.code}</div>
                  <div className="text-sm text-gray-600 text-center w-full">{payservice.slug}</div> */}
									<div className="text-md text-center w-full">
										{paymentService.title}
									</div>
								</div>
							);
						})}
					</div>
					{/* <div className='mb-10 grid lg:grid-cols-2 md:grid-cols-2 sm:grid-cols-1' style={{gap:'20px'}}>
            {allKYCStatsQueryRes?.status === 'loading' ? 
                <div className="flex justify-center w-full py-10">
                    <div className={'loadingSpinner'}></div>
                </div>
                :
                <>
                {infoData.map((data, index) => (
                    <InfoCard key={index} data={data} />
                ))}
                </>
            } 
        </div> */}
				</section>
			</>
		</Layout>
	);
}
