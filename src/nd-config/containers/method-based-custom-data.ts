
export  class MethodBasedCustomData {
    methodBasedId: number;
    fqm: string;
    enableReturnType: boolean;
    enableArgumentType: boolean;
    returnTypeValue : string;
    argumentTypeValue:string;
    returnTypeData: ReturnTypeData[];
    argumentTypeData: ArgumentTypeData[];
}

export class ReturnTypeData{

     id:number;
     returnTypeId: number; 
     headerName: string;
     operationName:string;
     operatorValue:string;
     indexVal:number | string;
     type:number | string;
     typeName:string;

}

export class ArgumentTypeData{
    id:number;
    argTypeId: number;
     headerName: string;
     operation:string;
     operatorValue:string;
     type:number | string;
     indexVal:number | string;
     typeName:string;
}
