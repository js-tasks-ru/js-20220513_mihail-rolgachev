/**
 * pick - Creates an object composed of the picked object properties:
 * @param {object} obj - the source object
 * @param {...string} fields - the properties paths to pick
 * @returns {object} - returns the new object
 */
export const pick = (obj, ...fields) => {
    const filtered = Object.entries(obj).filter(([key, val])=>fields.includes(key));
    return Object.fromEntries(filtered);
};
const obj = {foo: 'foo', bar: 'bar', baz: 'baz'};
console.log(pick(obj, 'foo', 'bar'));