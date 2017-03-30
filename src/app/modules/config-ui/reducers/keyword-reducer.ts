import { ActionReducer, Action } from '@ngrx/store';

export const KEYWORD_DATA = "keywordData";

export function  keywordReducer(data: Object = {}, action: Action): Object{
    switch(action.type){
        case KEYWORD_DATA:
        console.log("action.payload", action.payload);
            return action.payload;

    }
}