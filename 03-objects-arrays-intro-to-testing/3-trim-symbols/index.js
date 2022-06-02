/**
 * trimSymbols - removes consecutive identical symbols if they quantity bigger that size
 * @param {string} string - the initial string
 * @param {number} size - the allowed size of consecutive identical symbols
 * @returns {string} - the new string without extra symbols according passed size
 */
export function trimSymbols(string, size) {
    if (size === undefined) return string;
    if (size < 1) return "";
let result = "";
let prev = "";
let count = 0;
for (let i=0; i<string.length; i++)
{
    const cur = string[i];
    if (cur != prev)
    {
        result+= cur;
        prev = cur;
        count = 0;
    } else
    {
        if (count < size-1)
        {
            console.log("1");
            result+= string[i];
            count++
        }       
    }
}
return result;
}
console.log(trimSymbols('xxxaxxx', 2));