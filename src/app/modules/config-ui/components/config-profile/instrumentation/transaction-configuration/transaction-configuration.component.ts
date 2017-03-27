import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-transaction-configuration',
  templateUrl: './transaction-configuration.component.html',
  styleUrls: ['./transaction-configuration.component.css']
})
export class TransactionConfigurationComponent implements OnInit {
  
  @Input()
  profileId: number;
  
  constructor() { }

  ngOnInit() {
  }

}
