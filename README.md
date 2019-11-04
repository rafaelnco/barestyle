# [Bare Style - A declarative variant generator](https://rafaelnco.github.io/barestyle/)

## Summary

<img src="https://github.com/rafaelnco/barestyle/blob/gh-pages/logo512.png?raw=true" width="25%" style="float: right;">

- [Introduction](#introduction)
- [Getting Started](#getting-started)
  - [Install](#1-install)
  - [Configure](#2-configure)
  - [Implementation](#3-implementation)
  - [Instantiation](#4-instantiation)
- [Deprecation Schedule](#deprecation-schedule)
- [Changelog](#changelog)

Projects using Barestyle:

Project|Links
-|--
Bare Style Demo|- https://rafaelnco.github.io/barestyle/<br>- https://github.com/rafaelnco/barestyle/blob/master/example/src/App.js
Seu Job|- https://seujob.github.io/hot<br>- https://github.com/rafaelnco/seujob-entrega/blob/master/src/Appearance.js<br>- https://github.com/rafaelnco/seujob-entrega/blob/master/src/Components.js

## Introduction
[Back](#summary)

- You define the constraints, Bare Style creates the style variations 

- Works with and without Styled System/Components

- Works on React JS and React Native

- Define components like this:

```jsx
  // enable or disable variants with a simple boolean
  const focused = true

  Button.Primary = props => (
    <Button primary-background {...props} />
  )

  <Button.Primary
    linkForeground={focused}
    disabled-foreground={!focused}
  />

  //barestyle understand different cases
  <Container justifyStart align-center full-height horizontal />

  <Container half-width flex vertical double-grow />

  Container.Row = <Container full-width horizontal />

  Text.Heading = <Text primary-foreground large-text />

  <Section lightest-filled-shadow justify-start>

  <Section five-height no-flow-horizontal flow-vertical>

  <Image src={logo} full-height absolute/>

  <Text primary-foreground heavy-text block light-textShadow>

  <Section wrap horizontal justify-center vertical-flow>

  ...
```

<img src="https://github.com/rafaelnco/barestyle/blob/gh-pages/logo512.png?raw=true" width="10%" style="float: right;">

## Getting started
[Back](#summary)

### 1. Install
[Back](#summary)

  - `$ yarn add barestyle`

### 2. Configure
[Back](#summary)

  - create `Appearance.js` on home folder and choose a way:

  - The TL;DR Way: fill with this and follow to the next step

```jsx
import { generator, applyAll, applyVariants } from 'barestyle'

/* will be using defaults, take a look at barestyle/defaults.js */
const variations = generator()

/* old way, you can also use applyVariants directly */
const applyVariations = props => applyAll(variations, props);

/* new way, checkout usage on next section */
const assembled = Object.assign({}, ...Object.values(variations))
const bareStyle = props => applyVariants(assembled, props)

export { applyVariations, bareStyle };
```


  - The Lengthy Way: copy & paste this code block inside the file and customize as you please

```jsx
/*

We'll be using some basic tools of Bare Style. 

  Generator: generates the variants either for use with style prop or styled system props

  applyAll: this very method picks prop`s variant references and combine them in the resulting style

  defaults: a set of default definitions to quick start Bare Style set up

*/
import { generator, applyAll, defaults } from "barestyle";

/* Types are used to define Values */
const { color, scale } = defaults.types;

/* Unit is the basic dimension converter used in Transformations, can also be used to implement Pixel Perfect */
const unit = value => `${value}vmax`;

/* Variations are the final resulting set of names + styles from generator() */
const variations = {};

/* Proprietary Definitions that vary between projects */
const proprietaryDefinitions = {}

/* Types are derivated from values.dimension scale (will be changed in v2) and can be combined in Transformations. Types can also apply their own transformations */
proprietaryDefinitions.types = {
  /* derived types require a base type declaration */
  spacing: spacing => ({ 
    spacing: 5 * spacing
  }),
  border: border => ({ border }),
  font: font => ({ font }),

  string: string => ({ string }),
  unit
}

/* base type declaration */
proprietaryDefinitions.types.font.base = 'dimension'
proprietaryDefinitions.types.border.base = 'dimension'
proprietaryDefinitions.types.spacing.base = 'dimension'

/* Values are primary constants used to define style property values in the resulting variants */
proprietaryDefinitions.values = {
  dimension: {
    sub: scale(0.2),
    small: scale(0.5),
    normal: scale(1),
    big: scale(1.5),
    bigger: scale(2),
    giant: scale(2.5),
    monumental: scale(5)
  },
  pallete: {
    link: color("#4169e1"),
    success: color("#11cc11"),
    alert: color("#ff1111"),
    attention: color("#ffcc00"),
    primary: color("#000000"),
    secondary: color("#ffffff"),
    filled: color("#222222"),
    disabled: color("#555555"),
    empty: color("#eeeeee"),
    transparent: color("#00000000")
  }
}

/* Variants are combinations of constraints from which variant style property names and values are going to be generated.

Note that Types are also Constraints and referenced by name (as in values.font, values.shadow).

Take a look at barestyle/defaults.js
*/
proprietaryDefinitions.variants = ({ rules, values }) => ({
  ...defaults.variants({ rules, values }),

  /*
    combine pallete values names (primary, secondary...) + vector rules names (fill) generating variants like:
    primary-fill
    secondary-fill
    ...
  */
  vectors: [values.pallete, rules.vectors],

  /* combine scaling + fontSize generating variants like: small-text, heavy-text */
  typography: [values.font, rules.typography],

  /* generates:
    <Section horizontal> ...
    <Section vertical> */
  orientation: [values.orientation, rules.orientation],

  /* generates:
    light-primary-shadow
    heavy-shadow
    ...
  */
  shadow: [values.shadow, optional(values.pallete), rules.shadow],

  /*generates:
    light-primary-border
    heavy-secondary-border-bottom
    normal-border-left
    ...
  */
  borders: [values.border, optional(values.pallete), rules.borders, rules.sides]
})

/* 

  Transformers are used to apply final transformations on constraints accumulated in the chain.
*/

function identify() {
  let native = false
  try { native = !!require("react-native") } catch (e) {}
  return { native, web: !native }
}

const { native, web } = identify()

proprietaryDefinitions.transformers: props => [
  ...defaults.transformers(props),

  /* defining cross platform borders definitions */
  {
    parameters: ["border"],
    transformation: ({ border, color }, { name }) => Object.assign({
      [name+'Width']: unit(border),
      [name+'Color']: '#333'
    }, web && {
      [name+'Style']: 'solid',
    })
  },

  /* combining border (dimension derivate) + color constraints */
  {
    parameters: ["border", "color"],
    transformation: ({ border, color }, { name }) => Object.assign({
      [name+'Width']: unit(border),
      [name+'Color']: color
    }, web && {
      [name+'Style']: 'solid',
    })
  },

  /* transforming raw shadow values in styled rules */
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

  /* combining shadow (dimension derivate) + color constraints */
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

  /*  transformation using styled components properties */
  {
    parameters: ["border", "color"],
    transformation: ({ border, color }) => `;
      borderWidth: ${unit(border)};
      borderStyle: solid;
      borderColor: ${color};
    `
  },

  /* combining scale + color constraints to create color tone variations */
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

/* Themes can easily be generated by merging them with appropriate proprietaryDefinitions properties */
const availableThemes = [
  {
    primary: "#000000",
    secondary: "#ffffff",
    link: "#4169e1"
  },
  {
    primary: "#ffffff",
    secondary: "#000000",
    link: "#ffcc00"
  }
];

/* old way, kept for reference */
const applyVariations = props => applyAll(variations, props);

/* new way, checkout usage on next section */
const assembled = Object.assign({}, ...Object.values(variations))
const bareStyle = props => applyVariants(assembled, props)

/* In this case, availableThemes are being merged on values.pallete property */
const applyTheme = (theme, definitions = proprietaryDefinitions) => {
  const pallete = Object.assign({}, definitions.values.pallete, theme);
  const values = Object.assign({}, definitions.values, { pallete });
  return Object.assign(variations, generator({ ...definitions, values }));
};

/* Use this method anywhere to change variations theme */
applyTheme(availableThemes[0]);

export { applyVariations, bareStyle, unit, applyTheme, availableThemes };
```



<img src="https://github.com/rafaelnco/barestyle/blob/gh-pages/logo512.png?raw=true" width="10%" style="float: right;">

### 3. Implementation
[Back](#summary)

Right way: (check defaults.js and example for real case)

```jsx
import { bareStyle } from "~/Appearance";

const BareComponent = ({ TagType='div', ...props }) => {
  return <TagType {...bareStyle(props)} />
}
```

Old way: (deprecated in favour of default applyVariants)

```jsx
import { applyVariations } from "~/Appearance";

const BareComponent = ({ style, ...props }) => {
  return (
    <Component
      {...props}
      style={{
        /* just merge them variant with your Component Style */
        ...applyVariations(props),
        ...style
      }}
    />
  );
};
```

Bare Style can be easily integrated with Styled System  and Styled Components:

In Appearance.js:bareStyle() just remember to return the `style` property only:
```jsx
...
const assembled = Object.assign({}, ...Object.values(variations));

const bareStyle = props => applyVariants(assembled, props).style; /* HERE */

export { bareStyle, unit };
```

In your component implementation, add if after styled-system:
```jsx
import styled from 'styled-components/native';
import { typography, color, space, layout } from 'styled-system';

import { bareStyle } from '~/Appearance';

/* using applyVariations as styled system property */
export const Text = styled.Text`
  ${color}
  ${typography}
  ${space}
  ${layout}
  ${bareStyle}
`;

```

<img src="https://github.com/rafaelnco/barestyle/blob/gh-pages/logo512.png?raw=true" width="10%" style="float: right;">

### 4. Instantiation
[Back](#summary)

Once you grasp the variant declaration syntax it'll be easy to compose new variant definitions

```jsx
  <Button
    heavy-margin-top
    secondary-background
    primary-foreground
    small-text
    justify-start
    ...
```

Going beyond, `Components.js`:

```jsx
const { values, rules } = defaults

const unit = unit => `${2 * unit}rem`

const variations = generator({
  types: { unit }
})

const assembled = Object.assign({}, ...Object.values(variations))

const Bare = ({ Tag = 'div', ...props }) => <Tag {...applyVariants(assembled, props)} />

const Section = ({ ...props }) => <Bare flex {...props} />

const Square = props => <Bare three-width three-height {...props} />

const Text = props => <Bare Tag="p" primary-foreground {...props} />;

const Link = props => (
  <Text Tag="a" no-decoration link-foreground {...props} />
);

const Image = props => (
  <Bare Tag="img" normal-round normal-shadow {...props} />
);

const Path = props => <Bare Tag="path" primary-fill {...props} />;

const Button = ({...props}) => {
   /* interaction handlers, see barestyle/example */
  const reaction = useReaction()
  return <Square
    lightest-filled-shadow={!reaction.state.pressed}
    lightest-link-shadow={reaction.state.pressed}
    lightest-round
    lightest-margin
    {...reaction.props}
    {...props}
  />
}
```


<img src="https://github.com/rafaelnco/barestyle/blob/gh-pages/logo512.png?raw=true" width="10%" style="float: right;">

## Deprecation Schedule
[Back](#summary)

Deadline|Version|Feature|Purpose
--|---|---|---
10/10/19||`full/...(-flex)` single-worded flex variant|Use `full-flex` explicitly
10/10/19||`dimension-round` variant|More coherently use `dimension-radius`


<img src="https://github.com/rafaelnco/barestyle/blob/gh-pages/logo512.png?raw=true" width="10%" style="float: right;">

## Changelog
[Back](#summary)

Version|Documentation|Description|Breaking Change
-|---|---|---
1.3.3||Add opacity, apex (zIndex) default variants||
1.3.2||Add drop width, borderRadius default variants|
1.3.1||Update alpha color transformation||
1.3.0|Update readme||
1.2.9|Updates example to use `applyVariants`|- Adds variants: all/none pointer events, none overflow, display table-cell, position absolute/relative..., textShadow, spacing (margin + padding), scaling area (width + height), positioning (top, left, bottom, inset...)<br><br>- Adds alpha color transformation<br><br>- Adds `applyVariants` to barestyle exports|Overflow variants are inverted (_vertical-flow_ turns into _flow-vertical_, _no-flow-vertical_...)
1.2.8|Updates readme|Add default display variants|
1.2.7||Draft flex rules|
1.2.6||Update default base types typo|
1.2.5|Update example||
1.2.4|Update readme||
1.2.3|Update readme||
1.2.2|Draft code documentation||
1.2.1||- Add default flex variants<br><br>- Add base types|Derived types require base type declaration
1.2.0||Add default dimension variants|
1.1.9|Update example||
1.1.8||Add default percentile variants|
1.1.7||Add default scaling variants|
1.1.6|Update readme||
1.1.5|Update readme||
1.1.4|Update readme||
1.1.3|Update readme||
1.1.2|Update example||
1.1.1|Update readme||
1.1.0|Link to demo||
1.0.9|Add Example||
1.0.8||Add missing default prop|
1.0.7|NPM Link||
1.0.6|||
1.0.5|||Add platform aware default transformations|
1.0.4|NPM Links||
1.0.3||Add text alignment default variations|
1.0.2||Add border decoration default variations|
1.0.1|Add Readme||
1.0.0||First version|