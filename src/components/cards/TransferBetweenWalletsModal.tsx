import React, { useState, useEffect, useRef } from "react";
import CButton from "@/components/shared/CButton";
import classNames from "classnames";
import { PuffLoader } from "react-spinners";
import { WalletService } from "@/api/services/cartevo-api/wallets";

interface TransferBetweenWalletsModalProps {
  setIsOpen: (isOpen: boolean) => void;
  onSubmit: (data: TransferBetweenWalletsSubmitProps) => void;
  onLoadWallets: () => Promise<any[]>;
  isLoading: boolean;
  sourceWallet: {
    id: string;
    currency: string;
    balance: number;
    country_iso_code?: string;
  };
  token: string;
}

export interface TransferBetweenWalletsSubmitProps {
  from_wallet_id: string;
  to_wallet_id: string;
  amount: number;
  reason?: string;
}

interface AvailableWallet {
  id: string;
  balance: number;
  currency: string;
  country: string;
  country_iso_code: string;
}

const TransferBetweenWalletsModal: React.FC<TransferBetweenWalletsModalProps> = ({
  setIsOpen,
  onSubmit,
  onLoadWallets,
  isLoading,
  sourceWallet,
  token
}) => {
  const [amount, setAmount] = useState("100");
  const [selectedWalletId, setSelectedWalletId] = useState("");
  const [reason, setReason] = useState("");
  const [availableWallets, setAvailableWallets] = useState<AvailableWallet[]>([]);
  const [loadingWallets, setLoadingWallets] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [feeCalculation, setFeeCalculation] = useState<{
    feeAmount: number;
    feeType: string;
    feeValue: number;
    feeFixed: number;
    feePercentage: number;
    feeId: string;
    description: string;
    exchangeRate?: number;
    convertedAmount?: number;
    totalAmount: number;
  } | null>(null);
  const [loadingFees, setLoadingFees] = useState(false);
  const [isSelectOpen, setIsSelectOpen] = useState(false);
  const selectRef = useRef<HTMLDivElement>(null);

  const amountNum = parseFloat(amount) || 0;
  const selectedWallet = availableWallets.find(w => w.id === selectedWalletId);
  

  useEffect(() => {
    loadAvailableWallets();
  }, []);

  // Close select when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (selectRef.current && !selectRef.current.contains(event.target as Node)) {
        setIsSelectOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Calculate fees when amount or selected wallet changes
  useEffect(() => {
    if (amountNum > 0 && selectedWallet) {
      calculateTransferFees();
    } else {
      setFeeCalculation(null);
    }
  }, [amountNum, selectedWallet]);

  const loadAvailableWallets = async () => {
    setLoadingWallets(true);
    try {
      const wallets = await onLoadWallets();
      console.log('TransferBetweenWalletsModal - loaded wallets:', wallets);
      setAvailableWallets(wallets);
    } catch (error) {
      console.error('TransferBetweenWalletsModal - error loading wallets:', error);
      setErrorMessage("Failed to load available wallets");
    } finally {
      setLoadingWallets(false);
    }
  };

  const calculateTransferFees = async () => {
    if (!selectedWallet) return;
    
    setLoadingFees(true);
    try {
      const res = await WalletService.calculate_transfer_fees({
        token,
        body: {
          from_currency: sourceWallet.currency,
          to_currency: selectedWallet.currency,
          amount: amountNum,
          country_iso_code: sourceWallet.country_iso_code
        }
      });
      
      const json = await res.json();
      console.log('Full API response:', json);
      
      if (json.success && json.data) {
        console.log('Fee calculation result:', json.data);
        setFeeCalculation(json.data);
      } else {
        console.log('Fee calculation failed:', json.message);
        setFeeCalculation(null);
      }
    } catch (error) {
      setFeeCalculation(null);
    } finally {
      setLoadingFees(false);
    }
  };

  const handleSubmit = () => {
    if (!amountNum || amountNum <= 0) {
      setErrorMessage("Please enter a valid amount");
      return;
    }

    if (!selectedWalletId) {
      setErrorMessage("Please select a destination wallet");
      return;
    }

    if (feeCalculation && sourceWallet.balance < feeCalculation.totalAmount) {
      setErrorMessage(`Insufficient balance. Required: ${feeCalculation.totalAmount.toLocaleString()} ${sourceWallet.currency} (including ${feeCalculation.feeAmount.toLocaleString()} ${sourceWallet.currency} fees)`);
      return;
    }

    if (!feeCalculation && sourceWallet.balance < amountNum) {
      setErrorMessage("Insufficient balance in source wallet");
      return;
    }

    onSubmit({
      from_wallet_id: sourceWallet.id,
      to_wallet_id: selectedWalletId,
      amount: amountNum,
      reason: reason || undefined
    });
  };

  return (
    <div className="bg-white rounded-lg p-6 w-[500px]">
      <h2 className="text-xl font-bold mb-4">Transfer Between Wallets</h2>

      <div className="space-y-4">
        {/* Source Wallet Info */}
        <div className="bg-blue-50 p-4 rounded-md">
          <h3 className="font-medium text-blue-900 mb-2">From Wallet</h3>
          <div className="text-sm text-blue-800">
            <div>Currency: {sourceWallet.currency}</div>
            <div>Balance: {sourceWallet.balance.toLocaleString()} {sourceWallet.currency}</div>
          </div>
        </div>

        {/* Amount Input */}
        <div>
          <label className="flex justify-between items-center block text-sm font-medium text-gray-700 mb-2">
            <span>Amount ({sourceWallet.currency})</span>
            <span className="text-xs">
              Available: {sourceWallet.balance.toLocaleString()} {sourceWallet.currency}
            </span>
          </label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder={`Enter amount in ${sourceWallet.currency}`}
            min="1"
            step="0.01"
          />
        </div>

        {/* Destination Wallet Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            To Wallet ({selectedWallet ? selectedWallet.currency : sourceWallet.currency})
          </label>
          {loadingWallets ? (
            <div className="flex items-center justify-center py-4">
              <PuffLoader size={30} color="#1F66FF" />
              <span className="ml-2 text-sm text-gray-600">Loading wallets...</span>
            </div>
          ) : (
            <div className="relative" ref={selectRef}>
              <button
                type="button"
                onClick={() => setIsSelectOpen(!isSelectOpen)}
                className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-none text-left flex justify-between items-center outline-none ${
                  selectedWallet ? 'bg-white' : 'bg-gray-50'
                }`}
              >
                <span className={selectedWallet ? "text-gray-900" : "text-gray-400"}>
                  {selectedWallet 
                    ? `${selectedWallet.country} - ${selectedWallet.balance.toLocaleString()} ${selectedWallet.currency}`
                    : "Select destination wallet"
                  }
                </span>
                <svg
                  className={`w-5 h-5 text-gray-400 transition-transform ${isSelectOpen ? 'rotate-180' : ''}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              
              {isSelectOpen && (
                <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto">
                  {availableWallets.length === 0 ? (
                    <div className="px-3 py-2 text-sm text-gray-500">
                      No wallets available
                    </div>
                  ) : (
                    availableWallets.map((wallet) => (
                      <button
                        key={wallet.id}
                        type="button"
                        onClick={() => {
                          console.log('TransferBetweenWalletsModal - selection changed:', { walletId: wallet.id, selectedWalletId });
                          setSelectedWalletId(wallet.id);
                          setIsSelectOpen(false);
                        }}
                        className={`w-full px-3 py-2 text-left text-sm hover:bg-gray-100 focus:bg-gray-100 focus:outline-none ${
                          selectedWalletId === wallet.id ? 'bg-blue-50 text-blue-900' : 'text-gray-900'
                        }`}
                      >
                        <div className="flex justify-between items-center">
                          <span>{wallet.country} ({wallet.currency})</span>
                          <span className="text-xs text-gray-500">
                            {wallet.balance.toLocaleString()} {wallet.currency}
                          </span>
                        </div>
                      </button>
                    ))
                  )}
                </div>
              )}
            </div>
          )}
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

        {/* Fee Calculation Display */}
        {loadingFees && (
          <div className="flex items-center justify-center py-4">
            <PuffLoader size={20} color="#1F66FF" />
            <span className="ml-2 text-sm text-gray-600">Calculating fees...</span>
          </div>
        )}

        {/* Transfer Summary */}
        {amountNum > 0 && selectedWallet && feeCalculation && (
          <div className="bg-gray-50 p-4 rounded-md space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="font-medium">Transfer Amount:</span>
              <span className="font-bold text-gray-900">
                {amountNum.toLocaleString()} {sourceWallet.currency}
              </span>
            </div>
            
            {feeCalculation && (
              <div className="flex justify-between">
                <span className="font-medium">Transfer Fee:</span>
                <span className="font-bold text-red-600">
                  {feeCalculation.feeAmount.toLocaleString()} {sourceWallet.currency}
                </span>
              </div>
            )}
            
            <div className="flex justify-between border-t pt-2">
              <span className="font-medium">Total Amount:</span>
              <span className="font-bold text-red-600">
                {feeCalculation.totalAmount.toLocaleString()} {sourceWallet.currency}
              </span>
            </div>

            {selectedWallet.currency === 'USD' && feeCalculation.exchangeRate && (
              <>
                <div className="flex justify-between">
                  <span className="font-medium">Exchange Rate:</span>
                  <span className="font-bold text-gray-900">
                    {feeCalculation.exchangeRate >= 1 
                      ? `1 ${sourceWallet.currency} = ${feeCalculation.exchangeRate.toFixed(2)} ${selectedWallet.currency}`
                      : `1 ${selectedWallet.currency} = ${(1 / feeCalculation.exchangeRate).toFixed(2)} ${sourceWallet.currency}`
                    }
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Converted Amount:</span>
                  <span className="font-bold text-green-600">
                    {feeCalculation.convertedAmount?.toLocaleString()} {selectedWallet.currency}
                  </span>
                </div>
              </>
            )}


            <div className="flex justify-between">
              <span className="font-medium">Destination:</span>
              <span className="font-bold text-gray-900">
                {selectedWallet.country} ({selectedWallet.currency})
              </span>
            </div>
          </div>
        )}

        {/* Fallback summary for same currency without fees */}
        {amountNum > 0 && selectedWallet && !feeCalculation && !loadingFees && (
          <div className="bg-gray-50 p-4 rounded-md space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="font-medium">From:</span>
              <span className="font-bold text-red-600">
                -{amountNum.toLocaleString()} {sourceWallet.currency}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">To:</span>
              <span className="font-bold text-green-600">
                +{amountNum.toLocaleString()} {selectedWallet.currency}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">Destination:</span>
              <span className="font-bold text-gray-900">
                {selectedWallet.country}
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
          disabled={
            amountNum <= 0 || 
            !selectedWalletId || 
            loadingWallets || 
            loadingFees ||
            (feeCalculation ? sourceWallet.balance < feeCalculation.totalAmount : sourceWallet.balance < amountNum)
          }
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

export default TransferBetweenWalletsModal;

