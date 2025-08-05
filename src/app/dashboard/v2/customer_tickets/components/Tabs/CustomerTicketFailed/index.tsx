import CButton from "@/components/shared/CButton";
import CustomTable from "@/components/shared/CustomTable";
import LabelWithBadge from "@/components/shared/LabelWithBadge";
import { FourDots } from "@/components/shared/icons";
import { headerCustomerTicketDataV2 } from "@/constants/CustomerTicketData";
import { selectCustomerTicketFailed } from "@/redux/slices_v2/customerticket";
import { getFormattedDateTime } from "@/utils/DateFormat";
import { usePathname } from "next/navigation";
import { useSelector } from "react-redux";
type Props = {
	isLoading?:boolean;
	search?:string; 
	setSearch?:(data?:any)=>void;
}
export default function Index({isLoading, search, setSearch}:Props) {
	const pathname = usePathname();
	const trxAll:any = useSelector(selectCustomerTicketFailed);

  	const rearrangedTableData = trxAll?.map((item:any, index:any) => {
		const rearrangedItem = {
			serial: index+1,
			reference: item.reference,
			resp: item.technical_support_name,
			title: item.title,
			category: item.category_name,
			user_phone: item.user_phone,
			user_email: item.user_email,
			priority: 
				item.priority == '1'?
				<LabelWithBadge className={`text-xs`} label={'Faible'} badgeColor={'#964B00'} textColor={'#444'}/>
				:
				item.priority == '2' ?
				<LabelWithBadge className={`text-xs`} label={'Moyen'} badgeColor={'#007FFF'} textColor={'#444'}/>
				:
				item.priority == '3' ?
				<LabelWithBadge className={`text-xs`} label={'Elevé'} badgeColor={'#18BC7A'} textColor={'#444'}/>
				:
				item.priority == '4' ?
				<LabelWithBadge className={`text-xs`} label={'Urgent'} badgeColor={'#F85D4B'} textColor={'#444'}/>
				:
				<></>
			,	
			status: 
				item.status == 'SUCCESS'?
				<LabelWithBadge className={`text-xs`} label={'Résolu'} badgeColor={'#18BC7A'} textColor={'#444'}/>
				:
				item.status == 'FAILED' ?
				<LabelWithBadge className={`text-xs`} label={'Fermé'} badgeColor={'#F85D4B'} textColor={'#444'}/>
				:
				item.status == 'ONGOING' ?
				<LabelWithBadge className={`text-xs`} label={'En cours'} badgeColor={'#007FFF'} textColor={'#444'}/>
				:
				item.status == 'PENDING' ?
				<LabelWithBadge className={`text-xs`} label={'En attente'} badgeColor={'#FFDB5A'} textColor={'#444'}/>
				:
				<></>
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
        headerData={headerCustomerTicketDataV2}
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
