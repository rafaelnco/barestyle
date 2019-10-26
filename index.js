import defaults from "./defaults";

import { arraysEqual, isString, isFunction, valid } from "./utils";

const optional = variation => ({ "": [""], ...variation });

const parse = part => {
  return Object.keys(part).map(key =>
    Object.assign({
      property: Array.isArray(part[key]) ? [part[key]] : [],
      value: !Array.isArray(part[key]) ? [part[key]] : [],
      variant: [key]
    })
  );
};

const recursive = (constraints, stack = []) => {
  if (!constraints.length) return stack;
  const constraint = constraints.shift();
  const variations = parse(constraint);
  const extend = stacked =>
    variations.map(extension => {
      const concat = key => ({ [key]: stacked[key].concat(extension[key]) });
      return Object.assign({}, ...Object.keys(extension).map(concat));
    });
  const extended = !stack.length ? variations : stack.map(extend).flat();
  return recursive(constraints, extended);
};

const transform = (values, types, transformers, property) => {
  const safeRead = value => (isString(value) ? types.string(value) : value);
  const safeValues = Object.assign({}, ...values.map(safeRead));
  const valuesKeys = Object.keys(safeValues);
  const apply = ({ parameters, transformation }) =>
    arraysEqual(valuesKeys, parameters) && transformation(safeValues, property);
  const transformed = transformers(types).map(apply);
  const result = transformed.filter(valid);
  if (result.length) return result[result.length - 1];
  return Object.values(safeValues).join(" ");
};

const properties = (parts, values = []) => {
  if (!parts.length) return values;
  const variations = parts.shift();
  const name = value => variations.map(variation => value.concat(variation));
  const extended = !values.length ? variations : values.map(name).flat();
  return properties(parts, extended);
};

const generate = ({
  constraints,
  transformers = defaults.transformers,
  nominators = defaults.nominators,
  types = defaults.types
}) => {
  const crunch = ({ property, value, variant }) => {
    const apply = name => {
      const result = transform(value, types, transformers, { name })
      if(typeof result === 'object') return result
      return ({ [name]: result })
    };
    const values = Object.assign({}, ...properties(property).map(apply));
    const nominate = nominator => ({ [nominator(variant)]: values });
    return Object.assign({}, ...nominators.map(nominate));
  };
  return Object.assign({}, ...recursive(constraints).map(crunch));
};

const convert = (type, newType) => {
  const apply = key => ({ [key]: newType(Object.values(type[key])[0]) });
  return Object.assign({}, ...Object.keys(type).map(apply));
};

const generator = (proprietary = {}) => {
  const { nominators, transformers } = proprietary;
  const rules = Object.assign({}, defaults.rules, proprietary.rules);
  const types = Object.assign({}, defaults.types, proprietary.types);
  const values = Object.assign({}, defaults.values, proprietary.values);
  const derivate = type => ({ [type]: convert(values.dimension, types[type]) });
  Object.assign(values, ...Object.keys(types).map(derivate));
  const variantGenerator = proprietary.variants || defaults.variants;
  const variants = variantGenerator({ rules, values });
  const context = variant => {
    const constraints = variants[variant];
    return { constraints, nominators, transformers, types };
  };
  const doGenerate = variant => ({ [variant]: generate(context(variant)) });
  return Object.assign({}, ...Object.keys(variants).map(doGenerate));
};

const applyVariants = (variants, props) => {
  const isEnabled = prop => !!props[prop] && variants[prop];
  const enabled = Object.keys(props).filter(isEnabled);
  const apply = variant =>
    isFunction(variants[variant])
      ? variants[variant](props[variant])
      : variants[variant];
  return Object.assign({}, ...enabled.map(apply));
};

const applyAll = (variants, props) => {
  const apply = variation => applyVariants(variants[variation], props);
  return Object.assign({}, ...Object.keys(variants).map(apply));
};

export { defaults, generator, generate, applyAll, optional };
