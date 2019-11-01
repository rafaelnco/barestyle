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

function useMouse({hoverIn, hoverOut, pressIn, pressOut}) {
  const [pressed, setPressed] = useState(false)
  return {
    onMouseEnter: () => {
      if(hoverIn) hoverIn()
    },
    onMouseDown: () => {
      if(pressIn) pressIn()
      setPressed(true)
    },
    onMouseUp: () => {
      if(pressed && pressOut) pressOut()
      setPressed(false)
    },
    onMouseLeave: () => {
      if(pressed) {
        //if(pressOut) pressOut()
        setPressed(false)
      }
      if(hoverOut) hoverOut()
    },
  }
}

function useReaction() {
  const [state, setState] = useState({})
  const {pressed, hovered, animating} = state;
  return {
    state,
    props: {
      pressIn: () => setState({ animating, pressed: true }),
      pressOut: () => setState({ animating: !animating, hovered }),
      hoverIn: () => setState({ animating: !animating, hovered: true }),
      hoverOut: () => setState({ animating: !animating }),
      style: {
        transform: [
          `scale(${ pressed ? 0.9 : hovered ? 1.1 : 1 })`,
          animating && `rotate3d(1,1,0,30deg)`
        ].filter(valid).join(' ')
      },
    }
  }
}

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

const Section = ({ hoverIn, hoverOut, pressIn, pressOut, ...props }) => {
  const handlers = useMouse({hoverIn, hoverOut, pressIn, pressOut})
  return <BareComponent flex {...handlers} {...props} />
}

const Square = props => <Section three-width three-height {...props} />

const Text = props => <Section TagType="p" {...props} />

const Image = props => <Section TagType="img" {...props} />

const Button = ({...props}) => {
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

const constraints = [ values.dimension, values.pallete, rules.background ]
const samples = generate({constraints})
export default () => {
  return <Section vertical>
    <Section lightest-filled-shadow justify-start>
      <Section five-height>
        <Image src={logo} full-height/>
      </Section>
      <Section>
        <Text primary-foreground heavy-text>Bare Style</Text>
      </Section>
    </Section>
    <Section wrap horizontal justify-center vertical-flow>
      {
        Object.keys(values.pallete).map((pallete, index) => (
          <Section key={String.fromCharCode(65+index)}>
            {
              Object.keys(samples).slice(
                Object.keys(values.pallete).length*index,
                (index+1)*Object.keys(values.pallete).length
              ).map(sample => (
                <Button
                  key={sample}
                  double-grow
                  lightest-link-border-bottom
                  lightest-alert-border-left
                  {...{[sample]: true}}
                />
              ))
            }
          </Section>
        ))
      }
    </Section>
  </Section>
}