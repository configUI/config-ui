import { TypeInfo } from './type-info';
export interface MainInfo {
    homeData: [TypeInfo]
    ns_wdir: string;
    trData: { status: string, trNo: string };
}