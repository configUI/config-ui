export interface ServiceInfo {
    graphDataDTO: Array<GraphDatainfo>;
    timpstamp:  Array<String>;
}

interface GraphDatainfo {
    graphData: Array<String> ;
    lastUpdateBy: 'NA';
    lastUpdateTime: 'NA';
    serviceName: '';
    templateName: '';
    color: '';
}

