import * as CFlags from "country-flag-icons/react/3x2";

const CountryFlags: any = CFlags;

export const ItemFlag = ({ iso2, size }: { iso2: string; size?: number }) => {
	// country-flag-icons exports ISO codes in UPPERCASE
	const code = String(iso2)?.toUpperCase();
	const FlagIcon = CountryFlags?.[code];
	if (!FlagIcon) return null; // guard if unsupported code
	return (
		<FlagIcon
			className={`h-full ${size ? `w-${size}` : "w-full"} object-cover`}
			title={code}
		/>
	);
};
