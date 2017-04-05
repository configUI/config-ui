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

export class AddIPDetection{
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
    namingRule: NamingRule;
}

export class EndPoint {
    id: number;
    name: string;
    description: string;
    enabled: boolean;
    fqm: string;
}

export class NamingRule {
    backendTypeId: number;
    databaseProductVersion: boolean;
    driverVersion: boolean;
    host: boolean;
    port: boolean;
    serviceName: boolean;
    tableName: boolean;
    topicName: boolean;
    url: boolean;
    lstEndPoints: { id: number, enabled: true }[]
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

export class OperationType    // Business Transaction Rules by Lucky
{
    methodValue: string;
    btName: string;
    methodOperation: string;
}

export class BusinessTransMehtodData    // Business Transaction Method by Lucky
{
    argumentIndex: number;
    btMethodId: number;
    enableArgumentType: boolean;
    fqm: string;
    returnType: string;
    rules: {
        btMethodRuleId: number;
        opCode: number;
        parentBTMethodId: number;
        previousBtMethodRulesIds: any;
        value: string;
        btName: string;
        operationName: string;
    };
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