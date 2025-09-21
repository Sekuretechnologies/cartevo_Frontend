import React, { useState, useEffect } from "react";
import CButton from "@/components/shared/CButton";
import PhoneInput from "react-phone-number-input";
import "react-phone-number-input/style.css";
import { Select, SelectItem } from "@nextui-org/select";
import { useSelector } from "react-redux";
import { selectTransactionFees } from "@/redux/slices_v2/settings";
import classNames from "classnames";
import { PuffLoader } from "react-spinners";
import { countries as countryDataList } from "country-data";
import { getCountryPhonePrefix } from "@/utils/utils";

interface WithdrawFundsModalProps {
  setIsOpen: (isOpen: boolean) => void;
  onSubmit: (data: WithdrawFundsSubmitProps) => void;
  isLoading: boolean;
  isSuccess: boolean;
  isError: boolean;
  operators?: Array<{
    operator_name?: string;
    operator_code?: string;
    currency?: string;
    country_iso_code?: string;
  }>;
  wallet: {
    id: string;
    currency: string;
    payout_balance: number;
    country_iso_code?: string;
    country_phone_code?: string;
  };
  userId: string;
}

export interface WithdrawFundsSubmitProps {
  amount: number;
  phone_number: string;
  operator: string;
  reason?: string;
  user_id: string;
}

const WithdrawFundsModal: React.FC<WithdrawFundsModalProps> = ({
  setIsOpen,
  onSubmit,
  isLoading,
  isSuccess,
  isError,
  operators = [],
  wallet,
  userId
}) => {
  const [amount, setAmount] = useState("100");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [operator, setOperator] = useState("");
  const [reason, setReason] = useState("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const countryIsoCode = wallet.country_iso_code || "CM";
  const countryPhoneCode = getCountryPhonePrefix(
    (countryDataList as any)[countryIsoCode]?.countryCallingCodes || []
  );

  // Get transaction fees from Redux store
  const transactionFees = useSelector(selectTransactionFees);

  // Find the appropriate transaction fee for withdrawals
  const feeData = transactionFees.find(
    (fee: any) =>
      fee.transaction_category === "WALLET" &&
      fee.transaction_type === "WITHDRAWAL"
  );

  const fees = feeData?.value || 2.0; // Fallback to 2% if not found

  const amountNum = parseFloat(amount) || 0;
  const feeAmount = (amountNum * fees) / 100;
  const totalAmount = amountNum + feeAmount;

  const handleSubmit = () => {
    console.log('=== WITHDRAWAL VALIDATION DEBUG ===');
    console.log('wallet.payout_balance:', wallet.payout_balance);
    console.log('amountNum:', amountNum);
    console.log('feeAmount:', feeAmount);
    console.log('totalAmount:', totalAmount);
    console.log('phoneNumber:', phoneNumber);
    console.log('operator:', operator);
    console.log('Validation: wallet.payout_balance < totalAmount =', wallet.payout_balance < totalAmount);
    console.log('=====================================');

    if (!amountNum || amountNum <= 0) {
      setErrorMessage("Please enter a valid amount");
      return;
    }

    if (!phoneNumber) {
      setErrorMessage("Please enter a phone number");
      return;
    }

    if (!operator) {
      setErrorMessage("Please select an operator");
      return;
    }

    if (wallet.payout_balance < totalAmount) {
      setErrorMessage(`Insufficient PayOut balance. Required: ${totalAmount.toLocaleString()} ${wallet.currency} (including ${feeAmount.toLocaleString()} ${wallet.currency} fees)`);
      return;
    }

    onSubmit({
      amount: amountNum,
      phone_number: phoneNumber.replace(`+`, "").replace(`${countryPhoneCode}`, ""),
      operator,
      reason: reason || undefined,
      user_id: userId
    });
  };

  useEffect(() => {
    if (isSuccess || isError) setIsOpen(false);
  }, [isSuccess, isError]);

  return (
    <div className="bg-white rounded-lg p-6 w-[400px]">
      <h2 className="text-xl font-bold mb-4">Withdraw {wallet.currency} Funds</h2>

      <div className="space-y-4">
        {/* Amount Input */}
        <div>
          <label className="flex justify-between items-center block text-sm font-medium text-gray-700 mb-2">
            <span>Amount ({wallet.currency})</span>
            <span className="text-xs">
              Available: {wallet.payout_balance.toLocaleString()} {wallet.currency}
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
          <p className="flex text-xs text-gray-900 mt-2">
            <span>Fee ({fees}%) : </span>
            <span className="font-medium">
              {feeAmount.toLocaleString()} {wallet.currency}
            </span>
          </p>
        </div>

        {/* Phone Number Input */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Phone Number
          </label>
          <div className="w-full px-3 py-2 border border-gray-300 rounded-md" style={{ position: 'relative' }}>
            <PhoneInput
              value={phoneNumber}
              onChange={(value) => setPhoneNumber(value || "")}
              defaultCountry={countryIsoCode as any}
              international
              countryCallingCodeEditable={false}
              className="w-full"
              inputClassName="w-full border-0 focus:outline-none focus:ring-0 bg-transparent"
              containerClassName="w-full"
              placeholder="Enter phone number"
              style={{ 
                '--PhoneInputCountryFlag-height': '1.2em',
                '--PhoneInputCountrySelectArrow-opacity': '0.5'
              } as any}
            />
          </div>
        </div>

        {/* Operator Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Mobile Money Operator
          </label>
          <Select
            placeholder="Select an operator"
            selectedKeys={[operator]}
            onSelectionChange={(keys) => {
              const value = keys.currentKey as string;
              setOperator(value);
            }}
            className="w-full"
          >
            {operators.map((op: any, idx: number) => {
              const value = op.operator_code || op.operator_name || op.code || op.name;
              const label = op.operator_name || op.operator_code || op.name || value;
              return (
                <SelectItem key={`${value}-${idx}`} value={value}>
                  {label}
                </SelectItem>
              );
            })}
          </Select>
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
            placeholder="Enter reason for withdrawal"
          />
        </div>

        {/* Fee and Amount Display */}
        <div className="bg-gray-50 p-4 rounded-md space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="font-medium">Withdrawal Amount:</span>
            <span className="font-bold text-red-600">
              -{amountNum.toLocaleString()} {wallet.currency}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="font-medium">Withdrawal Fee:</span>
            <span className="font-bold text-red-600">
              -{feeAmount.toLocaleString()} {wallet.currency}
            </span>
          </div>
          <div className="flex justify-between border-t pt-2">
            <span className="font-medium">Total Debited:</span>
            <span className="font-bold text-red-600">
              -{totalAmount.toLocaleString()} {wallet.currency}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="font-medium">To:</span>
            <span className="font-bold text-gray-900">
              {operator && phoneNumber && phoneNumber.length > 4 
                ? `${operator.split('-')[0]} - ${phoneNumber.replace(`+${countryPhoneCode}`, '')}` 
                : '-'}
            </span>
          </div>
            <div className="flex justify-between">
              <span className="font-medium">New PayOut Balance:</span>
              <span className={`font-bold ${(wallet.payout_balance - totalAmount) < 0 ? 'text-red-600' : 'text-gray-900'}`}>
                {(wallet.payout_balance - totalAmount) < 0 ? '0' : (wallet.payout_balance - totalAmount).toLocaleString()} {wallet.currency}
              </span>
            </div>
        </div>
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
          text="Withdraw Funds"
          btnStyle="blue"
          onClick={handleSubmit}
          disabled={amountNum <= 0 || totalAmount > wallet.payout_balance || !phoneNumber || !operator}
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

export default WithdrawFundsModal;
