export function parseDateStr(dateString: string) {
	return dateString ? dateString.replace(/T.*Z$/, "") : "";
}

export function parseDateObject(dateString: string) {
	return dateString ? new Date(dateString.replace(/T.*Z$/, "")) : new Date();
}

export const getFormattedDate = (
	entry: Date,
	lang?: string,
	isText?: boolean
) => {
	if (typeof entry === "string") {
		entry = new Date(entry);
	}
	if (entry) {
		// Adjust the date to the day before if necessary
		let adjustedEntry = new Date(entry.getTime());

		// Check if the time is midnight (00:00)
		if (adjustedEntry.getHours() === 0) {
			// Set the time to 23:59 (11:00 PM) if it's midnight
			adjustedEntry.setHours(23);
			adjustedEntry.setDate(adjustedEntry.getDate() - 1);
		}

		const year = adjustedEntry.getFullYear();
		const month = `0${adjustedEntry.getMonth() + 1}`.slice(-2); // Note: getMonth() returns 0-11, hence the +1
		const day = `0${adjustedEntry.getDate()}`.slice(-2);

		// const year = entry.getFullYear();
		// const month = `0${entry.getMonth() + 1}`.slice(-2);
		// const day = `0${entry.getDate()}`.slice(-2);

		return lang == "fr"
			? `${day}/${month}/${year}`
			: `${year}-${month}-${day}`;
	}
	return "";
};

export const getTextFormattedDate = (
	entry: Date | string,
	lang?: string,
	withHours?: boolean
): string => {
	let adjustedEntry: Date;

	// Handle input type
	if (typeof entry === "string") {
		entry = new Date(entry);
	}

	// Adjust the date to the day before if necessary
	adjustedEntry = new Date(entry.getTime());

	// Check if the time is midnight (00:00) and adjust if needed
	if (adjustedEntry.getHours() === 0) {
		adjustedEntry.setHours(23);
		adjustedEntry.setDate(adjustedEntry.getDate() - 1);
	}

	// Format the date using toLocaleDateString
	let options: Intl.DateTimeFormatOptions;

	if (withHours) {
		options = {
			year: "numeric",
			month: "short",
			day: "numeric",
			hour: "2-digit",
			minute: "2-digit",
		};
	} else {
		options = {
			year: "numeric",
			month: "short",
			day: "numeric",
		};
	}

	const formattedDate = adjustedEntry.toLocaleDateString("fr-FR", options);

	return formattedDate;
};

export const getInputFormattedDate = (entry: Date, lang?: string) => {
	const year = entry.getFullYear();
	const month = `0${entry.getMonth() + 1}`.slice(-2);
	const day = `0${entry.getDate()}`.slice(-2);
	return lang == "fr" ? `${day}-${month}-${year}` : `${year}-${month}-${day}`;
};

export const getNextUIDatePickerValueStr = (
	inputYear: number,
	inputMonth: number,
	inputDay: number
) => {
	const year = inputYear;
	const month = `0${inputMonth}`.slice(-2);
	const day = `0${inputDay}`.slice(-2);
	return `${year}-${month}-${day}`;
};

export const getFormattedTime = (entry: Date) => {
	if (typeof entry === "string") {
		// console.log("getFormattedTime : ", entry);
		entry = new Date(entry);
	}
	if (entry) {
		let gmtOffset = entry.getTimezoneOffset() / 60;
		let hours = entry.getHours() + gmtOffset;
		hours = hours < 0 ? 24 + hours : hours; // Adjust for negative hours
		hours = hours > 23 ? hours - 24 : hours; // Adjust for hours exceeding 23
		const minutes = `0${entry.getMinutes()}`.slice(-2);
		if (isNaN(parseInt(`${hours}`)) || isNaN(parseInt(minutes))) {
			return "";
		}
		return `${Number(hours)}:${minutes}`;
	}

	return "";
};

function extractDateAndTime(dateTimeString: string) {
	const date = new Date(dateTimeString);
	const year = date.getFullYear();
	const month = String(date.getMonth() + 1).padStart(2, "0"); // Adding 1 to month as getMonth returns zero-based value
	const day = String(date.getDate()).padStart(2, "0");
	const hours = String(date.getHours()).padStart(2, "0");
	const minutes = String(date.getMinutes()).padStart(2, "0");

	const formattedDateTime = `${day}/${month}/${year}  ${hours}:${minutes}`;
	return formattedDateTime;
}

export const getFormattedDateTime = (
	entry: Date,
	format?: string,
	lang?: string
) => {
	let year0 = "";
	if (typeof entry === "string") {
		// const x = new Date(entry);
		year0 = String(entry).slice(0, 1);
	}

	if (year0 === "0") {
		return "-/-";
	} else {
		if (format == "date") {
			return getFormattedDate(entry, lang);
		} else if (format == "time") {
			return getFormattedTime(entry);
		} else {
			return `${getFormattedDate(entry, lang)}    ${getFormattedTime(
				entry
			)}`;
		}
	}
};

const getWeekNumber = (entry: Date) => {
	const date = new Date(
		Date.UTC(entry.getFullYear(), entry.getMonth(), entry.getDate())
	);
	date.setUTCDate(date.getUTCDate() + 4 - (date.getUTCDay() || 7));
	const yearStart = new Date(Date.UTC(date.getUTCFullYear(), 0, 1));
	return Math.ceil(((Number(date) - Number(yearStart)) / 86400000 + 1) / 7);
};
export const days = ["Dim.", "Lun.", "Mar.", "Mer.", "Jeu.", "Ven.", "Sam."];
export const months = [
	"Jan.",
	"Fev.",
	"Mars",
	"Avr.",
	"MaI",
	"Juin",
	"Jul.",
	"Août",
	"Sep.",
	"Oct.",
	"Nov.",
	"Dec.",
];
export const getDayAndMonthLabel = (entry: Date) => {
	if (typeof entry === "string") {
		entry = new Date(entry);
	}
	return [days[entry.getDay()], months[entry.getMonth()]];
};

export const getDisplayedDate = (entry: string = "") => {
	if (!`${entry}`.length || !`${entry}`.trim().length) {
		return entry;
	}
	const entryAsDate = new Date(entry);
	const [dayOfDate, month, year] = getFormattedDate(entryAsDate).split("/");
	const [dayOfWeekLabel, monthLabel] = getDayAndMonthLabel(entryAsDate);
	return `${dayOfWeekLabel}, ${dayOfDate} ${monthLabel}`;
};

const getFormattedNumber = (entry: number) => {
	return entry > 9 ? entry : `0${entry}`;
};
export const getHumanDate = (entry: Date) => {
	if (entry === null) {
		return entry;
	}

	if (typeof entry === "string") {
		entry = new Date(entry);
	}

	const [dayOfDate] = getFormattedDate(entry).split("/");
	const [dayOfWeekLabel, monthLabel] = getDayAndMonthLabel(entry);
	return `${dayOfWeekLabel} ${dayOfDate} ${monthLabel}`;
};

export const tomorrow = () => {
	const now = new Date();
	now.setDate(now.getDate() + 1);
	return;
};

export const getStringAsDate = (entry: any) => {
	if (entry === null) {
		return entry;
	}
	if (typeof entry === "string") {
		entry = new Date(entry);
	}
	return entry;
};

export const getDateWithTime = (date: any, time: string) => {
	if (date === null) {
		return date;
	}

	const hours = Number(time.split(":")[0]);
	const minutes = Number(time.split(":")[1]);

	date.setHours(hours);
	date.setMinutes(minutes);
	return date;
};

export const getDateFromDateAndTime = (date: any, time: string) => {
	const [hours, minutes] = time.split(":");
	const selectedDate = new Date(date);
	selectedDate.setHours(Number(hours.trim()));
	selectedDate.setMinutes(Number(minutes.trim()));
	return selectedDate;
};
