import { Component, OnInit } from '@angular/core';
import {  SelectItem } from 'primeng/primeng';
@Component({
  selector: 'app-generate-exception',
  templateUrl: './generate-exception.component.html',
  styleUrls: ['./generate-exception.component.css']
})
export class GenerateExceptionComponent implements OnInit {

  constructor() {
  }
exceptionType:SelectItem[];
  ngOnInit() {
this.createExceptionTypeSelectType();
  }
createExceptionTypeSelectType()
{
  this.exceptionType = [];
    this.exceptionType.push( { value: -1, label: '--Select--' },
                                             { value: 0, label: 'Null Pointer Exception' },
                                             { value: 1, label: 'Array IndexOutOfBounds Exception' },
                                            { value: 2, label: 'Class Cast Exception' },
                                            { value: 3, label: 'Arithematic Exception' },
                                            { value: 4, label: 'Illegal Exception' });

}
}
