export function getAvailableBalance(
	accounts: any[],
	countryCode: string,
	service: string
) {
	console.log("accounts ::", accounts);

	const account = accounts.find(
		(account) =>
			account.country_code === countryCode && account.service === service
	);
	return account
		? Number(account.balance_available)?.toLocaleString("fr-FR") ?? 0
		: 0;
}

export function isString({ value }: any) {
	return typeof value === "string";
}

export function isObject(value: any): boolean {
	return typeof value === "object" && value !== null;
}

export function objectToUrlParams(obj: any): string {
	const params = [];
	for (const key in obj) {
		if (Object.hasOwnProperty.call(obj, key)) {
			const value = obj[key];
			if (typeof value === "object") {
				// Handle nested objects recursively (if needed)
				const nestedParams = Object.entries(value).map(
					([nestedKey, nestedValue]) => {
						return `${key}[${nestedKey}]=${encodeURIComponent(
							nestedValue as string
						)}`;
					}
				);
				params.push(...nestedParams);
			} else {
				params.push(`${key}=${encodeURIComponent(value)}`);
			}
		}
	}
	return params.join("&");
}

export function urlParamsToObject(urlParamsString: string) {
	const params = new URLSearchParams(urlParamsString);
	const obj: { [key: string]: string } = {};
	for (const [key, value] of Array.from(params.entries())) {
		obj[key] = decodeURIComponent(value);
	}
	return obj;
}

const TOP_UP_DOLLARS_RATE_FIRST = 765;
const TOP_UP_DOLLARS_RATE_SECOND = 760;
const TOP_UP_DOLLARS_RATE_THIRD = 735;
const TOP_UP_DOLLARS_RATE_FINAL = 725;

export const getDollarRate = (amount: string | number) => {
	let dollars_rate: number;

	if (Number(amount) >= 0 && Number(amount) < 15000)
		dollars_rate = Number(TOP_UP_DOLLARS_RATE_FIRST);
	else if (Number(amount) >= 15000 && Number(amount) < 150000)
		dollars_rate = Number(TOP_UP_DOLLARS_RATE_SECOND);
	else if (Number(amount) >= 150000 && Number(amount) < 380000)
		dollars_rate = Number(TOP_UP_DOLLARS_RATE_THIRD);
	else dollars_rate = Number(TOP_UP_DOLLARS_RATE_FINAL);

	return dollars_rate;
};

type AmountProps = {
	amount: string | number;
	amountUSD?: string | number;
	dollars_rate?: string | number;
};
export const getXAFAmount = ({ amount }: AmountProps) => {
	const dollars_rate = getDollarRate(amount);
	const newAmount = Number(amount);
	const xafAmount = (newAmount * Number(dollars_rate)) / 100;
	const finalxafAmount = Math.ceil(xafAmount / 100) * 100;
	return finalxafAmount;
};

export const getUSDAmount = ({ amount }: AmountProps) => {
	const dollars_rate = getDollarRate(amount);
	const newAmount = Number(amount);
	const usdAmount = Math.trunc((newAmount / Number(dollars_rate)) * 100);
	// console.log({amount, newAmount, dollars_rate, usdAmount});
	return usdAmount;
};

export const retrieveUSDAmount = ({ amount, amountUSD }: AmountProps) => {
	const dollars_rate = getDollarRate(amount ?? 0);
	const newAmount = Number(amount ?? 0);
	const newAmountToUSD = getUSDAmount({ amount: newAmount, dollars_rate });
	const newAmountUSD = amountUSD ? Number(amountUSD) : newAmountToUSD;
	// console.log({amount, newAmount, newAmountToUSD, newAmountUSD});

	return newAmountUSD / 100;
};

export const generateRandomCode = (length: number) => {
	let result = "";
	const characters =
		"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

	for (let i = 0; i < length; i++) {
		result += characters[Math.floor(Math.random() * characters.length)];
	}

	return result;
};

export function removeAllSpaces(text: string): string {
	return text.replace(/\s+/g, "");
}

export function getFileExtension(filename: string) {
	return filename.slice(((filename.lastIndexOf(".") - 1) >>> 0) + 2);
}

export function transformArray(array: any[]) {
	return array.reduce((accumulator, current) => {
		// Check if the accumulator already has a property with the current status value
		if (!accumulator[current.status]) {
			// If not, add a new property with the current object as its value
			accumulator[current.status] = current;
		}
		// Return the accumulator for the next iteration
		return accumulator;
	}, {}); // Initialize the accumulator as an empty object
}

export function calculateAge(birthdate?: string) {
	if (!birthdate) {
		return "";
	}
	const today = new Date();
	const birthDate = new Date(birthdate);

	// Check if the input is valid
	if (isNaN(birthDate.getTime())) {
		throw new Error("Invalid birthdate");
	}

	// Calculate age in years
	let ageInYears = today.getFullYear() - birthDate.getFullYear();

	// Adjust for months and days
	const monthDifference = today.getMonth() - birthDate.getMonth();
	const dayDifference = today.getDate() - birthDate.getDate();

	if (
		(monthDifference < 0 || (monthDifference === 0 && dayDifference < 0)) &&
		!(
			today.getMonth() === birthDate.getMonth() &&
			today.getDate() === birthDate.getDate()
		)
	) {
		ageInYears--;
	}

	return String(ageInYears);
}

export function isExpired(expiryDate: string) {
	const currentDate = new Date();
	const expiryDateObj = new Date(expiryDate);

	// Compare dates
	return currentDate >= expiryDateObj;
}

export function getCurrentDateTime() {
	const now = new Date();

	const year = now.getFullYear();
	const month = String(now.getMonth() + 1).padStart(2, "0");
	const day = String(now.getDate()).padStart(2, "0");
	const hour = String(now.getHours()).padStart(2, "0");
	const minute = String(now.getMinutes()).padStart(2, "0");
	const second = String(now.getSeconds()).padStart(2, "0");

	return `${year}${month}${day}_${hour}:${minute}:${second}`;
}

export function getSortedObject(obj: any) {
	return Object.fromEntries(
		Object.entries(obj).sort(([, valueA], [, valueB]) =>
			String(valueA).localeCompare(String(valueB))
		)
	);
}

export function removeKeyValuePairs(obj: any, keysToRemove: string[]) {
	// Create a new object excluding the specified keys
	return Object.fromEntries(
		Object.entries(obj).filter(([key]) => !keysToRemove.includes(key))
	);
}
