import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Rx';

import './config-rxjs-import';

import { ConfigUtilityService } from './config-utility.service';

@Injectable()
export class ConfigRestApiService {

  constructor(private http: Http, private configUtilityService: ConfigUtilityService) { }

  className: string = "ConfigRestApiService";

  // Fetch data
  getDataByGetReq(url: string): Observable<any> {
    this.configUtilityService.progressBarEmit({ flag: true, color: 'primary' });
    // ...using get request
    return this.http.get(url)
      // ...and calling .json() on the response to return data
      .map((res: Response) => {
        this.configUtilityService.progressBarEmit({ flag: false, color: 'primary' });
        return res.json();
      })
      //...errors if any
      .catch((error: any) => {
        this.configUtilityService.progressBarEmit({ flag: true, color: 'warn' });
        this.configUtilityService.errorMessage("Error: Check guiError.log for more details")
        return Observable.throw(error.json().error || 'Server Error')
      })
  }

  // Fetch data
  getDataByGetReqWithNoJson(url: string): Observable<any> {
    this.configUtilityService.progressBarEmit({ flag: true, color: 'primary' });
    // ...using get request
    return this.http.get(url)
      .map((res: Response) => {
        this.configUtilityService.progressBarEmit({ flag: false, color: 'primary' });
        return res;
      })
      //...errors if any
      .catch((error: any) => {
        this.configUtilityService.progressBarEmit({ flag: true, color: 'warn' });
        this.configUtilityService.errorMessage("Error: Check guiError.log for more details")
        return Observable.throw(error.json().error || 'Server Error')
      })
  }

  getDataByPostReq(url: string, body?: any): Observable<any> {
    this.configUtilityService.progressBarEmit({ flag: true, color: 'primary' });
    if (body == undefined)
      body = {};
    let headers = new Headers({ 'Content-type': 'application/json' });// ... Set content type to JSON
    let options = new RequestOptions({ headers: headers });// Create a request option

    console.info(this.className, "getDataByPostReq", "URL", url, "Body", body);

    return this.http.post(url, body, options) // ...using post request
      // ...and calling .json() on the response to return data
      .map((res: Response) => {
        this.configUtilityService.progressBarEmit({ flag: false, color: 'primary' });
        return res.json();
      })
      //...errors if any
      .catch((error: any) => {
        this.configUtilityService.progressBarEmit({ flag: true, color: 'warn' });
        this.configUtilityService.errorMessage("Error: Check guiError.log for more details")
        return Observable.throw(error.json().error || 'Server Error')
      });
  }

  getDataByPutReq(url: string, body?: Object): Observable<any> {
    let headers = new Headers({ 'Content-type': 'application/json' });// ... Set content type to JSON
    let options = new RequestOptions({ headers: headers });// Create a request option

    console.info(this.className, "getDataByPutReq", "URL", url, "Body", body);

    return this.http.put(url, body, options) // ...using post request
      // ...and calling .json() on the response to return data
      .map((res: Response) => res.json())
      //...errors if any
      .catch((error: any) => Observable.throw(error.json().error || 'Server Error'));

  }

  //  Get Agent Info according selected DC 
  getAgentDataByGetReq(url: string): Observable<any> {
    this.configUtilityService.progressBarEmit({ flag: true, color: 'primary' });  // ...using get request
    return this.http.get(url) // ...and calling .json() on the response to return data
      .map((res: Response) => {
        this.configUtilityService.progressBarEmit({ flag: false, color: 'primary' });
        return res.json();
      })
      //...errors if any
      .catch((error: any) => {
        this.configUtilityService.progressBarEmit({ flag: true, color: 'warn' });
        this.configUtilityService.errorMessage("Error: Check guiError.log for more details")
        return Observable.throw(error.json().error || 'Server Error')
      })
  }

  // This method is used for get value in xml format     
  getXMLDataByPostReq(url: string, body?: any): Observable<any> {
    this.configUtilityService.progressBarEmit({ flag: true, color: 'primary' });
    if (body == undefined)
      body = {};
    let headers = new Headers({ 'Content-type': 'application/xml' });// ... Set content type to XML
    let options = new RequestOptions({ headers: headers });// Create a request option
    console.info(this.className, "getDataByPostReq", "URL", url, "Body", body);
    return this.http.post(url, body, options) // ...using post request
      .map((res: Response) => {
        this.configUtilityService.progressBarEmit({ flag: false, color: 'primary' });
        return res;
      })
      //...errors if any
      .catch((error: any) => {
        this.configUtilityService.progressBarEmit({ flag: true, color: 'warn' });
        this.configUtilityService.errorMessage("Error: Check guiError.log for more details")
        return Observable.throw(error.json().error || 'Server Error')
      });
  }

}