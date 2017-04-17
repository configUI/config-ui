import { ActionReducer, Action } from '@ngrx/store';
import { KeywordList, KeywordData } from '../containers/keyword-data';


export const METHOD_BASED_CUSTOMDATA = "methodBasedCustomData";


 function modifyData(val){
    
      if(val.returnTypeData != null && val.returnTypeData.length != 0){
          let hdrNames = getHdrNames(val.returnTypeData);
          val.returnTypeVal = hdrNames
      }
      else{
         val.returnTypeVal = "NA"
      } 
      
      if(val.argumentTypeData != null && val.argumentTypeData.length != 0){
          let hdrNames = getHdrNames(val.argumentTypeData);
          val.argumentTypeVal = hdrNames
      }
      else{
         val.argumentTypeVal = "NA"
      } 
      console.log("in modifyData function valled--",val)
        return val;
  }

  function getHdrNames(data){
     let hdrNames ='';
     data.map(function(val,index){
     
      if(index != (data.length -1)){
          hdrNames = hdrNames + val.headerName +"," ;
      }
      else {
        hdrNames = hdrNames + val.headerName
      }
    })
    return hdrNames ;
  }

export function customDataReducer(state={},action: Action) {
    switch (action.type) {
        case METHOD_BASED_CUSTOMDATA:
            /*
            *  iterating over the data received from server inorder to add 2 extra key -value pair as:
            *   returnTypeVal ="aa,bb"
            *   argumentTypeVal= "aa,bb"
            *   to display in the table
            *
            */
            var newState = Object.assign({}, state);
            var data = action.payload;
             data.map(function(val){
                 modifyData(val);
            })
            newState = data;
            return newState ;
        
    }
}