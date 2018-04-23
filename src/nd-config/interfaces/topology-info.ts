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
    instanceType: string;
    aiEnable: boolean;
}

export class AutoInstrSettings{
    enableAutoInstrSession: boolean = true;
    minStackDepthAutoInstrSession: number = 10;
    autoInstrTraceLevel: number = 1;
    autoInstrSampleThreshold: number = 120;
    autoInstrPct: number = 60;
    autoDeInstrPct: number = 80;
    autoInstrMapSize: number = 100000;
    autoInstrMaxAvgDuration: number = 2;
    autoInstrClassWeight: number = 10;
    autoInstrSessionDuration: number = 1800;
    autoInstrRetainChanges: boolean = true;
    blackListForDebugSession: boolean = true;

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
    sessionName: string;
    instanceId: number;
    type: string;
    triggerScreen: string;
}

export class DDAIInfo{
    type: string = ""
    conf: string = ""
    sessionName: string = ""
    bt: string = "ALL"
    testRun: number = 2
    tier: string =""
    server: string =""
    instance: string  = ""
    duration: number = 600
    retainchanges: number = 0
    dump_data: number = 2
    stackDepthFilter: number = 10
    ddsampleInterval: number = 30
    ddtraceLevel: number = 1
    autoInstrsampleThreshold: number = 1000
    instrPct: number = 50
    removeInstrPct: number = 80
    maxMethods: number = 10000
    minAvgResponseTime: number = 1
    weightage: number = 10
    blackListForAI: string = "2"
    aiThreshold: number = 5
    ddaithreadblackList: string = ""
    ddaithreadwhiteList: string = ""
    ddaibtblackList: string = ""
    ddaibtwhiteList: string = ""
    acknowledgeMode: string = ""
    completionMode: number = 2
    applyMode: number = 0
    saveAppliedChanges: number = 1
    deleteFromServer: number = 1
    agentType: string = ""
    sessionId: number
    message: string = "";
}

//Class for Auto-Instrumentation Summary
export class AutoInstrSummaryData {
    packageName:string;
    className:string;
    methodName:string;
    count:number;
    duration:number;
}
