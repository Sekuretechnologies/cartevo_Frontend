import { MdCheckCircle, MdChangeCircle, MdRemoveCircle } from "react-icons/md";
import { IoIosCloseCircle } from "react-icons/io";
import { IoEllipsisHorizontalCircleSharp } from "react-icons/io5";
import { BiTransferAlt } from "react-icons/bi";
import { MdOutlinePhoneIphone } from "react-icons/md";
import { MdAttachMoney } from "react-icons/md";
import { FaFolder, FaLock, FaRegCalendarCheck } from "react-icons/fa";
import { GrTransaction } from "react-icons/gr";
import { BsFillBookmarkCheckFill } from "react-icons/bs";
import { FaRegCreditCard } from "react-icons/fa6";
import { TbSum } from "react-icons/tb";
import { AiOutlineStop } from "react-icons/ai";
// import { PiHandWithdraw } from "react-icons/pi";
// import { PiHandDeposit } from "react-icons/pi";

export const checkCircleIcon = <MdCheckCircle size={24} color={"#1F66FF"} />;
export const folderIcon = <FaFolder size={24} color={"#777"} />;
export const stopIcon = <AiOutlineStop size={24} color={"#777"} />;
export const lockedIcon = <FaLock size={20} color={"#777"} />;
export const verifiedIcon = (
	<BsFillBookmarkCheckFill size={20} color={"#777"} />
);
export const ongoingCircleIcon = <MdChangeCircle size={24} color={"#777"} />;
export const waitCircleIcon = (
	<IoEllipsisHorizontalCircleSharp size={24} color={"#777"} />
);
export const haltCircleIcon = <MdRemoveCircle size={24} color={"#F85D4B"} />;
export const haltCircleIconGray = <MdRemoveCircle size={24} color={"#777"} />;
export const closeCircleIcon = <IoIosCloseCircle size={24} color={"#F85D4B"} />;
export const calendarIcon = <FaRegCalendarCheck size={20} color={"#444"} />;
export const creditCardIcon = <FaRegCreditCard size={20} color={"#444"} />;
export const totalIcon = <TbSum size={20} color={"#444"} />;

export const transferIcon = <BiTransferAlt size={24} color={"#444"} />;
export const transferIconToday = (
	<span className="flex gap-1">
		{transferIcon} {calendarIcon}
	</span>
); // aujourd'hui
export const transferIconAvg = (
	<span className="flex gap-1">Moy. {transferIcon}</span>
);
export const transferIconTotal = (
	<span className="flex gap-1">
		{totalIcon} {transferIcon}
	</span>
);

export const mobileMoneyIcon = (
	<span className="relative">
		<MdOutlinePhoneIphone size={24} />
		<span
			style={{
				position: `absolute`,
				top: "3px",
				right: "4px",
				background: "white",
			}}
		>
			<MdAttachMoney size={16} />
		</span>
	</span>
);

export const sekureIcon = (
	<svg
		version="1.0"
		xmlns="http://www.w3.org/2000/svg"
		width="21"
		height="20"
		viewBox="0 0 100.000000 112.000000"
		preserveAspectRatio="xMidYMid meet"
	>
		<g
			transform="translate(0.000000,112.000000) scale(0.050000,-0.050000)"
			fill="#1F66FF"
			stroke="none"
		>
			<path
				d="M710 2093 c-477 -158 -760 -612 -692 -1114 129 -963 1382 -1179 1810
-311 81 163 89 203 37 183 -19 -8 -108 -24 -197 -37 -161 -22 -163 -23 -217
-107 -248 -392 -851 -447 -1159 -107 -590 653 88 1634 878 1272 182 -83 390
-333 390 -468 0 -38 101 -23 230 34 l93 41 -67 125 c-209 394 -716 618 -1106
489z"
			/>
			<path
				d="M600 1761 c-396 -121 -585 -565 -398 -939 291 -582 1110 -413 1189
246 l14 118 -57 -13 c-32 -7 -87 -19 -123 -26 -48 -9 -65 -23 -65 -52 0 -410
-601 -613 -850 -287 -357 469 181 1089 650 750 l83 -61 69 47 c87 59 86 65
-26 137 -148 93 -339 125 -486 80z"
			/>
			<path
				d="M470 1472 c-315 -141 -288 -604 41 -712 270 -89 539 225 431 505 -25
64 -26 64 -103 24 -50 -25 -56 -37 -39 -68 87 -163 -111 -392 -295 -342 -287
77 -233 521 63 521 43 0 92 47 92 89 0 21 -130 9 -190 -17z"
			/>
			<path
				d="M429 1191 c-109 -109 18 -264 138 -170 83 66 33 219 -71 219 -10 0
-40 -22 -67 -49z"
			/>
		</g>
	</svg>
);

export const transferIconMomoToday = (
	<span className="flex gap-1">
		{transferIcon} vers {mobileMoneyIcon} {calendarIcon}
	</span>
);
export const transferIconMomoTotal = (
	<span className="flex gap-1">
		{totalIcon} {transferIcon} vers {mobileMoneyIcon}
	</span>
);

export const transferIconSekureToday = (
	<span className="flex gap-1">
		{transferIcon} vers {sekureIcon} {calendarIcon}
	</span>
);
export const transferIconSekureTotal = (
	<span className="flex gap-1">
		{totalIcon} {transferIcon} vers {sekureIcon}
	</span>
);

export const transactionIcon = <GrTransaction size={20} color={"#444"} />;
// export const depositIcon = <PiHandWithdraw size={24} color={"#444"} />;
// export const withdrawalIcon = <PiHandDeposit size={24} color={"#444"} />;

export const transactionIconToday = (
	<span className="flex gap-1">
		{transactionIcon} {calendarIcon}
	</span>
); // aujourd'hui
export const transactionIconAvg = (
	<span className="flex gap-1">Moy. {transactionIcon}</span>
);
export const transactionIconTotal = (
	<span className="flex gap-1">
		{totalIcon} {transactionIcon}
	</span>
);
export const depositIconToday = (
	<span className="flex gap-1">Recharges {calendarIcon}</span>
); // aujourd'hui
export const withdrawalIconToday = (
	<span className="flex gap-1">Retraits {calendarIcon}</span>
); // aujourd'hui

export const cardDepositIconToday = (
	<span className="flex gap-1">
		Recharges {creditCardIcon} {calendarIcon}
	</span>
); // aujourd'hui
export const cardWithdrawalIconToday = (
	<span className="flex gap-1">
		Retraits {creditCardIcon} {calendarIcon}
	</span>
);
export const cardDepositIconTotal = (
	<span className="flex gap-1">{totalIcon} Recharges</span>
); // aujourd'hui
export const cardWithdrawalIconTotal = (
	<span className="flex gap-1">{totalIcon} Retraits</span>
);

export const paymentIconToday = (
	<span className="flex gap-1">Paiements {calendarIcon}</span>
);
export const paymentIconTotal = (
	<span className="flex gap-1">{totalIcon} Paiements</span>
);
