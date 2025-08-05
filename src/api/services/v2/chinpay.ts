import BaseMethods from "../../baseMethods";
import { chnpaymentUrlsV2, transactionUrlsV2 } from "../../urls";


export class ChinpayService {
    static get_all_trxs = ({status, searchTerm}: {status?:string, searchTerm?:string}) =>{
        let query_params:any = {};        
        if(status) query_params.status =status;
        if(searchTerm) query_params.searchTerm =searchTerm;
        return BaseMethods.getRequest(chnpaymentUrlsV2.GET_ALL_CHNPAYMENTS, true, query_params);
    }
    static get_one_trx = (id:string) =>{
        return BaseMethods.getRequest(chnpaymentUrlsV2.GET_ONE_CHNPAYMENT(id), true);
    }    
    static update_chnpayment = ({ userId, chnPaymentId, body }: { userId:string, chnPaymentId:string, body:any }) => {
        let query_params:any = {};
        if(userId) query_params.adminUserId =userId;
        return BaseMethods.putRequest(chnpaymentUrlsV2.UPDATE_CHNPAYMENT(chnPaymentId), body, true, query_params);
    }

    static update_chnpayment_proof = ({ userId, chnPaymentId, body }: { userId:string, chnPaymentId:string, body:any }) => {
        let query_params:any = {};
        if(userId) query_params.adminUserId =userId;
        console.log("update_chnpayment_proof :::", body);
        return BaseMethods.putFileRequest(chnpaymentUrlsV2.UPDATE_CHNPAYMENT_PROOF(chnPaymentId), body, true, query_params);
    }
    
}