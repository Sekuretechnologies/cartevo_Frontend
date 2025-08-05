import { getGraphData, getTransactionPerCategoryTypeGraphData, getTransactionPerCountryGraphData, getTransactionTrendGraphData } from "@/utils/graphs";
import { TransactionService } from "@/api/services/v1v2/transaction";
import { selectLimitDate, selectStartDate } from "@/redux/slices_v2/settings";
import toast from "react-hot-toast";
import { useQuery } from "react-query";
import { useSelector } from "react-redux";
import DataCard from "@/components/cards/DataCard/DataCard";

const getCategoryTypeTransactions = async ({queryKey}:any) => {
  const [_key, startDate, limitDate] = queryKey;
  let params:any = {};
  if(startDate) params.startDate = startDate;
  if(limitDate) params.limitDate = limitDate;
  const response = await TransactionService.get_stats_category_type(params);
  const responseJson = await response.json();
  if (!response.ok) {
    throw new Error(responseJson.message || 'Failed to get transactions per category and type'); 
  }  
  return responseJson.data; 
};

interface Props {
    customer?:any;
    isOpen: boolean;
    setIsOpen:(data?:any)=>void;
}

export default function StatsPerCategoryType() {
    const startDate:string = useSelector(selectStartDate);
    const limitDate:string = useSelector(selectLimitDate);

    const transactionPerCategoryTypeQueryRes = useQuery({
        queryKey: ["transactionPerCategoryType", startDate, limitDate],
        queryFn: getCategoryTypeTransactions,
        onError: (err) => {
          toast.error("Une erreur est survenue:"+err);
        },
        refetchInterval: 35000, // Fetches data every 15 seconds
    });

    console.log("transactionPerCategoryType.data : ", transactionPerCategoryTypeQueryRes.data);

    const {dataData:cardsGraphData, trxData:cardsData} = getGraphData(transactionPerCategoryTypeQueryRes?.data?.cards ?? [], 1);
    const {dataData:usersGraphData , trxData:usersData} = getGraphData(transactionPerCategoryTypeQueryRes?.data?.users ?? [], 2);
    const {dataData:cardsTopUpsGraphData , trxData:cardsTopUpsData} = getGraphData(transactionPerCategoryTypeQueryRes?.data?.cardTopUpPerDay ?? [], 3);

    return (
        <>
        {/* <div className='w-full my-[50px] border border-gray-800'/> */}
        {transactionPerCategoryTypeQueryRes.status === 'loading' ?
            <div className='flex w-full py-10 justify-center items-center'>
              <div className={'loadingSpinner'}></div>
            </div>
            :
        <div className='grid grid-flow-row grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-col-5 w-full gap-5'>
          {          
          transactionPerCategoryTypeQueryRes?.data && Object.values(transactionPerCategoryTypeQueryRes.data?.transactions)?.map((item:any, index:any) =>{
            const itemGraphData = getTransactionPerCategoryTypeGraphData(item?.transactions ?? [], index);
            return (
            <div key={index}>
              <DataCard 
                title={item.title}
                change_per="24%"
                chartData={itemGraphData}
                withPeriods={true}
                data={{
                  today: `${item?.todayTotal?.todayTotalAmount?.toLocaleString('fr-FR') ?? 0} XAF`,
                  total: `${item?.avgTotal?.totalAmount?.toLocaleString('fr-FR') ?? 0} XAF`,
                  average: `${item?.avgTotal?.avgAmount ? Math.round(item?.avgTotal?.avgAmount).toLocaleString('fr-FR') : 0} XAF`,
                  periodStats: item?.periods
                }}
              />
            </div>
          )})}
          {transactionPerCategoryTypeQueryRes?.data &&
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
          </>}
        </div>
        }
        </>
  )
}
