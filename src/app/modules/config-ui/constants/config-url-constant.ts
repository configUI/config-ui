// const SERVICE_URL = 'http://localhost:8090';
// const  SERVICE_URL = 'http://10.10.50.7:8001/configUI';
// const  SERVICE_URL = 'http://10.10.60.77:8090';
 const  SERVICE_URL = 'http://10.10.40.7:8006/configUI';
//const SERVICE_URL = 'http://localhost:8090';
//const  SERVICE_URL = 'http://10.10.50.7:8001/configUI';
//  const  SERVICE_URL = 'http://10.10.40.7:8006/configUI';
//  const  SERVICE_URL = 'http://10.10.30.26:8001/configUI';
//const  SERVICE_URL = 'http://localhost:8001/configUI';

//For Production use this SERVICE_URL

//const SERVICE_URL = '/configUI';


/* Url for Home Screen */
export const HOME_SCREEN_URL = `${SERVICE_URL}/home`;
export const UPDATE_TOPOLOGY = `${SERVICE_URL}/uploadtopology`;

/* Url for Application Table */
export const FETCH_APP_TABLE_DATA = `${SERVICE_URL}/custom/application/getAllApplication`;
export const APP_TREE_URL = `${SERVICE_URL}/custom/tree/application`;
export const ADD_ROW_APP_URL = `${SERVICE_URL}/custom/application`;
export const DEL_ROW_APP_URL = `${SERVICE_URL}/custom/application/delete`;

/* Url for DCDetail */
export const DC_TABLE_DATA_URL = `${SERVICE_URL}/application`;
export const ADD_ROW_DC_URL = `${SERVICE_URL}/custom/dcdetail`;
export const DEL_ROW_DC_URL = `${SERVICE_URL}/dcdetail`;

/* Url for Topology */
export const FETCH_TOPO_TABLE_URL = `${SERVICE_URL}/custom/topology`;
export const FETCH_TOPO_TREE_URL = `${SERVICE_URL}/custom/tree/topology`;
export const DEL_TOPO_ROW_URL = `${SERVICE_URL}/dctopoassociation`;
export const ATTACH_PROFTO_TOPO = `${SERVICE_URL}/custom/topology`;
export const ADD_ROW_TOPOLOGY_URL = `${SERVICE_URL}/custom/topology`;
export const TOGGLE_STATE_TOPOLOGY = `${SERVICE_URL}/custom/topology`;

/* Url for Profiles */
//export const FETCH_PROFILE_TABLEDATA = `${SERVICE_URL}/profiles`
export const FETCH_PROFILE_TABLEDATA = `${SERVICE_URL}/custom/profile/profilelist`
//export const UPDATE_PROFILE_TABLE = ` ${SERVICE_URL}/profiles`
export const UPDATE_PROFILE_TABLE = ` ${SERVICE_URL}/custom/profile`

/* Url for Tier */
export const FETCH_TIER_TREE_URL = `${SERVICE_URL}/custom/tree/tier`;
//export const FETCH_TIER_TABLE_URL = `${SERVICE_URL}/topology`;
export const FETCH_TIER_TABLE_URL = `${SERVICE_URL}/custom/tier`;
export const ATTACH_PROFTO_TIER = `${SERVICE_URL}/custom/tier`;


/* Url for Server */
export const FETCH_SERVER_TREE_URL = `${SERVICE_URL}/custom/tree/server`;
export const FETCH_SERVER_TABLE_URL = `${SERVICE_URL}/custom/server`;
export const ATTACH_PROFTO_SERVER = `${SERVICE_URL}/custom/server`;

/* Url for Instance */
export const FETCH_INSTANCE_TREE_URL = `${SERVICE_URL}/custom/tree/instance`;
export const FETCH_INSTANCE_TABLE_URL = `${SERVICE_URL}/custom/instance`;
export const ATTACH_PROFTO_INSTANCE = `${SERVICE_URL}/custom/instance`;
export const TOGGLED_INSTANCE_STATE = `${SERVICE_URL}/custom/instance`

/* Url for ServiceEntryPoint */
export const FETCH_SERVICE_POINTS_TABLEDATA = `${SERVICE_URL}/custom/profileserviceentryasso`;
export const FETCHING_SERVICE_ENTRYPOINTS_FORM = `${SERVICE_URL}/entryTypes`;
export const  ADD_NEW_SERVICE_ENTRY_POINTS = `${SERVICE_URL}/custom/profileserviceentryasso`;
export const DEL_SERVICE_ENTRY_POINTS = `${SERVICE_URL}/profileserviceentryasso`;

/*Url for Toggle */ 
export const UPDATE_TOGGLE_PROFSEPASSOC = ` ${SERVICE_URL}/custom/profileserviceentryasso` ;

/* Url fot BussinessTransaction */
export const ADD_BT = `${SERVICE_URL}/custom/btGlobal`;
export const GET_BT = `${SERVICE_URL}/profiles`;
export const FETCH_LIST_GROUP_NAMES_FORM = `${SERVICE_URL}/btgroup`;
export const FETCH_BT_PATTERN_TABLEDATA = `${SERVICE_URL}/custom/btpattern`;
export const ADD_NEW_BT_PATTERN_DETAILS = `${SERVICE_URL}/custom/btpattern`;
export const ADD_NEW_BT_GROUP_DETAILS = `${SERVICE_URL}/custom/btpattern/addGroup`;
export const DEL_BT_PATTERN_DETAILS = `${SERVICE_URL}/custom/btpattern/delete`;

/* Url fot BussinessTransactionGlobal */
export const FETCH_BT_GLOBAL_DATA = `${SERVICE_URL}/bussinesstransglobal`;


/* Url for Backend Detection */
export const FETCH_BACKEND_TABLEDATA = `${SERVICE_URL}/custom/backenddetection`;
// export const FETCH_BACKEND_TYPES = `${SERVICE_URL}/backendTypes`;
export const FETCH_BACKEND_TYPES = `${SERVICE_URL}/custom/backenddetection/getbackendtype`;
export const ADD_NEW_BACKEND_POINT = `${SERVICE_URL}/custom/backenddetection`;
export const UPDATE_BACKEND_POINT = `${SERVICE_URL}/custom/backenddetection/updatebackend`;


//export const FETCH_ALL_TOPODATA = `${SERVICE_URL}/topology`;
export const FETCH_ALL_TOPODATA = `${SERVICE_URL}/custom/topology/getalltopologylist`;

/* URL for generating nd.conf file  */
export const GENERATE_ND_CONF = `${SERVICE_URL}/custom/application/ndconf`;

/* Url for General Keywords Screen*/
export const GET_KEYWORDS_DATA = `${SERVICE_URL}/custom/profilekeywords` ;
export const UPDATE_KEYWORDS_DATA = `${SERVICE_URL}/custom/profilekeywords`;
//export const UPDATE_KEYWORDS_DATA = `${SERVICE_URL}/custom/profilekeywords/updatekeywords`;

/*Instrumentation Profile List*/
export const GET_INSTR_PROFILE_LIST = `${SERVICE_URL}/custom/profilekeywords/xmlfiles` ;


/* URL for monitors  */
export const FETCH_METHOD_MON_TABLEDATA = `${SERVICE_URL}/custom/methodmonitor`;
export const ADD_METHOD_MONITOR = `${SERVICE_URL}/custom/methodmonitor`;
export const DEL_METHOD_MONITOR = `${SERVICE_URL}/custom/methodmonitor/delete`;
export const EDIT_ROW_METHOD_MONITOR_URL= `${SERVICE_URL}/custom/methodmonitor/updateMethodMonitor`;

/* URL for Error Detection  */
export const FETCH_ERROR_DETECTION_TABLEDATA = `${SERVICE_URL}/custom/errordetection`;
export const ADD_NEW_ERROR_DETECTION = `${SERVICE_URL}/custom/errordetection`;
export const DEL_ERROR_DETECTION =  `${SERVICE_URL}/custom/errordetection/delete`;


/*URL for Http Stats Condition*/
export const FETCH_HTTP_STATS_COND_TABLEDATA = `${SERVICE_URL}/custom/httpstatscondition`;
export const GET_HTTP_HEADERS_lIST =`${SERVICE_URL}/custom/httpstatscondition/listofheaders`;
export const GET_TYPE_HTTP_STATS = `${SERVICE_URL}/custom/httpstatscondition/listoftypes`;
export const GET_LIST_OF_VALUETYPE = `${SERVICE_URL}/custom/httpstatscondition/listofvaluetypes`;
export const GET_LIST_OF_OPERATORS = `${SERVICE_URL}/custom/httpstatscondition/listofoperators`; 
export const ADD_NEW_HTTP_STATS_COND = `${SERVICE_URL}/custom/httpstatscondition`;
export const DEL_HTTP_STATS_COND   = `${SERVICE_URL}/custom/httpstatscondition/delete`;

/*URL for RUNTIME changes*/
export const RUNTIME_CHANGE_TOPOLOGY = `${SERVICE_URL}/custom/runtimechange/topology`;
export const RUNTIME_CHANGE_TIER = `${SERVICE_URL}/custom/runtimechange/tier`;
export const RUNTIME_CHANGE_SERVER = `${SERVICE_URL}/custom/runtimechange/server`;
export const RUNTIME_CHANGE_INSTANCE = `${SERVICE_URL}/custom/runtimechange/instance`;


/* URL for ND Agent Status */
export const FETCH_ND_AGENT_TABLEDATA = `${SERVICE_URL}/ndagent`;

/* URL for SessionAtrributeMonitor */
export const FETCH_SESSION_ATTR_TABLEDATA = `${SERVICE_URL}/custom/sessionattrmonitor/getallsessionattrdata` ;
export const ADD_SPECIFIC_ATTR = `${SERVICE_URL}/custom/sessionattrmonitor/addspecificattr`;
export const UPDATE_SESSION_TYPE = `${SERVICE_URL}/custom/sessionattrmonitor/updateSessionType`;
export const UPDATE_ATTR_VALUES = `${SERVICE_URL}/custom/sessionattrmonitor/updateAttrValues`;
export const ADD_ATTR_VALUES = `${SERVICE_URL}/custom/sessionattrmonitor/addAttrValues`;

export const DEL_ATTR_VALUES = `${SERVICE_URL}/custom/sessionattrmonitor/delattrvalues`;
export const UPDATE_SESSION_ATTR = `${SERVICE_URL}/custom/sessionattrmonitor/updateSessionAttribute`;
export const DELETE_SESSION_ATTR = `${SERVICE_URL}/custom/sessionattrmonitor/delete`;

//export const DEL_ROW_SESSION_ATTR = `${SERVICE_URL}/custom/sessionattrmonitor/delSessionAttr`;

 /*URL for btMethod */    
 export const ADD_BT_METHOD = `${SERVICE_URL}/custom/btmethod/addbtmethod`;
 export const FETCH_BTMETHOD_URL = `${SERVICE_URL}/custom/btmethod/getallbtmethoddata`;
 export const EDIT_BT_PATTERN_TABLEDATA = `${SERVICE_URL}/custom/btpattern/updateBTPattern`;
 export const ADD_BTMETHOD_RULE = `${SERVICE_URL}/custom/btmethod/addbtmethodrule`;
 export const UPDATE_BTMETHOD = `${SERVICE_URL}/custom/btmethod/updatebtmethod`;
 export const DEL_METHOD_RULES =  `${SERVICE_URL}/custom/btmethod/deleteRules`;
 export const DEL_METHOD_BT =  `${SERVICE_URL}/custom/btmethod/delete`;


/* URL for methodBasedCapturingData */
export const ADD_METHOD_BASED_CAPTURING = `${SERVICE_URL}/custom/methodbasedcapturing/addcustomdata`;
export const FETCH_METHOD_BASED_CUSTOMDATA = `${SERVICE_URL}/custom/methodbasedcapturing/getmethodbasedcapturedata`;
export const ADD_RETURN_TYPE = `${SERVICE_URL}/custom/methodbasedcapturing/addreturntype`;
export const ADD_ARGUMENT_TYPE = `${SERVICE_URL}/custom/methodbasedcapturing/argtype`;
export const DEL_METHOD_BASED_CAPTURING = `${SERVICE_URL}/custom/methodbasedcapturing/delete`;
export const UPDATE_METHODBASED_CUSTOMDATA = `${SERVICE_URL}/custom/methodbasedcapturing/updatemethodbasedcapture`;
export const DEL_CUSTOM_METHOD_RETURN_VALUE = `${SERVICE_URL}/custom/methodbasedcapturing/deletereturnvalue`;
export const DEL_CUSTOM_METHOD_ARG_VALUE = `${SERVICE_URL}/custom/methodbasedcapturing/deleteargvalue`;


export const UPDATE_CUSTOM_CAPTURE_DATA_FILE = `${SERVICE_URL}/custom/methodbasedcapturing/updatecustomcapturefile`;

export const DEL_HTTP_REQ_HDR = `${SERVICE_URL}/custom/httpreqbasedcapturing/delete`;
export const ADD_HTTP_REQ_HDR = `${SERVICE_URL}/custom/httpreqbasedcapturing/addhttpreqhdr`;
export const FETCH_HTTPREQ_HDR = `${SERVICE_URL}/custom/httpreqbasedcapturing/gethttpreqhdr`;
export const ADD_RULES_HTTPREQHDR = `${SERVICE_URL}/custom/httpreqbasedcapturing/addhttpreqhdrrules`;

export const UPDATE_HTTPREQHDR = `${SERVICE_URL}/custom/httpreqbasedcapturing/updatehttpreqbasedcustomdata`;
export const DEL_HTTP_CUSTOM_DATA = `${SERVICE_URL}/custom/httpreqbasedcapturing/httpCustomData/delete`;



