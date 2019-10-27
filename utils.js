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

const valid = value => !!value;

const titleCase = string =>
  string && `${string[0].toUpperCase()}${string.substr(1).toLowerCase()}`;

const camelCase = parts =>
  parts
    .filter(valid)
    .map((part, index) => (!index ? part.toLowerCase() : titleCase(part)))
    .join("");

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

const toHex = value => value.toString(16).padStart(2, "0");
const isString = unknown => typeof unknown === "string";
const isFunction = unknown => typeof unknown === "function";

export {
  toHex,
  parseHex,
  hexRegex,
  paramCase,
  camelCase,
  titleCase,
  valid,
  arraysEqual,
  isString,
  isFunction
};
