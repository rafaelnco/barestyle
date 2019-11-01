<img src="https://github.com/rafaelnco/barestyle/blob/gh-pages/logo512.png?raw=true" width="25%">

# [Bare Style - A declarative variant generator](https://rafaelnco.github.io/barestyle/)

## Summary

- [Introduction](#introduction)
- [Getting Started](#getting-started)
- [Changelog](#changelog)

Online demo: https://rafaelnco.github.io/barestyle/

Demo Source code: https://github.com/rafaelnco/barestyle/blob/master/example/src/App.js

## Introduction
[Back](#summary)

- You define the constraints, Bare Style creates the style variations 

- Works with and without Styled System/Components

- Works on React JS and React Native

- Define components like this:

```jsx
  // enable or disable variants with a simple boolean
  const focused = true

  //you can configure barestyle use camelCase and param-case simultaneously
  <Button
    heavy-margin-top
    light-padding-vertical

    light-text
    heavy-text

    secondaryBackground
    primary-foreground
    linkForeground={focused}
    disabled-foreground={!focused}

    justifyStart
    align-center

    full-height
    half-width

    flex
    block

    double-grow
    single-flex

    ...
  />
```

## Getting started
[Back](#summary)

### 1. In your projects root folder, on your terminal:

  - `$ yarn add barestyle`

### 2. In your prefferable code editor:

  - create `Appearance.js` on home folder and choose a way:

  - The TL;DR Way: fill with this and follow to the next step

```jsx
import { generator, applyAll } from 'barestyle'

/* will be using defaults, take a look at barestyle/defaults.js */
const variations = generator()

const applyVariations = props => applyAll(variations, props);

export { applyVariations };
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

/* Method used to filter enabled variants and apply them to components */
const applyVariations = props => applyAll(variations, props);

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

/* In this case, availableThemes are being merged on values.pallete property */
const applyTheme = (theme, definitions = proprietaryDefinitions) => {
  const pallete = Object.assign({}, definitions.values.pallete, theme);
  const values = Object.assign({}, definitions.values, { pallete });
  return Object.assign(variations, generator({ ...definitions, values }));
};

/* Use this method anywhere to change variations theme */
applyTheme(availableThemes[0]);

export { applyVariations, unit, applyTheme, availableThemes };
```

### 3. In your component implementation

Simple way:

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

Right way: (check defaults.js)

```jsx
import { applyVariations } from "~/Appearance";

function filterVariants(variations, props) {
  const variationsNames = Object.values(variations).map(Object.keys).flat()
  const isNotVariation = name => variationsNames.indexOf(name) === -1
  return Object.assign({}, ...Object.keys(props).filter(isNotVariation).map(prop => ({[prop]:props[prop]})))
}

const BareComponent = ({ TagType='div', style, ...props }) => {
  return <TagType
    style={Object.assign({}, applyAll(variations, props), style)}
    {...filterVariants(variations, props)}
  />
}
```

Bare Style can be easily integrated with Styled System  and Styled Components:

```jsx
import { typography, color, space, layout } from 'styled-system';

import { applyVariations } from '~/Appearance';

/* using applyVariations as styled system property */
export const Text = styled.Text`
  ${color}
  ${typography}
  ${space}
  ${layout}
  ${applyVariations}
`;

```

### 4. In your component instantiation

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
import React, { useState } from "react";

import { applyVariations } from "./Appearance";

function filterVariants(variations, props) {
  const variationsNames = Object.values(variations).map(Object.keys).flat()
  const isNotVariation = name => variationsNames.indexOf(name) === -1
  return Object.assign({}, ...Object.keys(props).filter(isNotVariation).map(prop => ({[prop]:props[prop]})))
}

const BareComponent = ({ TagType='div', style, ...props }) => {
  return <TagType
    style={Object.assign({}, applyAll(variations, props), style)}
    {...filterVariants(variations, props)}
  />
}

/* Theme propagation easily solvable using Composition */
const Text = props => <BareComponent
  TagType="p"
  primary-foreground
  {...props}
/>;

const Link = props => (
  <Text
    TagType="a"
    no-decoration
    link-foreground
    {...props}
  />
);

const Image = props => (
  <BareComponent
    TagType="img"
    normal-round
    normal-shadow
    {...props}
  />
);

const Path = props => <BareComponent
  TagType="path"
  primary-fill
  {...props}
/>;

export { BareComponent, Text, Link, Path, Input, Image, Navigator };
```

## Changelog
[Back](#summary)

> Empty rows were either documentation/example updating

Version|Description|Breaking Change
-|---|---
1.2.8|Add display variants|
1.2.7||
1.2.6||
1.2.5||
1.2.4||
1.2.3||
1.2.2||
1.2.1|Add base types, Add default flex variants|Derived types require base type declaration
1.2.0|Add default dimension variants|
1.1.9||
1.1.8|Add default percentile variants|
1.1.7|Add default scaling variants|
1.1.6||
1.1.5||
1.1.4||
1.1.3||
1.1.2||
1.1.1||
1.1.0||
1.0.9||
1.0.7||
1.0.6||
1.0.5|Add platform aware default transformations|
1.0.4||
1.0.3|Add text alignment default variations|
1.0.2||
1.0.1||
1.0.0|First version|