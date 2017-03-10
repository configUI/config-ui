import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Rx';

/**Import RxJs Required methods */
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

import 'rxjs/add/operator/toPromise';

import * as URL from '../constants/config-ui-url-constant';
import { ApplicationData } from '../containers/application-data';
import { TopologyData } from '../containers/topology-data';
import { TierData } from '../containers/tier-data';
import { MainInfo } from '../interfaces/main-info';


@Injectable()
export class ConfigUiDataService {
  
  // private instance variable to hold base url
  url = "http://10.10.50.7:8001/configUI/";

  // Resolve HTTP using the constructor
  constructor(private http: Http) { }

  applicationData: ApplicationData[];
  topologyData: TopologyData[];

  getApplicationData(): Promise<ApplicationData[]> {
    if(this.applicationData != undefined){
      return Promise.resolve(this.applicationData);
    }
    return this.http.get(URL.FETCH_APP_TABLE_DATA).toPromise().then(response => {
      return this.applicationData = response.json();
    }).catch(this.handleError);
  }

  private handleError(error: any): Promise<any> {
    console.error("Erro occurred", error);
    return Promise.reject(error.message || error);
  }


  // Fetch all existing Profile
  getProfileData(): Observable<ApplicationData[]> {
    
    //If application data exist then no need to call ajax again.
    if(this.applicationData)
      return Observable.of(this.applicationData);

    // ...using get request
    return this.http.get(URL.FETCH_APP_TABLE_DATA)
      // ...and calling .json() on the response to return data
      .map((res: Response) => res.json() as ApplicationData[])
      //...errors if any
      .catch((error: any) => Observable.throw(error.json().error || 'Server error'));
  }

  // Fetch all existing Topology Data
  getTopologyDetail(): Observable<TopologyData[]> {
    if(this.topologyData)
     return Observable.of(this.topologyData);

    return this.http.get(`${URL.FETCH_TOPO_TABLE_URL}/12725`)
      .map((res: Response) => {
        return this.topologyData = res.json();
      })
      .catch((error: any) => Observable.throw(error.json().error || 'Server error'));
  }

  // Fetch all existing Tier Detail
  getTierDetail(): Observable<TierData[]> {
    return this.http.get(URL.FETCH_TIER_TABLE_URL)
      .map((res: Response) => res.json() as TierData[])
      .catch((error: any) => Observable.throw(error.json().error || 'Server error'));
  }


  

}