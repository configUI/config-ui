import { Pipe, PipeTransform } from '@angular/core';


@Pipe({ name: 'typeLabel' })
export class PipeForType implements PipeTransform {

  transform(value: string): string {
    let label = "";
    if (value == "NDC#")
      label = "NDC"
    else if (value == "NDP#")
      label = "NDP"
    else
      label = value;

    return label;
  }

}

/** To search text from an array */
@Pipe({
  name: 'filter'
})
export class FilterPipe implements PipeTransform {
  transform(items: any[], searchText: string): any[] {
    if (!items) return [];
    if (!searchText) return items;
    searchText = searchText.toLowerCase();
    return items.filter(it => {
      return it.toLowerCase().includes(searchText);
    });
  }
}

/** To highlight the content of the file */
@Pipe({
  name: 'highlight'
})

export class HighlightSearch implements PipeTransform {

  transform(value: any, args: any): any {
    if (!args) { return value; }
    var re = new RegExp(args, 'gi'); //'gi' for case insensitive and can use 'g' if you want the search to be case sensitive.
    return value.replace(re, "<mark>" + args + "</mark>");
  }
}