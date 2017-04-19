import { TypeInfo } from './type-info';
import { NDAgentInfo } from './nd-agent-info';

export interface MainInfo {
    homeData: TypeInfo[];
    ns_wdir: string;
    trData: TRData;
    adminMode: boolean;
    agentData: NDAgentInfo[];
}

export interface TRData {
    status: string;
    trNo: string;
}