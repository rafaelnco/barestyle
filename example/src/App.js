import React, { useState } from 'react';

import logo from './logo.svg'

import './App.css';

import {
  defaults,
  generator,
  generate,
  applyVariants,
} from 'barestyle'

import { valid, paramCase, camelCase} from 'barestyle/utils'

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

const { values, rules } = defaults

const unit = unit => `${2 * unit}rem`

const variations = generator({
  nominators: [paramCase, camelCase],
  types: { unit }
})

console.log(variations)

const assembled = Object.assign({}, ...Object.values(variations))

const Bare = ({ Tag = 'div', hoverIn, hoverOut, pressIn, pressOut, ...props }) => {
  const handlers = useMouse({hoverIn, hoverOut, pressIn, pressOut})
  return <Tag {...handlers} {...applyVariants(assembled, props)} />
}

const Section = ({ hoverIn, hoverOut, pressIn, pressOut, ...props }) => {
  return <Bare flex {...props} />
}

const Square = props => <Bare three-width three-height {...props} />

const Text = props => <Bare Tag="p" {...props} />

const Image = props => <Bare Tag="img" {...props} />

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

const background = { background: ["backgroundColor"] }
const constraints = [ values.dimension, values.pallete, background ]
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
    <Section wrap horizontal justify-center flow-vertical>
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