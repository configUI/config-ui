import { TypeInfo } from './type-info';
import { NDAgentInfo } from './nd-agent-info';

export interface MainInfo {
    homeData: TypeInfo[];
    ns_wdir: string;
    trData: { status: string, trNo: string };
    adminMode: boolean;
    agentData : NDAgentInfo[];
}