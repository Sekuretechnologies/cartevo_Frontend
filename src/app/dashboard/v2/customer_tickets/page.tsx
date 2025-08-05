"use client"

import Layout from "@/components/shared/Layout";
// import TabsComponent from "@/components/shared/TabsComponent";
import CButton from "@/components/shared/CButton";
import { FaFilter, FaPlus } from "react-icons/fa";
import { HiOutlineFilter } from "react-icons/hi";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import  CustomerTicketAll from "./components/Tabs/CustomerTicketAll";
import  CustomerTicketSuccess from "./components/Tabs/CustomerTicketSuccess";
import  CustomerTicketFailed from "./components/Tabs/CustomerTicketFailed";
import  CustomerTicketPending from "./components/Tabs/CustomerTicketPending";
import  CustomerTicketOngoing from "./components/Tabs/CustomerTicketOngoing ";
import InfoCard, { TDataList } from "@/components/cards/InfoCard";
import { checkCircleIcon, haltCircleIcon, stopIcon, folderIcon, ongoingCircleIcon, verifiedIcon, waitCircleIcon } from "@/constants/icons";
import { UserService } from "@/api/services/user";
import { useTitle } from "@/hooks/useTitle";
import { useDispatch, useSelector } from "react-redux";
import { useQuery } from "react-query";
import toast from "react-hot-toast";
import { setCustomerTicketAll, setCustomerTicketPending, setCustomerTicketFailed, setCustomerTicketSuccess, setCustomerTicketOngoing } from "@/redux/slices_v2/customerticket";
import { selectSearchTerm } from "@/redux/slices/search";
import { useState } from "react";
import { CustomerService } from "@/api/services/v2/customer";
import { ChinpayService } from "@/api/services/v2/chinpay";
import { CustomerTicketService } from "@/api/services/v2/customerticket";
import { usePathname } from "next/navigation";



const getAllCustomerTickets = async ({queryKey}:any) => {
  const [_key, filter, st] = queryKey;
  let params:any = {};
  if(st) params.searchTerm = st;
  if(filter?.status) params.status = filter?.status;

  const response = await CustomerTicketService.get_all_customer_tickets(params);
  const responseJson = await response.json();
  if (!response.ok) {
    throw new Error(responseJson.message || 'Failed to get users'); 
  } 
  return responseJson.data; 
};

// const getKYCStats = async () => {
//   const response = await CustomerService.get_kyc_stats();
//   const responseJson = await response.json();
//   if (!response.ok) {
//     throw new Error(responseJson.message || 'Failed to get users statistics'); 
//   }
//   // console.log("getKYCStats.data : ", responseJson.data);
//   return responseJson.data; 
// };

export default function CustomerTickets() {
  useTitle("Requêtes Clients", true);

  const pathname = usePathname();

  const [searchCustomerTicket, setSearchCustomerTicket] = useState('');
	const [searchCustomerTicketSuccess, setSearchCustomerTicketSuccess] = useState('');
	const [searchCustomerTicketPending, setSearchCustomerTicketPending] = useState('');
  const [searchCustomerTicketOngoing, setSearchCustomerTicketOngoing] = useState('');
	const [searchCustomerTicketFailed, setSearchCustomerTicketFailed] = useState('');
  
	const dispatch = useDispatch();
	const searchTerm:string = useSelector(selectSearchTerm);

	// const allKYCStatsQueryRes = useQuery({
  //     queryKey: ["allKYCStats"],
  //     queryFn: getKYCStats,
  //     onError: (err) => {
  //       toast.error("Failed to get KYC stats.");
  //       console.log("Failed to get KYC stats : ", err);
  //     },
  //     refetchInterval: 30000, // Fetches data every 30 seconds
  // });


  const allCustomerTicketQueryRes = useQuery({
      queryKey: ["allCustomerTickets", {}, searchCustomerTicket],
      queryFn: getAllCustomerTickets,
      onError: (err) => {
        toast.error("Failed to get CustomerTicket.");
        console.log("Failed to get CustomerTicket : ", err);
      },
      // enabled: false,
      refetchInterval: 30000, // Fetches data every 30 seconds
  });
  dispatch(setCustomerTicketAll(allCustomerTicketQueryRes.data));
  console.log("allCustomerTicketQueryRes.data : ", allCustomerTicketQueryRes.data);


  const allCustomerTicketSuccessQueryRes = useQuery({
      queryKey: ["allCustomerTicketSuccess", {status:'SUCCESS'}, searchCustomerTicketSuccess],
      queryFn: getAllCustomerTickets,
      onError: (err) => {
        toast.error("Failed to get Accepted KYC list.");
        console.log("Failed to get Accepted KYC list: ", err);
      },
      // enabled: false,
      refetchInterval: 30000, // Fetches data every 30 seconds
  });
  dispatch(setCustomerTicketSuccess(allCustomerTicketSuccessQueryRes.data));
  console.log("allCustomerTicketSuccessQueryRes.data : ", allCustomerTicketSuccessQueryRes.data);
  

  const allCustomerTicketPendingQueryRes = useQuery({
      queryKey: ["allCustomerTicketPending", {status:'PENDING'}, searchCustomerTicketPending],
      queryFn: getAllCustomerTickets,
      onError: (err) => {
        toast.error("Failed to get Pending CustomerTicket list.");
        console.log("Failed to get Pending CustomerTicket list: ", err);
      },
      // enabled: false,
      refetchInterval: 30000, // Fetches data every 30 seconds
  });
  dispatch(setCustomerTicketPending(allCustomerTicketPendingQueryRes.data));
  console.log("allCustomerTicketPendingQueryRes.data : ", allCustomerTicketPendingQueryRes.data);


  const allCustomerTicketOngoingQueryRes = useQuery({
      queryKey: ["allCustomerTicketOngoing", {status:'ONGOING'}, searchCustomerTicketOngoing],
      queryFn: getAllCustomerTickets,
      onError: (err) => {
        toast.error("Failed to get Ongoing CustomerTicket list.");
        console.log("Failed to get Ongoing CustomerTicket list: ", err);
      },
      // enabled: false,
      refetchInterval: 30000, // Fetches data every 30 seconds
  });
  dispatch(setCustomerTicketOngoing(allCustomerTicketOngoingQueryRes.data));
  console.log("allCustomerTicketOngoingQueryRes.data : ", allCustomerTicketOngoingQueryRes.data);



  const allCustomerTicketFailedQueryRes = useQuery({
      queryKey: ["allCustomerTicketFailed", {status:'FAILED'}, searchCustomerTicketFailed],
      queryFn: getAllCustomerTickets,
      onError: (err) => {
        toast.error("Failed to get Failed CustomerTicket list.");
        console.log("Failed to get Failed CustomerTicket list: ", err);
      },
      // enabled: false,
      refetchInterval: 30000, // Fetches data every 30 seconds
  });
  dispatch(setCustomerTicketFailed(allCustomerTicketFailedQueryRes.data));
  console.log("allCustomerTicketFailedQueryRes.data : ", allCustomerTicketFailedQueryRes.data);

	return (
		<Layout
		title={"Requêtes Clients"}
		>
			<>
			<section className="px-2">
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
      <section className="my-10">
        <div className="my-5 flex justify-end items-center">
            <CButton 
            text={`Ajouter un ticket`} 
            btnStyle={"lightGreen"}
            href={`${pathname}/create`}
            // onClick={()=>handleCheckPartnerTransaction(item?.id)}                    
            icon={<FaPlus/>}
            width={'150px'}
            height={"35px"}
            />
        </div>
          <Tabs defaultValue="pending" className="w-full">
            <div className="border-b-1">
            <TabsList className="TabsList">
              <TabsTrigger className="TabsTrigger" value="pending">En attente</TabsTrigger>
              <TabsTrigger className="TabsTrigger" value="ongoing">En cours de traitement</TabsTrigger>
              <TabsTrigger className="TabsTrigger" value="success">Résolus</TabsTrigger>
              <TabsTrigger className="TabsTrigger" value="failed">Fermés</TabsTrigger>
              <TabsTrigger className="TabsTrigger" value="all">Tous</TabsTrigger>              
            </TabsList>
            </div>
            <div className={`mt-5`}>
              <TabsContent value="all">
                <CustomerTicketAll
                isLoading={allCustomerTicketQueryRes.status == 'loading'}
                search={searchCustomerTicket}
						    setSearch={setSearchCustomerTicket}
                />
              </TabsContent>
              <TabsContent value="success">
                <CustomerTicketSuccess
                isLoading={allCustomerTicketSuccessQueryRes.status == 'loading'}
                search={searchCustomerTicketSuccess}
						    setSearch={setSearchCustomerTicketSuccess}
                />
              </TabsContent>
              <TabsContent value="failed">
                <CustomerTicketFailed
                isLoading={allCustomerTicketFailedQueryRes.status == 'loading'}
                search={searchCustomerTicketFailed}
						    setSearch={setSearchCustomerTicketFailed}
                />
              </TabsContent>
              <TabsContent value="pending">
                <CustomerTicketPending
                isLoading={allCustomerTicketPendingQueryRes.status == 'loading'}
                search={searchCustomerTicketPending}
						    setSearch={setSearchCustomerTicketPending}
                />
              </TabsContent>
              <TabsContent value="ongoing">
                <CustomerTicketOngoing
                isLoading={allCustomerTicketOngoingQueryRes.status == 'loading'}
                search={searchCustomerTicketOngoing}
						    setSearch={setSearchCustomerTicketOngoing}
                />
              </TabsContent>
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

