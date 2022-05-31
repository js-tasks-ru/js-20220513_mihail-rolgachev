/**
 * createGetter - creates function getter which allows select value from object
 * @param {string} path - the strings path separated by dot
 * @returns {function} - function-getter which allow get value from object by set path
 */
export function createGetter(path) {
const fields = path.split('.');
return (obj) =>
{
    let result = obj;
    while (result)
    {
        const field = fields.shift();
        if (!result.hasOwnProperty(field)) return undefined;
        result = result[field];
        if (fields.length == 0) return result;
    }
    return result;
}
}
const obj = {
    category: {
      title: 'Goods',
      foo: undefined
    }
  };
  const getter = createGetter('category.title');
console.log(getter(obj));