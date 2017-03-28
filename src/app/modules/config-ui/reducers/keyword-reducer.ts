import { ActionReducer, Action } from '@ngrx/store';

export const KEYWORD_DATA = "keyword";

export function  keywordReducer(data: Object = {}, action: Action): Object{
    switch(action.type){
        case KEYWORD_DATA:
            return {};

    }
}