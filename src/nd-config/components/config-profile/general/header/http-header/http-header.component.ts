// import { Component, OnInit } from '@angular/core';

// @Component({
//   selector: 'app-http-header',
//   templateUrl: './http-header.component.html',
//   styleUrls: ['./http-header.component.css']
// })
// export class HttpHeaderComponent implements OnInit {

//   constructor() { }

//   httpRequestCustomDialog: boolean = false;

//   ngOnInit() {
//   }

//    openMethodDialog() {
//     this.httpRequestCustomDialog = true;
//   }


// }

import { Component, OnInit } from '@angular/core';
import { ConfigUiUtility } from '../../../../../utils/config-utility';
import { SelectItem } from 'primeng/primeng';

@Component({
  // selector: 'app-http-request',
  // templateUrl: './http-request.component.html',
  // styleUrls: ['./http-request.component.css']
  selector: 'app-http-header',
  templateUrl: './http-header.component.html',
  styleUrls: ['./http-header.component.css']
})
export class HttpHeaderComponent implements OnInit {

  specifiedHeaderType: SelectItem[];
  selectedHeaderType: string;

  headerTypes: SelectItem[];
  selectedHeader: string;

  captureMode: SelectItem[];
  selectedCaptureMode: string;

  constructor() {
    var reqHdrList = ['Accept-Charset', 'Accept-Datetime', 'Accept-Encoding', 'Accept-Language', 'Accept', 'Authorization',
      'Cache-Control', 'Connection', 'Content-Length', 'Content-MD5', 'Cookie', 'DNT', 'Date', 'Expect',
      'Front-End-Https', 'Host', 'If-Match', 'If-Modified-Since', 'If-None-Match', 'If-Range', 'Proxy-Connection',
      'Range', 'Referer', 'TE', 'Upgrade', 'User-Agent', 'Via', 'X-ATT-DeviceId', 'X-Forwarded-For', 'X-Forwarded-Proto',
      'X-Requested-With', 'X-Wap-Profile'];

    this.specifiedHeaderType = ConfigUiUtility.createDropdown(reqHdrList);

    var reqHdrType = ['ALL Headers' , 'Specified Headers'];

    this.headerTypes = ConfigUiUtility.createDropdown(reqHdrType);

    var reqcaptureMode = ['complete' , 'brief'];

    this.captureMode = ConfigUiUtility.createDropdown(reqcaptureMode);


  }

  ngOnInit() {
  }

}
