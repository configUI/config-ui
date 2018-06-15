import { ActionReducer, Action } from '@ngrx/store';
import { KeywordList, KeywordData } from '../containers/keyword-data';
import { cloneObject } from '../utils/config-utility';
export const KEYWORD_DATA = "keywordData";

//Default Keyword data.
const DEFAULT_DATA = {"ASStackComparingDepth":{"defaultValue":"10","min":"0","max":"1000","assocId":-1,"value":"10","keyId":18},
"doNotDiscardFlowPaths":{"defaultValue":"0","min":"0","max":"1","assocId":-1,"value":"0","keyId":5},
"maxStackSizeDiff":{"defaultValue":"20","min":"0","max":"1000","assocId":-1,"value":"20","keyId":36},
"bciInstrSessionPct":{"defaultValue":"5","min":"0","max":"100","assocId":-1,"value":"5","keyId":1},
"captureHttpSessionAttr":{"defaultValue":"false","min":"","max":"","assocId":-1,"value":"false","keyId":31},
"ndMethodMonTraceLevel":{"defaultValue":"0","min":"0","max":"10","assocId":-1,"value":"0","keyId":22},
"BTRuleConfig":{"defaultValue":"global","min":"NA","max":"NA","assocId":-1,"value":"global","keyId":28},
"ASPositiveThreadFilters":{"defaultValue":"NA","min":"2","max":"1048576","assocId":-1,"value":"NA","keyId":34},
"enableNDSession":{"defaultValue":"0","min":"0","max":"1024","assocId":-1,"value":"0","keyId":12},
"enableBciDebug":{"defaultValue":"1","min":"0","max":"6","assocId":-1,"value":"1","keyId":3},
"NDHTTPReqHdrCfgListFullFp":{"defaultValue":"NA","min":"1","max":"1024","assocId":-1,"value":"NA","keyId":25},
"captureHTTPRespFullFp":{"defaultValue":"1","min":"1","max":"1048576","assocId":-1,"value":"1","keyId":26},
"ndMethodMonFile":{"defaultValue":"false","min":"","max":"","assocId":-1,"value":"false","keyId":29},
"enableBciError":{"defaultValue":"1","min":"1","max":"100","assocId":-1,"value":"1","keyId":4},
"enableCpuTime":{"defaultValue":"0","min":"0","max":"1024","assocId":-1,"value":"0","keyId":13},
"BTErrorRules":{"defaultValue":"false","min":"","max":"","assocId":-1,"value":"false","keyId":30},
"ASSampleInterval":{"defaultValue":"500","min":"0","max":"5000","assocId":-1,"value":"500","keyId":6},
"ASReportInterval":{"defaultValue":"0","min":"0","max":"900000","assocId":-1,"value":"0","keyId":8},
"ASNegativeThreadFilter":{"defaultValue":"NDControlConnection","min":"2","max":"1048576","assocId":-1,"value":"NDControlConnection","keyId":35},
"putDelayInMethod":{"defaultValue":"0","min":"0","max":"10240","assocId":-1,"value":"0","keyId":19},
"generateExceptionInMethod":{"defaultValue":"0","min":"0","max":"10240","assocId":-1,"value":"0","keyId":23},
"ASMethodHotspots":{"defaultValue":"-1","min":"0","max":"1","assocId":-1,"value":"-1","keyId":37},
"captureHTTPReqFullFp":{"defaultValue":"0","min":"1","max":"10485760","assocId":-1,"value":"0","keyId":24},
"enableBackendMonitor":{"defaultValue":"1","min":"0","max":"1","assocId":-1,"value":"1","keyId":20},
"enableForcedFPChain":{"defaultValue":"1","min":"0","max":"3","assocId":-1,"value":"1","keyId":14},
"NDEntryPointsFile":{"defaultValue":"true","min":"","max":"","assocId":-1,"value":"true","keyId":21},
"ASThresholdMatchCount":{"defaultValue":"5","min":"1","max":"100","assocId":-1,"value":"5","keyId":7},
"instrExceptions":{"defaultValue":"1%201%200%2020","min":"0","max":"512","assocId":-1,"value":"1%201%200%2020","keyId":16},
"InstrTraceLevel":{"defaultValue":"0","min":"0","max":"11","assocId":-1,"value":"0","keyId":15},
"captureCustomData":{"defaultValue":"false","min":" ","max":" ","assocId":-1,"value":"false","keyId":33},
"ASDepthFilter":{"defaultValue":"20","min":"0","max":"100","assocId":-1,"value":"20","keyId":10},
"instrProfile":{"defaultValue":"","min":"","max":"","assocId":-1,"value":"","keyId":9},
"enableJVMThreadMonitor":{"defaultValue":"0","min":"0","max":"2048","assocId":-1,"value":"0","keyId":32},
"enableBTMonitor":{"defaultValue":"1","min":"0","max":"1","assocId":-1,"value":"1","keyId":27},
"ASTraceLevel":{"defaultValue":"1","min":"0","max":"20","assocId":-1,"value":"1","keyId":11},
"logLevelOneFpMethod":{"defaultValue":"0","min":"0","max":"1","assocId":-1,"value":"0","keyId":2},
"correlationIDHeader":{"defaultValue":"0","min":"0","max":"1024","assocId":-1,"value":"0","keyId":17},
"captureErrorLogs": {"defaultValue":"0","min":"0","max":"2","assocId":-1,"value":"0","keyId":2},
"HTTPStatsCondCfg": {"defaultValue":"false","min":"1","max":"1024","assocId":-1,"value":"0","keyId":5},
"enableExceptionsWithSourceAndVars":{"defaultValue":"0","min":"0","max":"2048","assocId":-1,"value":"0","keyId":43},
"enableSourceCodeFilters":{"defaultValue": "false", "min": "1", "max": "1024", "assocId": -1, "value": "false", "keyId": 44},
"ndExceptionMonFile":{"defaultValue":"false","min":"","max":"","assocId":-1,"value":"false","keyId":45},
"maxQueryDetailsmapSize":{"defaultValue": "1000000", "min": "0", "max": "10000000", "assocId": -1, "value": "1000000", "keyId": 46},
"formatIPResourceURL":{"defaultValue":"0","min":"0","max":"512","assocId":-1,"value":"0","keyId":47},
"enableIPResourceURL":{"defaultValue":"0","min":"0","max":"1","assocId":-1,"value":"0","keyId":48},
"dumpDefaultCassandraQuery":{"defaultValue":"0","min":"0","max":"1","assocId":-1,"value":"0","keyId":49},
"enableTransformThreadSubClass":{"defaultValue":"1","min":"0","max":"1","assocId":-1,"value":"1","keyId":50},
"captureMethodForAllFP":{"defaultValue":"0","min":"0","max":"1","assocId":-1,"value":"0","keyId":73},
"enableMethodBreakDownTime":{"defaultValue":"0","min":"0","max":"1024","assocId":-1,"value":"0","keyId":53},
"ndBackendNamingRulesFile":{"defaultValue":"true","min":"","max":"","assocId":-1,"value":"true","keyId":74},
"eventLoopMonitor":{"defaultValue":"1","min":"","max":"","assocId":-1,"value":"1","keyId":75}, //NodeJS Only
"gcProfiler":{"defaultValue":"1","min":"","max":"","assocId":-1,"value":"1","keyId":75}, //NodeJS Only
"nodejsCpuProfilingTime":{"defaultValue":"10","min":"","max":"","assocId":-1,"value":"10","keyId":75}, //NodeJS Only
"nodeAsyncEventMonitor":{"defaultValue":"0","min":"","max":"","assocId":-1,"value":"0","keyId":75}, //NodeJS Only
"nodeServerMonitor":{"defaultValue":"0","min":"","max":"","assocId":-1,"value":"0","keyId":75}, //NodeJS Only
"excludeMethodOnRespTime":{"defaultValue":"0","min":"","max":"","assocId":-1,"value":"0","keyId":75}, //NodeJS Only
"NDHTTPRepHdrCfgListFullFp":{"defaultValue":"NA","min":"1","max":"1024","assocId":-1,"value":"NA","keyId":54},
"NDHTTPRepHdrCfgListL1Fp":{"defaultValue":"NA","min":"1","max":"1024","assocId":-1,"value":"NA","keyId":55},
"dumpOnlyMethodExitInFP":{"defaultValue":"0","min":"0","max":"1","assocId":-1,"value":"0","keyId":103},
"methodResponseTimeFilter":{"defaultValue":"0%201%2020","min":"0","max":"3600000","assocId":-1,"value":"0%201%2020","keyId":104},
"NDAsyncRuleConfig":{"defaultValue":"false","min":"1","max":"1024","assocId":-1,"value":"false","keyId":105},
"enableHSLongStack":{"defaultValue":"0%5%Immediate,TickObject,Timeout,TIMERWRAP","min":"0","max":"1024","assocId":-1,"value":"0%5%Immediate,TickObject,Timeout,TIMERWRAP","keyId":106},
"correlateEventCallback":{"defaultValue":"0","min":"0","max":"512","assocId":-1,"value":"0","keyId":107},
"enableWaitSyncQueueTime":{"defaultValue":"1","min":"0","max":"1","assocId":-1,"value":"1","keyId":108},
"enableCaptureNetDelay":{"defaultValue":"0","min":"0","max":"1","assocId":-1,"value":"0","keyId":109}
};

export function keywordReducer(data: KeywordList, action: Action): KeywordList {
    switch (action.type) {
        case KEYWORD_DATA:
            console.log("KeywordList data ", data);
            console.log("action.payload", action.payload);
            return cloneObject(action.payload);
        default:
            return DEFAULT_DATA;
    }
}
