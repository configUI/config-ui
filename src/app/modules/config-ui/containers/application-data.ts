export class ApplicationData {
    private appDesc: string;
    private appId: number;
    private appName: string;
    private dcId: number;
    private dcTopoAssocId: number;
    private topoId: number;
    private topoName: string;
    private userName: string;

    public get $appDesc(): string {
        return this.appDesc;
    }

    public set $appDesc(value: string) {
        this.appDesc = value;
    }

    public get $appId(): number {
        return this.appId;
    }

    public set $appId(value: number) {
        this.appId = value;
    }

    public get $appName(): string {
        return this.appName;
    }

    public set $appName(value: string) {
        this.appName = value;
    }

    public get $dcId(): number {
        return this.dcId;
    }

    public set $dcId(value: number) {
        this.dcId = value;
    }

    public get $dcTopoAssocId(): number {
        return this.dcTopoAssocId;
    }

    public set $dcTopoAssocId(value: number) {
        this.dcTopoAssocId = value;
    }

    public get $topoId(): number {
        return this.topoId;
    }

    public set $topoId(value: number) {
        this.topoId = value;
    }

    public get $topoName(): string {
        return this.topoName;
    }

    public set $topoName(value: string) {
        this.topoName = value;
    }

    public get $userName(): string {
        return this.userName;
    }

    public set $userName(value: string) {
        this.userName = value;
    }
}
