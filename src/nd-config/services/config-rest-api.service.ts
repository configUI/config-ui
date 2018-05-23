import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Rx';
import { CavTopPanelNavigationService } from './cav-top-panel-navigation.service';
import { CavConfigService } from './cav-config.service';

import './config-rxjs-import';

import {ConfigUtilityService} from './config-utility.service';

import * as URL from '../constants/config-url-constant';

@Injectable()
export class ConfigRestApiService {


  constructor(private _navService: CavTopPanelNavigationService, private _productConfig: CavConfigService, private http: Http, private configUtilityService: ConfigUtilityService) { }

  className: string = "ConfigRestApiService";
 // productKey = this._productConfig.$productKey;
  // Fetch data

  /**
   * This method is used for set user name in audit log 
   * @param url 
   */
  setUserNameForAuditLog(url: string):void
  { 
    // if(url.indexOf("?") > 0)
    //  url = this._productConfig.getINSPrefix () +  this._navService.getDCNameForScreen('ndConfig') + url + "&productKey=" + this.productKey;
    // else
    //  url = this._productConfig.getINSPrefix () +  this._navService.getDCNameForScreen('ndConfig') + url + "?productKey=" + this.productKey;

    this.http.get(url).subscribe((data) => {
      console.log('Data: ', data);
    })
  }

  getDataByGetReq(url: string): Observable<any> {
    // if(url.indexOf("?") > 0)
    //  url = this._productConfig.getINSPrefix () +  this._navService.getDCNameForScreen('ndConfig') + url + "&productKey=" + this.productKey;
    // else
    //  url = this._productConfig.getINSPrefix () +  this._navService.getDCNameForScreen('ndConfig') + url + "?productKey=" + this.productKey;
    
   var userNameUrl = `${URL.LOGGED_USER_NAME}/${sessionStorage.getItem("sesLoginName")}`;
   this.setUserNameForAuditLog(userNameUrl);

    this.configUtilityService.progressBarEmit({flag: true, color: 'primary'});
    // ...using get request
    return this.http.get(url)
      // ...and calling .json() on the response to return data
      .map((res: Response) => {
        this.configUtilityService.progressBarEmit({flag: false, color: 'primary'});
        return res.json();
      })
      //...errors if any
      .catch((error: any) => { this.configUtilityService.progressBarEmit({flag: true, color: 'warn'}); return Observable.throw(error.json().error || 'Server Error')})
  }

  getDataByGetReqForRunningTestStatus(url: string): Observable<any> {
  //  if(url.indexOf("?") > 0)
  //    url = this._productConfig.getINSPrefix () +  this._navService.getDCNameForScreen('ndConfig') + url + "&productKey=" + this.productKey;
  //   else
  //    url = this._productConfig.getINSPrefix () +  this._navService.getDCNameForScreen('ndConfig') + url + "?productKey=" + this.productKey;

 // this.configUtilityService.progressBarEmit({flag: true, color: 'primary'});
    // ...using get request
      return this.http.get(url)
      // ...and calling .json() on the response to return data
      .map((res: Response) => {
        //this.configUtilityService.progressBarEmit({flag: false, color: 'primary'});
        return res.json();
      })
      //...errors if any
      .catch((error: any) => { console.log("error = "+ error ); return Observable.throw(error.json().error || 'Server Error')})
  }

    // Fetch data
  getDataByGetReqWithNoJson(url: string): Observable<any> {
  //  if(url.indexOf("?") > 0)
  //    url = this._productConfig.getINSPrefix () +  this._navService.getDCNameForScreen('ndConfig') + url + "&productKey=" + this.productKey;
  //   else
  //    url = this._productConfig.getINSPrefix () +  this._navService.getDCNameForScreen('ndConfig') + url + "?productKey=" + this.productKey;   
 
  var userNameUrl = `${URL.LOGGED_USER_NAME}/${sessionStorage.getItem("sesLoginName")}`;
  this.setUserNameForAuditLog(userNameUrl);

   this.configUtilityService.progressBarEmit({flag: true, color: 'primary'});
    // ...using get request
    return this.http.get(url)
      .map((res: Response) => {
        this.configUtilityService.progressBarEmit({flag: false, color: 'primary'});
        return res;
      })
      //...errors if any
      .catch((error: any) => { this.configUtilityService.progressBarEmit({flag: true, color: 'warn'}); return Observable.throw(error.json().error || 'Server Error')})
  }

  getDataByPostReq(url: string, body?: any): Observable<any> {
  //  if(url.indexOf("?") > 0)
  //    url = this._productConfig.getINSPrefix () +  this._navService.getDCNameForScreen('ndConfig') + url + "&productKey=" + this.productKey;
  //   else
  //    url = this._productConfig.getINSPrefix () +  this._navService.getDCNameForScreen('ndConfig') + url + "?productKey=" + this.productKey;   
 
  var userNameUrl = `${URL.LOGGED_USER_NAME}/${sessionStorage.getItem("sesLoginName")}`;
  this.setUserNameForAuditLog(userNameUrl);

   this.configUtilityService.progressBarEmit({flag: true, color: 'primary'});
    if(body == undefined)
      body = {};
    let headers = new Headers({ 'Content-type': 'application/json' });// ... Set content type to JSON
    let options = new RequestOptions({ headers: headers });// Create a request option
    
    console.info(this.className, "getDataByPostReq", "URL", url, "Body", body);

    return this.http.post(url, body, options) // ...using post request
      // ...and calling .json() on the response to return data
      .map((res: Response) => {
        this.configUtilityService.progressBarEmit({flag: false, color: 'primary'});
        return res.json();
      })
      //...errors if any
      .catch((error: any) => { this.configUtilityService.progressBarEmit({flag: true, color: 'warn'}); return Observable.throw(error.json().error || 'Server Error' )});
  }


  
  getDataByPutReq(url: string, body?: Object): Observable<any> {
  //  if(url.indexOf("?") > 0)
  //    url = this._productConfig.getINSPrefix () +  this._navService.getDCNameForScreen('ndConfig') + url + "&productKey=" + this.productKey;
  //   else
  //    url = this._productConfig.getINSPrefix () +  this._navService.getDCNameForScreen('ndConfig') + url + "?productKey=" + this.productKey;

  var userNameUrl = `${URL.LOGGED_USER_NAME}/${sessionStorage.getItem("sesLoginName")}`;
  this.setUserNameForAuditLog(userNameUrl);

    let headers = new Headers({ 'Content-type': 'application/json' });// ... Set content type to JSON
    let options = new RequestOptions({ headers: headers });// Create a request option
    
    console.info(this.className, "getDataByPutReq", "URL", url, "Body", body);

    return this.http.put(url, body, options) // ...using post request
      // ...and calling .json() on the response to return data
      .map((res: Response) => res.json())
      //...errors if any
      .catch((error: any) => Observable.throw(error.json().error || 'Server Error'));
  }
/*  Get Agent Info according selected DC */
  getAgentDataByGetReq(url: string): Observable<any> {
  //  if(url.indexOf("?") > 0)
  //    url = this._productConfig.getINSPrefix () +  this._navService.getDCNameForScreen('ndAgent') + url + "&productKey=" + this.productKey;
  //   else
  //    url = this._productConfig.getINSPrefix () +  this._navService.getDCNameForScreen('ndAgent') + url + "?productKey=" + this.productKey;  
  
  var userNameUrl = `${URL.LOGGED_USER_NAME}/${sessionStorage.getItem("sesLoginName")}`;
  this.setUserNameForAuditLog(userNameUrl);

  this.configUtilityService.progressBarEmit({flag: true, color: 'primary'});
    // ...using get request
    return this.http.get(url)
      // ...and calling .json() on the response to return data
      .map((res: Response) => {
        this.configUtilityService.progressBarEmit({flag: false, color: 'primary'});
        return res.json();
      })
      //...errors if any
      .catch((error: any) => { this.configUtilityService.progressBarEmit({flag: true, color: 'warn'}); return Observable.throw(error.json().error || 'Server Error')})
  }

/* This method is used for get value in xml format */
 getXMLDataByPostReq(url: string, body?: any): Observable<any> {
  //  if(url.indexOf("?") > 0)
  //    url = this._productConfig.getURLByActiveDC() + url + "&productKey=" + this.productKey;
  //   else
  //    url = this._productConfig.getURLByActiveDC() + url + "?productKey=" + this.productKey;  

  var userNameUrl = `${URL.LOGGED_USER_NAME}/${sessionStorage.getItem("sesLoginName")}`;
  this.setUserNameForAuditLog(userNameUrl);

  this.configUtilityService.progressBarEmit({flag: true, color: 'primary'});
    if(body == undefined)
      body = {};
    let headers = new Headers({ 'Content-type': 'application/xml' });// ... Set content type to XML
    let options = new RequestOptions({ headers: headers });// Create a request option

    console.info(this.className, "getDataByPostReq", "URL", url, "Body", body);

    return this.http.post(url, body, options) // ...using post request
        .map((res: Response) => {
        this.configUtilityService.progressBarEmit({flag: false, color: 'primary'});
        return res;
      })
      //...errors if any
      .catch((error: any) => { this.configUtilityService.progressBarEmit({flag: true, color: 'warn'}); return Observable.throw(error.json().error || 'Server Error' )});
  }

  getDataByPostReqWithNoJSON(url: string, body?: any): Observable<any> {
    // if(url.indexOf("?") > 0)
    //  url = this._productConfig.getINSPrefix () +  this._navService.getDCNameForScreen('ndConfig') + url + "&productKey=" + this.productKey;
    // else
    //  url = this._productConfig.getINSPrefix () +  this._navService.getDCNameForScreen('ndConfig') + url + "?productKey=" + this.productKey;  
    var userNameUrl = `${URL.LOGGED_USER_NAME}/${sessionStorage.getItem("sesLoginName")}`;
    this.setUserNameForAuditLog(userNameUrl);

    this.configUtilityService.progressBarEmit({flag: true, color: 'primary'});
    if(body == undefined)
      body = {};
    let headers = new Headers({ 'Content-type': 'application/json' });// ... Set content type to JSON
    let options = new RequestOptions({ headers: headers });// Create a request option
    
    console.info(this.className, "getDataByPostReq", "URL", url, "Body", body);

    return this.http.post(url, body, options) // ...using post request
      // ...and calling .json() on the response to return data
      .map((res: Response) => {
        this.configUtilityService.progressBarEmit({flag: false, color: 'primary'});
        return res;
      })
      //...errors if any
      .catch((error: any) => { this.configUtilityService.progressBarEmit({flag: true, color: 'warn'}); return Observable.throw(error.json().error || 'Server Error' )});
  }
}
