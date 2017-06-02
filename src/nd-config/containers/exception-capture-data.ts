export class ExceptionData
{
    instrumentException : boolean;
    exceptionCapturing : string = "1";
    exceptionTrace : boolean;
    exceptionTraceDepth : number = 999;
    exceptionType : boolean;
}

//Contains exception filter Keyword variables
export class EnableSourceCodeFilters {
  advanceExceptionFilterId:number;
  advanceExceptionFilterPattern: string;
  advanceExceptionFilterMode:number;
  advanceExceptionFilterOperation:string;
}