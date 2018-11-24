export class NVAutoInjectionPolicyRule {
    id: number;
    ruleName: string = "";
    btName: string = "";
    httpUrl: string = "";
    extension: string = "";
    type: string = "";
    httpMethod: string = "";
    parameterName: string = "";
    parameterValue: string = "";
    parameterOperation: string = "";
    headerName: string = "";
    headerValue: string = "";
    headerOperation: string = "";
    queryParameter: string = "";
    httpHeader: string = "";
    enabled: boolean = false;
    exclude: boolean = false;
    profileId: number;
}

export class NVAutoInjectionTagRule {
    id: number;
    ruleName: string = "";
    htmlTag: string= "";
    beforeAfterTag: string = "1";
    enabled: boolean = false;
    jsCode: string = "";
}