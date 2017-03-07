export class ApplicationData {
    private _appDesc: string;
    private _appId: number;
    private _appName: string;
    private _dcId: number;
    private _dcTopoAssocId: number;
    private _topoId: number;
    private _topoName: string;
    private _userName: string;


    public get appName(): string {
        return this._appName;
    }

    public set appName(value: string) {
        this._appName = value;
    }

    public get appDesc(): string {
        return this._appDesc;
    }

    public set appDesc(value: string) {
        this._appDesc = value;
    }

    public get userName(): string {
        return this._userName;
    }

    public set userName(value: string) {
        this._userName = value;
    }

    public get dcId(): number {
        return this._dcId;
    }

    public set dcId(value: number) {
        this._dcId = value;
    }

	public get appId(): number {
		return this._appId;
	}

	public set appId(value: number) {
		this._appId = value;
	}

	public get topoId(): number {
		return this._topoId;
	}

	public set topoId(value: number) {
		this._topoId = value;
	}

	public get dcTopoAssocId(): number {
		return this._dcTopoAssocId;
	}

	public set dcTopoAssocId(value: number) {
		this._dcTopoAssocId = value;
	}

	public get topoName(): string {
		return this._topoName;
	}

	public set topoName(value: string) {
		this._topoName = value;
	}
    
}
