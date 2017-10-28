import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { WdInputs } from '../containers/wd-inputs';
import { DashboardDataCache } from '../containers/dashboard-data-cache';

@Injectable()
export class CavConfigService {

	private protocol = 'http';
	private host = window.location.hostname;
	private port = window.location.port;
	private productName = 'netstorm';
	private productType = '';
	private userName: string = null;
	private userType = 'Engineer';
	private userRole = 'Standard';
	private userGroup = 'netstorm';
	private serverIP: string = null;
	private appPath: string = null;
	private serverType = '';
	private serverTitle = '';
	private productMode = '';
	private timeZone = 'IST';
	private workPath = '';
	private openDashboardInTab = true;
	private dashboardTestRun: number = -1;

	private selectedDataCenter = 'ALL';
	private dcInfoArr: any[] = [];
	private aggregateDCString = '';
	private nonAggDCString = '';
	private controllerName = '';
	private serialNumberOfServer = '';
	public clientConnectionKey = null;
	wdExternalInputs: WdInputs = null;
	wdOpenOnStart = false;
	private dashboardDataCache: DashboardDataCache = null;
	private aclAccessRight: string;
	private testRunAccessPrivileges: any;

	private sessionTestNumChange = new Subject<any>();
	sessionTestNumChange$ = this.sessionTestNumChange.asObservable();
	constructor() {
		// this.openDashboardInTab = true;
		this.serverIP = '//' + this.host + ':' + this.port + '/';
		this.appPath = this.serverIP + 'ProductUI';
	}

	/* Getting values from session storage if browser refresh happend. */
	public restoreConfiguration() {
		try {
			console.info('Restoring configuration from session.');

			this.userName = sessionStorage.getItem('sesLoginName');
			this.userGroup = sessionStorage.getItem('sessGroupName');
			this.userType = sessionStorage.getItem('sessUserType');
			this.userRole = sessionStorage.getItem('sesRole');
			this.productType = sessionStorage.getItem('strServerType');
			this.serverTitle = sessionStorage.getItem('sessServerTitle');
			this.productMode = sessionStorage.getItem('productType');
			this.workPath = sessionStorage.getItem('workPath');
			this.productName = sessionStorage.getItem('sessServerTitle');
			this.timeZone = sessionStorage.getItem('timeZone');
			this.controllerName = sessionStorage.getItem('controllerName');
			this.serialNumberOfServer = sessionStorage.getItem('serialNumber');

			if (sessionStorage.getItem('dashboardTestRun') !== null && sessionStorage.getItem('dashboardTestRun') !== undefined) {
				this.dashboardTestRun = parseInt(sessionStorage.getItem('dashboardTestRun'), 10);
				if (sessionStorage.getItem('clientConnectionKey') !== null && sessionStorage.getItem('clientConnectionKey') !== undefined) {
					this.clientConnectionKey = sessionStorage.getItem('clientConnectionKey');
				}
			}

		} catch (e) {
			console.error('Error in restoring session.');
			console.error(e);
		}
	}

	public get $protocol(): string {
		return this.protocol;
	}

	public set $protocol(value: string) {
		this.protocol = value;
	}

	public get $host(): string {
		return this.host;
	}

	public set $host(value: string) {
		this.host = value;
	}

	public get $port(): string {
		return this.port;
	}

	public set $port(value: string) {
		this.port = value;
	}

	public get $productName(): string {
		return this.productName;
	}

	public set $productName(value: string) {
		this.productName = value;
	}

	public get $userName(): string {
		return this.userName;
	}

	public set $userName(value: string) {
		this.userName = value;
	}

	public get $userType(): string {
		return this.userType;
	}

	public set $userType(value: string) {
		this.userType = value;
	}

	public get $serverIP(): string {
		return this.serverIP;
	}

	public set $serverIP(value: string) {
		this.serverIP = value;
	}

	public set $dashboardDataCache(dashboardDataCache: DashboardDataCache) {
		this.dashboardDataCache = dashboardDataCache;
	}

	public get $dashboardDataCache() {
		return this.dashboardDataCache;
	}

	public get $appPath(): string {
		if (sessionStorage.getItem('isMultiDCMode')) {
			return sessionStorage.getItem('appPathForDC');
		}
		else {
			return this.appPath;
		}
	}

	public set $appPath(value: string) {
		this.appPath = value;
	}

	public get $openDashboardInTab(): boolean {
		return this.openDashboardInTab;
	}

	public set $openDashboardInTab(value: boolean) {
		this.openDashboardInTab = value;
	}

	public get $dashboardTestRun(): number {
		return this.dashboardTestRun;
	}

	public set $dashboardTestRun(value: number) {
		console.log('Opening dashboard with testRun =', value);
		this.dashboardTestRun = value;
		this.sessionTestNumChange.next(value);
		/*On Every new Test Run connection key got reset. */
		this.clientConnectionKey = null;
		/**On Every new Test Run cache is cleared. */
		this.dashboardDataCache = null;
	}

	/* using for external link such as copy favorite link */
	public get $wdExternalInputs(): WdInputs {
		return this.wdExternalInputs;
	}

	public set $wdExternalInputs(value: WdInputs) {
		this.wdExternalInputs = value;
	}

	public get $userGroup(): string {
		return this.userGroup;
	}

	public set $userGroup(value: string) {
		this.userGroup = value;
	}

	public get $userRole(): string {
		return this.userRole;
	}

	public set $userRole(value: string) {
		this.userRole = value;
	}

	public get $productType(): string {
		return this.productType;
	}

	public set $productType(value: string) {
		this.productType = value;
	}

	public get $serverType(): string {
		return this.serverType;
	}

	public set $serverType(value: string) {
		this.serverType = value;
	}

	public get $serverTitle(): string {
		return this.serverTitle;
	}

	public set $serverTitle(value: string) {
		this.serverTitle = value;
	}

	public get $productMode(): string {
		return this.productMode;
	}

	public set $productMode(value: string) {
		this.productMode = value;
	}

	public get $timeZone(): string {
		return this.timeZone;
	}

	public set $timeZone(value: string) {
		this.timeZone = value;
	}

	public get $workPath(): string {
		return this.workPath;
	}

	public set $workPath(value: string) {
		this.workPath = value;
	}

	public get $controllerName(): string {
		return this.controllerName;
	}

	public set $controllerName(value: string) {
		this.controllerName = value;
	}

	/**client connection key for the access log */
	public get $clientConnectionKey(): string {
		return this.clientConnectionKey;
	}

	public set $clientConnectionKey(value: string) {
		this.clientConnectionKey = value;
	}

	public get $serialNumberOfServer(): string {
		return this.serialNumberOfServer;
	}

	public set $serialNumberOfServer(value: string) {
		this.serialNumberOfServer = value;
	}

	/* Getter Setter For Multi DC Env  */

	// Prefix for Aggreagte Specific URL's
	public setINSAggrPrefix(url) {
		this.aggregateDCString = url;
	}

	public getINSAggrPrefix() {
		if (sessionStorage.getItem('isMultiDCMode') === undefined || sessionStorage.getItem('isMultiDCMode') === null) {
			return `//${this.host}:${this.port}`;
		} else {
			if (this.getActiveDC() !== 'ALL') {
				return `//${this.host}:${this.port}/tomcat/`;
			}
			return sessionStorage.getItem('INSAggrPrefix');
		}
	}

	// Prefix for Non Aggr Specific URL
	public setINSPrefix(url) {
		this.nonAggDCString = url;
	}

	public getINSPrefix() {
		if (sessionStorage.getItem('isMultiDCMode') === undefined || sessionStorage.getItem('isMultiDCMode') === null)
			return `//${this.host}:${this.port}`;
		else
			return sessionStorage.getItem('INSPrefix');
	}

	/*Setting Active DC*/
	public setActiveDC(dcName) {
		this.selectedDataCenter = dcName;
	}

	public getActiveDC() {
		if (sessionStorage.getItem('isMultiDCMode'))
			return sessionStorage.getItem('activeDC');
		else
			return this.selectedDataCenter;
	}

	/*Setting DC Obj*/
	public setDCInfoObj(dcArrObj) {
		this.dcInfoArr = dcArrObj;
	}
	public getDCInfoObj() {
		return this.dcInfoArr;
	}

	/** Get IP for Selected DC in case of MultiDC else return current host IP */
	public getURLByActiveDC(dc?) {
		try {
			if (sessionStorage.getItem('isMultiDCMode') === undefined)
				return this.serverIP;
			else {
				let dcName = (dc === undefined) ? this.getActiveDC() : dc;

				// In case ALL is selected, open JSP with Master DC IP
				if (dcName === 'ALL') {
					for (let property in this.dcInfoArr) {
						if (this.dcInfoArr[property].isMaster === true) {
							dcName = this.dcInfoArr[property].dc;
							break;
						}
						else
							continue;
					}
				}

				let host = this.dcInfoArr.find((info) => {
					return info.dc === dcName;
				});
				if (host === null || host === undefined) {
				  return this.serverIP;
 				} else {
				  return `${host.protocol}://${host.ip}:${host.port}/`;
				}
			}
		} catch (e) {
			console.log('In method getIPForJSP. Error while getting IP.', e);
			return this.serverIP;
		}
	}
	public get $aclAccessRight(): string {
		return this.aclAccessRight;
	}

	public set $aclAccessRight(value: string) {
		this.aclAccessRight = value;
	} 

	public get $testRunAccessPrivileges(): any {
		return this.testRunAccessPrivileges;
	}

	public set $testRunAccessPrivileges(value: any) {
		this.testRunAccessPrivileges = value;
	}
}
