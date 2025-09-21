"use client";
import urls from "@/config/urls";
import { selectCurrentUser } from "@/redux/slices/auth";
import { hasPermission } from "@/utils/permissions";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";

interface ICartesCard {
	cardNumber: string;
	type: string;
	matricule: string;
	date: string;
	solde: string | number;
	soldeUSD: string | number;
	status: string;
	activateDate: string;
	title?: string;
	expanded?: boolean;
	nbPayments?: string | number;
	nbPaymentsSuccess?: string | number;
	nbPaymentsFailed?: string | number;
	totalRecharges?: string | number;
	totalPayments?: string | number;
	totalRetraits?: string | number;
	averagePaymentAmountPerWeek?: string | number;
	color?: string;
	index?: number;
	card?: any;
	customer?: any;
}

const CartesCardV2 = ({
	cardNumber,
	type,
	matricule,
	date,
	solde,
	soldeUSD,
	status,
	activateDate,
	title,
	expanded,
	nbPayments,
	nbPaymentsSuccess,
	nbPaymentsFailed,
	totalRecharges,
	totalPayments,
	totalRetraits,
	averagePaymentAmountPerWeek,
	color,
	index,
	card,
	customer,
}: ICartesCard) => {
	const router = useRouter();
	const currentUser = useSelector(selectCurrentUser);
	return (
		<div className="flex flex-col justify-start items-start gap-3">
			{/* <h1 className="text-base font-semibold tracking-tight">{title ?? `Carte ${index}`}</h1> */}

			<div
				style={{ background: `#${color ?? "FFDB5A"}` }}
				className={`px-3 py-3 bg-[#FFDB5A] outline-none border-none shadow-sm 
      flex justify-center items-center rounded-2xl w-full`}
			>
				<h1 className="text-lg font-bold tracking-wide">
					<span className="flex flex-wrap items-center gap-2">
						{card.masked_number}
						{/* {cardNumber?.slice(0, 4)?.trim()}
						{[1, 1].map((item, idx) => (
							<span key={idx} className="flex h-5 items-center">
								{[1, 1, 1, 1].map((si, sidx) => (
									<GoDotFill key={sidx} size={10} />
								))}
							</span>
						))}
						{cardNumber?.slice(12)?.trim()} */}
					</span>
				</h1>
			</div>
			{/* <div className="flex justify-between items-center w-full mb-2"> */}
			<div className="grid grid-cols-2 gap-x-3 gap-y-1">
				<h1
					style={{ whiteSpace: "nowrap" }}
					className="text-sm font-semibold text-left tracking-tight"
				>
					Type
				</h1>
				<span
					style={{ whiteSpace: "nowrap" }}
					className="text-sm font-[400] tracking-tighter"
				>
					{type}
				</span>

				<h1
					style={{ whiteSpace: "nowrap" }}
					className="text-sm font-semibold text-left tracking-tight"
				>
					Id Carte Fournisseur
				</h1>
				<span className="text-sm font-[400] tracking-tighter">
					{card.provider_card_id}
				</span>

				<h1
					style={{ whiteSpace: "nowrap" }}
					className="text-sm font-semibold text-left tracking-tight"
				>
					Reference
				</h1>
				<span className="text-sm font-[400] tracking-tighter">
					{card.reference}
				</span>

				<h1
					style={{ whiteSpace: "nowrap" }}
					className="text-sm font-semibold text-left tracking-tight"
				>
					Créé le
				</h1>
				<span
					style={{ whiteSpace: "nowrap" }}
					className="text-sm font-[400] tracking-tighter"
				>
					{date}
				</span>

				<h1
					style={{ whiteSpace: "nowrap" }}
					className="text-sm font-semibold text-left tracking-tight"
				>
					Solde
				</h1>
				<span
					style={{ whiteSpace: "nowrap" }}
					className="text-sm font-[400] tracking-tighter"
				>
					{solde}
				</span>

				<h1
					style={{ whiteSpace: "nowrap" }}
					className="text-sm font-semibold text-left tracking-tight"
				>
					Solde USD
				</h1>
				<span
					style={{ whiteSpace: "nowrap" }}
					className="text-sm font-[400] tracking-tighter"
				>
					{soldeUSD}
				</span>

				<h1
					style={{ whiteSpace: "nowrap" }}
					className="text-sm font-semibold text-left tracking-tight"
				>
					Statut
				</h1>
				<span
					style={{
						whiteSpace: "nowrap",
						color:
							status === "TERMINATED"
								? "#F85D4B"
								: status === "FREEZE" || status === "DISABLED"
								? "gray"
								: "#1F66FF",
					}}
					className="text-sm font-[400] tracking-tighter"
				>
					{status}
				</span>

				<h1
					style={{ whiteSpace: "nowrap" }}
					className="text-sm font-semibold text-left tracking-tight"
				>
					Expire le
				</h1>
				<span
					style={{ whiteSpace: "nowrap" }}
					className="text-sm font-[400] tracking-tighter"
				>
					{card.expired_at}
				</span>

				{/* <h1 style={{whiteSpace:'nowrap'}} className="text-sm font-semibold text-left tracking-tight">Fournisseur</h1>
          <span style={{whiteSpace:'nowrap'}} className="text-sm font-[400] tracking-tighter">{card.provider ? String(card.provider).toUpperCase() : 'MAPLERAD'}</span>           */}

				<h1
					style={{ whiteSpace: "nowrap" }}
					className="text-sm font-semibold text-left tracking-tight"
				>
					A/N
				</h1>
				<span
					style={{
						whiteSpace: "nowrap",
						color: card.is_from_v1 ? "gray" : "#1F66FF",
					}}
					className="text-sm font-[400] tracking-tighter"
				>
					{card.is_from_v1 ? "Ancien" : "Nouveau"}
				</span>

				<h1
					style={{ whiteSpace: "nowrap" }}
					className="text-sm font-semibold text-left tracking-tight"
				>
					Visible
				</h1>
				<span
					style={{
						whiteSpace: "nowrap",
						color: !card.is_active ? "gray" : "#1F66FF",
					}}
					className="text-sm font-[400] tracking-tighter"
				>
					{!card.is_active ? "Non" : "Oui"}
				</span>
				<h1
					style={{ whiteSpace: "nowrap" }}
					className="text-sm font-semibold text-left tracking-tight"
				>
					Fournisseur
				</h1>
				<span
					style={{
						whiteSpace: "nowrap",
						color: "gray",
					}}
					className="text-sm font-[400] tracking-tighter"
				>
					{card.provider?.toUpperCase()?.slice(0, 1)?.trim()}
				</span>

				{/* <h1 style={{whiteSpace:'nowrap'}} className="text-sm font-semibold text-left tracking-tight">Dernière activité</h1>
          <span style={{whiteSpace:'nowrap'}} className="text-sm font-[400] tracking-tighter">{activateDate}</span>             */}
			</div>

			{hasPermission(currentUser, "home:cards", "edit") ? (
				<>
					<div className="grid grid-cols-2 gap-3 w-full">
						<div className="col-span-2">
							{/* <CButton
            text={'Recharger'}
            href={`?rechargeCard${index}=true`}
            btnStyle={'dark'}
            icon={<FourDots />}
            width={'100%'}
          />
          <Modal name={`rechargeCard${index}`} modalContent={<RechargeWithdrawCardBalanceModalForm index={index} card={card} customer={customer}/>}/> */}
						</div>
						<div className="col-span-2">
							{/* <CButton
            text={'Retirer'}
            href={`?withdrawCard${index}=true`}
            btnStyle={'dark'}
            icon={<FourDots />}                    
            width={'100%'}
          />
          <Modal name={`withdrawCard${index}`} modalContent={<RechargeWithdrawCardBalanceModalForm index={index} card={card} customer={customer}/>}/> */}
						</div>
						{card?.status === "ACTIVE" ? (
							<div className="col-span-2">
								{/* <CButton
            text={'Bloquer'}
            href={`?freezeCard${index}=true`}
            btnStyle={'dark'}
            icon={<FourDots />}                    
            width={'100%'}
          />
          <Modal name={`freezeCard${index}`} modalContent={<BlockCardModalForm index={index} card={card} customer={customer}/>}/> */}
							</div>
						) : card?.status === "FREEZE" ? (
							<div className="col-span-2">
								{/* <CButton
            text={'Débloquer'}
            href={`?unfreezeCard${index}=true`}
            btnStyle={'dark'}
            icon={<FourDots />}                    
            width={'100%'}
          />
          <Modal name={`unfreezeCard${index}`} modalContent={<UnblockCardModalForm index={index} card={card} customer={customer}/>}/> */}
							</div>
						) : (
							<></>
						)}
						{/* <div className="col-span-2">
          <CButton
            text={'Supprimer'}
            href={`#`}
            btnStyle={'dark'}
            icon={<FourDots />}                    
            width={'100%'}
          />
          </div> */}
						<div className="col-span-2">
							{!expanded ? (
								<>
									{/* <CButton
              text={'Voir transactions'}
              // href={`?cardTransactions${index}=true`}
              href={`${urls.cards.manage}/${card?._id}`}
              btnStyle={'dark'}
              icon={<FourDots />}
              width={'100%'}            
            /> */}
									{/* <Modal name={`cardTransactions${index}`} modalContent={<CardTransactionsModal index={index} card={card} customer={customer}/>}/> */}
								</>
							) : (
								<></>
							)}
						</div>
						{/* {[1, 2, 3, 4].map((_, idx) => (
            <Button key={idx} id={idx.toString()} type="button" className="text-sm text-gray-300 rounded-full w-[109px]" asChild>
              <Link href="#">
                <PiCirclesFourFill color="white" size={24} className="mr-1" />Bloquer
              </Link>
            </Button>
          ))}
          <Button type="button" className="text-sm text-gray-300 rounded-full px-6" asChild>
            <Link href="#">
              <PiCirclesFourFill color="white" size={24} className="mr-4" />Bloquer
            </Link>
          </Button> */}
					</div>
					{expanded ? (
						<>
							<div className={`my-3`}>
								<div className="text-sm font-semibold">
									Propriétaire de la carte
								</div>
								<Link
									href={`${urls.users.manage}/${customer?._id}`}
									className="hover:text-[#18BC7A] "
								>
									<div
										onClick={() =>
											router.push(
												`${urls.users.manage}/${customer?._id}`
											)
										}
										className="text-md cursor-pointer font-normal "
									>
										{customer?.name}
									</div>
									<div
										onClick={() =>
											router.push(
												`${urls.users.manage}/${customer?._id}`
											)
										}
										className="text-sm cursor-pointer font-normal "
									>
										{customer?.email}
									</div>
									<div
										onClick={() =>
											router.push(
												`${urls.users.manage}/${customer?._id}`
											)
										}
										className="text-sm cursor-pointer font-normal "
									>
										{customer?.phone}
									</div>
								</Link>
							</div>

							{/* <div>
        <div className="text-sm font-semibold">Nombre de paiements</div>
        <div className="text-xl text-[#18BC7A] font-semibold ">{nbPayments}</div>
        </div>
        <div className="flex items-center gap-3 w-full my-2">
          <p title="Actives" className=" flex items-center gap-3 text-sm font-normal">
            <MdCheckCircle size={22} color="#1F66FF"/>
            <span className="ml-1 font-bold">{nbPaymentsSuccess}</span>
          </p>
          <p title="Echouées" className=" flex items-center gap-3 text-sm font-normal">
            <IoIosCloseCircle size={22} color="#F85D4B"/>
            <span className="ml-1 font-bold">{nbPaymentsFailed}</span>
          </p> */}

							{/* <p className="text-xs font-normal">
            Bloquées 
            <span className=" text-[#444] ml-1 font-bold">2</span></p>
          <p className="text-xs font-normal">
            Supprimées 
            <span className=" text-[#F85D4B] ml-1 font-bold">3</span></p> */}

							{/* </div>
        <div>
          <h1 className="text-sm font-semibold ">Moyenne paiements par semaine</h1>
          <h1 className="text-xl text-[#18BC7A] font-semibold mb-3">{averagePaymentAmountPerWeek?.toLocaleString('fr-FR')} XAF /sem</h1>
        </div>
        <div>
          <h1 className="text-sm font-semibold ">Total Paiements réussis</h1>
          <h1 className="text-xl text-[#18BC7A] font-semibold mb-3">{totalPayments?.toLocaleString('fr-FR')} XAF</h1>
        </div>
        <div>
          <h1 className="text-sm font-semibold ">Total Retraits réussis</h1>
          <h1 className="text-xl text-[#18BC7A] font-semibold mb-3">{totalRetraits?.toLocaleString('fr-FR')} XAF</h1>
        </div>
        <div>
          <h1 className="text-sm font-semibold ">Total Recharges réussies</h1>
          <h1 className="text-xl text-[#18BC7A] font-semibold mb-3">{totalRecharges?.toLocaleString('fr-FR')} XAF</h1>
        </div> */}
						</>
					) : (
						<></>
					)}
				</>
			) : (
				<></>
			)}
		</div>
	);
};

export default CartesCardV2;
