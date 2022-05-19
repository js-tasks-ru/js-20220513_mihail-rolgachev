/**
 * sortStrings - sorts array of string by two criteria "asc" or "desc"
 * @param {string[]} arr - the array of strings
 * @param {string} [param="asc"] param - the sorting type "asc" or "desc"
 * @returns {string[]}
 */
function compareDesc(fist, second)
{
    if (fist > second) return 1;
    if (fist === second) return 0;
    return -1;
}
export function sortStrings(arr, param = 'asc') {

switch (param)
{
    case 'asc': return arr.sort();
    case 'desc': return arr.sort(compareDesc);
    default: throw new Error("Неверное значение параметра сортировки " + param);
}
    
}
Console.Log(sortStrings(['b', 'a', 'c'], 'asc'));