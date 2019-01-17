import { ROUTING_PATH } from './config-url-constant';

export const LABEL = {
    HOME: 'Home',
    APPLICATION_LIST: 'Application',
    PROFILE_LIST: 'Profile',
    TOPOLOGY_LIST: 'Topology List',
    TOPOLOGY_DETAIL: 'Topology',
    CONFIGURATION: 'Configuration',
    GENERAL:'General',
    INSTRUMENTATION: 'Instrumentation',
    ADVANCE: 'Advance Settings',
    INTEGRATION:'Product Integration',
    TREE_MAIN: 'Topology Details',
    ND_AGENT: 'ND Agent Status',
    INSTRUMENTATION_PROFILE_MAKER: 'Instrumentation Profile Maker',
    AUTO_DISCOVER: 'Auto Discover',
    VIEW_AUDIT_LOG: 'View Audit Log',
    NDC_KEYWORDS: 'ND Collector',
    AUTO_INSTRUMENTATION: 'Instrumentation Finder',
    AI: 'Auto Instrumentation',
    NDE_CLUSTER: 'NDE Cluster Configuration',
    USER_CONFIG_KEYWORDS: 'User Configured Settings',
    ND_AGENT_INFO: 'ND Agent Info',
    BCI_LOGS: 'Download Agent Logs'
} 

export const URL = {
    HOME: `${ROUTING_PATH}/home`,
    APPLICATION_LIST: `${ROUTING_PATH}/application-list`,
    NDC_KEYWORDS: `${ROUTING_PATH}/application-list/ndc-keywords-setting`,
    PROFILE: `${ROUTING_PATH}/profile`,
    PROFILE_LIST: `${ROUTING_PATH}/profile/profile-list`,
    TOPOLOGY_LIST: `${ROUTING_PATH}/profile/topology-list`,
    TOPOLOGY_DETAIL: `${ROUTING_PATH}/topology-list`,
    CONFIGURATION: `${ROUTING_PATH}/profile/configuration`,
    ND_AGENT: `${ROUTING_PATH}/nd-agent`,

    GENERAL: `${ROUTING_PATH}/profile/general`,
    INSTRUMENTATION: `${ROUTING_PATH}/profile/instrumentation`,
    ADVANCE: `${ROUTING_PATH}/profile/advance`,
    INTEGRATION: `${ROUTING_PATH}/profile/integration`,

    TREE_GENERAL: `${ROUTING_PATH}/tree-main/profile/general`,
    TREE_INSTRUMENTATION: `${ROUTING_PATH}/tree-main/profile/instrumentation`,
    TREE_ADVANCE: `${ROUTING_PATH}/tree-main/profile/advance`,
    TREE_INTEGRATION: `${ROUTING_PATH}/tree-main/profile/integration`,

    TOPO_TREE_GENERAL: `${ROUTING_PATH}/tree-main/topology/profile/general`,
    TOPO_TREE_INSTRUMENTATION: `${ROUTING_PATH}/tree-main/topology/profile/instrumentation`,
    TOPO_TREE_ADVANCE: `${ROUTING_PATH}/tree-main/topology/profile/advance`,
    TOPO_TREE_INTEGRATION: `${ROUTING_PATH}/tree-main/topology/profile/integration`,

    TREE_MAIN: `${ROUTING_PATH}/tree-main`,
    TREE_MAIN_TOPOLOGY:`${ROUTING_PATH}/tree-main/topology`,
    TOPOLOGY_PROFILE: `${ROUTING_PATH}/tree-main/profile/configuration`,
    TREE_TOPOLOGY: `${ROUTING_PATH}/tree-main/topology/profile/configuration`,
    TREE_TOPO_PROFILE: `${ROUTING_PATH}/tree-main/topology/profile`,    
    TREE_PROFILE: `${ROUTING_PATH}/tree-main/profile`,
    INSTRUMENTATION_PROFILE_MAKER: `${ROUTING_PATH}/instrumentation-profile-maker`,
    AUTO_DISCOVER: `${ROUTING_PATH}/auto-discover-main`,
    AUTO_DISCOVER_TREE: `${ROUTING_PATH}/auto-discover-tree`,
    AUTO_INSTRUMENTATION: `${ROUTING_PATH}/auto-discover`,
    NDE_CLUSTER_CONFIG: `${ROUTING_PATH}/nde-cluster-config`,
    USER_CONFIGURED_KEYWORD: `${ROUTING_PATH}/user-configured-keywords`,
    VIEW_AUDIT_LOG: `${ROUTING_PATH}/audit-log-view`,
    ND_AGENT_INFO: `${ROUTING_PATH}/nd-agent-info`,
    BCI_LOGS: `${ROUTING_PATH}/bci-logs`
};  
