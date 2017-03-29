export class ServiceEntryPoint{
    desc:string;
    enabled:boolean;
    entryType:string;
    entryTypeId:number;
    fqm:string;
    id:number;
    name:string;
    tableType:string;
}

export class ErrorDetection{
    errDetectionId:number;
    ruleName:string;
    errorFrom:string;
    errorTo:string;
    enabled:boolean;
    ruleDesc:string;
}

export class IntegrationPTDetection{
    type:string;
    detail:string;
}
export class MethodMonitor{
    methodId:number;
    methodName:string;
    methodDisplayName:string;
    methodDesc:string;
}

export class MethodMonitorData {
    methodId: number;
    methodName: string;
    methodDisplayName: string;
    methodDesc: string;
}