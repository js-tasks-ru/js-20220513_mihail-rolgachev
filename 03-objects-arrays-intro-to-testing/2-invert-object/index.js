/**
 * invertObj - should swap object keys and values
 * @param {object} obj - the initial object
 * @returns {object | undefined} - returns new object or undefined if nothing did't pass
 */
export function invertObj(obj) {
    if (!obj) return undefined;
    const result  = {};
    const fields = Object.entries(obj);
    fields.forEach(([key, val])=>result[val] = key);
    return result;
}

const obj = {
    key1: 'value1',
    key2: 'value2'
  };
console.log(invertObj(obj));