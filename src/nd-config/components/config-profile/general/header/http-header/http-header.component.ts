import { Component, OnInit,Input } from '@angular/core';
import { ConfigUiUtility } from '../../../../../utils/config-utility';
import { SelectItem } from 'primeng/primeng';

@Component({
  selector: 'app-http-header',
  templateUrl: './http-header.component.html',
  styleUrls: ['./http-header.component.css']
})
export class HttpHeaderComponent implements OnInit {


  @Input() data;

  /* Request Header Drop Down */
  specifiedReqHeaderType: SelectItem[];
  selectedReqHeaderType: string;

  reqHeaderTypes: SelectItem[];
  selectedReqHeader: string;

  /* Response Header Drop Down */
  specifiedResHeaderType: SelectItem[];
  selectedResHeaderType: string;

  resHeaderTypes: SelectItem[];
  selectedResHeader: string;

  

  constructor() {
    var reqHdrList = ['Accept-Charset', 'Accept-Datetime', 'Accept-Encoding', 'Accept-Language', 'Accept', 'Authorization',
      'Cache-Control', 'Connection', 'Content-Length', 'Content-MD5', 'Cookie', 'DNT', 'Date', 'Expect',
      'Front-End-Https', 'Host', 'If-Match', 'If-Modified-Since', 'If-None-Match', 'If-Range', 'Proxy-Connection',
      'Range', 'Referer', 'TE', 'Upgrade', 'User-Agent', 'Via', 'X-ATT-DeviceId', 'X-Forwarded-For', 'X-Forwarded-Proto',
      'X-Requested-With', 'X-Wap-Profile'];

    this.specifiedReqHeaderType = ConfigUiUtility.createDropdown(reqHdrList);

    var reqHdrType = ['ALL', 'Specified'];

    this.reqHeaderTypes = ConfigUiUtility.createDropdown(reqHdrType);

    var resHdrList = ['Accept-Ranges', 'Access-Control-Allow-Origin', 'Age', 'Allow', 'Cache-Control', 'Connection', 'Content-Disposition', 'Content-Encoding',
      'Content-Language', 'Content-Length', 'Content-Location', 'Content-MD5', 'Content-Range', 'Content-Security-Policy',
  
      'Content-Type', 'Date', 'ETag', 'Expires', 'Last-Modified', 'Link', 'Location', 'P3P', 'Pragma', 'Proxy-Authenticate', 'Refresh', 'Retry-After',
      'Server', 'Set-Cookie', 'Status', 'Strict-Transport-Security', 'Trailer', 'Transfer-Encoding', 'Vary', 'Via', 'WWW-Authenticate', 'Warning',
      'X-Content-Security-Policy', 'X-Content-Type-Options', 'X-Frame-Options', 'X-Powered-By', 'X-UA-Compatible', 'X-WebKit-CSP', 'X-XSS-Protection'];

    this.specifiedResHeaderType = ConfigUiUtility.createDropdown(resHdrList);

    var resHdrType = ['ALL', 'Specified'];

    this.resHeaderTypes = ConfigUiUtility.createDropdown(resHdrType);
  }


  ngOnInit() {
  }

}

