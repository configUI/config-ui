import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-http-header',
  templateUrl: './http-header.component.html',
  styleUrls: ['./http-header.component.css']
})
export class HttpHeaderComponent implements OnInit {

  constructor() { }

  httpRequestCustomDialog: boolean = false;

  ngOnInit() {
  }

   openMethodDialog() {
    this.httpRequestCustomDialog = true;
  }


}
