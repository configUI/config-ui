export class NDE {
    id: number;
    name: any;
    ip: any;
    port: any;
    isMaster: any;
    wsPort: any;
    wssPort: any;

}

export class NDERoutingRules {
    id: number;
    nde: NDE;
    tierGroup: any;

}
