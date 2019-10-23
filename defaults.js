import { toHex, parseHex, paramCase } from "./utils";

import { optional } from "./index";

const defaults = { nominators: [paramCase] };

defaults.types = {
  unit: value => `${value}rem`,
  color: color => ({ color }),
  scale: scale => ({ scale }),
  shadow: shadow => ({ shadow }),
  border: border => ({ border }),
  string: string => ({ string }),
  font: font => ({ font }),
  spacing: spacing => ({ spacing })
};

const { color, scale } = defaults.types;

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

defaults.variants = ({ rules, values }) => ({
  flex: [rules.flex, values.flex],
  wrap: [values.wrap, rules.wrap],
  text: [values.text, rules.typography],
  layout: [rules.layout, values.layout],
  pointer: [values.pointer, rules.cursor],
  vectors: [values.pallete, rules.vectors],
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

defaults.transformers = ({ unit }) => [
  {
    parameters: ["border"],
    transformation: ({ border }) => `${unit(border)} solid #333`
  },
  {
    parameters: ["border", "color"],
    transformation: ({ border, color }) => `${unit(border)} solid ${color}`
  },
  {
    parameters: ["shadow"],
    transformation: ({ shadow }) => `0 0 ${unit(shadow)} #6666`
  },
  {
    parameters: ["shadow", "color"],
    transformation: ({ shadow, color }) => `0 0 ${unit(shadow)} ${color}`
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
    parameters: ["scale", "color"],
    transformation: ({ scale, color }) => {
      const intColors = parseHex(color);
      const factor = 1 / scale;
      const calculate = value => Math.min(255, Math.round(factor * value));
      const calculated = intColors.map(calculate);
      return `#${calculated.map(toHex).join("")}`;
    }
  }
];

export default defaults;
