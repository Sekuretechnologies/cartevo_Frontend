"use client"

import Layout from "@/components/shared/Layout";
// import TabsComponent from "@/components/shared/TabsComponent";
import CButton from "@/components/shared/CButton";
import { FaFilter } from "react-icons/fa";
import { HiOutlineFilter } from "react-icons/hi";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import  KYCAll from "./components/Tabs/KYCAll";
import  KYCNone from "./components/Tabs/KYCNone";
import  KYCAccepted from "./components/Tabs/KYCAccepted";
import  KYCDeclined from "./components/Tabs/KYCDeclined";
import  KYCPending from "./components/Tabs/KYCPending";
import InfoCard, { TDataList } from "@/components/cards/InfoCard";
import { checkCircleIcon, haltCircleIcon, stopIcon, folderIcon, ongoingCircleIcon, verifiedIcon, waitCircleIcon } from "@/constants/icons";
import { UserService } from "@/api/services/user";
import { useTitle } from "@/hooks/useTitle";
import { useDispatch, useSelector } from "react-redux";
import { useQuery } from "react-query";
import toast from "react-hot-toast";
import { setKYCAccepted, setKYCAll, setKYCDeclined, setKYCNone, setKYCPending } from "@/redux/slices_v2/kyc";
import { selectSearchTerm } from "@/redux/slices/search";
import { useState } from "react";
import { CustomerService } from "@/api/services/v2/customer";
import { isObject } from "@/utils/utils";


let infoData: TDataList[] = [
  [
      [{
          label:{text:"Regularisations aujourd'hui", fw:"bold", color:"#444"},
          value:{text:"42", fw:"bold", color:"#444"}
      }],
      [{
          label:{text:"Total Regularisations", fw:"", color:"#444"},
          value:{text:"80", fw:"bold", color:"#444"}
      }]
  ],
  [
    [{
        label:{text:"MOMO aujourd'hui", fw:"bold", color:"#444"},
        value:{text:"42", fw:"bold", color:"#444"}
    }],
    [{
        label:{text:"Total MOMO", fw:"", color:"#444"},
        value:{text:"80", fw:"bold", color:"#444"}
    }]
  ],
  [
    [{
        label:{text:"SEKURE aujourd'hui", fw:"bold", color:"#444"},
        value:{text:"42", fw:"bold", color:"#444"}
    }],
    [{
        label:{text:"Total SEKURE", fw:"", color:"#444"},
        value:{text:"80", fw:"bold", color:"#444"}
    }]
  ]
];

infoData[0][0][0].value.text = 0;
infoData[0][1][0].value.text = 0;
infoData[1][0][0].value.text = 0 + "  XAF";
infoData[1][1][0].value.text = 0 + "  XAF";
infoData[2][0][0].value.text = 0 + "  XAF";
infoData[2][1][0].value.text = 0 + "  XAF";
// infoData[3][0][0].value.text = 0;
// infoData[3][1][0].value.text = 0 + "  XAF";
// infoData[4][0][0].value.text = 0;
// infoData[4][1][0].value.text = 0 + "  XAF";
// infoData[3][1][1].value.text = 0;
// infoData[3][1][2].value.text = 0;



const getAllKYC = async ({queryKey}:any) => {
  const [_key, filter, filterContent, st] = queryKey;
  let params:any = {};
  if(st) params.searchTerm = st;

  if(isObject(filter)){
      Object.entries(filter).map(([key, value]:any[]) => {
          if(value && value!== 'all') params[key] = value;
      });
  }
  if(isObject(filterContent)){
    Object.entries(filterContent).map(([key, value]:any[]) => {
        if(value && value!== 'all') params[key] = value;
    });
}
  
  // if(filter?.kyc_result) params.kyc_result = filter?.kyc_result;
  // if(filter?.kyc_status) params.kyc_status = filter?.kyc_status;
  // if(filter?.regularisation_status) params.regularisation_status = filter?.regularisation_status;

  const response = await CustomerService.get_regularisations(params);
  const responseJson = await response.json();
  if (!response.ok) {
    throw new Error(responseJson.message || 'Failed to get users'); 
  }  
  
  
  return responseJson.data; 
};
const getKYCStats = async () => {
  const response = await CustomerService.get_regularisation_stats();
  const responseJson = await response.json();
  if (!response.ok) {
    throw new Error(responseJson.message || 'Failed to get users statistics'); 
  }
  // console.log("getKYCStats.data : ", responseJson.data);
  return responseJson.data; 
};

export default function KYC() {
  useTitle("Sekure | Vérifications KYC", true);
  const [searchKYC, setSearchKYC] = useState('');
	const [searchKYCAccepted, setSearchKYCAccepted] = useState('');
	const [searchKYCPending, setSearchKYCPending] = useState('');
	const [searchKYCDeclined, setSearchKYCDeclined] = useState('');
  const [searchKYCNone, setSearchKYCNone] = useState('');

  const [filterKYC, setFilterKYC] = useState('');
	const [filterKYCAccepted, setFilterKYCAccepted] = useState('');
	const [filterKYCPending, setFilterKYCPending] = useState('');
	const [filterKYCDeclined, setFilterKYCDeclined] = useState('');
  const [filterKYCNone, setFilterKYCNone] = useState('');

	const dispatch = useDispatch();
	const searchTerm:string = useSelector(selectSearchTerm);

	const allKYCStatsQueryRes = useQuery({
      queryKey: ["allKYCStats"],
      queryFn: getKYCStats,
      onError: (err) => {
        toast.error("Failed to get KYC stats.");
        console.log("Failed to get KYC stats : ", err);
      },
      refetchInterval: 30000, // Fetches data every 30 seconds
  });
  console.log("allKYCStatsQueryRes.data : ", allKYCStatsQueryRes.data);


  const allKYCQueryRes = useQuery({
      queryKey: ["allKYC", {regularisation_status:'ALL'}, filterKYC, searchKYC],
      queryFn: getAllKYC,
      onError: (err) => {
        toast.error("Failed to get KYC.");
        console.log("Failed to get KYC : ", err);
      },
      // enabled: false,
      refetchInterval: 30000, // Fetches data every 30 seconds
  });
  dispatch(setKYCAll(allKYCQueryRes.data));
  console.log("allKYCQueryRes.data : ", allKYCQueryRes.data);


  const allKYCAcceptedQueryRes = useQuery({
      queryKey: ["allKYCAccepted", {regularisation_status:'QUEUED'}, filterKYCAccepted, searchKYCAccepted],
      queryFn: getAllKYC,
      onError: (err) => {
        toast.error("Failed to get Accepted KYC list.");
        console.log("Failed to get Accepted KYC list: ", err);
      },
      // enabled: false,
      refetchInterval: 30000, // Fetches data every 30 seconds
  });
  dispatch(setKYCAccepted(allKYCAcceptedQueryRes.data));
  console.log("allKYCAcceptedQueryRes.data : ", allKYCAcceptedQueryRes.data);
  

  const allKYCPendingQueryRes = useQuery({
      queryKey: ["allKYCPending", {regularisation_status:'VERIFIED'}, filterKYCPending, searchKYCPending],
      queryFn: getAllKYC,
      onError: (err) => {
        toast.error("Failed to get Pending KYC list.");
        console.log("Failed to get Pending KYC list: ", err);
      },
      // enabled: false,
      refetchInterval: 30000, // Fetches data every 30 seconds
  });
  dispatch(setKYCPending(allKYCPendingQueryRes.data));
  console.log("allKYCPendingQueryRes.data : ", allKYCPendingQueryRes.data);


  const allKYCDeclinedQueryRes = useQuery({
      queryKey: ["allKYCDeclined", {regularisation_status:'PROCESSING'}, filterKYCDeclined, searchKYCDeclined],
      queryFn: getAllKYC,
      onError: (err) => {
        toast.error("Failed to get Declined KYC list.");
        console.log("Failed to get Declined KYC list: ", err);
      },
      // enabled: false,
      refetchInterval: 30000, // Fetches data every 30 seconds
  });
  dispatch(setKYCDeclined(allKYCDeclinedQueryRes.data));
  console.log("allKYCDeclinedQueryRes.data : ", allKYCDeclinedQueryRes.data);


  const allKYCNoneQueryRes = useQuery({
    queryKey: ["allKYCNone", {regularisation_status:'PAID'}, filterKYCNone, searchKYCNone],
      queryFn: getAllKYC,
      onError: (err) => {
        toast.error("Failed to get None KYC list.");
        console.log("Failed to get None KYC list: ", err);
      },
      // enabled: false,
      refetchInterval: 30000, // Fetches data every 30 seconds
  });
  dispatch(setKYCNone(allKYCNoneQueryRes.data));
  console.log("allKYCNoneQueryRes.data : ", allKYCNoneQueryRes.data);


  if(allKYCStatsQueryRes?.data) {

    infoData[0][0][0].value.text = `${(allKYCStatsQueryRes?.data?.customers?.today_completed_reg_users_count?.toLocaleString('fr-FR') ?? 0)}`;
    infoData[0][1][0].value.text = `${(allKYCStatsQueryRes?.data?.customers?.overall_completed_reg_users_count?.toLocaleString('fr-FR') ?? 0)} / ${(allKYCStatsQueryRes?.data?.customers?.overall_reg_users_count?.toLocaleString('fr-FR') ?? 0)}`;
    
    infoData[1][0][0].value.text = `${(allKYCStatsQueryRes?.data?.transactions?.standbypayout?.todayTotal?.todayTotalAmount?.toLocaleString('fr-FR') ?? 0)} XAF`;
    infoData[1][1][0].value.text = `${(allKYCStatsQueryRes?.data?.transactions?.standbypayout?.avgTotal?.totalAmount?.toLocaleString('fr-FR') ?? 0)} XAF`;

    infoData[2][0][0].value.text = `${(allKYCStatsQueryRes?.data?.transactions?.standbyrelease?.todayTotal?.todayTotalAmount?.toLocaleString('fr-FR') ?? 0)} XAF`;
    infoData[2][1][0].value.text = `${(allKYCStatsQueryRes?.data?.transactions?.standbyrelease?.avgTotal?.totalAmount?.toLocaleString('fr-FR') ?? 0)} XAF`;
    
  }

	return (
		<Layout
		title={"Régularisations"}
		>
			<>
			<section className="px-2">
        <div className='mb-10 grid lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-1' style={{gap:'20px'}}>
            
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
           
            
        </div>
      </section>
      <section className="my-10">
          <Tabs defaultValue="pending" className="w-full">
            <div className="border-b-1">
            <TabsList className="TabsList">
              <TabsTrigger className="TabsTrigger" value="pending">Vérifiés</TabsTrigger>
              <TabsTrigger className="TabsTrigger" value="accepted">{`En file d'attente`}</TabsTrigger>
              <TabsTrigger className="TabsTrigger" value="declined">En cours de traitement</TabsTrigger>
              <TabsTrigger className="TabsTrigger" value="none">Payés</TabsTrigger>
              <TabsTrigger className="TabsTrigger" value="all">Tous</TabsTrigger>              
            </TabsList>
            </div>
            <div className={`mt-5`}>
              <TabsContent value="all">
                <KYCAll
                isLoading={allKYCQueryRes.status == 'loading'}
                search={searchKYC}
						    setSearch={setSearchKYC}
                filter={filterKYC}
						    setFilter={setFilterKYC}
                />
              </TabsContent>
              <TabsContent value="accepted">
                <KYCAccepted
                isLoading={allKYCAcceptedQueryRes.status == 'loading'}
                search={searchKYCAccepted}
						    setSearch={setSearchKYCAccepted}
                filter={filterKYCAccepted}
						    setFilter={setFilterKYCAccepted}
                />
              </TabsContent>
              <TabsContent value="declined">
                <KYCDeclined
                isLoading={allKYCDeclinedQueryRes.status == 'loading'}
                search={searchKYCDeclined}
						    setSearch={setSearchKYCDeclined}
                filter={filterKYCDeclined}
						    setFilter={setFilterKYCDeclined}
                />
              </TabsContent>
              <TabsContent value="pending">
                <KYCPending
                isLoading={allKYCPendingQueryRes.status == 'loading'}
                search={searchKYCPending}
						    setSearch={setSearchKYCPending}
                filter={filterKYCPending}
						    setFilter={setFilterKYCPending}
                />
              </TabsContent>
              <TabsContent value="none">
                <KYCNone
                isLoading={allKYCNoneQueryRes.status == 'loading'}
                search={searchKYCNone}
						    setSearch={setSearchKYCNone}
                filter={filterKYCNone}
						    setFilter={setFilterKYCNone}
                />
  KYC          </TabsContent>
            </div>
          </Tabs>
      	{/* <Tabs defaultValue="Dossiers KYC" className="w-full">
					<div className="flex justify-between items-center mt-3 w-full">
						<TabsComponent data={['Dossiers KYC', 'KYC vérifiés', 'KYC approuvés', 'KYC rejetés', 'KYC en attente']} />
						<CButton
							text={'Filtrer par'}
							icon={<HiOutlineFilter/>}
							btnStyle={'green'}
							height={'32px'}
						/>
					</div>
					<TabsContent value="Dossiers KYC">
						<DosiersKYC />
					</TabsContent>
				</Tabs> */}
    </section>
			</>
	  </Layout>
	);
}

