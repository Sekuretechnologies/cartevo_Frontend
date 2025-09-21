import React, { useState, useEffect } from "react";
import PhoneInput from "@/components/shared/PhoneInput";
import CButton from "@/components/shared/CButton";
import classNames from "classnames";
import { PuffLoader } from "react-spinners";
import { allCountries } from "country-telephone-data";
import { ChevronDown } from "lucide-react";
import { Select, SelectItem } from "@nextui-org/select";

interface WithdrawModalProps {
  setIsOpen: (isOpen: boolean) => void;
  onSubmit: (data: WithdrawSubmitProps) => void;
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
    country_phone_code?: string;
  };
}

export interface WithdrawSubmitProps {
  amount: number;
  phone_number: string;
  operator: string;
  reason?: string;
}

// Composant PhoneInput personnalisé pour le retrait
const RestrictedPhoneInput: React.FC<{
  value: string;
  onChange: (number: string, code: string) => void;
  restrictedCountryCode?: string;
}> = ({ value, onChange, restrictedCountryCode }) => {
  // Normaliser le code restreint (enlever le + s'il existe)
  const normalizedRestrictedCode = restrictedCountryCode?.replace('+', '') || '';
  
  console.log('RestrictedPhoneInput - restrictedCountryCode:', restrictedCountryCode);
  console.log('RestrictedPhoneInput - normalizedRestrictedCode:', normalizedRestrictedCode);
  
  // Filtrer les pays en excluant le pays restreint
  const availableCountries = allCountries.filter(
    c => c.dialCode !== normalizedRestrictedCode
  );
  
  const [selectedCountry, setSelectedCountry] = useState(
    availableCountries[0] || allCountries[0]
  );
  const [isOpen, setIsOpen] = useState(false);

  console.log('RestrictedPhoneInput - selectedCountry:', selectedCountry);

  // Initialiser le code téléphonique au montage
  useEffect(() => {
    if (selectedCountry) {
      onChange(value, `+${selectedCountry.dialCode}`);
    }
  }, [selectedCountry, value, onChange]);

  const handleSelect = (country: any) => {
    setSelectedCountry(country);
    onChange(value, `+${country.dialCode}`);
    setIsOpen(false);
  };

  console.log('RestrictedPhoneInput - availableCountries count:', availableCountries.length);

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-3 border border-[#E6E6E6] rounded-[7px]"
      >
        <img
          src={`https://flagcdn.com/${selectedCountry.iso2.toLowerCase()}.svg`}
          alt={selectedCountry.dialCode}
          className="w-6 h-6"
        />
        <span className="text-sm text-gray-700 font-poppins">
          {selectedCountry.dialCode}
        </span>
        <ChevronDown />
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-2 w-56 bg-white border rounded-xl shadow-lg max-h-60 overflow-y-auto z-50">
          {availableCountries.map((country) => (
            <button
              key={country.dialCode}
              type="button"
              onClick={() => handleSelect(country)}
              className="flex items-center gap-2 w-full px-3 py-2 hover:bg-gray-100 text-left"
            >
              <img
                src={`https://flagcdn.com/${country.iso2.toLowerCase()}.svg`}
                alt={country.name}
                className="w-6 h-6"
              />
              <span className="text-sm text-gray-700 font-poppins">
                {country.name}
              </span>
              <span className="ml-auto text-sm text-gray-500 font-poppins">
                {country.dialCode}
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

const WithdrawModal: React.FC<WithdrawModalProps> = ({
  setIsOpen,
  onSubmit,
  isLoading,
  isSuccess,
  isError,
  operators = [],
  wallet
}) => {
  console.log('WithdrawModal - wallet:', wallet);
  console.log('WithdrawModal - wallet.country_phone_code:', wallet.country_phone_code);
  
  const [amount, setAmount] = useState("100");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [phoneCode, setPhoneCode] = useState<string>("");
  const [operator, setOperator] = useState("");
  const [reason, setReason] = useState("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const amountNum = parseFloat(amount) || 0;

  const handleSubmit = () => {
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

    if (wallet.payout_balance < amountNum) {
      setErrorMessage("Insufficient PayOut balance");
      return;
    }

    onSubmit({
      amount: amountNum,
      phone_number: `${phoneCode}${phoneNumber}`.trim(),
      operator,
      reason: reason || undefined
    });
  };

  return (
    <div className="bg-white rounded-lg p-6 w-[400px]">
      <h2 className="text-xl font-bold mb-4">Withdraw Funds</h2>

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
            className="w-full px-3 py-2 border-0 border-gray-300 rounded-md focus:outline-none focus:ring-0"
            placeholder={`Enter amount in ${wallet.currency}`}
            min="1"
            step="0.01"
          />
        </div>

        {/* Phone Number Input */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Phone Number
          </label>
          <div className="flex gap-2 items-center">
            <RestrictedPhoneInput
              value={phoneNumber}
              onChange={(num: string, code: string) => {
                setPhoneNumber(num);
                setPhoneCode(code);
              }}
              restrictedCountryCode={wallet.country_phone_code}
            />
            <input
              type="tel"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              className="flex-1 px-3 py-2 border-0 border-gray-300 rounded-md focus:outline-none focus:ring-0"
              placeholder="Enter phone number"
            />
          </div>
        </div>

        {/* Operator Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Mobile Money Operator
          </label>
          <Select
            placeholder="Select operator"
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
            className="w-full px-3 py-2 border-0 border-gray-300 rounded-md focus:outline-none focus:ring-0"
            placeholder="Enter reason for withdrawal"
          />
        </div>

        {/* Withdrawal Summary */}
        {amountNum > 0 && phoneNumber && operator && (
          <div className="bg-gray-50 p-4 rounded-md space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="font-medium">Withdrawal Amount:</span>
              <span className="font-bold text-red-600">
                -{amountNum.toLocaleString()} {wallet.currency}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">To:</span>
              <span className="font-bold text-gray-900">
                {operator} - {`${phoneCode}${phoneNumber}`.trim()}
              </span>
            </div>
            <div className="flex justify-between border-t pt-2">
              <span className="font-medium">New PayOut Balance:</span>
              <span className="font-bold text-gray-900">
                {(wallet.payout_balance - amountNum).toLocaleString()} {wallet.currency}
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
          text="Withdraw"
          btnStyle="blue"
          onClick={handleSubmit}
          disabled={amountNum <= 0 || amountNum > wallet.payout_balance || !phoneNumber || !operator}
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

export default WithdrawModal;

