export class  ServiceEntryPoint {
    desc: string;
    enabled: boolean;
    entryType: string;
    entryTypeId: number;
    fqm: string;
    id: number;
    name: string;
    tableType: string;
    isCustomEntry:boolean=true;
    module:string;
    agent: string;
    //Used to hold Category(whether predefined/Custom) for Download files feature
    entryTypeCategory: string;
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
    isCustomEntry:boolean=true;
    agent: string;
    module: string;
    argumentIndex: number;
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

export class IntegrationPT {
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
    isCustomEntry:boolean=true;
    agent: string;
    module: string;
    argumentIndex: number;
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
    module:string;
    agent: string;
}

export class ExceptionMonitor {
    exceptionId: number;
    exceptionName: string;
    exceptionDisplayName: string;
    exceptionDesc: string;
}

/**It stores exception-list data */
export class ExceptionMonitorData {
    exceptionId: number;
    exceptionName: string;
    exceptionDisplayName: string;
    exceptionDesc: string;
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
    argumentIndex: number = -1;
    btMethodId: number;
    enableArgumentType: boolean;
    fqm: string;
    returnType: string;
    rules: RulesData[];
    methodInvocation :string;
    methodInvocationIndex : number = -1;
}

export class RulesData {
    id: number;
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
    id: number;
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
    reqHeaderKey: string;
    reqHeaderValue: string;
    reqMethod: string;
    reqParamKey: string;
    reqParamValue: string;
    slowTransaction: string;
    urlName: string;
    verySlowTransaction: string;
    reqParamKeyVal : string;
    slowDynamicThreshold: string;
    verySlowDynamicThreshold: string;
    agent: string;
    parentBtId:number;
    asyncTrans: number;
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
    slowDynamicThreshold: string;
    verySlowDynamicThreshold: string;
    segmentNoVal: string;
    segmentNo: string;
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
    specAttrValId: number;
    id?: number;
    lb?: string;
    rb?: string;
    type?: number;
    valName?: string;
}

export class HTTPRequestHdrComponentData {
    attrMode?: number;
    attrValues?: RulesHTTPRequestHdrComponentData[];
    httpReqHdrBasedId: number;
    headerName: string;
    dumpMode: number;
    specific?: boolean;
    complete?: boolean;
    valueNames?:string;
    attrType: string;
    httpAttrId?: number;
    rules?: RulesHTTPRequestHdrComponentData[];
}

export class RulesHTTPRequestHdrComponentData {
    ruleId: number;
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
    kmdId: any;
}

/** BT HTTP HEADERS  */
export class BTHTTPHeaderData{
    id: number = 0;
    headerId: number;
    headerName: string;
    headerValType: string;
    hdrBtNames: string;
    conditions: BTHTTPHeaderConditions[];
}

/** BT HTTP HEADERS CONDITIONS */
export class BTHTTPHeaderConditions{
    id: number = 0;
    hdrCondId: number;
    btName: string;
    operation: string;
    hdrValue: string;

}

/** BT RESPONSE HEADERS  */
export class BTResponseHeaderData{
    id: number = 0;
    headerId: number;
    headerName: string;
    headerValType: string;
    hdrBtNames: string;
    conditions: BTResponseHeaderConditions[];
}

/** BT HTTP HEADERS CONDITIONS */
export class BTResponseHeaderConditions{
    id: number = 0;
    hdrCondId: number;
    btName: string;
    operation: string;
    hdrValue: string;
}

export class UrlCapturingData{
    includeParameter: boolean = false;
    urlOffset: number;
    maxChar: number;
}

//Request Param key/value in http bt configuration
export class RequestParamData{
    id: number;
    key: any;
    value: any;
}

export class HTTPResponseHdrComponentData {
    attrMode?: number;
    attrValues?: RulesHTTPResponseHdrComponentData[];
    httpRepHdrBasedId: number;
    headerName: string;
    dumpMode: number;
    specific?: boolean;
    complete?: boolean;
    valueNames?:string;
    attrType: string;
    httpAttrId?: number;
    rules?: RulesHTTPResponseHdrComponentData[];
}

export class RulesHTTPResponseHdrComponentData {
    ruleId: number;
    valName: string;
    lb: string;
    rb: string;
    id: number;
    customValTypeName: string;
    type: number;
}

export class AsynchronousRuleType {
    assocId: number;
    containerType: string;
    enabled: boolean;
    description: string;
}

/**BT HTTP Body */
export class BTHTTPBody{
    id: number;
    bodyType: string;
    xpath: string;
    cond: BTHTTPBodyConditions[];
    bodyBtNames: string;
    dataType: string;
}

/**BT HTTP Bpdy conditions */
export class BTHTTPBodyConditions{
    id: number;
    condId: number;
    btName: string;
    opCode: any;
    value: any;
}
export class FPMethodStackData {
    depthFP : number;
    durationFP : number;
    countStackTraceFP : number;
    durationStackTraceFP : number;
}

export class NDCCustomKeywordsComponentData{
    ndcKeyId:number;
    keywordName :string;
    value :string ;
    description: string;
    type: string;
    assocId:number;
}

export class BackendInterfaceTableInfo {
    type: string;
    detail: string;
    enabled: boolean;
    id: number;
    lstInterfaceEndPoints: InterfaceEndPoint[];
}

export class InterfaceEndPoint {
    id: number;
    name: string;
    description: string;
    enabled: boolean;
    fqm: string;
    isCustomEntry:boolean=true;
    agent: string;
    module: string;
    type: string;
    subType: string;
}

export class InterfaceDetail {
    type: string;
    detail: string;
    enabled: boolean;
    id: number;
    lstInterfaceEndPoints: InterfaceEndPoint[];
}

export class InterfacePoint {
    backendTypeInterfaceId: number;
    lstInterfaceEndPoints: InterfaceEndPointInfo[];
}

export class InterfaceEndPointInfo {
    id: number;
    enabled: boolean;
}