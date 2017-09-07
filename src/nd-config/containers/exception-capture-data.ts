export class ExceptionData
{
    instrumentException : boolean;
    exceptionCapturing : boolean = false;
    exceptionTrace : boolean;
    exceptionTraceDepth : number = 9999;
    exceptionType : boolean;
}


//Contains exception filter Keyword variables
export class EnableSourceCodeFilters {
  advanceExceptionFilterId:number;
  advanceExceptionFilterPattern: string;
  advanceExceptionFilterMode:number;
  advanceExceptionFilterOperation:string;
}
