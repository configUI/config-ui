import { Injectable } from '@angular/core';
import { Http, Headers, Response } from '@angular/http';
import { Observable, Subject } from 'rxjs';
import { ServiceInfo } from '../interfaces/service-info';
import 'rxjs/add/operator/map'
import { CavConfigService } from './cav-config.service';
import { CavDataApiService } from './cav-data-api.service';
import { CavTopPanelNavigationService } from './cav-top-panel-navigation.service';

@Injectable()
export class AuthenticationService {
    private userNameWithPass: String;

    private ServiceBroadcaster = new Subject<Array<ServiceInfo>>();
    ServiceProvide = this.ServiceBroadcaster.asObservable();
    
      private canDeactivatelogoutFlag: boolean; /* This tells deactivate method of routing guard that logout button is clicked*/

    constructor(private http: Http,
        private _config: CavConfigService,
        private _cavDataApiService: CavDataApiService,
        private _navigation: CavTopPanelNavigationService) {

    }

    login(username: string, password: string) {
        console.log('login method called..');
        this.userNameWithPass = username + "|" + password;

        return this.http.get(this._config.$serverIP + 'ProductUI/productSummary/SummaryWebService/authenticate?queryString=' + this.userNameWithPass)
            .map((response: Response) => response.json());
    }

    createJspSession(Url: string) {
        console.log('createJspSession method called -- ', Url);
        return this.http.get(Url).map(res => res.json()).subscribe(res => (this.doAssignValueTestRun(res)));
    }

    doAssignValueTestRun(res) {
        console.log(res);
    }

    logout() {
	console.log("Going to remove navigation links on log out");
	this._navigation.setNavigationLinksonLogOut([]);
        // remove user from local storage to log user out
        localStorage.removeItem('currentUser');
    }

    // getting Data from server 
    getServiceData() {
        try {
            this._cavDataApiService.getDataByRESTAPI(this._config.$serverIP +
                'DashboardServer/web/NOandNFDataService/getDataforNOandNF', '')
                .subscribe(
                result => {
                    this.ServiceBroadcaster.next(result);
                },
                error => {
                    console.log('error in getting data from server --> ', error);
                },
                () => {

                }
                );
        } catch (error) {
            console.log('error in getting data from server --> ', error);
        }
    }

    validateUserBeforeLogin(userName: string, passWord: string) {
        console.log('validateUserBeforeLogin method called..');
        try {

            return this.http.get(this._config.$serverIP + 'DashboardServer/acl/user/authenticateUser?userName=' + userName + '&passWord=' + passWord)
                .map((response: Response) => response.json());

        } catch (error) {
            console.log('error in while validating user --> ', error);
        }
    }


    public get $canDeactivatelogoutFlag(): boolean {
        return this.canDeactivatelogoutFlag;
    }

    public set $canDeactivatelogoutFlag(value: boolean) {
        this.canDeactivatelogoutFlag = value;
    }

}
