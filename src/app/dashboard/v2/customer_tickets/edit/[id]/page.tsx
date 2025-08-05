"use client"
import Layout from '@/components/shared/Layout';
import Title from '@/components/shared/Title';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form"
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Image from 'next/image';
import { FaLock, FaX } from 'react-icons/fa6';
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { chnpaymentSchema } from "@/validation/FormValidation";
import ActiveYesNo from '@/components/shared/ActiveYesNo';
import LabelWithBadge from '@/components/shared/LabelWithBadge';
import { FaCheck } from 'react-icons/fa';
import CButton from '@/components/shared/CButton';
import { ChinpayService } from '@/api/services/v2/chinpay';
import { useTitle } from '@/hooks/useTitle';
import { useParams, useRouter } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import { useQuery } from 'react-query';
import toast from 'react-hot-toast';
import { getFormattedDateTime } from '@/utils/DateFormat';
import { useState } from 'react';
import { setCurrentCustomerTicket } from '@/redux/slices_v2/customerticket';
import Index from './components';
import { CustomerTicketService } from '@/api/services/v2/customerticket';


const getOneCustomerTicket = async ({queryKey}:any) => {
  const [_key, id] = queryKey;
  // console.log("getCustomers searchTerm : ", st, queryKey);
  
  const response = await CustomerTicketService.get_one_customer_ticket(id);
  const responseJson = await response.json();
  if (!response.ok) {
    throw new Error(responseJson.message || 'Failed to get user ' + id); 
  }  
  return responseJson.data; 
};

export default function Edit() {
  useTitle("Sekure | Requetes Clients", true);  
  const {id} = useParams();
  const dispatch = useDispatch();
  const router = useRouter();

  const cTicketQueryRes = useQuery({
    queryKey: ["cTicket", id],
    queryFn: getOneCustomerTicket,
    onError: (err) => {
      toast.error("Failed to get cTicket : "+id);
    },
    // enabled: false,
    // refetchInterval: 50000, // Fetches data every 60 seconds
  });
  dispatch(setCurrentCustomerTicket(cTicketQueryRes.data));
  console.log("cTicketQueryRes.data : ", cTicketQueryRes.data);  

  
  return (
    <Layout
      title={"Details Requete Client"}
      backLink={'/dashboard/v2/customer_tickets'}
    >
      {cTicketQueryRes.data ?
      <Index/>
      : 
        <div className="flex justify-center w-full py-10">
            <div className={'loadingSpinner'}></div>
        </div>
      }
    </Layout>
  )
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
