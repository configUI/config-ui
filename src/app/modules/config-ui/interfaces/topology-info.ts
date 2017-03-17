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