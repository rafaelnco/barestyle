import { toHex, parseHex, paramCase } from "./utils";

import { optional } from "./index";

function identify() {
  let native = false
  try { native = !!require("react-native") } catch (e) {}
  return { native, web: !native }
}

const defaults = { nominators: [paramCase] };

defaults.types = {
  unit: value => `${value}rem`,
  font: font => ({ font }),
  color: color => ({ color }),
  scale: scale => ({ scale }),
  shadow: shadow => ({ shadow }),
  border: border => ({ border }),
  string: string => ({ string }),
  spacing: spacing => ({ spacing }),
  percentile: percentile => ({ percentile }),
};

const { color, scale, percentile } = defaults.types;

defaults.values = {
  flex: { full: "1" },
  wrap: { wrap: "wrap" },
  text: { italic: "italic" },
  overflow: { flow: "auto" },
  decoration: { no: "none" },
  pointer: { pointer: "pointer" },
  orientation: {
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

defaults.rules = {
  flex: { "": ["flex"] },
  wrap: { "": ["flexWrap"] },
  vectors: { fill: ["fill"] },
  cursor: { cursor: ["cursor"] },
  borders: { border: ["border"] },
  textAlign: { text: ["textAlign"] },
  shadow: { shadow: ["boxShadow"] },
  corners: { round: ["borderRadius"] },
  orientation: { "": ["flexDirection"] },
  decoration: { decoration: ["textDecoration"] },
  background: { background: ["backgroundColor"] },
  scaling: {
    width: ["width"],
    height: ["height"],
    ratio: ["aspectRatio"]
  },
  typography: {
    text: ["fontSize"],
    font: ["fontStyle"],
    weight: ["fontWeight"]
  },
  layout: {
    align: ["alignItems"],
    justify: ["justifyContent"]
  },
  theme: {
    foreground: ["color"],
    background: ["backgroundColor"]
  },
  spacing: {
    margin: ["margin"],
    padding: ["padding"]
  },
  overflow: {
    "": ["overflow"],
    vertical: ["overflowY"],
    horizontal: ["overflowX"]
  },
  sides: {
    "": [""],
    top: ["Top"],
    left: ["Left"],
    right: ["Right"],
    bottom: ["Bottom"],
    vertical: ["Top", "Bottom"],
    horizontal: ["Left", "Right"]
  }
};

defaults.transformers = ({ unit }) => {
  const { native, web } = identify()
  return [
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
    },
    {
      parameters: ["scale"],
      transformation: ({ scale }) => unit(scale)
    },
    {
      parameters: ["font"],
      transformation: ({ font }) => unit(font)
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
      parameters: ["scale", "color"],
      transformation: ({ scale, color }) => {
        const intColors = parseHex(color);
        const factor = 1 / scale;
        const calculate = value => Math.min(255, Math.round(factor * value));
        const calculated = intColors.map(calculate);
        return `#${calculated.map(toHex).join("")}`;
      }
    }
  ]
};

defaults.variants = ({ rules, values }) => ({
  flex: [rules.flex, values.flex],
  wrap: [values.wrap, rules.wrap],
  text: [values.text, rules.typography],
  layout: [rules.layout, values.layout],
  pointer: [values.pointer, rules.cursor],
  vectors: [values.pallete, rules.vectors],
  percentile: [values.percentiles, rules.scaling],
  scaling: [values.scaling, rules.scaling],
  dimension: [values.dimension, rules.scaling],
  overflow: [rules.overflow, values.overflow],
  typography: [values.font, rules.typography],
  textAlign: [values.textAlign, rules.textAlign],
  borderDecoration: [values.decoration, rules.borders],
  decoration: [values.decoration, rules.decoration],
  orientation: [values.orientation, rules.orientation],
  spacing: [values.spacing, rules.spacing, rules.sides],
  corners: [values.dimension, rules.corners, rules.sides],
  shadow: [values.shadow, optional(values.pallete), rules.shadow],
  themes: [optional(values.dimension), values.pallete, rules.theme],
  borders: [values.border, optional(values.pallete), rules.borders, rules.sides]
});

export default defaults;
