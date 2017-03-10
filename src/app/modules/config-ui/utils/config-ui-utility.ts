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