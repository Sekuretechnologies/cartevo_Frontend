import BaseMethods from "../../baseMethods";
import { transactionUrlsV1 } from "../../urls";


export class TransactionService {    
    static get_stats_periodic = ({period, startDate, limitDate, separateDecline}: {period?:string, startDate?:string, limitDate?:string, separateDecline?:boolean}) => {
        let query_params:any = {};
        if(period) query_params.period =period;
        if(startDate ) query_params.startDate=startDate;
        if(limitDate) query_params.limitDate =limitDate;        
        if(separateDecline) query_params.separateDecline ='true';
        return BaseMethods.getRequest(transactionUrlsV1.STATS_PERIODIC, true, query_params);
    }        
    static get_stats_category_type = ({startDate, limitDate}: {startDate?:string, limitDate?:string}) => {
        let query_params:any = {};
        if(startDate ) query_params.startDate=startDate;
        if(limitDate) query_params.limitDate =limitDate;
        return BaseMethods.getRequest(transactionUrlsV1.STATS_PER_CATEGORY_TYPE, true, query_params);
    }
    static get_stats_daily_category_type = ({startDate, limitDate}: {startDate?:string, limitDate?:string}) => {
        let query_params:any = {};
        if(startDate ) query_params.startDate=startDate;
        if(limitDate) query_params.limitDate =limitDate;
        return BaseMethods.getRequest(transactionUrlsV1.STATS_DAILY_PER_CATEGORY_TYPE, true, query_params);
    }
}