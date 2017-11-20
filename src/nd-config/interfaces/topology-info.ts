export interface TopologyInfo {
    profileId: number;
    topoDesc: string;
    topoName: string;
    dcTopoId: number;
    topoState: number;
    profileName: number;
    topoId: number;
}
export interface TierInfo {
    tierId: number;
    tierFileId: number;
    tierDesc: string;
    tierName: string;
    profileId: number;
    profileName: string;
}

export interface ServerInfo {
    serverId: number;
    serverFileId: number;
    serverDesc: string;
    serverDisplayName: string;
    serverName: string;
    profileId: number;
    profileName: string;
}

export interface InstanceInfo {
    instanceId: number;
    instanceFileId: number;
    instanceName: string;
    instanceDisplayName: string;
    instanceDesc: string;
    profileId: number;
    profileName: string;
    enabled: boolean;
}

export class AutoInstrSettings{
    enableDebugSession: boolean = true;
    minStackDepthDebugSession: number = 10;
    autoInstrTraceLevel: number = 1;
    autoInstrSampleThreshold: number = 120;
    autoInstrPct: number = 60;
    autoDeInstrPct: number = 80;
    autoInstrMapSize: number = 100000;
    autoInstrMaxAvgDuration: string = "5";
    autoInstrClassWeight: number = 10;

}

export class AutoIntrDTO{
    instanceName: string;
    startTime: string;
    endTime: string;
    duration: string;
    status: string;
    elapsedTime: string;
    configuration: string;
    appName: string;
}
