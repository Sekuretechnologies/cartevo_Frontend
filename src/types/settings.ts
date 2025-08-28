export interface ExchangeRate {
	id?: string;
	fromCurrency: string;
	toCurrency: string;
	rate: number;
	source: string;
	description: string;
	isActive: boolean;
	createdAt?: string;
	updatedAt?: string;
}

export interface TransactionFee {
	id?: string;
	transactionType: string;
	transactionCategory: string;
	countryIsoCode: string;
	currency: string;
	type: string;
	value: number;
	description: string;
	createdAt?: string;
	updatedAt?: string;
}

export interface DeveloperSettings {
	webhook_is_active?: boolean;
	webhook_url?: string;
	client_id?: string;
	client_key?: string;
}

export interface CreateExchangeRateRequest {
	fromCurrency: string;
	toCurrency: string;
	rate: number;
	source?: string;
	description?: string;
	isActive?: boolean;
}

export interface UpdateExchangeRateRequest
	extends Partial<CreateExchangeRateRequest> {
	id: string;
}

export interface CreateTransactionFeeRequest {
	transactionType: string;
	transactionCategory: string;
	countryIsoCode: string;
	currency: string;
	type: string;
	value: number;
	description: string;
}

export interface UpdateTransactionFeeRequest
	extends Partial<CreateTransactionFeeRequest> {
	id: string;
}

export interface UpdateDeveloperSettingsRequest {
	webhookUrl?: string;
	clientId?: string;
	clientKey?: string;
	isActive?: boolean;
}
