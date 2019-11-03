import { toHex, parseHex, paramCase, identify } from "./utils";

import { optional } from "./index";

/* default declarations to quick start */
const defaults = {

  /* nominators combine properties names into a variant name */
  nominators: [paramCase]

};

/* types are one type of constraints */
defaults.types = {

  /* root types used in final transformations */
  unit: value => `${value}rem`,

  /* values declarations too are used as types */
  scale: scale => ({ scale }),
  string: string => ({ string }),
  percentile: percentile => ({ percentile }),

  /* derived types require a base type declaration */
  font: font => ({ font }),
  flex: flex => ({ flex }),
  color: color => ({ color }),
  shadow: shadow => ({ shadow }),
  border: border => ({ border }),
  spacing: spacing => ({ spacing }),

};

/*
  Base types values names are used to generate variant names:

  `dimension: { lightest: scale(0.2), light: scale(0.5), ...`
  lightest-padding, light-border, normal-margin ...
*/
defaults.types.flex.base = 'percentiles'
defaults.types.font.base = 'dimension'
defaults.types.color.base = 'dimension'
defaults.types.shadow.base = 'dimension'
defaults.types.border.base = 'dimension'
defaults.types.spacing.base = 'dimension'

/* always use types to define values constraints */
const { color, scale, percentile } = defaults.types;

/*
  Values constraints names are used to generate variant names

  `decoration: { no: "none" },`
  no-border
  
  `overflow: { flow: "auto" },`
  flow-horizontal, flow-vertical...

  `dimension: { lightest: scale(0.2), light: scale(0.5), ...`
  lightest-padding, light-border, normal-margin ...


  `pallete: { link: color("#2a7fff"), success: color("#11cc11"), ...`
  link-foreground, success-background...
*/
defaults.values = {
  wrap: { wrap: "wrap" },
  text: { italic: "italic" },
  decoration: { no: "none" },
  pointer: { pointer: "pointer" },
  events: { all: "all", no: "none" },
  overflow: { "": "auto", no: "hidden" },
  display: {
    flex: "flex",
    block: "block",
    cell: "table-cell"
  },
  position: {
    absolute: "absolute",
    relative: "relative",
    static: "static",
    fixed: "fixed",
    sticky: "sticky"
  },
  direction: {
    horizontal: "row",
    vertical: "column"
  },
  textAlign: {
    left: "left",
    center: "center",
    right: "right"
  },
  layout: {
    between: "space-between",
    around: "space-around",
    start: "flex-start",
    center: "center",
    end: "flex-end"
  },
  dimension: {
    lightest: scale(0.2),
    light: scale(0.5),
    normal: scale(1),
    heavy: scale(1.5),
    heaviest: scale(2)
  },
  scaling: {
    zero: scale(0),

    oneTwenth: scale(1/20),

    oneTenth: scale(1/10),
    oneNinth: scale(1/9),
    oneEighth: scale(1/8),
    oneSeventh: scale(1/7),

    fiveSixths: scale(5/6),
    oneSixth: scale(1/6),

    fourFifths: scale(4/5),
    threeFifths: scale(3/5),
    twoFifths: scale(2/5),
    oneFifth: scale(1/5),

    threeFourths: scale(3/4),
    twoFourths: scale(2/4),
    oneFourth: scale(1/4),

    threeThirds: scale(3/3),
    twoThirds: scale(2/3),
    oneThird: scale(1/3),

    oneHalf: scale(1/2),

    one: scale(1),
    two: scale(2),
    three: scale(3),
    four: scale(4),
    five: scale(5)
  },
  percentiles: {
    zero: percentile(0),
    twoAHalf: percentile(0.025),
    fifth: percentile(0.05),
    tenth: percentile(0.1),
    fifteenth: percentile(0.15),
    quarter: percentile(0.25),
    half: percentile(0.5),
    threeQuarters: percentile(0.75),
    hundred: percentile(1),
    full: percentile(1),
    single: percentile(1),
    oneAHalf: percentile(1.5),
    double: percentile(2),
    doubleAHalf: percentile(2.5),
    triple: percentile(3),
    quadruple: percentile(4),
    quintuple: percentile(5),
  },
  pallete: {
    link: color("#2a7fff"),
    success: color("#11cc11"),
    alert: color("#ff1111"),
    attention: color("#ffcc00"),
    primary: color("#eeeeee"),
    secondary: color("#111111"),
    filled: color("#222222"),
    disabled: color("#777777"),
    empty: color("#eeeeee"),
    transparent: color("#00000000")
  }
};

/* 
  Rules constraints properties and can also be combined

  `wrap: { "": ["flexWrap"] },`
  empty rules names ("") are to be applied without mention
  therefore all wrap values names are single named variants
  <C wrap ... >

  `cursor: { cursor: ["cursor"] },`
  <C cursor-pointer >

  `shadow: { shadow: ["boxShadow"] },`
  <C primary-shadow ...


  `flex: { "": ["flex"], grow: ["flexGrow"], shrink: ["flexShrink"] ...`
  <C one-grow /><C two-grow /><C horizontal />

  `sides: { "": [""], top: ["Top"], left: ["Left"],...`
  <C padding-left margin border-bottom ...

*/
defaults.rules = {
  wrap: { "": ["flexWrap"] },
  display: { "": ["display"] },
  position: { "": ["position"] },
  direction: { "": ["flexDirection"] },
  vectors: { fill: ["fill"] },
  cursor: { cursor: ["cursor"] },
  borders: { border: ["border"] },
  overflow: { flow: ["overflow"] },
  textAlign: { text: ["textAlign"] },
  corners: { round: ["borderRadius"] },
  events: { events: ["pointerEvents"] },
  decoration: { decoration: ["textDecoration"] },
  shadow: {
    shadow: ["boxShadow"],
    textShadow: ["textShadow"]
  },
  layout: {
    align: ["alignItems"],
    justify: ["justifyContent"]
  },
  theme: {
    foreground: ["color"],
    background: ["backgroundColor"]
  },
  typography: {
    text: ["fontSize"],
    font: ["fontStyle"],
    weight: ["fontWeight"]
  },
  spacing: {
    margin: ["margin"],
    padding: ["padding"],
    spacing: ["margin", "padding"]
  },
  scaling: {
    width: ["width"],
    height: ["height"],
    area: ["width", "height"],
    ratio: ["aspectRatio"]
  },
  flowSides: {
    vertical: ["Y"],
    horizontal: ["X"]
  },
  flex: {
    "": ["flex"], /* to be deprecated: 10/10/19 */
    flex: ["flex"],
    grow: ["flexGrow"],
    basis: ["flexBasis"],
    shrink: ["flexShrink"]
  },
  sides: {
    top: ["Top"],
    left: ["Left"],
    right: ["Right"],
    bottom: ["Bottom"],
    vertical: ["Top", "Bottom"],
    horizontal: ["Left", "Right"]
  },
  positioning: {
    top: ["top"],
    left: ["left"],
    right: ["right"],
    bottom: ["bottom"],
    vertical: ["top","bottom"],
    horizontal: ["left","right"],
    inset: ["top","bottom","left","right"]
  },
};

/*

  Transformations are applied after variations generation

  `parameters: [...]` are used to match variations with the right transformations

  It's possible to derive complex values by combining simple values, as in:

  ```
    {
      parameters: ["scale", "color"],
      transformation: ({ scale, color }) => {
        ...
        return `#${calculated.map(toHex).join("")}`;
      }
  ```

  This transformations applies to variants that combine scale and color values:

    light-link-foreground heavy-primary-background ...

  It's possible to branch between different style notations

  ```
    {
      parameters: ["shadow"],
      transformation: ({ shadow }) => 
        web && `0 0 ${unit(shadow)} #6666`
        || native && ({
          shadowRadius: unit(shadow),
          shadowColor: '#6666',
          elevation: unit(shadow)
        })
    },`
  ```
*/
defaults.transformers = ({ unit }) => {
  const { native, web } = identify()
  return [
    {
      parameters: ["flex"],
      transformation: ({ flex }) => flex
    },
    {
      parameters: ["font"],
      transformation: ({ font }) => unit(font)
    },
    {
      parameters: ["scale"],
      transformation: ({ scale }) => unit(scale)
    },
    {
      parameters: ["spacing"],
      transformation: ({ spacing }) => unit(spacing)
    },
    {
      parameters: ["percentile"],
      transformation: ({percentile}) => `${percentile * 100}%`
    },
    {
      parameters: ["percentile", "color"],
      transformation: ({ percentile, color }) => `${color.substr(0,7)}${toHex(percentile*255)}`
    },
    {
      parameters: ["scale", "color"],
      transformation: ({ scale, color }) => {
        const calculate = value => Math.min(255, Math.round((1 / scale) * value));
        return `#${parseHex(color).map(calculate).map(toHex).join("")}`;
      }
    },
    {
      parameters: ["border"],
      transformation: ({ border, color }, { name }) => Object.assign({
        [name+'Width']: unit(border),
        [name+'Color']: '#333'
      }, web && {
        [name+'Style']: 'solid',
      })
    },
    {
      parameters: ["border", "color"],
      transformation: ({ border, color }, { name }) => Object.assign({
        [name+'Width']: unit(border),
        [name+'Color']: color
      }, web && {
        [name+'Style']: 'solid',
      })
    },
    {
      parameters: ["shadow"],
      transformation: ({ shadow }) => 
        web && `0 0 ${unit(shadow)} #6666`
        || ({
          shadowRadius: unit(shadow),
          shadowColor: '#6666',
          elevation: unit(shadow)
        })
    },
    {
      parameters: ["shadow", "color"],
      transformation: ({ shadow, color }) => 
        web && `0 0 ${unit(shadow)} ${color}`
        || ({
          shadowRadius: unit(shadow),
          shadowColor: color,
          elevation: unit(shadow)
        })
    }
  ]
};

/*
  These are default variants that cover some basic styles to quick start development

  `shadow: [values.shadow, optional(values.pallete), rules.shadow],`

    values.shadow: lightest, light, normal...
    values.pallete: link, success, primary...
    rules.shadow: shadow

    lightest-shadow light-success-shadow normal-primary-shadow ...

  `borderDecoration: [values.decoration, rules.borders],`

    values.decotation: no
    rules.borders: border

    no-border

  `borders: [values.border, optional(values.pallete), rules.borders, rules.sides]`

    values.border: lightest, light, normal... (base = dimension)
    values.pallete: link, primary ...
    rules.borders: border
    rules.sides: left, top, vertical ...

    light-primary-border-top lightest-link-border-vertical ...
*/
defaults.variants = ({ rules, values }) => ({
  flex: [values.flex, rules.flex],
  wrap: [values.wrap, rules.wrap],
  text: [values.text, rules.typography],
  layout: [rules.layout, values.layout],
  events: [values.events, rules.events],
  pointer: [values.pointer, rules.cursor],
  display: [values.display, rules.display],
  vectors: [values.pallete, rules.vectors],
  scaling: [values.scaling, rules.scaling],
  position: [values.position, rules.position],
  typography: [values.font, rules.typography],
  dimension: [values.dimension, rules.scaling],
  direction: [values.direction, rules.direction],
  textAlign: [values.textAlign, rules.textAlign],
  percentile: [values.percentiles, rules.scaling],
  decoration: [values.decoration, rules.decoration],
  positioning: [values.percentiles, rules.positioning],
  borderDecoration: [values.decoration, rules.borders],
  themesAlpha: [values.percentiles, values.pallete, rules.theme],
  shadow: [values.shadow, optional(values.pallete), rules.shadow],
  spacing: [values.spacing, rules.spacing, optional(rules.sides)],
  themes: [optional(values.dimension), values.pallete, rules.theme],
  corners: [values.dimension, rules.corners, optional(rules.sides)],
  overflow: [values.overflow, rules.overflow, optional(rules.flowSides)],
  spacingPercentile: [values.percentiles, rules.spacing, optional(rules.sides)],
  borders: [values.border, optional(values.pallete), rules.borders, optional(rules.sides)]
});

export default defaults;
