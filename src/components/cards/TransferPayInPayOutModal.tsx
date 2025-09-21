import React, { useState } from "react";
import CButton from "@/components/shared/CButton";
import classNames from "classnames";
import { PuffLoader } from "react-spinners";

interface TransferPayInPayOutModalProps {
  setIsOpen: (isOpen: boolean) => void;
  onSubmit: (data: TransferPayInPayOutSubmitProps) => void;
  isLoading: boolean;
  isSuccess: boolean;
  isError: boolean;
  wallet: {
    id: string;
    currency: string;
    payin_balance: number;
    payout_balance: number;
  };
}

export interface TransferPayInPayOutSubmitProps {
  amount: number;
  direction: 'PAYIN_TO_PAYOUT' | 'PAYOUT_TO_PAYIN';
  reason?: string;
}

const TransferPayInPayOutModal: React.FC<TransferPayInPayOutModalProps> = ({
  setIsOpen,
  onSubmit,
  isLoading,
  isSuccess,
  isError,
  wallet
}) => {
  const [amount, setAmount] = useState("100");
  const [direction, setDirection] = useState<'PAYIN_TO_PAYOUT' | 'PAYOUT_TO_PAYIN'>('PAYIN_TO_PAYOUT');
  const [reason, setReason] = useState("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const amountNum = parseFloat(amount) || 0;

  const handleSubmit = () => {
    if (!amountNum || amountNum <= 0) {
      setErrorMessage("Please enter a valid amount");
      return;
    }

    // Check sufficient balance
    if (direction === 'PAYIN_TO_PAYOUT' && wallet.payin_balance < amountNum) {
      setErrorMessage("Insufficient PayIn balance");
      return;
    }

    if (direction === 'PAYOUT_TO_PAYIN' && wallet.payout_balance < amountNum) {
      setErrorMessage("Insufficient PayOut balance");
      return;
    }

    onSubmit({
      amount: amountNum,
      direction,
      reason: reason || undefined
    });
  };

  const getAvailableBalance = () => {
    return direction === 'PAYIN_TO_PAYOUT' ? wallet.payin_balance : wallet.payout_balance;
  };

  const getSourceLabel = () => {
    return direction === 'PAYIN_TO_PAYOUT' ? 'PayIn' : 'PayOut';
  };

  const getDestinationLabel = () => {
    return direction === 'PAYIN_TO_PAYOUT' ? 'PayOut' : 'PayIn';
  };

  return (
    <div className="bg-white rounded-lg p-6 w-[400px]">
      <h2 className="text-xl font-bold mb-4">Internal Transfer</h2>

      <div className="space-y-4">
        {/* Direction Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Transfer Direction
          </label>
          <div className="flex gap-4">
            <label className="flex items-center">
              <input
                type="radio"
                checked={direction === 'PAYIN_TO_PAYOUT'}
                onChange={() => setDirection('PAYIN_TO_PAYOUT')}
                className="mr-2"
              />
              PayIn → PayOut
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                checked={direction === 'PAYOUT_TO_PAYIN'}
                onChange={() => setDirection('PAYOUT_TO_PAYIN')}
                className="mr-2"
              />
              PayOut → PayIn
            </label>
          </div>
        </div>

        {/* Amount Input */}
        <div>
          <label className="flex justify-between items-center block text-sm font-medium text-gray-700 mb-2">
            <span>Amount ({wallet.currency})</span>
            <span className="text-xs">
              Available: {getAvailableBalance().toLocaleString()} {wallet.currency}
            </span>
          </label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder={`Enter amount in ${wallet.currency}`}
            min="1"
            step="0.01"
          />
        </div>

        {/* Reason Input */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Reason (Optional)
          </label>
          <input
            type="text"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter reason for transfer"
          />
        </div>

        {/* Transfer Summary */}
        {amountNum > 0 && (
          <div className="bg-gray-50 p-4 rounded-md space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="font-medium">From {getSourceLabel()}:</span>
              <span className="font-bold text-red-600">
                -{amountNum.toLocaleString()} {wallet.currency}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">To {getDestinationLabel()}:</span>
              <span className="font-bold text-green-600">
                +{amountNum.toLocaleString()} {wallet.currency}
              </span>
            </div>
            <div className="flex justify-between border-t pt-2">
              <span className="font-medium">Total Balance:</span>
              <span className="font-bold text-gray-900">
                {(wallet.payin_balance + wallet.payout_balance).toLocaleString()} {wallet.currency}
              </span>
            </div>
          </div>
        )}
      </div>

      {errorMessage && (
        <div className="my-2 p-2 text-xs bg-red-100 text-red-700 rounded-md">
          {errorMessage}
        </div>
      )}

      <div className="flex gap-3 justify-end mt-6">
        <CButton
          text="Cancel"
          btnStyle="outlineDark"
          onClick={() => setIsOpen(false)}
        />
        <CButton
          text="Transfer"
          btnStyle="blue"
          onClick={handleSubmit}
          disabled={amountNum <= 0 || amountNum > getAvailableBalance()} 
        />
      </div>

      {isLoading && (
        <div
          className={classNames(
            "transition-all invisible z-[1000] bg-blue-900/30 opacity-0 absolute top-0 left-0 h-full w-full flex items-center justify-center",
            {
              "!opacity-100 !visible z-[1000]": isLoading,
            }
          )}
        >
          <PuffLoader
            className="shrink-0"
            size={50}
            color="#1F66FF"
          />
        </div>
      )}
    </div>
  );
};

export default TransferPayInPayOutModal;

