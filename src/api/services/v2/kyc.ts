import BaseMethods from "../../baseMethods";
import { kycUrlsV2 } from "../../urls";


export class KycService {
    static get_kyc_warnings_list = ({lang}:{lang:'fr'|'en'}) => {
        let query_params:any = {lang};
        return BaseMethods.getRequest(kycUrlsV2.GET_KYC_WARNINGS_LIST, true, query_params);
    }
}