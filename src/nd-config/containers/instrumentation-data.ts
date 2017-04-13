export class ServiceEntryPoint {
    desc: string;
    enabled: boolean;
    entryType: string;
    entryTypeId: number;
    fqm: string;
    id: number;
    name: string;
    tableType: string;
}

export class ErrorDetection {
    errDetectionId: number;
    ruleName: string;
    errorFrom: string;
    errorTo: string;
    enabled: boolean;
    ruleDesc: string;
}

export class AddIPDetection {
    backendType: string;
    backendTypeId: number;
    desc: string;
    enabled: boolean;
    fqm: string;
    id: number;
    name: string;
}

export class IntegrationPTDetection {
    type: string;
    detail: string;
    enabled: boolean;
    id: number;
    lstEndPoints: EndPoint[];
    namingRule: NamingRuleAndExitPoint;
}

export class EndPoint {
    id: number;
    name: string;
    description: string;
    enabled: boolean;
    fqm: string;
}

export class NamingRuleAndExitPoint {
    backendTypeId: number;
    databaseProductVersion: boolean;
    driverVersion: boolean;
    host: boolean;
    port: boolean;
    serviceName: boolean;
    tableName: boolean;
    topicName: boolean;
    url: boolean;
    lstEndPoints: EndPointInfo[];
}
export class EndPointInfo {
    id: number;
    enabled: boolean;
}

export class MethodMonitor {
    methodId: number;
    methodName: string;
    methodDisplayName: string;
    methodDesc: string;
}

export class MethodMonitorData {
    methodId: number;
    methodName: string;
    methodDisplayName: string;
    methodDesc: string;
}

export class HttpStatsMonitorData{
    compValue:string;
    condition: string;
    conditionName: string;
    cookieName: string;
    description: string;
    fpDumpMode: string;
    hmdId: number;
    hscid: number;
    htId: number;
    optId: number;
    valId: number;
}

export class BusinessTransMethodData    // Business Transaction Method by Lucky
{
    argumentIndex: number;
    btMethodId: number;
    enableArgumentType: boolean = false;
    fqm: string;
    returnType: string;
    rules: RulesData[];
}

export class RulesData {
    btMethodRuleId?: number;
    opCode?: number;
    parentBTMethodId?: number;
    opCodeDropDown?: { dropDownVal: number };
    previousBtMethodRulesIds?: any;
    value: string;
    btName: string;
    operationName: string;

}


export class BusinessTransPatternData   // Business Transaction Pattern by Lucky
{
    btId: number;
    btName: string;
    dynamicPartReq: boolean;
    headerKeyValue: string;
    id: number;
    include: string;
    matchType: string;
    mode: string;
    paramKeyValue: string;
    reqHeaderKey: string;
    reqHeaderValue: string;
    reqMethod: string;
    reqParamKey: string;
    reqParamValue: string;
    slowTransaction: number;
    urlName: string;
    verySlowTransaction: number;

}

export class BusinessTransGlobalData {
    complete: string;
    dynamicReqType: boolean;
    dynamicReqValue: string;
    httpMethod: boolean;
    id: string;
    profileId: string;
    requestHeader: string;
    requestParam: string;
    segmentType: string;
    segmentURI: string;
    segmentValue: string;
    slowTransaction: string;
    verySlowTransaction: string;
    uriType: string;
}

export class SessionAtrributeComponetsData {
    //  attrList : [{attrMode : number, attrName: string , attrType: string
    //      ,attrValues:[{lb:string, rb:string,specAttrValId: number, type : string, valName: string }],sessAttrId: number }];
    attrMode: number;
    attrName: string;
    attrType: string;
    lb: string;
    rb: string;
    specAttrValId: number;
    type: string;
    valName: string;
    sessAttrId: number;
    profileId: number;
    sessionType: string;
}

// export class SessionAtrributeComponetsData {
//     //  attrList : [{attrMode : number, attrName: string , attrType: string
//     //      ,attrValues:[{lb:string, rb:string,specAttrValId: number, type : string, valName: string }],sessAttrId: number }];
//     // // // attrMode : number;
//     // // attrName: string;
//     // // attrType: string;
//     // lb:string;
//     // rb:string;
//     // specAttrValId: number;
//     // type : string;
//     // valName: string;
//     // sessAttrId :number ;
//     attrName: string 
//      profileId: number;
//      sessionType : string;
//      attrType: string;
//      valName: string;
// }