export class ImmutableArray {
//to add data in table
    static push(arr, newEntry) {
        console.log("[...arr, newEntry]--",[...arr, newEntry])
        return [...arr, newEntry]
    }
//to delete from table
    static delete(arr, index) {
        return arr.slice(0, index).concat(arr.slice(index + 1))
    }

    /**
     * arr = Main Data list
     * newEntry = For entry
     * index = For replace index
     */

//to edit table data
    static replace(arr, newEntry, index){
         arr[index] = newEntry;
         return arr.slice();
    }

    static unshift(arr, newEntry) {
        return [newEntry, ...arr]
    }

    static splice(arr, start, deleteCount, ...items) {
        return [...arr.slice(0, start), ...items, ...arr.slice(start + deleteCount)]
    }


}
