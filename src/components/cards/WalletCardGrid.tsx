import React, { useState } from "react";
import InfoCard from "./InfoCard";
import cstyle from "./styles/style.module.scss";
import WalletCard from "./walletCard";
import FundUSDModal from "./FundUSDModal";
import FundXAFModal from "./FundXAFModal";
import Modal from "@/components/shared/Modal/Modal";

type TText = {
	text: string | number | React.ReactNode;
	fw?: string;
	color?: string;
	fs?: string;
	tooltip?: string;
	whiteSpace?: string;
	maxWidth?: string;
};
type TDataItem = {
	label: TText;
	value: TText;
};
export type TDataList = TDataItem[][];

interface WalletCardProps {
	walletData: TDataList[];
	onAddWallet?: () => void;
}
// interface IDataLine {
//   items: IDataItem[];
// };

// export type TDataList = {
//   lines: IDataLine[];
// };

const WalletCardGrid: React.FC<WalletCardProps> = ({
	walletData,
	onAddWallet,
}) => {
	return (
		// <div className={`mb-10 ${cstyle["infoCardGrid"]}`}>
		<div
			className={`mb-10 gap-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3`}
		>
			{walletData.map((data, index) => (
				<WalletCard key={index} data={data} />
			))}
			{/* Add new wallet card */}
			<div
				className="border-2 border-dashed border-gray-300 rounded-lg p-6 flex items-center justify-center cursor-pointer hover:border-gray-400 transition-colors"
				onClick={() => onAddWallet && onAddWallet()}
			>
				<div className="text-center">
					<div className="text-4xl text-gray-400 mb-2">+</div>
					<div className="text-gray-500">Add New Wallet</div>
				</div>
			</div>
		</div>
	);
};

export default WalletCardGrid;
