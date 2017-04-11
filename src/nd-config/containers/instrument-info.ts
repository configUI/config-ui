export class ServiceEntryPointInterface{
    desc:string;
    enabled:boolean;
    entryType:string;
    entryTypeId:number;
    fqm:string;
    id:number;
    name:string;
    tableType:string;
}

export class ErrorDetectionInterface{
    errDetectionId:number;
    ruleName:string;
    errorFrom:string;
    errorTo:string;
    enabled:boolean;
    ruleDesc:string;
}

export class IntegrationPTDetectionInterface{
    type:string;
    detail:string;
}
export class MethodMonitorInterface{
    methodId:number;
    methodName:string;
    methodDisplayName:string;
    methodDesc:string;
}