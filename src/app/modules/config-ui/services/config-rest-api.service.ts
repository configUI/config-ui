import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Rx';

import './config-rxjs-import';

@Injectable()
export class ConfigRestApiService {

  constructor(private http: Http) { }

  className: string = "ConfigRestApiService";

  // Fetch data
  getDataByGetReq(url: string): Observable<any> {
    // ...using get request
    return this.http.get(url)
      // ...and calling .json() on the response to return data
      .map((res: Response) => res.json())
      //...errors if any
      .catch((error: any) => Observable.throw(error.json().error || 'Server Error'))
  }

  getDataByPostReq(url: string, body?: any): Observable<any> {
    if(body == undefined)
      body = {};
    let headers = new Headers({ 'Content-type': 'application/json' });// ... Set content type to JSON
    let options = new RequestOptions({ headers: headers });// Create a request option
    
    console.info(this.className, "getDataByPostReq", "URL", url, "Body", body);

    return this.http.post(url, body, options) // ...using post request
      // ...and calling .json() on the response to return data
      .map((res: Response) => res.json())
      //...errors if any
      .catch((error: any) => Observable.throw(error.json().error || 'Server Error'));
  }

  getDataByPutReq(url: string, body: Object): Observable<any> {
    let headers = new Headers({ 'Content-type': 'application/json' });// ... Set content type to JSON
    let options = new RequestOptions({ headers: headers });// Create a request option
    
    console.info(this.className, "getDataByPutReq", "URL", url, "Body", body);

    return this.http.put(url, body, options) // ...using post request
      // ...and calling .json() on the response to return data
      .map((res: Response) => res.json())
      //...errors if any
      .catch((error: any) => Observable.throw(error.json().error || 'Server Error'));
  }

}
