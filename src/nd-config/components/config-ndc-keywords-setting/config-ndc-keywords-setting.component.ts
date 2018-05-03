import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';
import { Store } from '@ngrx/store';
import { ConfirmationService } from 'primeng/primeng';
import { ConfigKeywordsService } from '../../services/config-keywords.service';
import { ConfigUtilityService } from '../../services/config-utility.service';
import { NDCKeywordsInfo } from '../../interfaces/keywords-info';
import { KeywordData, KeywordList } from '../../containers/keyword-data';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { NDC_KEYWORD_DATA } from '../../reducers/ndc-keyword-reducer';
import { ConfigUiUtility, cloneObject } from '../../utils/config-utility';


@Component({
    selector: 'app-ndc-keywords-setting',
    templateUrl: './config-ndc-keywords-setting.component.html',
    styleUrls: ['./config-ndc-keywords-setting.component.css']
})
export class ConfigNDCKeywordsSettingComponent implements OnInit {

    @Output()
    ndcKeywordData = new EventEmitter();

    ndcKeywords: Object;

    subscription: Subscription;

    // Variables for values of NDC_TRACING_LEVEL keyword
    NDC_TRACING_LEVEL_VAL;
    NDC_TRACING_LEVEL_SIZE;

    //Variables for values of NDDBU_TRACE_LEVEL keyword
    // NDDBU_TRACE_LEVEL_VAL;
    // NDDBU_TRACE_LEVEL_SIZE;

    //Variables for values of NDDBU_RD_INST_COUNT_AND_SKIP keyword
    // NDDBU_RD_INST_COUNT_AND_SKIP_MIN;
    // NDDBU_RD_INST_COUNT_AND_SKIP_MAX;

    //Variables for values of ND_ENABLE_CAPTURE_DB_TIMING keyword
    JDBC;
    REDIX;
    MONGODB;
    CASSANDRA;

    //Variables for values of NDC_THRESHOLD_TIME_TO_MARK_APP_INACTIVE keyword
    NDC_THRESHOLD_TIME_TO_MARK_APP_INACTIVE_MIN;
    NDC_THRESHOLD_TIME_TO_MARK_APP_INACTIVE_MAX;

    //Variable for values of NDP_SEQ_BLOB_IN_FILE_FLAG keyword
    NDP_SEQ_BLOB_IN_FILE_FLAG_VAL;
    NDP_SEQ_BLOB_IN_FILE_FLAG_VER;
    NDP_SEQ_BLOB_IN_FILE_FLAG_SIZE;
    
    //Variables for values of NDC_HS_ST_IN_FILE_FLAG keyword
    NDC_HS_ST_IN_FILE_FLAG_VAL;
    NDC_HS_ST_IN_FILE_FLAG_VER;

    NDC_THRESOLD_TO_MARK_DELETED_VAL = 8;

    //Variables for values of ND_FPI_MASK keyword
    ndeId1;
    ndeId2;
    appId1;
    appId2;
    timestamp1;
    timestamp2;
    seqNo1;
    seqNo2;
    
    //Dropdown values containing A and B
    version;

    /**This the list of all NDC keywords. */
    keywordList = [
        'NDC_WAIT_TIME_AFTER_TEST_IS_OVER',
        'NDC_CONTROL_MSG_ACK_TIMEOUT',
        'NDC_CONTROL_THREAD_EPOLL_TIMEOUT',
        'NDC_CONTINUE_ON_CONTROL_CONNECTION_ERROR',
        'NDC_TIME_TO_SEND_HEART_BEAT_TO_BCI',
        'NDP_TR_RUNNING_STATUS_POLL_INTERVAL',
        'NDP_NEW_RAW_DATA_POLL_INTERVAL',
        'ENABLE_METHOD_TIMING_TABLE',
        'NDP_OMIT_NON_NS_FLOWPATHS',
        'NDP_EXCLUDE_FLOWPATHS_OUTSIDE_TESTIDX',
        'NDP_TRACE_LEVEL',
        'MAX_METHOD_CALL_STACK',
        'NDP_INIT_CONCURRENT_FLOWPATHS',
        'NDP_DELTA_CONCURRENT_FLOWPATHS',
        'NDP_MAX_BUFFERED_META_DATA_BUFSIZE',
        'NDP_MAX_BUFFERED_BCI_ARG_BUFSIZE',
        'NDP_MAX_BUFFERED_HTTP_HEADER_MD_BUFSIZE',
        'NDP_MAX_BUFFERED_HTTP_HEADER_BUFSIZE',
        'NDP_MAX_BUFFERED_EXCEPTION_DATA_BUFSIZE',
        'NDP_MAX_BUFFERED_FLOWPATH_BUFSIZE',
        'NDP_MAX_BUFFERED_APPLOG_BUFSIZE',
        'NDP_MAX_BUFFERED_METHOD_TIMING_TABLE_ENTRIES',
        'NDP_MAX_BUFFERED_MEM_ALLOC_BUFSIZE',
        'NDP_MAX_BUFFERED_SQL_TABLE_BUFSIZE',
        'NDP_MAX_BUFFERED_SQL_RECORD_TABLE_BUFSIZE',
        'NDP_DEBUG_LOGFILE_ROLLOVER_SIZE',
        'NDP_FORCE_UPLOAD_TIMEOUT',
        'NDP_SECS_TO_MARK_AN_FP_DEAD',
        'NDP_SECS_TO_CLEAN_DEAD_FLOWPATHS',
        'DB_UPLOAD_MODE',
        'NDP_FORCE_ADD_URC_FOR_NS_FPI_IN_MAPPING_RECORD',
        'NDP_MAX_ENTRY_EXIT_RECORDS_IN_AN_FP',
        'NDP_LOWER_PROCESS_PRIORITY_FLAG',
        'NDP_MAX_BUFFERED_JMS_BUFSIZE',
        'NDP_MAX_CONCURRENT_THREADS_IN_JVM',
        'NDP_METHOD_TIMING_CSV_FLUSH_INTERVAL_SECS',
        'NDP_DISABLE_DUMPING_CAPTURED_HTTP_BODY',
        'NDC_TRACING_LEVEL',
        'NDC_STOP_INSTRUMENTATION_RESPONSE_TIMEOUT',
        'NDC_ACCEPT_NEW_AND_CLOSE_CURRENT_DATA_CONNECTION',
        'NDC_DATA_THD_TERM_RETRY_COUNT',
        'NDC_DATA_THD_TERM_RETRY_INTERVAL_MSEC',
       // 'SND_RESP_TO_BCI_ON_DATA_CONN',
        'NDC_LOG_BCI_AGGREGATE_RAW_DATA',
        // 'NDDBU_TRACE_LEVEL',
        'NDP_SEQ_BLOB_IN_FILE_FLAG',
        'NDP_SEQ_BLOB_IN_FILE_MIN_SIZE',
        'NDP_SEQ_BLOB_COMPRESSION_BUFFER_INIT_SIZE',
        'MAX_BUFFERED_SQB_BUFSIZE',
        'NDC_WAIT_TIME_TO_SEND_FORCE_STOP_COMP_SIG',
        'NDP_DUMP_URC',
        'NDP_META_DATA_RECOVERY_RETRY_TIMEOUT_IN_SEC',
        'NDP_SQL_START_NORM_ID',
        'NDP_ENABLE_SQL_TIMING',
        'NDP_ENABLE_SQL_RECORD',
        'NDP_ENABLE_BCIARG',
        'NDDBU_TMP_FILE_PATH',
        // 'NDDBU_RD_INST_COUNT_AND_SKIP',
        'NDDBU_CHUNK_SIZE',
        'NDDBU_IDLE_TIME',
        // 'NDDBU_NUM_CYCLES',
        'NDP_FORCE_ADD_URC_FOR_MISSING_FP_MAPPING_RECORD',
        'NDP_FREE_FP_MIN_SQB_SIZE',
        'NDP_RAW_DATA_BUF_SIZE',
        'NDP_GENERATE_FP_SIGNATURES',
        'NDP_MIN_RESPTIME_TO_FILTER_L1_FP',
        'NDP_BINARY_FORMAT_FOR_METHOD_TIMING',
        'NDC_BCI_TIME_DIFF_THRESHOLD_IN_MS',
        'NDC_HS_ST_IN_FILE_FLAG',
        'NDC_HS_ST_IN_FILE_MIN_SIZE',
        'NDC_HS_ST_COMPRESSION_BUFFER_INIT_SIZE',
        'ND_FPI_MASK',
        'ND_ENABLE_MONITOR_LOG',
        'NDP_MAX_ENTRY_EXIT_RECORDS_IN_AN_FP_EX2',
	// 'ENABLE_AUTO_SCALING',
        'NDC_MODIFY_TOPO_ENTRY',
        'NDC_DATA_THD_TERM_RETRY_INTERVAL_SEC',
        'NDP_DEBUG_LOGLEVEL',
        'NDC_REUSE_INSTANCE_ID_TIME_IN_MIN',
        'NDP_ENABLE_METADATA_RECOVERY',
        'NDP_ALLOW_REQ_DETAIL_BEFORE_SQB_BEGIN_REC',
        'NDC_LOG_BCI_AGGREGATE_RAW_DATA_EX',
        'NDC_BCI_RESPONSE_TIME_FOR_METADATA_IN_SECS',
        'ND_ENABLE_CAPTURE_DB_TIMING',
        'NDC_THRESHOLD_TIME_TO_MARK_APP_INACTIVE',
        'ENABLE_FP_STAT_MONITOR',
        'SEND_ACTIVE_INSTANCE_REP',
        'NDC_MAX_CTRL_CON',
        'NDP_MAX_SQL_INDEX_FROM_BCI',
        'NDC_THRESOLD_TO_MARK_DELETED'
    ];

    appId: number;
    isAppPerm: boolean;
    dropDownLabel= ['hr','min','sec'];
    dropDownValue =['hr','min','sec'];
    dropDownOption =  [];
    selectedFormat : any
    enableAutoCleanUp :boolean =true;

    constructor(private _configUtilityService: ConfigUtilityService,
        private confirmationService: ConfirmationService,
        private _configKeywordsService: ConfigKeywordsService,
        private router: Router,
        private route: ActivatedRoute,
        private store: Store<KeywordList>) {

        //Getting aplication's Id from URL
        this.route.params.subscribe((params: Params) => {
            this.appId = params['appId'];
        });

        //Getting NDC keyword data from the reducer
        this.subscription = this.store.select("ndcKeywordData").subscribe(data => {
            var keywordDataVal = {}
            this.keywordList.map(function (key) {
                keywordDataVal[key] = data[key];
            })
            this.ndcKeywords = keywordDataVal;
        });
    }

    ngOnInit() {
        this.dropDownOption= ConfigUiUtility.createListWithKeyValue(this.dropDownValue,this.dropDownLabel);
        this.isAppPerm=+sessionStorage.getItem("ApplicationAccess") == 4 ? true : false;
        // Getting data on Initial Load
        this.getNDCKeywords();
        this.loadDropDownVal();
    }

    //Loads dropdown data 
    loadDropDownVal(){
        this.version = [];
        var val = ['A', 'B'];
        var key = ['Uncompressed', 'Compressed'];
        this.version = ConfigUiUtility.createListWithKeyValue(key, val);
    }

    /**
     * Getting NDC Keywords
     */
    getNDCKeywords() {
        // Getting NDC keywords data from Server
        this._configKeywordsService.getNDCKeywords(this.appId).subscribe(data => {
            this.splitKeywords(data);
            this.ndcKeywords = data;
            this.store.dispatch({ type: NDC_KEYWORD_DATA, payload: data });
        });
    }


    //This method splits the value of those keywords which have can have multiple values 
    splitKeywords(data) {

        //NDC_TRACING_LEVEL 1 50
        if (data.NDC_TRACING_LEVEL.value.includes(" ")) {
            let val = data.NDC_TRACING_LEVEL.value.split(" ");
            this.NDC_TRACING_LEVEL_VAL = val[0];
            this.NDC_TRACING_LEVEL_SIZE = val[1];
        }
        //NDDBU_TRACE_LEVEL 1 10
        // if (data.NDDBU_TRACE_LEVEL.value.includes(" ")) {
        //     let val = data.NDDBU_TRACE_LEVEL.value.split(" ");
        //     this.NDDBU_TRACE_LEVEL_VAL = val[0];
        //     // this.NDDBU_TRACE_LEVEL_SIZE = val[1];
        // }
        //NDDBU_RD_INST_COUNT_AND_SKIP  0 5
        // if (data.NDDBU_RD_INST_COUNT_AND_SKIP.value.includes(" ")) {
        //     let val = data.NDDBU_RD_INST_COUNT_AND_SKIP.value.split(" ");
        //     this.NDDBU_RD_INST_COUNT_AND_SKIP_MIN = val[0];
        //     this.NDDBU_RD_INST_COUNT_AND_SKIP_MAX = val[1];
        // }

        //ND_ENABLE_CAPTURE_DB_TIMING 1 0 0 0
        if (data.ND_ENABLE_CAPTURE_DB_TIMING.value.includes(" ")) {
            let val = data.ND_ENABLE_CAPTURE_DB_TIMING.value.split(" ");
            this.JDBC = val[0];
            this.REDIX = val[1];
            this.MONGODB = val[2];
            this.CASSANDRA = val[3];
        }

        //NDC_THRESHOLD_TIME_TO_MARK_APP_INACTIVE 3600000 600000
        if (data.NDC_THRESHOLD_TIME_TO_MARK_APP_INACTIVE.value.includes(" ")) {
            let val = data.NDC_THRESHOLD_TIME_TO_MARK_APP_INACTIVE.value.split(" ");
            this.NDC_THRESHOLD_TIME_TO_MARK_APP_INACTIVE_MIN = val[0];
            this.NDC_THRESHOLD_TIME_TO_MARK_APP_INACTIVE_MAX = val[1];
        }

        //NDP_SEQ_BLOB_IN_FILE_FLAG 1 B 100000
        if (data.NDP_SEQ_BLOB_IN_FILE_FLAG.value.includes(" ")) {
            let val = data.NDP_SEQ_BLOB_IN_FILE_FLAG.value.split(" ");
            this.NDP_SEQ_BLOB_IN_FILE_FLAG_VAL = val[0];
            this.NDP_SEQ_BLOB_IN_FILE_FLAG_VER = val[1];
            this.NDP_SEQ_BLOB_IN_FILE_FLAG_SIZE = val[2];
        }

        //NDC_HS_ST_IN_FILE_FLAG 1 B
        if (data.NDC_HS_ST_IN_FILE_FLAG.value.includes(" ")) {
            let val = data.NDC_HS_ST_IN_FILE_FLAG.value.split(" ");
            this.NDC_HS_ST_IN_FILE_FLAG_VAL = val[0];
            this.NDC_HS_ST_IN_FILE_FLAG_VER = val[1];
        }

        //ND_FPI_MASK NDEID:56:4;AppID:46:10;TS:8:38;SeqNo:0:8
        if (data.ND_FPI_MASK.value.includes(":")) {
            let val = data.ND_FPI_MASK.value.split(";");
            if(val[0].includes("NDEID")){
            let ndeId = val[0].split(":");
            this.ndeId1 = ndeId[1];
            this.ndeId2 = ndeId[2];
            }

            if(val[1].includes("AppID")){
            let appId = val[1].split(":");
            this.appId1 = appId[1];
            this.appId2 = appId[2];
            }

            if(val[2].includes("TS")){
            let ts = val[2].split(":");
            this.timestamp1 = ts[1];
            this.timestamp2 = ts[2];
            }
            if(val[3].includes("SeqNo")){
            let seqno = val[3].split(":");
            this.seqNo1 = seqno[1];
            this.seqNo2 = seqno[2];
            }
        }
        if (data.NDC_THRESOLD_TO_MARK_DELETED.value.includes(" ")){
            let arr = data.NDC_THRESOLD_TO_MARK_DELETED.value.split(" ");
            if(arr[0] == 1){
                this.enableAutoCleanUp = true;
            }
            if(arr[1].includes("h")){
                this.selectedFormat = "hr";
                let arrtime = arr[1].split("h")
                this.NDC_THRESOLD_TO_MARK_DELETED_VAL = +arrtime[0];
            }
            else if(arr[1].includes("m")){
                this.selectedFormat = "min";
                let arrtime = arr[1].split("m")
                this.NDC_THRESOLD_TO_MARK_DELETED_VAL= +arrtime[0];
            }
            else if(arr[1].includes("s")){
                this.selectedFormat = "sec";
                let arrtime = arr[1].split("s")
                this.NDC_THRESOLD_TO_MARK_DELETED_VAL = +arrtime[0];
            }
        }
        else{
            this.enableAutoCleanUp = false;
            this.NDC_THRESOLD_TO_MARK_DELETED_VAL = 8;
            this.selectedFormat = "hr";
        }
    }


    //This function is responsible for saving Keywords value in DB
    saveNDCKeywords() {
         if(this.enableAutoCleanUp){
             if(this.selectedFormat == "hr")
                this.ndcKeywords['NDC_THRESOLD_TO_MARK_DELETED'].value ="1 " + this.NDC_THRESOLD_TO_MARK_DELETED_VAL + "h";
                else if(this.selectedFormat == "min")
                     this.ndcKeywords['NDC_THRESOLD_TO_MARK_DELETED'].value ="1 " + this.NDC_THRESOLD_TO_MARK_DELETED_VAL + "m";
                    else
                        this.ndcKeywords['NDC_THRESOLD_TO_MARK_DELETED'].value ="1 " + this.NDC_THRESOLD_TO_MARK_DELETED_VAL + "s";
        }
        else{
            this.ndcKeywords['NDC_THRESOLD_TO_MARK_DELETED'].value =0;
            this.NDC_THRESOLD_TO_MARK_DELETED_VAL = 8;
            this.selectedFormat = "hr"
        }
            // Saving Data to Server
            this.ndcKeywords = this.joinKeywordsVal(this.ndcKeywords)
            this._configKeywordsService.saveNDCKeywords(this.ndcKeywords, this.appId).subscribe(data => {
                this.ndcKeywords = data;
                this._configUtilityService.successMessage("Saved successfully")
                this.store.dispatch({ type: NDC_KEYWORD_DATA, payload: data });
            });
    }

    //This method merges the value of those keywords which have more than one values
    joinKeywordsVal(data) {

        //For NDC_TRACING_LEVEL
        data["NDC_TRACING_LEVEL"].value = this.NDC_TRACING_LEVEL_VAL + " " + this.NDC_TRACING_LEVEL_SIZE;

        //For NDDBU_TRACE_LEVEL
        // data["NDDBU_TRACE_LEVEL"].value = this.NDDBU_TRACE_LEVEL_VAL + " " + this.NDDBU_TRACE_LEVEL_SIZE;

        //NDDBU_RD_INST_COUNT_AND_SKIP
        // data["NDDBU_RD_INST_COUNT_AND_SKIP"].value = this.NDDBU_RD_INST_COUNT_AND_SKIP_MIN + " " + this.NDDBU_RD_INST_COUNT_AND_SKIP_MAX;

        //ND_ENABLE_CAPTURE_DB_TIMING
        data["ND_ENABLE_CAPTURE_DB_TIMING"].value = this.JDBC + " " + this.REDIX + " " + this.MONGODB + " " + this.CASSANDRA;

        //NDC_THRESHOLD_TIME_TO_MARK_APP_INACTIVE
        data["NDC_THRESHOLD_TIME_TO_MARK_APP_INACTIVE"].value = this.NDC_THRESHOLD_TIME_TO_MARK_APP_INACTIVE_MIN + " " + this.NDC_THRESHOLD_TIME_TO_MARK_APP_INACTIVE_MAX;

        //NDP_SEQ_BLOB_IN_FILE_FLAG
        data["NDP_SEQ_BLOB_IN_FILE_FLAG"].value = this.NDP_SEQ_BLOB_IN_FILE_FLAG_VAL + " " + this.NDP_SEQ_BLOB_IN_FILE_FLAG_VER + " " + this.NDP_SEQ_BLOB_IN_FILE_FLAG_SIZE;

        //NDC_HS_ST_IN_FILE_FLAG
        data["NDC_HS_ST_IN_FILE_FLAG"].value = this.NDC_HS_ST_IN_FILE_FLAG_VAL + " " + this.NDC_HS_ST_IN_FILE_FLAG_VER;

        //ND_FPI_MASK
        data["ND_FPI_MASK"].value = "NDEID:" + this.ndeId1 + ":" + this.ndeId2 + ";AppID:" + this.appId1 + ":" + this.appId2 + ";TS:" + this.timestamp1 + ":" + this.timestamp2 + ";SeqNo:" + this.seqNo1 + ":" + this.seqNo2 + ";"

        return data;
    }

      //Method to reset the default values of the keywords
  resetKeywordData() {
      this.getNDCKeywords()
  }

 /* This method is used to reset the keyword data to its Default value */
 resetKeywordsDataToDefault() {
     // Getting NDC keywords data from Server
        this._configKeywordsService.getNDCKeywords(this.appId).subscribe(data => {
            var keywordDataVal = {}
            keywordDataVal = data
            this.keywordList.map(function (key) {
                keywordDataVal[key].value = data[key].defaultValue
            })
            this.splitKeywords(keywordDataVal);
            this.ndcKeywords = keywordDataVal;
            // this.store.dispatch({ type: NDC_KEYWORD_DATA, payload: data });
        });
}
}

