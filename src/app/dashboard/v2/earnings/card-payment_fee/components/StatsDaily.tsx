import {
	getGraphData,
	getTransactionDailyPerCategoryTypeGraphData,
	getTransactionPerCategoryTypeGraphData,
	getTransactionPerCountryGraphData,
	getTransactionTrendGraphData,
} from "@/utils/graphs";
import { TransactionService } from "@/api/services/v2/transaction";
import { selectLimitDate } from "@/redux/slices_v2/settings";
import toast from "react-hot-toast";
import { useQuery } from "react-query";
import { useSelector } from "react-redux";
import DataCard from "@/components/cards/DataCard/DataCard";

const getDailyCategoryTypeTransactions = async ({ queryKey }: any) => {
	const [_key, limitDate] = queryKey;
	let params: any = {};
	if (limitDate) params.limitDate = limitDate;
	params.category = "card";
	params.type = "payment_fee";
	const response = await TransactionService.get_daily_stats(params);
	const responseJson = await response.json();
	if (!response.ok) {
		throw new Error(
			responseJson.message || "Failed to get daily transactions"
		);
	}
	return responseJson.data;
};

interface Props {
	customer?: any;
	isOpen: boolean;
	setIsOpen: (data?: any) => void;
}

export default function StatsDaily() {
	const limitDate: string = useSelector(selectLimitDate);

	const transactionDailyPerCategoryTypeQueryRes = useQuery({
		queryKey: ["transactionDailyPerCategoryType", limitDate],
		queryFn: getDailyCategoryTypeTransactions,
		onError: (err) => {
			toast.error("Une erreur est survenue:" + err);
		},
		refetchInterval: 35000, // Fetches data every 15 seconds
	});

	console.log(
		"transactionDailyPerCategoryType.data : ",
		transactionDailyPerCategoryTypeQueryRes.data
	);

	// const {dataData:cardsGraphData, trxData:cardsData} = getGraphData(transactionDailyPerCategoryTypeQueryRes?.data?.cards ?? [], 1);
	// const {dataData:usersGraphData , trxData:usersData} = getGraphData(transactionDailyPerCategoryTypeQueryRes?.data?.users ?? [], 2);
	// const {dataData:cardsTopUpsGraphData , trxData:cardsTopUpsData} = getGraphData(transactionDailyPerCategoryTypeQueryRes?.data?.cardTopUpPerDay ?? [], 3);

	return (
		<>
			{/* <div className='w-full my-[50px] border border-gray-800'/> */}
			{transactionDailyPerCategoryTypeQueryRes.status === "loading" ? (
				<div className="flex w-full py-10 justify-center items-center">
					<div className={"loadingSpinner"}></div>
				</div>
			) : (
				<div className="grid grid-flow-row grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-col-5 w-full gap-5">
					{transactionDailyPerCategoryTypeQueryRes?.data &&
						Object.values(
							transactionDailyPerCategoryTypeQueryRes.data
								?.transactions
						)?.map((item: any, index: any) => {
							const itemGraphData =
								getTransactionDailyPerCategoryTypeGraphData(
									item?.transactions ?? [],
									index
								);
							return (
								<div
									key={index}
									className={index === 0 ? `` : ``}
								>
									<DataCard
										title={item?.title}
										change_per="24%"
										chartData={itemGraphData}
										mainData={item?.transactions ?? []}
										withDailyStats={true}
										data={{
											dailyStats: item?.stats,
										}}
									/>
								</div>
							);
						})}
					{transactionDailyPerCategoryTypeQueryRes?.data && (
						<>
							{/* <div>
            <DataCard 
              title={"Comptes créés"}
              change_per="24%"
              chartData={usersGraphData}
              data={{
                today: `${usersData?.todayTotal?.total?.toLocaleString('fr-FR') ?? 0}`,
                total: `${usersData?.avgTotal?.total?.toLocaleString('fr-FR') ?? 0}`,
                average: `${usersData?.avgTotal?.avg ? Math.round(usersData?.avgTotal?.avg).toLocaleString('fr-FR') : 0}`,
              }}
            />
          </div>
          <div>
            <DataCard 
              title={"Création de cartes"}
              change_per="24%"
              chartData={cardsGraphData}
              data={{
                today: `${cardsData?.todayTotal?.total?.toLocaleString('fr-FR') ?? 0}`,
                total: `${cardsData?.avgTotal?.total?.toLocaleString('fr-FR') ?? 0}`,
                average: `${cardsData?.avgTotal?.avg ? Math.round(cardsData?.avgTotal?.avg).toLocaleString('fr-FR') : 0}`,
              }}
            />
          </div>
          <div>
            <DataCard 
              title={"Recharges de cartes par jour"}
              change_per="24%"
              chartData={cardsTopUpsGraphData}
              data={{
                today: `${cardsTopUpsData?.todayTotal?.total?.toLocaleString('fr-FR') ?? 0}`,
                total: `${cardsTopUpsData?.avgTotal?.total?.toLocaleString('fr-FR') ?? 0}`,
                average: `${cardsTopUpsData?.avgTotal?.avg ? Math.round(cardsTopUpsData?.avgTotal?.avg).toLocaleString('fr-FR') : 0}`,
              }}
            />
          </div> */}
						</>
					)}
				</div>
			)}
		</>
	);
}
