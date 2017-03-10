export class TierData {
    private tierId: number;
	private tierFileId: number;
	private tierDesc: string;
	private tierName: string;
	private profileId: number;
	private profileName: string;


	public get $tierId(): number {
		return this.tierId;
	}

	public set $tierId(value: number) {
		this.tierId = value;
	}

	public get $tierFileId(): number {
		return this.tierFileId;
	}

	public set $tierFileId(value: number) {
		this.tierFileId = value;
	}
    

	public get $tierDesc(): string {
		return this.tierDesc;
	}

	public set $tierDesc(value: string) {
		this.tierDesc = value;
	}

	public get $tierName(): string {
		return this.tierName;
	}

	public set $tierName(value: string) {
		this.tierName = value;
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
    
}
