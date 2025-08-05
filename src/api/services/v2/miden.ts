import BaseMethods from "../../baseMethods";
import { midenUrls } from "../../urls";

export class MidenService {
	static get_miden_balance = () => {
		return BaseMethods.getRequest(midenUrls.GET_MIDEN_BALANCE, true);
	};
}
