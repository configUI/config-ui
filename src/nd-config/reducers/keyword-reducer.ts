import { ActionReducer, Action } from '@ngrx/store';
import { KeywordList, KeywordData } from '../containers/keyword-data';
import { cloneObject } from '../utils/config-utility';
export const KEYWORD_DATA = "keywordData";

export function keywordReducer(data: KeywordList, action: Action): KeywordList {
    switch (action.type) {
        case KEYWORD_DATA:
            console.log("KeywordList data ", data);
            console.log("action.payload", action.payload);
            return cloneObject(action.payload);
    }
}