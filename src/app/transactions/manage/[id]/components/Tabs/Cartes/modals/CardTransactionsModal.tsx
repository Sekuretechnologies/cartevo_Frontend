
import CButton from '@/components/shared/CButton';
import Title from '@/components/shared/Title';
import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import { FaX } from 'react-icons/fa6';
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { loginSchema } from "@/validation/FormValidation";
import { FaChevronRight, FaLongArrowAltDown, FaLongArrowAltUp } from "react-icons/fa";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useMutation, useQuery } from "react-query";
import { HashLoader } from "react-spinners";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { selectCurrentUser, setCredentials } from "@/redux/slices/auth";
import { useRouter } from "next/navigation";
import classNames from "classnames";
import { Textarea } from '@/components/ui/textarea';
import { Autocomplete, Box, Chip, MenuItem, OutlinedInput, TextField } from '@mui/material'; 
import _ from 'lodash';
import { TransactionService } from '@/api/services/transaction';
import { selectCurrentCustomerDetails, setCurrentCustomerDetails } from '@/redux/slices/customer';
import { useRef } from 'react';
import { UserService } from '@/api/services/user';
import { CardService } from '@/api/services/card';
import CustomTable from '@/components/shared/CustomTable';
import { headerTransactionData } from '@/constants/TransactionData';
import Modal from '@/components/shared/Modal/Modal';
import TransactionModal from '../../Transactions/modals/TransactionModal';
import { categoryType, categoryMode, getCategoryMode } from '@/utils/graphs';
import LabelWithBadge from '@/components/shared/LabelWithBadge';
import { getFormattedDateTime } from '@/utils/DateFormat';
import { FourDots } from '@/components/shared/icons';
import { selectSearchTerm } from '@/redux/slices/search';

    
const getCardTransactions = async ({queryKey}:any) => {
    const [_key, cardId, st] = queryKey;
    let params:any = {};
    if(st) params.searchTerm = st;
    if(cardId) params.cardId = cardId;
    // console.log("getCustomers searchTerm : ", st, queryKey);
    
    const response = await CardService.get_card_transactions(params);
    const responseJson = await response.json();
    if (!response.ok) {
      throw new Error(responseJson.message || 'Failed to card transactions'); 
    }
    console.log("responseJson.data : ", responseJson.data);
    return responseJson.data; 
};

interface ModalProps {
    card?:any,
    customer?:any,
    index?:string | number,
}

export default function CardTransactionsModal({index, card, customer}:ModalProps) {
    const pathname = usePathname();
    const redirectRef:any = useRef();

    const searchTerm:string = useSelector(selectSearchTerm);

    const cardTransactionsQueryRes = useQuery({
        queryKey: ["cardTransactions", card?._id, searchTerm],
        queryFn: getCardTransactions,
        onError: (err:any) => {
          toast.error("Failed to get card transactions.");
        },
        // refetchInterval: 30000, // Fetches data every 30 seconds
    });

    console.log("cardTransactionsQueryRes.data : ", cardTransactionsQueryRes.data);    

    // const currentUser = useSelector(selectCurrentUser);
    const customerDetails:any = useSelector(selectCurrentCustomerDetails);

    const rearrangedTableData = cardTransactionsQueryRes?.data?.map((item:any, index:any) => {
	    
    const rearrangedItem = {
        serial: index+1,
        type: categoryType[item.category][item.type],
        name: item.merchant?.name,			
        country: item.country,
        phone: item.number,
                idTrx: item._id,
        amount: item.amount?.toLocaleString('fr-FR') ?? 0,
        method: item.method,
        mode: 
        getCategoryMode(item.category, item.type, item.mode).mode == 'CREDIT'?
        <LabelWithBadge icon={<FaLongArrowAltDown color={'#18BC7A'} />} className={`text-xs`} label={`${getCategoryMode(item.category, item.type, item.mode).text}`} badgeColor={'#18BC7A'} textColor={'#444'}/>
        :
        getCategoryMode(item.category, item.type, item.mode).mode == 'DEBIT'?
        <LabelWithBadge icon={<FaLongArrowAltUp color={'#F85D4B'} />}className={`text-xs`} label={`${getCategoryMode(item.category, item.type, item.mode).text}`} badgeColor={'#F85D4B'} textColor={'#444'}/>
        :
        <>{item.mode}</>
        ,
			status: 
        item.status == 'SUCCESS'?
        <LabelWithBadge className={`text-xs`} label={'Réussi'} badgeColor={'#18BC7A'} textColor={'#444'}/>
        :
        item.status == 'FAILED' ?
        <LabelWithBadge className={`text-xs`} label={'Echec'} badgeColor={'#F85D4B'} textColor={'#444'}/>
        :
        item.status?.toUpperCase() == 'PENDING' ?
        <LabelWithBadge className={`text-xs`} label={'En cours'} badgeColor={'orange'} textColor={'#444'}/>
        :
        item.status == 'INITIATED' ?
        <LabelWithBadge className={`text-xs`} label={'Initial'} badgeColor={'#007FFF'} textColor={'#444'}/>
        :
        (item.status == 'CANCELLED' || item.status == 'CANCELED') ?
        <LabelWithBadge className={`text-xs`} label={'Suspendu'} badgeColor={'#444'} textColor={'#444'}/>
        :
        <></>
        // <LabelWithBadge className={`text-xs`} label={'En cours'} badgeColor={'#000'} textColor={'#000'}/>
        // <ActiveYesNo isActive={item.status} label="Réussi"/>
        // :<ActiveYesNo isActive={item.status} label="Echec"/>
        ,			
        date: getFormattedDateTime(item.createdAt),
        actions: <>
        {/* <div className='flex gap-5'>
          <CButton
          text={'Details'}
          href={`?transaction${index+1}=true`}
          btnStyle={'dark'}
          icon={<FourDots />}              
          />
          <Modal index={index+1} name={'transaction'} modalContent={<TransactionModal customer={customerDetails?.customer} item={item}/>}/>
		</div> */}
		</>
		};
		item = rearrangedItem;
		return item;
	});

   

    return (
    <div className="bg-white m-auto p-8 rounded-md min-w-[350px] max-w-[100vw]">
        <div className="flex justify-between mb-5 gap-10">
            <Title
            title={`Transactions de la carte`}
            titleLine2={`**** **** **** ${card?.number.slice(12).trim()}`}
            />
            {/* {customer.name} */}
            <Link href={pathname}>
                <FaX size={16} color={"#444"}/>
            </Link>
        </div>

        <div className="my-[50px]">
            <div className="mb-5">
                <Title 
                title={"Liste des transactions"}
                />
            </div>
            <CustomTable
            headerData={headerTransactionData}
            tableData={rearrangedTableData}
            isLoading={cardTransactionsQueryRes.status == 'loading'}
            threeButtons
            />
        </div>
        <a ref={redirectRef} hidden href="#"></a>
       
    </div>
  )
}
