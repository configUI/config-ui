import { SelectItem } from 'primeng/primeng'
export class ConfigUiUtility {

    static createDropdown(list: any): SelectItem[] {
        let selectItemList: SelectItem[] = [];

        for (let index in list) {
            if (list[index].indexOf("--Select") != -1) {
                selectItemList.push({ label: list[index], value: ''});
            }
            else {
                selectItemList.push({ label: list[index], value: list[index]});
            }
        }

        return selectItemList;
    }

// This method is created for showing xml files in dropdown without .xml extension
    static createInstrProfileDropdown(list: any): SelectItem[] {
        let selectItemList: SelectItem[] = [];

        for (let index in list) {
            if (list[index].indexOf("--Select") != -1) {
                selectItemList.push({ label: list[index].split(".")[0] , value: ''});
            }
            else {
                selectItemList.push({ label: list[index].split(".")[0] , value: list[index]});
            }
        }

        return selectItemList;
    }

    static createListWithKeyValue(arrLabel: string[], arrValue: string[]): SelectItem[] {
        let selectItemList = [];

        for (let index in arrLabel) {
            selectItemList.push({ label: arrLabel[index], value: arrValue[index] });
        }

        return selectItemList;
    }
}

/**
var valuesArr = ["v1", "v2", "v3", "v4", "v5"];   
var removeValFromIndex = [0, 2, 4]; // ascending

it will return ["v2", "v4"]
 */
export function deleteMany(array, indexes = []) {
    return array.filter((item, idx) => indexes.indexOf(idx) === -1);
}

export function cloneObject(data){
    return JSON.parse(JSON.stringify(data));
}
