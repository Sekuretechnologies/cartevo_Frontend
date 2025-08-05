import BaseMethods from "../baseMethods";
import { transactionUrls } from "../urls";


export class TransactionService {
    // static get_all_transactions = () => 
    //     BaseMethods.getRequest(transactionUrls.GET_ALL_TRANSACTIONS, true);
    static get_periodic_transactions = ({period, separateDecline}: {period?:string, separateDecline?:boolean}) =>{
        let query_params:any = {};
        if(period) query_params.period =period;
        if(separateDecline) query_params.separateDecline ='true';
        return BaseMethods.getRequest(transactionUrls.GET_PERIODIC_TRANSACTIONS, true, query_params);
    }
    static get_user_transactions = ({userId, category, type, searchTerm}: {userId:string, category?:string, type?:string, searchTerm?:string}) =>{
        let query_params:any = {};
        if(searchTerm) query_params.searchTerm =searchTerm;
        if(category) query_params.category =category;
        if(type) query_params.type =type;

        return BaseMethods.getRequest(transactionUrls.GET_USER_TRANSACTIONS(userId), true, query_params);
    }
    static get_user_transactions_stats = ({userId, category, type}: {userId:string, category?:string, type?:string}) =>{
        let query_params:any = {};
        if(category) query_params.category =category;
        if(type) query_params.type =type;
        return BaseMethods.getRequest(transactionUrls.GET_USER_TRANSACTIONS_STATS(userId), true, query_params);
    }
    static get_countries_transactions = () =>
        BaseMethods.getRequest(transactionUrls.GET_COUNTRIES_TRANSACTIONS, true);
    static get_category_type_transactions = () =>
        BaseMethods.getRequest(transactionUrls.GET_CATEGORY_TYPE_TRANSACTIONS, true);
    static get_last_10_transactions = () =>
        BaseMethods.getRequest(transactionUrls.GET_LAST_10_TRANSACTIONS, true);
    static get_all_transactions = ({category, type, searchTerm}: {category?:string, type?:string, searchTerm?:string}) =>{
        let query_params:any = {};
        if(searchTerm) query_params.searchTerm =searchTerm;
        if(category) query_params.category =category;
        if(type) query_params.type =type;

        return BaseMethods.getRequest(transactionUrls.GET_ALL_TRANSACTIONS, true, query_params);
    }
    static get_wallets_transactions_stats = ({category, type}: {category?:string, type?:string}) =>{
        let query_params:any = {};
        if(category) query_params.category =category;
        if(type) query_params.type =type;
        return BaseMethods.getRequest(transactionUrls.GET_WALLETS_TRANSACTIONS_STATS, true, query_params);
    }
    static get_transfers_stats = ({category, type}: {category?:string, type?:string}) =>{
        let query_params:any = {};
        if(category) query_params.category =category;
        if(type) query_params.type =type;
        return BaseMethods.getRequest(transactionUrls.GET_TRANSFERS_STATS, true, query_params);
    }
    

    // Handle Customer transactions
    static handle_user_account_transactions = ({ userId, customerId, label, body }: { userId:string, customerId:string, label:string, body:any }) => {
        let query_params:any = {};
        if(label) query_params.label =label;
        if(userId) query_params.adminUserId =userId;
        if(customerId) query_params.customerId =customerId;
        return BaseMethods.postRequest(transactionUrls.HANDLE_USER_ACCOUNT_TRANSACTIONS, body, true, query_params);
    }
}