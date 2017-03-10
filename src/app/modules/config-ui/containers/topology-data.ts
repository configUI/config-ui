export class TopologyData {
    private dcTopoId: number;
    private profileId: number;
    private profileName: string;
    private topoDesc: string;
    private topoId: number;
    private topoName: string;
    private topoState: boolean;

	public get $dcTopoId(): number {
		return this.dcTopoId;
	}

	public set $dcTopoId(value: number) {
		this.dcTopoId = value;
	}

	public get $profileId(): number {
		return this.profileId;
	}

	public set $profileId(value: number) {
		this.profileId = value;
	}

	public get $profileName(): string {
		return this.profileName;
	}

	public set $profileName(value: string) {
		this.profileName = value;
	}

	public get $topoDesc(): string {
		return this.topoDesc;
	}

	public set $topoDesc(value: string) {
		this.topoDesc = value;
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

	public get $topoState(): boolean {
		return this.topoState;
	}

	public set $topoState(value: boolean) {
		this.topoState = value;
	}
    
}
