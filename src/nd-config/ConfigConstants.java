/**
 * 
 */
package com.cavisson;

/**
 * @author netstorm
 *
 */

public interface ConfigConstants 
{
	public static long DEFAULT_PROF_ID = 1;
	
	public static long INSTANCE_WEIGHT = 4;
	public static long SERVER_WEIGHT = 3;
	public static long TIER_WEIGHT = 2;
	public static long TOPOLOGY_WEIGHT = 1;
	
	public static String TREE_URL = "/custom/tree";
	public static String PROFILE_URL = "/custom/profile";
	public static String TOPOLOGY_URL = "/custom/topology";
	public static String PROFILE_SERVICE_ENTRY_URL = "/custom/profileserviceentryasso";
	public static String BACKEND_DETECTION_URL = "/custom/backenddetection";
	public static String BT_PATTERN_URL = "/custom/btpattern";
	public static String PROFILE_KEYWORDS_URL = "/custom/profilekeywords";
	public static String METHOD_MONITOR_URL = "/custom/methodmonitor";
	public static String ERROR_DETECTION_URL = "/custom/errordetection";
	public static String RUNTIME_CHANGE_URL = "/custom/runtimechange";
	public static String ND_AGENT_STATUS_URL = "/ndagent";
	public static String BTMETHOD_URL = "custom/btmethod";
	public static String METHOD_BASED_CAPTURING_URL = "custom/methodbasedcapturing";
	public static String ADVANCE_EXCEPTION_FILTER_URL = "custom/exceptionfilters";
	public static String EXCEPTION_MONITOR_URL = "custom/exceptionmonitor";
	public static String BT_HTTP_HDR_URL = "custom/bthttpheader";
}
