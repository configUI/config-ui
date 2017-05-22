export interface NDAgentInfo {
    agentId:number;
	tier:string;
	server:string;
	instance:string;
	installDir:string;
	version:string;
	bciRunningSince:string;
	bciStartTime:string;
	ndcStartTime :string;
	state:string;
}

export interface CmonInfo{
    activeorInActive: string;
	appName:string;
	cmonHome:string;
	cmonJavaHome:string;
	cmonPid:string;
	cmonStartTime:string;
	cmonVersion:string;
	id:number;
	serverIp: string;
	serverName:string;
	testRunNo:string;
	testRunning:boolean;
	tierName: string;
	topoName: string;
}
