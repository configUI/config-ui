const SERVICE_URL = 'http://10.10.30.26:8001/configUI'

/* Url for Home Screen */
export const HOME_SCREEN_URL = `${SERVICE_URL}/home`;
export const UPDATE_TOPOLOGY = `${SERVICE_URL}/uploadtopology`;

/* Url for Application Table */
export const FETCH_APP_TABLE_DATA = `${SERVICE_URL}/custom/application/getAllApplication`;
export const APP_TREE_URL = `${SERVICE_URL}/custom/tree/application`;
export const ADD_ROW_APP_URL = `${SERVICE_URL}/custom/application`;
export const DEL_ROW_APP_URL = `${SERVICE_URL}/custom/application/delete`;
