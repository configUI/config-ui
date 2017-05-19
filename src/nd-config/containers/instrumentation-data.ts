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
export class BackendTableInfo {
    type: string;
    detail: string;
    enabled: boolean;
    id: number;
    lstEndPoints: EndPoint[];
    namingRule: NamingRule;
}

export class NamingRule {
    databaseProductName: boolean;
    databaseProductVersion: boolean;
    driverName: boolean;
    driverVersion: boolean;
    host: boolean;
    port: boolean;
    query: boolean;
    serviceName: boolean;
    tableName: boolean;
    topicName: boolean;
    url: boolean;
    userName: boolean;
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
    databaseProductName: boolean;
    databaseProductVersion: boolean;
    driverName: boolean;
    driverVersion: boolean;
    host: boolean;
    port: boolean;
    query: boolean;
    serviceName: boolean;
    tableName: boolean;
    topicName: boolean;
    url: boolean;
    userName: boolean;
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

export class HttpStatsMonitorData {  //Http stats monitors by Surbhi
    compValue: string;
    condition?: string;
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
    enableArgumentType: string;
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

export class ArgumentRulesData {
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
    slowTransaction: string;
    urlName: string;
    verySlowTransaction: string;

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

export class SessionAtrributeComponentsData {
    attrMode?: number;
    attrName: string;
    attrType: string;
    specific?: boolean;
    complete?: boolean;
    sessAttrId?: number;
    valName?: string;
     attrValues: SessionTypeValueData[];
}

export class SessionTypeValueData {
    customValTypeName: string;
    id?: number;
    lb?: string;
    rb?: string;
    type?: number;
    valName?: string;
}

export class HTTPRequestHdrComponentData {
    attrValues?: RulesHTTPRequestHdrComponentData[];
    httpReqHdrBasedId: number;
    headerName: string;
    dumpMode: number;
    specific?: boolean;
    complete?: boolean;
    valueNames?:string;
    rules?: RulesHTTPRequestHdrComponentData[];
}

export class RulesHTTPRequestHdrComponentData {
  //  ruleId: number;
    valName: string;
    lb: string;
    rb: string;
    id: number;
    customValTypeName: string;
    type: number;
}


export class CustomKeywordsComponentData{
    id:number;
    keywordName :string;
    value :string ;
    description: string;
    enable:boolean;

}