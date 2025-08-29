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

export const cartevoIcon = (
	<svg
		width="23"
		height="22"
		viewBox="0 0 1142 1142"
		version="1.1"
		fill-rule="evenodd"
		clip-rule="evenodd"
		stroke-linejoin="round"
		stroke-miterlimit="2"
	>
		<g transform="matrix(1,0,0,1,-47059.6,-11308.2)">
			<g
				id="Plan-de-travail1"
				transform="matrix(0.43884,0,0,0.43884,47113.2,11308.2)"
			>
				<rect
					x="-122"
					y="0"
					width="2602.32"
					height="2602.32"
					fill="none"
				/>
				<g transform="matrix(8.12637,0,0,3.02129,-2109.83,-2622.72)">
					<g>
						<g transform="matrix(0.280412,0,0,0.754225,-3346.55,319.792)">
							<path
								d="M13884.1,1350.66C13861.8,1582.58 13684.1,1769.4 13456.5,1805.75L13375.5,1603.02C13525.2,1603.02 13649.6,1493.75 13673.3,1350.66L13884.1,1350.66ZM13073.6,1301.16L12871.3,1217.16C12911.5,975.034 13122,790.157 13375.5,790.157C13640.8,790.157 13859.2,992.821 13884.1,1251.66L13673.3,1251.66C13649.6,1108.56 13525.2,999.291 13375.5,999.291C13208.9,999.291 13073.6,1134.55 13073.6,1301.16Z"
								fill="rgb(31,102,255)"
							/>
						</g>
						<g transform="matrix(0.319437,0,0,0.859288,-2912.42,124.568)">
							<path
								d="M10453.5,1812.16C10453.5,1812.16 10453.5,1640.64 10453.5,1496.34C10453.5,1388.54 10366.1,1301.16 10258.3,1301.16C10114,1301.16 9942.46,1301.16 9942.46,1301.16C9942.46,1301.16 9942.46,1317.49 9942.46,1340.46L10088.2,1486.17C10123.2,1486.17 10159.3,1486.17 10189.9,1486.17C10210.7,1486.17 10230.7,1494.44 10245.4,1509.17C10260.2,1523.9 10268.5,1543.88 10268.5,1564.7L10268.5,1666.45L10414.2,1812.16C10437.1,1812.16 10453.5,1812.16 10453.5,1812.16Z"
								fill="rgb(0,207,217)"
							/>
						</g>
					</g>
				</g>
			</g>
		</g>
	</svg>
);

export const cartevoIconName = (
	<svg
		width="160px"
		height="37px"
		viewBox="0 0 4760 1142"
		version="1.1"
		xmlns="http://www.w3.org/2000/svg"
		fill-rule="evenodd"
		clip-rule="evenodd"
		stroke-linejoin="round"
		stroke-miterlimit="2"
	>
		<g transform="matrix(1,0,0,1,-47059.6,-13250.2)">
			<g
				id="Plan-de-travail1"
				transform="matrix(1.82888,0,0,0.43884,47282.7,13250.2)"
			>
				<rect
					x="-122"
					y="0"
					width="2602.32"
					height="2602.32"
					fill="none"
				/>
				<g transform="matrix(1.84669,0,0,2.86134,-816.276,-2414.98)">
					<g transform="matrix(1,0,0,1,132.355,0)">
						<g transform="matrix(0.280412,0,0,0.754225,-3346.55,319.792)">
							<path
								d="M13884.1,1350.66C13861.8,1582.58 13684.1,1769.4 13456.5,1805.75L13375.5,1603.02C13525.2,1603.02 13649.6,1493.75 13673.3,1350.66L13884.1,1350.66ZM13073.6,1301.16L12871.3,1217.16C12911.5,975.034 13122,790.157 13375.5,790.157C13640.8,790.157 13859.2,992.821 13884.1,1251.66L13673.3,1251.66C13649.6,1108.56 13525.2,999.291 13375.5,999.291C13208.9,999.291 13073.6,1134.55 13073.6,1301.16Z"
								fill="rgb(31,102,255)"
							/>
						</g>
						<g transform="matrix(0.319437,0,0,0.859288,-2912.42,124.568)">
							<path
								d="M10453.5,1812.16C10453.5,1812.16 10453.5,1649.14 10453.5,1507.25C10453.5,1452.59 10431.7,1400.17 10393.1,1361.52C10354.4,1322.87 10302,1301.16 10247.3,1301.16C10105.5,1301.16 9942.46,1301.16 9942.46,1301.16C9942.46,1301.16 9942.46,1313.73 9942.46,1332.31L10096.3,1486.17L10185.5,1486.17C10207.5,1486.17 10228.6,1494.9 10244.2,1510.45C10259.7,1526.01 10268.5,1547.1 10268.5,1569.1L10268.5,1658.31L10422.3,1812.16C10440.9,1812.16 10453.5,1812.16 10453.5,1812.16Z"
								fill="rgb(0,207,217)"
							/>
						</g>
					</g>
					<g transform="matrix(0.386321,0,0,0.987635,-4204.53,-0.907418)">
						<text
							x="12804.8px"
							y="1600.66px"
							font-family="'Satoshi', 'sans-sreif'"
							font-weight="700"
							font-size="770.449px"
							fill="rgb(31,102,255)"
						>
							C
							<tspan
								x="13342.2px 13722.8px 14008.6px 14233px 14603.8px 14967.6px "
								y="1600.66px 1600.66px 1600.66px 1600.66px 1600.66px 1600.66px "
							>
								artevo
							</tspan>
						</text>
					</g>
				</g>
			</g>
		</g>
	</svg>
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
