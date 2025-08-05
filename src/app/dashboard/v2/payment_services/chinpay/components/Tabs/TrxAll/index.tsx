import CButton from "@/components/shared/CButton";
import CustomTable from "@/components/shared/CustomTable";
import LabelWithBadge from "@/components/shared/LabelWithBadge";
import { FourDots } from "@/components/shared/icons";
import { headerChnPaymentDataV2 } from '@/constants/TransactionData';
import { selectTrxAll } from "@/redux/slices_v2/chinpay";
import { getFormattedDateTime } from "@/utils/DateFormat";
import { getCategoryModeV2, getCategoryTypeV2 } from "@/utils/graphs";
import { usePathname } from "next/navigation";
import { FaLongArrowAltDown, FaLongArrowAltUp } from "react-icons/fa";
import { useSelector } from "react-redux";
type Props = {
	isLoading?:boolean;
	search?:string; 
	setSearch?:(data?:any)=>void;
}
export default function Index({isLoading, search, setSearch}:Props) {
	const pathname = usePathname();
	const trxAll:any = useSelector(selectTrxAll);

  	const rearrangedTableData = trxAll?.map((item:any, index:any) => {
		const rearrangedItem = {
			serial: index+1,
			type: getCategoryTypeV2(item.category, item.type), 
			platform: item.chnpayment?.platform?.name,			
			country: item.user?.country,
			phone: item.user?.phone,
			idTrx: item.trx_ref,
			oldNew: //item.mode, //item.paymentMethod,
				!item.is_from_v1?
				<LabelWithBadge className={`text-xs`} label={`Nouveau`} badgeColor={'#18BC7A'} textColor={'#444'}/>
				:
				<LabelWithBadge className={`text-xs`} label={`Ancien`} badgeColor={'#444'} textColor={'#444'}/>
				
				,
			amount: item.amount_xaf?.toLocaleString('fr-FR') ?? 0,			
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
			date: getFormattedDateTime(item.created_at),
			actions: <>
				<div className='flex gap-5'>
					<CButton
					text={'Manage'}
					href={`${pathname}/edit/${item.id}`}
					btnStyle={'dark'}
					icon={<FourDots />}              
					/>
					{/* <Modal index={index+1} name={'transaction'} modalContent={<TransactionModal customer={customerDetails?.customer} item={item}/>}/> */}
			  	</div>
			</>
		};
		item = rearrangedItem;
		return item;
	});

  return (
    <section>
      <CustomTable
        headerData={headerChnPaymentDataV2}
        tableData={rearrangedTableData}
        filter
		threeButtons
		isLoading={isLoading && !trxAll}
		search={search}
		setSearch={setSearch}
      />
    </section>
  )
}
