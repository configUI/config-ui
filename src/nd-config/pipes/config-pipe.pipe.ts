import { Pipe, PipeTransform } from '@angular/core';


@Pipe({ name: 'typeLabel' })
export class PipeForType implements PipeTransform {

  transform(value: string): string {
    let label = "";
    if(value == "NDC#")
        label = "NDC"
    else if(value == "NDP#")
      label = "NDP"
    else
      label = value;

    return label;
  }

}