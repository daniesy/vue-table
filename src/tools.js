const set = (target, path, value) => {
  const [key, ...keys] = typeof path === "string" ? path.split(".") : path;
  if (keys.length) {
    target[key] = {};
    set(target[key], keys, value);
  } else {
    target[key] = value;
  }
};

const flattenObject = data => {
  let result = {};
  for (const key in data) {
    if (typeof data[key] == "object" && data[key] !== null) {
      const flatObject = flattenObject(data[key]);
      for (const x in flatObject) {
        result[`${key}.${x}`] = flatObject[x];
      }
    } else {
      result[key] = data[key];
    }
  }
  return result;
};

const unflattenObject = data => {
  let result = {};
  for (const i in data) {
    let keys = i.split(".");
    keys.reduce(function(r, e, j) {
      return (
        r[e] ||
        (r[e] = isNaN(Number(keys[j + 1]))
          ? keys.length - 1 == j
            ? data[i]
            : {}
          : [])
      );
    }, result);
  }
  return result;
};

export { set, flattenObject, unflattenObject };
