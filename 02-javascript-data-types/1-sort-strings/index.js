/**
 * sortStrings - sorts array of string by two criteria "asc" or "desc"
 * @param {string[]} arr - the array of strings
 * @param {string} [param="asc"] param - the sorting type "asc" or "desc"
 * @returns {string[]}
 */
function comparator(fist, second, collator)
{
    return collator.compare(fist, second)
}
export function sortStrings(arr, param = 'asc') 
{
    var result = JSON.parse(JSON.stringify(arr));
    const collator = new Intl.Collator("ru", { caseFirst: "upper" });
    switch (param)
    {
        case 'asc': return result.sort((fist, second) => comparator(fist, second, collator));
        case 'desc': return result.sort((fist, second) => -comparator(fist, second, collator));
        default: throw new Error("Неверное значение параметра сортировки " + param);
    }    
}
console.log(sortStrings(['абрикос', 'Абрикос', 'яблоко', 'Яблоко', 'ёжик', 'Ёжик']));