import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/toPromise';

import * as URL from '../constants/config-ui-url-constant';
import { ApplicationData } from '../containers/application-data';


@Injectable()
export class ConfigUiDataService {

  url = "http://10.10.50.7:8001/configUI/";

  constructor(private http: Http) { }

  getMainData(): Promise<any> {
    return this.http.get(URL.HOME_SCREEN_URL).toPromise().then(response => response.json()).catch(this.handleError);
  }

  getApplicationData(): Promise<ApplicationData[]> {
    return this.http.get(URL.FETCH_APP_TABLE_DATA).toPromise().then(response => response.json() as ApplicationData[]).catch(this.handleError);
  }

  private handleError(error: any): Promise<any> {
    console.error("Erro occurred", error);
    return Promise.reject(error.message || error);
  }
}
