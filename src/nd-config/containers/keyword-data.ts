export class KeywordData {
    assocId: number;
    defaultValue: number;
    keyId: number;
    max: number;
    min: number;
    value: number | string;
    path?: string;
}

export class KeywordList{

}

export class UserConfiguredKeywords{
    defaultValue: any;
    keyId: number;
    max: any = '';
    min: any = '';
    path?: string;
    desc: string = '';
    keyName: string;
    kmdId: number;
    agentMode: any;
    type: string = "user-configured";
}

export class UserConfiguredNDCKeywords{
    defaultValue: any;
    keyId: number;
    max: any = '';
    min: any = '';
    path?: string;
    desc: string = '';
    keyName: string;
    type: string = "user-configured";
}