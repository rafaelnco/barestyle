import React, { useState } from 'react';

import logo from './logo.svg'

import './App.css';

import {
  defaults,
  generator,
  generate,
  applyAll,
} from 'barestyle'

import { valid, 
  paramCase,
  camelCase} from 'barestyle/utils'

const { values, rules } = defaults

const unit = unit => `${2 * unit}rem`

const variations = generator({
  nominators: [paramCase, camelCase],
  types: {
    //spacing: spacing => ({ spacing: 5 * spacing }),
    unit,
  },
  /* transformers: props => [
    ...defaults.transformers(props),
  ] */
})

console.log(variations)

const Section = ({ TagType='div', hoverIn, hoverOut, pressIn, pressOut, style, ...props }) => {
  const [pressed, setPressed] = useState(false)
  return <TagType
    onMouseEnter={() => {
      if(hoverIn) hoverIn()
    }}
    onMouseDown={() => {
      if(pressIn) pressIn()
      setPressed(true)
    }}
    onMouseUp={() => {
      if(pressed && pressOut) pressOut()
      setPressed(false)
    }}
    onMouseLeave={() => {
      if(pressed) {
        //if(pressOut) pressOut()
        setPressed(false)
      }
      if(hoverOut) hoverOut()
    }}
    style={Object.assign(
      { display: 'flex' },
      applyAll(variations, props),
      style
    )}
    {...props}
  />
}

const Square = ({ size = 10, style, ...props }) =>
  <Section
    style={{ width: unit(size), height: unit(size), ...style }}
    {...props}
  />

const Text = props => <Section TagType="p" {...props} />

const Button = ({...props}) => {
  const [state, setState] = useState({})
  const {pressed, hovered, animating} = state;
  return <Square
    size={3}
    lightest-filled-shadow={!pressed}
    lightest-link-shadow={pressed}
    lightest-round
    lightest-margin
    {...props}
    pressIn={() => setState({ animating, pressed: true })}
    pressOut={() => setState({ animating: !animating, hovered })}
    hoverIn={() => setState({ animating: !animating, hovered: true })}
    hoverOut={() => setState({ animating: !animating })}
    style={{
      transform: [
        `scale(${ pressed ? 0.9 : hovered ? 1.1 : 1 })`,
        animating && `rotate3d(1,1,0,30deg)`
      ].filter(valid).join(' ')
    }}
  />
}

const constraints = [ values.dimension, values.pallete, rules.background ]
const samples = generate({constraints})
export default () => {
  return <Section vertical>
    <Section lightest-filled-shadow justify-start>
      <Section style={{width: unit(5)}}>
        <img src={logo} style={{ height: '100%' }}/>
      </Section>
      <Section>
        <Text primary-foreground heavy-text>Bare Style</Text>
      </Section>
    </Section>
    <Section wrap horizontal justify-center vertical-flow>
      {
        Object.keys(values.pallete).map((pallete, index) => (
          <Section>
            {
              Object.keys(samples).slice(
                Object.keys(values.pallete).length*index,
                (index+1)*Object.keys(values.pallete).length
              ).map(sample => <Button lightest-link-border-bottom lightest-alert-border-left key={sample} {...{[sample]: true}} />)
            }
          </Section>
        ))
      }
    </Section>
  </Section>
}