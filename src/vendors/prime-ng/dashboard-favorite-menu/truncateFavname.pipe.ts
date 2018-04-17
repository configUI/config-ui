import { Pipe, PipeTransform  } from '@angular/core';

@Pipe({
    name: 'truncateFavName'
})
export class TruncateFavNamePipe implements PipeTransform {
    
    transform (input: any, length?: number, suffix?: string, preserve?: boolean): any {
        
        
        if(input === 'Organize Favorites'){
           return input;
        }
        if (typeof input !== 'string') {
            return input;
        }
        
        length = typeof length === 'undefined' ? input.length : length;
        
        if (input.length <= length) {
            return input;
        }
        
        preserve = preserve || false;
        suffix = suffix || '';
        let index = length;
        
        if (preserve) {
            if (input.indexOf(' ', length) === -1) {
                index = input.length;
            }
            else {
                index  = input.indexOf(' ', length);
            }
        }
        
        return input.substring(0, index) + suffix;
    }
}