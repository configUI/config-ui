export class ConfigUiUtility {

    static createDropdown(list: any): Object[] {
        let selectItemList: Object[] = [];

        for (let index in list) {
            if (list[index].indexOf("--Select") != -1) {
                selectItemList.push({ label: list[index], value: '', enabled: true });
            }
            else {
                selectItemList.push({ label: list[index], value: list[index], enabled: true });
            }
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