import ActiveYesNo from "@/components/shared/ActiveYesNo";
import CButton from "@/components/shared/CButton";
import CustomTable from "@/components/shared/CustomTable";
import LabelWithBadge from "@/components/shared/LabelWithBadge";
import { FourDots } from "@/components/shared/icons";
import {
	headerKYCData,
	tableKYCData as data,
	headerRegularisationDataV2,
} from "@/constants/KYCData";
import { getFormattedDateTime } from "@/utils/DateFormat";
import { useSelector } from "react-redux";
import urlsV2 from "@/config/urls_v2";
import { selectKYCDeclined } from "@/redux/slices_v2/kyc";

type Props = {
	isLoading?: boolean;
	search?: string;
	setSearch?: (data?: any) => void;
	filter?: string;
	setFilter?: (data?: any) => void;
};
export default function Index({
	isLoading,
	search,
	setSearch,
	filter,
	setFilter,
}: Props) {
	const kycAll: any = useSelector(selectKYCDeclined);

	const rearrangedTableData = kycAll?.map((item: any, index: any) => {
		const rearrangedItem = {
			serial: index + 1,
			name: `${item.first_name} ${item.last_name}`,
			country: item.country,
			phone: item.phone,
			email: item.email,
			oldNew: item.is_from_v1 ? (
				<LabelWithBadge label="Ancien" badgeColor="#000" />
			) : (
				<LabelWithBadge label="Nouveau" badgeColor="#1F66FF" />
			),
			status: item.regularisation_status,
			method: item.regularisation_method,
			amount: item.old_balance_xaf,
			// item.kyc_result == 'APPROVED'
			// ?<LabelWithBadge label="Approuvé" badgeColor="#1F66FF"/>
			// :item.kyc_result == 'DECLINED'
			// ?<LabelWithBadge label="Refusé" badgeColor="#F85D4B"/>
			// :item.kyc_status == 'PENDING'
			// ?<LabelWithBadge label="En cours" badgeColor="#999"/>
			// :<LabelWithBadge label="Aucun" badgeColor="#000"/>,
			created: getFormattedDateTime(item.created_at),
			actions: (
				<>
					<div className="flex gap-5">
						<CButton
							text={"Manager"}
							href={`${urlsV2.usersAccounts.manage}/${item.id}`}
							btnStyle={"dark"}
							icon={<FourDots />}
						/>
						{/* <CButton 
			  text={'Editer'}
			  href={`kyc/edit/${item.id}`}
			  btnStyle={'dark'}
			  icon={<FourDots />} 
			  />
			  <CButton 
			  text={'Valider'} 
			  btnStyle={'yellow'}
			  icon={<FaLock />} 
			  />
			  <CButton 
			  text={'Rejeter'} 
			  btnStyle={'yellow'}
			  icon={<FaLock />} 
			  /> */}
					</div>
				</>
			),
		};
		item = rearrangedItem;
		return item;
	});

	return (
		<section>
			<CustomTable
				headerData={headerRegularisationDataV2}
				tableData={rearrangedTableData}
				filter
				threeButtons
				isLoading={isLoading && !kycAll}
				search={search}
				setSearch={setSearch}
				filterType={"regularisation"}
				filterContent={filter}
				setFilterContent={setFilter}
			/>
		</section>
	);
}
