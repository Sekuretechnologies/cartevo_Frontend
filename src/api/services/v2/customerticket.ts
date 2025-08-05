import BaseMethods from "../../baseMethods";
import { customerTicketUrlsV2 } from "../../urls";


export class CustomerTicketService {
    static get_all_customer_tickets = ({status, searchTerm}: {status?:string, searchTerm?:string}) =>{
        let query_params:any = {};        
        if(status) query_params.status =status;
        if(searchTerm) query_params.searchTerm =searchTerm;
        return BaseMethods.getRequest(customerTicketUrlsV2.GET_ALL_CUSTOMER_TICKETS, true, query_params);
    }
    static get_one_customer_ticket = (id:string) =>{
        return BaseMethods.getRequest(customerTicketUrlsV2.GET_ONE_CUSTOMER_TICKET(id), true);
    }
    static create_customer_ticket = ({ userId, body }: { userId?:string, body:any }) => {
        let query_params:any = {};
        if(userId) query_params.adminUserId =userId;
        return BaseMethods.postFileRequest(customerTicketUrlsV2.CREATE_CUSTOMER_TICKET, body, true, query_params);
    }    
    static update_customer_ticket = ({ userId, action, ticketId, body }: { userId:string, action?:boolean, ticketId:string, body:any }) => {
        let query_params:any = {};
        if(userId) query_params.adminUserId =userId;
        if(action) query_params.action =action;
        return BaseMethods.putFileRequest(customerTicketUrlsV2.UPDATE_CUSTOMER_TICKET(ticketId), body, true, query_params);
    }
    static delete_one_customer_ticket = (id:string) =>{
        return BaseMethods.deleteRequest(customerTicketUrlsV2.GET_ONE_CUSTOMER_TICKET(id), {}, true);
    }
    // static update_chnpayment_proof = ({ userId, chnPaymentId, body }: { userId:string, chnPaymentId:string, body:any }) => {
    //     let query_params:any = {};
    //     if(userId) query_params.adminUserId =userId;
    //     console.log("update_chnpayment_proof :::", body);
    //     return BaseMethods.putFileRequest(chnpaymentUrlsV2.UPDATE_CHNPAYMENT_PROOF(chnPaymentId), body, true, query_params);
    // }
    
}