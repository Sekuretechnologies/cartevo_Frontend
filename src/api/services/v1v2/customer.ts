import { isObject } from "@/utils/utils";
import BaseMethods from "../../baseMethods";
import { customerUrlsV1V2 } from "../../urls";


export class CustomerService {
    static get_all_customers = (params:any) =>{
        let query_params:any = {};
        if(isObject(params)){
            Object.entries(params).map(([key, value]:any[]) => {
                if(value) query_params[key] = value;
            });
        }
        return BaseMethods.getRequest(customerUrlsV1V2.GET_CUSTOMERS, true, query_params);
    }
    static get_stats_countries = ({limitDate}: {limitDate?:string}) => {
        let query_params:any = {};
        if(limitDate) query_params.limitDate =limitDate;        
        return BaseMethods.getRequest(customerUrlsV1V2.STATS_PER_COUNTRY, true, query_params);
    }
    // static get_stats_countries = () =>
    //     BaseMethods.getRequest(customerUrlsV1.STATS_PER_COUNTRY, true);
}