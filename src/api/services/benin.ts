import BaseMethods from "../baseMethods";
import { beninUrls } from "../urls";


export class BeninService {
    static get_benin_balance = ({token}: {token?:string}) =>{
        let query_params:any = {};
        return BaseMethods.getRequest(beninUrls.GET_BENIN_BALANCE, true, query_params, token);
    }
    static handle_benin_balance_withdrawal = ({userId, amount, phone, token}: {userId:string, amount:string, phone?:string, token?:string}) =>{
        let query_params:any = {};
        if(userId) query_params.userId =userId;
        if(amount) query_params.amount =amount;
        if(phone) query_params.phone =phone;        
        
        const body = {amount, phone};
        
        return BaseMethods.postRequest(beninUrls.BENIN_PAYOUT, body, true, query_params, token);
    }
    static get_benin_payout_status = ({trxId}: {trxId?:string}) =>{
        let query_params:any = {};
        return BaseMethods.getRequest(beninUrls.GET_BENIN_PAYOUT_STATUS, true, query_params, trxId);
    }
};