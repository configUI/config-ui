import { ActionReducer, Action } from '@ngrx/store';
import { KeywordList, KeywordData } from '../containers/keyword-data';
import { cloneObject } from '../utils/config-utility';
export const NDC_KEYWORD_DATA = "ndcKeywordData";

//Default Keyword data.
const DEFAULT_DATA = {
"NDC_WAIT_TIME_AFTER_TEST_IS_OVER":{"ndcKeyId":1,"defaultValue":"30","min":"","max":"","value":"30","assocId":-1},
"NDC_CONTROL_MSG_ACK_TIMEOUT":{"ndcKeyId":2,"defaultValue":"10","min":"","max":"","value":"10","assocId":-1},
"NDC_CONTROL_THREAD_EPOLL_TIMEOUT":{"ndcKeyId":3,"defaultValue":"10","min":"","max":"","value":"10","assocId":-1},
"NDC_CONTINUE_ON_CONTROL_CONNECTION_ERROR":{"ndcKeyId":4,"defaultValue":"2","min":"","max":"","value":"2","assocId":-1},
"NDC_TIME_TO_SEND_HEART_BEAT_TO_BCI":{"ndcKeyId":5,"defaultValue":"300","min":"","max":"","value":"300","assocId":-1},
"NDP_TR_RUNNING_STATUS_POLL_INTERVAL":{"ndcKeyId":6,"defaultValue":"500","min":"","max":"","value":"500","assocId":-1},
"NDP_NEW_RAW_DATA_POLL_INTERVAL":{"ndcKeyId":7,"defaultValue":"500","min":"","max":"","value":"500","assocId":-1},
"ENABLE_METHOD_TIMING_TABLE":{"ndcKeyId":8,"defaultValue":"1","min":"","max":"","value":"1","assocId":-1},
"NDP_OMIT_NON_NS_FLOWPATHS":{"ndcKeyId":9,"defaultValue":"1","min":"","max":"","value":"1","assocId":-1},
"NDP_EXCLUDE_FLOWPATHS_OUTSIDE_TESTIDX":{"ndcKeyId":10,"defaultValue":"1","min":"","max":"","value":"1","assocId":-1},
"NDP_TRACE_LEVEL":{"ndcKeyId":11,"defaultValue":"1","min":"0","max":"4","value":"1","assocId":-1},
"MAX_METHOD_CALL_STACK":{"ndcKeyId":12,"defaultValue":"128","min":"1","max":"10485760","value":"128","assocId":-1},
"NDP_INIT_CONCURRENT_FLOWPATHS":{"ndcKeyId":13,"defaultValue":"256","min":"8","max":"10485760","value":"256","assocId":-1},
"NDP_DELTA_CONCURRENT_FLOWPATHS":{"ndcKeyId":14,"defaultValue":"64","min":"8","max":"10485760","value":"64","assocId":-1},
"NDP_MAX_BUFFERED_META_DATA_BUFSIZE":{"ndcKeyId":15,"defaultValue":"64","min":"8","max":"1048576","value":"64","assocId":-1},
"NDP_MAX_BUFFERED_BCI_ARG_BUFSIZE":{"ndcKeyId":16,"defaultValue":"64","min":"8","max":"1048576","value":"64","assocId":-1},
"NDP_MAX_BUFFERED_HTTP_HEADER_MD_BUFSIZE":{"ndcKeyId":17,"defaultValue":"8","min":"8","max":"1048576","value":"8","assocId":-1},
"NDP_MAX_BUFFERED_HTTP_HEADER_BUFSIZE":{"ndcKeyId":18,"defaultValue":"64","min":"8","max":"1048576","value":"64","assocId":-1},
"NDP_MAX_BUFFERED_EXCEPTION_DATA_BUFSIZE":{"ndcKeyId":19,"defaultValue":"64","min":"8","max":"1048576","value":"64","assocId":-1},
"NDP_MAX_BUFFERED_FLOWPATH_BUFSIZE":{"ndcKeyId":20,"defaultValue":"512","min":"8","max":"1048576","value":"512","assocId":-1},
"NDP_MAX_BUFFERED_APPLOG_BUFSIZE":{"ndcKeyId":21,"defaultValue":"512","min":"8","max":"1048576","value":"512","assocId":-1},
"NDP_MAX_BUFFERED_METHOD_TIMING_TABLE_ENTRIES":{"ndcKeyId":22,"defaultValue":"1024","min":"8","max":"1048576","value":"1024","assocId":-1},
"NDP_MAX_BUFFERED_MEM_ALLOC_BUFSIZE":{"ndcKeyId":23,"defaultValue":"16","min":"8","max":"1048576","value":"16","assocId":-1},
"NDP_MAX_BUFFERED_SQL_TABLE_BUFSIZE":{"ndcKeyId":24,"defaultValue":"32","min":"32","max":"1048576","value":"32","assocId":-1},
"NDP_MAX_BUFFERED_SQL_RECORD_TABLE_BUFSIZE":{"ndcKeyId":25,"defaultValue":"16","min":"8","max":"1048576","value":"16","assocId":-1},
"NDP_DEBUG_LOGFILE_ROLLOVER_SIZE":{"ndcKeyId":26,"defaultValue":"100","min":"1","max":"102400","value":"100","assocId":-1},
"NDP_FORCE_UPLOAD_TIMEOUT":{"ndcKeyId":27,"defaultValue":"10","min":"1","max":"2592000000","value":"10","assocId":-1},
"NDP_SECS_TO_MARK_AN_FP_DEAD":{"ndcKeyId":28,"defaultValue":"90","min":"0","max":"43200","value":"90","assocId":-1},
"NDP_SECS_TO_CLEAN_DEAD_FLOWPATHS":{"ndcKeyId":29,"defaultValue":"10","min":"0","max":"43200","value":"10","assocId":-1},
"DB_UPLOAD_MODE":{"ndcKeyId":30,"defaultValue":"1","min":"","max":"","value":"1","assocId":-1},
"NDP_FORCE_ADD_URC_FOR_NS_FPI_IN_MAPPING_RECORD":{"ndcKeyId":31,"defaultValue":"0","min":"","max":"","value":"0","assocId":-1},
"NDP_MAX_ENTRY_EXIT_RECORDS_IN_AN_FP":{"ndcKeyId":32,"defaultValue":"110000","min":"0","max":"10000000","value":"110000","assocId":-1},
"NDP_LOWER_PROCESS_PRIORITY_FLAG":{"ndcKeyId":33,"defaultValue":"0","min":"","max":"","value":"0","assocId":-1},
"NDP_MAX_BUFFERED_JMS_BUFSIZE":{"ndcKeyId":34,"defaultValue":"32","min":"8","max":"1048576","value":"32","assocId":-1},
"NDP_MAX_CONCURRENT_THREADS_IN_JVM":{"ndcKeyId":35,"defaultValue":"512","min":"","max":"","value":"512","assocId":-1},
"NDP_METHOD_TIMING_CSV_FLUSH_INTERVAL_SECS":{"ndcKeyId":36,"defaultValue":"300","min":"0","max":"10000000","value":"300","assocId":-1},
"NDP_DISABLE_DUMPING_CAPTURED_HTTP_BODY":{"ndcKeyId":37,"defaultValue":"0","min":"0","max":"1","value":"0","assocId":-1},
"NDC_STOP_INSTRUMENTATION_RESPONSE_TIMEOUT":{"ndcKeyId":38,"defaultValue":"300000","min":"","max":"","value":"300000","assocId":-1},
"NDC_ACCEPT_NEW_AND_CLOSE_CURRENT_DATA_CONNECTION":{"ndcKeyId":39,"defaultValue":"1","min":"","max":"","value":"1","assocId":-1},
"NDC_DATA_THD_TERM_RETRY_COUNT":{"ndcKeyId":40,"defaultValue":"50","min":"","max":"","value":"50","assocId":-1},
"NDC_DATA_THD_TERM_RETRY_INTERVAL_MSEC":{"ndcKeyId":41,"defaultValue":"200000","min":"","max":"","value":"200000","assocId":-1},
"SND_RESP_TO_BCI_ON_DATA_CONN":{"ndcKeyId":42,"defaultValue":"0","min":"","max":"","value":"0","assocId":-1},
"NDC_LOG_BCI_AGGREGATE_RAW_DATA":{"ndcKeyId":43,"defaultValue":"0","min":"","max":"","value":"0","assocId":-1},
"NDP_SEQ_BLOB_IN_FILE_MIN_SIZE":{"ndcKeyId":44,"defaultValue":"64","min":"1","max":"2048","value":"64","assocId":-1},
"NDP_SEQ_BLOB_COMPRESSION_BUFFER_INIT_SIZE":{"ndcKeyId":45,"defaultValue":"1024","min":"1","max":"2048","value":"1024","assocId":-1},
"MAX_BUFFERED_SQB_BUFSIZE":{"ndcKeyId":46,"defaultValue":"8192","min":"8","max":"1024000","value":"8192","assocId":-1},
"NDC_WAIT_TIME_TO_SEND_FORCE_STOP_COMP_SIG":{"ndcKeyId":47,"defaultValue":"60","min":"","max":"","value":"60","assocId":-1},
"NDP_DUMP_URC":{"ndcKeyId":48,"defaultValue":"0","min":"","max":"","value":"0","assocId":-1},
"NDP_META_DATA_RECOVERY_RETRY_TIMEOUT_IN_SEC":{"ndcKeyId":49,"defaultValue":"60","min":"","max":"","value":"60","assocId":-1},
"NDP_SQL_START_NORM_ID":{"ndcKeyId":50,"defaultValue":"0","min":"0","max":"2000000000","value":"0","assocId":-1},
"NDP_ENABLE_SQL_TIMING":{"ndcKeyId":51,"defaultValue":"1","min":"","max":"","value":"1","assocId":-1},
"NDP_ENABLE_SQL_RECORD":{"ndcKeyId":52,"defaultValue":"0","min":"","max":"","value":"0","assocId":-1},
"NDP_ENABLE_BCIARG":{"ndcKeyId":53,"defaultValue":"1","min":"","max":"","value":"1","assocId":-1},
"NDDBU_CHUNK_SIZE":{"ndcKeyId":54,"defaultValue":"134217728","min":"","max":"","value":"134217728","assocId":-1},
"NDDBU_IDLE_TIME":{"ndcKeyId":55,"defaultValue":"5","min":"","max":"","value":"5","assocId":-1},
// "NDDBU_NUM_CYCLES":{"ndcKeyId":56,"defaultValue":"1","min":"","max":"","value":"1","assocId":-1},
"NDP_FORCE_ADD_URC_FOR_MISSING_FP_MAPPING_RECORD":{"ndcKeyId":57,"defaultValue":"0","min":"","max":"","value":"0","assocId":-1},
"NDP_FREE_FP_MIN_SQB_SIZE":{"ndcKeyId":58,"defaultValue":"32768","min":"","max":"","value":"32768","assocId":-1},
"NDP_RAW_DATA_BUF_SIZE":{"ndcKeyId":59,"defaultValue":"262144","min":"","max":"","value":"262144","assocId":-1},
"NDP_GENERATE_FP_SIGNATURES":{"ndcKeyId":60,"defaultValue":"0","min":"","max":"","value":"0","assocId":-1},
"NDP_MIN_RESPTIME_TO_FILTER_L1_FP":{"ndcKeyId":61,"defaultValue":"0","min":"","max":"","value":"0","assocId":-1},
"NDP_BINARY_FORMAT_FOR_METHOD_TIMING":{"ndcKeyId":62,"defaultValue":"1","min":"","max":"","value":"1","assocId":-1},
"NDC_BCI_TIME_DIFF_THRESHOLD_IN_MS":{"ndcKeyId":63,"defaultValue":"1000","min":"","max":"","value":"1000","assocId":-1},
"NDC_HS_ST_IN_FILE_MIN_SIZE":{"ndcKeyId":64,"defaultValue":"64","min":"1","max":"2000000000","value":"64","assocId":-1},
"NDC_HS_ST_COMPRESSION_BUFFER_INIT_SIZE":{"ndcKeyId":65,"defaultValue":"1024","min":"1","max":"2000000000","value":"1024","assocId":-1},
"ND_ENABLE_MONITOR_LOG":{"ndcKeyId":66,"defaultValue":"0","min":"","max":"","value":"0","assocId":-1},
"NDP_MAX_ENTRY_EXIT_RECORDS_IN_AN_FP_EX2":{"ndcKeyId":67,"defaultValue":"1000000","min":"","max":"","value":"1000000","assocId":-1},
// "ENABLE_AUTO_SCALING":{"ndcKeyId":68,"defaultValue":"0","min":"","max":"","value":"0","assocId":-1},
"NDC_MODIFY_TOPO_ENTRY":{"ndcKeyId":69,"defaultValue":"1","min":"","max":"","value":"1","assocId":-1},
"NDC_DATA_THD_TERM_RETRY_INTERVAL_SEC":{"ndcKeyId":70,"defaultValue":"20","min":"","max":"","value":"20","assocId":-1},
"NDP_DEBUG_LOGLEVEL":{"ndcKeyId":71,"defaultValue":"0","min":"0","max":"4","value":"0","assocId":-1},
"NDC_REUSE_INSTANCE_ID_TIME_IN_MIN":{"ndcKeyId":72,"defaultValue":"0","min":"","max":"","value":"0","assocId":-1},
"NDP_ENABLE_METADATA_RECOVERY":{"ndcKeyId":73,"defaultValue":"1","min":"","max":"","value":"1","assocId":-1},
"NDP_ALLOW_REQ_DETAIL_BEFORE_SQB_BEGIN_REC":{"ndcKeyId":74,"defaultValue":"1","min":"","max":"","value":"1","assocId":-1},
"NDC_LOG_BCI_AGGREGATE_RAW_DATA_EX":{"ndcKeyId":75,"defaultValue":"0","min":"","max":"","value":"0","assocId":-1},
"NDC_BCI_RESPONSE_TIME_FOR_METADATA_IN_SECS":{"ndcKeyId":76,"defaultValue":"60","min":"","max":"","value":"60","assocId":-1},
"ENABLE_FP_STAT_MONITOR":{"ndcKeyId":77,"defaultValue":"0","min":"","max":"","value":"0","assocId":-1},
"SEND_ACTIVE_INSTANCE_REP":{"ndcKeyId":78,"defaultValue":"1","min":"","max":"","value":"1","assocId":-1},
"NDC_MAX_CTRL_CON":{"ndcKeyId":79,"defaultValue":"400","min":"","max":"","value":"400","assocId":-1},
"NDP_MAX_SQL_INDEX_FROM_BCI":{"ndcKeyId":80,"defaultValue":"4096","min":"","max":"","value":"4096","assocId":-1},
"NDC_TRACING_LEVEL":{"ndcKeyId":81,"defaultValue":"1 50","min":"","max":"","value":"1 50","assocId":-1},
// "NDDBU_TRACE_LEVEL":{"ndcKeyId":82,"defaultValue":"1 10","min":"","max":"","value":"1 10","assocId":-1},
"NDP_SEQ_BLOB_IN_FILE_FLAG":{"ndcKeyId":83,"defaultValue":"1 B 10000","min":"","max":"","value":"1 B 10000","assocId":-1},
// "NDDBU_RD_INST_COUNT_AND_SKIP":{"ndcKeyId":84,"defaultValue":"0 5","min":"","max":"","value":"0 5","assocId":-1},
"NDC_HS_ST_IN_FILE_FLAG":{"ndcKeyId":85,"defaultValue":"1 B","min":"","max":"","value":"1 B","assocId":-1},
"ND_ENABLE_CAPTURE_DB_TIMING":{"ndcKeyId":86,"defaultValue":"1 0 0 0","min":"","max":"","value":"1 0 0 0","assocId":-1},
"NDC_THRESHOLD_TIME_TO_MARK_APP_INACTIVE":{"ndcKeyId":87,"defaultValue":"3600000 600000","min":"","max":"","value":"3600000 600000","assocId":-1},
"NDDBU_TMP_FILE_PATH":{"ndcKeyId":88,"defaultValue":"/mnt/tmp","min":"","max":"","value":"/mnt/tmp","assocId":-1},
"ND_FPI_MASK":{"ndcKeyId":89,"defaultValue":"NDEID:56:4;AppID:46:10;TS:8:38;SeqNo:0:8;","min":"","max":"","value":"NDEID:56:4;AppID:46:10;TS:8:38;SeqNo:0:8;","assocId":-1},
"NDC_THRESHOLD_TO_MARK_DELETED": {"ndcKeyId":90,"defaultValue":"1 8h","min":"","max":"","value":"1 8h","assocId":-1},
"NDP_DELETED_INSTANCE_CLEANUP_DELAY": {"ndcKeyId":91,"defaultValue":"3D","min":"0","max":"","value":"3D","assocId":-1}
};

export function ndcKeywordReducer(data: KeywordList, action: Action): KeywordList {
    switch (action.type) {
        case NDC_KEYWORD_DATA:
            console.log("KeywordList data ", data);
            console.log("action.payload", action.payload);
            return cloneObject(action.payload);
        default:
            return DEFAULT_DATA;
    }
}
