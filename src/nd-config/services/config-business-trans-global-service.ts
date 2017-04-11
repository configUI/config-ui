import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Rx'

import { ConfigRestApiService } from './config-rest-api.service';
import { BusinessTransGlobalInfo } from '../interfaces/business-Trans-global-info';
import { BusinessTransPatternInfo } from '../interfaces/business-trans-pattern-info';
import { BusinessTransMethodInfo } from '../interfaces/business-trans-method-info'
import * as URL from '../constants/config-url-constant';

@Injectable()
export class ConfigBusinessTranService {

    constructor(private _restApi: ConfigRestApiService) { }

    /* Fetch  Business Trans Global Info */
    getBusinessTransGlobalData(): Observable<BusinessTransGlobalInfo> {
        return this._restApi.getDataByGetReq(URL.FETCH_BT_GLOBAL_DATA);
    }

   /* Fetch  Business Trans Pattern Info */
    getBusinessTransPatternData(): Observable<BusinessTransPatternInfo> {
        return this._restApi.getDataByGetReq(URL.FETCH_BT_PATTERN_TABLEDATA);
    }

    /* Fetch  Business Trans Method Info */
    getBusinessTransMethodData(): Observable<BusinessTransMethodInfo> {
        return this._restApi.getDataByGetReq(URL.FETCH_BTMETHOD_URL);
    }
   
    /* Fetch  Business Trans Method Info */
    deleteBusinessTransMethodData(data): Observable<BusinessTransMethodInfo> {
        return this._restApi.getDataByPostReq(URL.DEL_METHOD_BT , data);
    }
    
    
}

