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
import { selectCurrentChnPayment, setCurrentChnPayment } from '@/redux/slices_v2/chinpay';
import Index from './components';


const getOneChnpayment = async ({queryKey}:any) => {
  const [_key, id] = queryKey;
  // console.log("getCustomers searchTerm : ", st, queryKey);
  
  const response = await ChinpayService.get_one_trx(id);
  const responseJson = await response.json();
  if (!response.ok) {
    throw new Error(responseJson.message || 'Failed to get user ' + id); 
  }  
  return responseJson.data; 
};

export default function Edit() {
  useTitle("Sekure | ChinPay", true);  
  const {id} = useParams();
  const dispatch = useDispatch();
  const router = useRouter();

  const chnPaymentQueryRes = useQuery({
    queryKey: ["chnPayment", id],
    queryFn: getOneChnpayment,
    onError: (err) => {
      toast.error("Failed to get chnPayment : "+id);
    },
    // enabled: false,
    // refetchInterval: 50000, // Fetches data every 60 seconds
  });
  dispatch(setCurrentChnPayment(chnPaymentQueryRes.data));
  console.log("chnPaymentQueryRes.data : ", chnPaymentQueryRes.data);  

  
  return (
    <Layout
      title={"Details paiement chine"}
      backLink={'/dashboard/v2/payment_services/chinpay'}
    >
      {chnPaymentQueryRes.data ?
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
