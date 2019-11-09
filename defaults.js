import { toHex, parseHex, paramCase, identify } from "./utils";

import { optional } from "./index";

/* default declarations to quick start */
const defaults = {

  /* nominators combine properties names into a variant name */
  nominators: [ paramCase ]

};

/* types are one type of constraints */
defaults.types = {

  /* root types used in final transformations */
  unit: value => `${ value }rem`,
  time: value => `${ value * 150 }ms`,
  percent: value => `${ value * 100 }%`,
  degree: value => `${ value * 360 }deg`,

  /* values declarations too are used as types */
  scale: scale => ({ scale }),
  string: string => ({ string }),
  transform: transform => ({ transform }),
  transition: transition => ({ transition }),
  percentile: percentile => ({ percentile }),

  /* derived types require a base type declaration */
  font: font => ({ font }),
  flex: flex => ({ flex }),
  apex: apex => ({ apex }),
  color: color => ({ color }),
  shadow: shadow => ({ shadow }),
  border: border => ({ border }),
  borderScale: borderScale => ({ borderScale }),
  timing: timing => ({ timing }),
  degrees: degrees => ({ degrees }),
  spacing: spacing => ({ spacing }),

};

/*
  Base types values names are used to generate variant names:

  `dimension: { lightest: scale(0.2), light: scale(0.5), ...`
  lightest-padding, light-border, normal-margin ...
*/
defaults.types.apex.base = 'scaling'
defaults.types.flex.base = 'percentiles'
defaults.types.font.base = 'dimension'
defaults.types.color.base = 'dimension'
defaults.types.shadow.base = 'dimension'
defaults.types.border.base = 'dimension'
defaults.types.borderScale.base = 'scaling'
defaults.types.timing.base = 'dimension'
defaults.types.spacing.base = 'dimension'
defaults.types.degrees.base = 'percentiles'

/* always use types to define values constraints */
const { color, scale, percentile, transform, transition } = defaults.types;

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
  drop: { drop: undefined },
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
  transformScaling: {
    scale: transform("scale")
  },
  transformPercentile: {
    translate: transform("translate"),
  },
  transformDegree: {
    rotate: transform("rotate"),
    skew: transform("skew"),
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
  transition: {
    all: transition("all"),
    flex: transition("flex"),
    width: transition("width"),
    height: transition("height"),
    opacity: transition("opacity"),
    foreground: transition("color"),
    transform: transition("transform"),
    background: transition("background-color"),
    theme: transition([ "color", "background-color" ]),
  },
  dimension: {
    lightest: scale(0.2),
    light: scale(0.5),
    softier: scale(0.75),
    soft: scale(0.9),
    normal: scale(1),
    smooth: scale(1.1),
    smoothier: scale(1.25),
    heavy: scale(1.5),
    heaviest: scale(2)
  },
  metric: {
    kilo: scale(1000),
    hecto: scale(100),
    deca: scale(10),
    deci: scale(0.1),
    centi: scale(0.01),
    milli: scale(0.001)
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
  transform: { "": ["transform"] },
  direction: { "": ["flexDirection"] },
  apex: { apex: ["zIndex"] },
  vectors: { fill: ["fill"] },
  cursor: { cursor: ["cursor"] },
  borders: { border: ["border"] },
  overflow: { flow: ["overflow"] },
  opacity: { opacity: ["opacity"] },
  textAlign: { text: ["textAlign"] },
  events: { events: ["pointerEvents"] },
  transition: { transition: ["transition"] },
  decoration: { decoration: ["textDecoration"] },
  corners: {
    round: ["borderRadius"], /* to be deprecated: 10/10/19 */
    radius: ["borderRadius"] 
  },
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
defaults.transformers = ({ unit, degree, percent, time }) => {
  const { native, web } = identify()
  return [
    {
      parameters: ["flex"],
      transformation: ({ flex }) => flex
    },
    {
      parameters: ["apex"],
      transformation: ({ apex }) => apex
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
      transformation: ({percentile}) => percent(percentile)
    },
    {
      parameters: ["percentile", "color"],
      transformation: ({ percentile, color }) => `${color.substr(0,7)}${toHex(Math.round(percentile*255))}`
    },
    {
      parameters: ["percentile", "transform"],
      transformation: ({ transform, percentile }) => `${transform}(${percent(percentile)})`
    },
    {
      parameters: ["scale", "transform"],
      transformation: ({ transform, scale }) => `${transform}(${scale})`
    },
    {
      parameters: ["degrees", "transform"],
      transformation: ({ transform, degrees}) => `${transform}(${degree(degrees)})`
    },
    {
      parameters: ["timing", "transition"],
      transformation: ({ timing, transition }) =>
        (Array.isArray(transition)
          ? transition
          : [transition]
        ).map(name => `${name} ${time(timing)}`).join(', ')
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
      transformation: ({ border }, { name }) => Object.assign({
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
      parameters: ["borderScale", "color"],
      transformation: ({ borderScale, color }, { name }) => Object.assign({
        [name+'Width']: borderScale,
        [name+'Color']: color
      }, web && {
        [name+'Style']: 'solid',
      })
    },
    {
      parameters: ["borderScale", "scale", "color"],
      transformation: ({ borderScale, color, scale }, { name }) => Object.assign({
        [name+'Width']: borderScale * scale,
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

  /* full-flex, double-flex, half-flex ... */
  flex: [values.flex, rules.flex],

  /* wrap */
  wrap: [values.wrap, rules.wrap],

  /* one-apex, two-apex, three-apex ... */
  apex: [values.apex, rules.apex],

  /* justify-between, align-start, justify-end ... */
  layout: [rules.layout, values.layout],

  /* no-events, all-events */
  events: [values.events, rules.events],

  /* pointer-cursor */
  pointer: [values.pointer, rules.cursor],

  /* flex, block, cell */
  display: [values.display, rules.display],

  /* alert-fill, primary-fill, warning-fill ... */
  vectors: [values.pallete, rules.vectors],

  /* half-opacity, full-opacity, tenth-opacity ... */
  opacity: [values.percentiles, rules.opacity],

  /* horizontal, vertical */
  direction: [values.direction, rules.direction],

  /* no-decoration */
  decoration: [values.decoration, rules.decoration],

  /* light-shadow, heavy-primary-shadow ... */
  shadow: [values.shadow, optional(values.pallete), rules.shadow],

  /* light-radius, heavy-radius-horizontal ... */
  corners: [values.dimension, rules.corners, optional(rules.sides)],

  /* flow-vertical, no-flow-horizontal, no-flow ... */
  overflow: [values.overflow, rules.overflow, optional(rules.flowSides)],

  /* light-width-transition, heavy-all-transition... */
  transition: [values.timing, values.transition, rules.transition],

  /* light-link-foreground, heavy-alert-background, warning-foreground, ... */
  themes: [optional(values.dimension), values.pallete, rules.theme],
  themesAlpha: [values.percentiles, values.pallete, rules.theme],

  /* full-margin half-padding-vertical tenth-spacing ... */
  spacingPercentile: [values.percentiles, rules.spacing, optional(rules.sides)],
  spacing: [values.spacing, rules.spacing, optional(rules.sides)],

  /* light-border, heavy-border-horizontal, no-border ... */
  borders: [values.border, optional(values.pallete), rules.borders, optional(rules.sides)],
  borderDecoration: [values.decoration, rules.borders],

  /* fixed, absolute, full-bottom, zero-top, half-left ... */
  position: [values.position, rules.position],
  positioning: [values.percentiles, rules.positioning],

  /* center-text, italic-text, light-text, ... */
  text: [values.text, rules.typography],
  textAlign: [values.textAlign, rules.textAlign],
  textTypography: [values.font, rules.typography],

  /* one-width, full-height, half-area, drop-height, ... */
  scaling: [values.scaling, rules.scaling],
  scalingDrop: [values.drop, rules.scaling],
  scalingDimension: [values.dimension, rules.scaling],
  scalingPercentile: [values.percentiles, rules.scaling],

  /* full-translate double-scale quarter-skew ... */
  transformDegree: [values.degrees, values.transformDegree, rules.transform],
  transformScaling: [values.scaling, values.transformScaling, rules.transform],
  transformDimension: [values.dimension, values.transformScaling, rules.transform],
  transformPercentile: [values.percentiles, values.transformPercentile, rules.transform],

  /* two-alert-border, one-warning-border-vertical ... */
  bordersScale: [
    values.borderScale,
    optional(values.pallete),
    rules.borders,
    optional(rules.sides)
  ],

  /* five-centi-link-border-bottom, two-deca-alert-border-vertical ... */
  bordersMetric: [
    values.borderScale,
    values.metric,
    optional(values.pallete),
    rules.borders,
    optional(rules.sides)
  ]
});

export default defaults;
