import { ROUTING_PATH } from './config-url-constant';

export const LABEL = {
    HOME: 'Home',
    APPLICATION_LIST: 'Application List',
    PROFILE_LIST: 'Profile List',
    TOPOLOGY_LIST: 'Topology List',
    TOPOLOGY_DETAIL: 'Topology Detail',
    CONFIGURATION: 'Configuration',
    GENERAL:'General',
    INSTRUMENTATION: 'Instrumentation',
    ADVANCE: 'Advance Settings',
    INTEGRATION:'Product Integration' 
} 

export const URL = {
    HOME: `${ROUTING_PATH}/home`,
    APPLICATION_LIST: `${ROUTING_PATH}/application-list`,
    PROFILE: `${ROUTING_PATH}/profile`,
    PROFILE_LIST: `${ROUTING_PATH}/profile/profile-list`,
    TOPOLOGY_LIST: `${ROUTING_PATH}/profile/topology-list`,
    CONFIGURATION: `${ROUTING_PATH}/profile/configuration`,

    GENERAL: `${ROUTING_PATH}/profile/general`,
    INSTRUMENTATION: `${ROUTING_PATH}/profile/instrumentation`,
    ADVANCE: `${ROUTING_PATH}/profile/advance`,
    INTEGRATION: `${ROUTING_PATH}/profile/integration`
};