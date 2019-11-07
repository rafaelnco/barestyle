

function identify() {
  let native = false
  try { native = !!require("react-native") } catch (e) {}
  return { native, web: !native }
}

const isString = unknown => typeof unknown === "string";

const isFunction = unknown => typeof unknown === "function";

const isObject = unknown => unknown && typeof unknown === "object";

const combine = (accumulated, actual) => {
  const assign = property => {
    const totalValue = accumulated[property];
    const actualValue = actual[property];
    if (Array.isArray(totalValue) && Array.isArray(actualValue)) {
      accumulated[property] = totalValue.concat(...actualValue);
    } else if (isObject(totalValue) && isObject(actualValue)) {
      accumulated[property] = merge(totalValue, actualValue);
    } else accumulated[property] = actualValue;
  }
  Object.keys(actual).forEach(assign);
  return accumulated;
}

const merge = (...objects) => objects.reduce(combine, {});

function arraysEqual(_a, _b) {
  const a = _a.sort();
  const b = _b.sort();
  if (a === b) return true;
  if (a == null || b == null) return false;
  if (a.length !== b.length) return false;
  for (let i = 0; i < a.length; i += 1) {
    if (a[i] !== b[i]) return false;
  }
  return true;
}

const valid = actualValue => !!actualValue;

const titleCase = string => string && [string[0].toUpperCase(),string.substr(1)].join("");

const applyCamel = (part, index) => (!index ? part.toLowerCase() : titleCase(part))

const camelCase = parts => parts.filter(valid).map(applyCamel).join("");

const paramCase = parts => parts.filter(valid).join("-");

const hexRegex = /#(\w\w)(\w\w)(\w\w)(\w\w)?/;

const parseHex = hex => {
  const treated = hex.match(hexRegex).slice(1, 5);
  let red;
  let green;
  let blue;
  let alpha;
  [red, green, blue, alpha = "ff"] = treated;
  return [red, green, blue, alpha].map(part => Number.parseInt(part, 16));
};

const toHex = actualValue => actualValue.toString(16).padStart(2, "0");

export {
  valid,
  toHex,
  parseHex,
  hexRegex,
  paramCase,
  camelCase,
  titleCase,
  arraysEqual,
  isString,
  isFunction,
  isObject,
  identify,
  merge
};
