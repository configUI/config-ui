export const TIER_DETAIL = [
    { field: 'tierName', header: 'Tier Name' },
    { field: 'tierDesc', header: 'Description' },
    { field: 'profileName', header: 'Profile Applied' },
    //tierId;
    //tierFileId;
    // profileId; 
];

export function APPLICATION_DATA() {
    let fields = {
        appName: 'Name',
        topoName: 'Topology',
        userName: 'User Name',
        appDesc: 'Description'
    };
    return getFieldHeaderData(fields);
};

export function TOPOLOGY_DETAIL() {
    let fields = {
        topoName: 'Topology Name',
        topoDesc: 'Description',
        profileName: 'Profile Applied'
    };
    return getFieldHeaderData(fields);
}

/**It is used to create object for table header */
export function getFieldHeaderData(fields) {
    let obj = [];
    for(let key in fields){
        obj.push({field: key, header: fields[key]});
    }
    return obj;
}  
