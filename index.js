import defaults from "./defaults";

import { arraysEqual, isString, isFunction, isObject, valid } from "./utils";

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
  const apply = ({ parameters, transformation, type = 'style' }) => {
    if (!arraysEqual(valuesKeys, parameters)) return
    const value = transformation(safeValues, property);
    if (isObject(value)) return { value, type }
    return { value: { [property.name]: value }, type }
  }
  const result = transformers(types).map(apply).filter(valid);
  if (result.length) return result[result.length - 1];
  const value = { [property.name]: Object.values(safeValues).join(" ") }
  return { value, type: 'style' };
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
    const apply = name => transform(value, types, transformers, { name });
    const combine = (acc, { value, type }) => ({ value: { ...acc.value, ...value }, type });
    const values = properties(property).map(apply).reduce(combine, {})
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
  const derivate = type => {
    if (!types[type].base) return types[type]
    return { [type]: convert(values[types[type].base], types[type]) }
  }
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
  const properties = { ...props };
  const raw = { style: {}, properties: {} }
  const consume = property => delete properties[property]
  const apply = prop => {
    if (!variants[prop]) return
    consume(prop)
    if (!props[prop]) return
    const { value, type } = variants[prop]
    const parse = name => {
      if ( !isFunction(value[name]) ) return ({ [name]: value[name] })
      if ( value[name].consumer ) value[name].consumer.map(consume)
      return ({ [name]: value[name]({ ...props, ...raw.properties }, props[prop]) })
    }
    return !!Object.assign(raw[type], Object.assign({}, ...Object.keys(value).map(parse)));
  };
  const processed = !!Object.keys(props).filter(apply).length;
  const style = Object.assign({}, raw.style, props.style);
  Object.assign(properties, ...Object.values(raw.properties))
  if (!processed) return { ...properties, style };
  return applyVariants(variants, { ...properties, style })
};

const applyAll = (variants, props) => {
  const apply = variation => applyVariants(variants[variation], props).style;
  return Object.assign({}, ...Object.keys(variants).map(apply));
};

const assemble = (...variants) => Object.assign({}, ...[ ...variants ].map(Object.values).flat())

export { defaults, generator, generate, applyVariants, applyAll, optional, assemble };