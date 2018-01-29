
export  class MethodBasedCustomData {
    methodBasedId: number;
    fqm: string;
    enableReturnType: boolean = false;
    enableArgumentType: boolean = false;
    returnTypeValue : string;
    argumentTypeValue:string;
    returnTypeData: ReturnTypeData[];
    argumentTypeData: ArgumentTypeData[];
}

export class ReturnTypeData{

     id:number;
     returnTypeId: number; 
     headerName: string;
     operation:string;
     operatorValue:string;
     indexVal:number | string;
     type:number | string;
     typeName:string;
     mode:string|number = 0;
     headerVal: string;
     lb: string;
     rb: string;

}

export class ArgumentTypeData{
     id:number;
     argTypeId: number;
     headerName: string;
     operationName:string;
     operatorValue:string;
     type:number | string;
     indexVal:number | string;
     typeName:string;
     mode:string|number;
     headerVal: string;
     lb: string;
     rb: string;
}
