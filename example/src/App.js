import React, { useState } from 'react';

import logo from './logo.svg'

import './App.css';

import { $, defaults, generator, generate, applyVariants, assemble } from 'barestyle'

import { paramCase, camelCase } from 'barestyle/utils'

const { values } = defaults

const variations = generator({
  nominators: [ paramCase/* , camelCase */ ],
  types: { unit: unit => `${ 2 * unit }rem` }
})

const animate = ({ pressed, hovered, animating }) => <$
  soft-scale={pressed}
  twoAHalf-skew={animating}
  smooth-scale={hovered}
  one-apex={hovered||pressed}
  lightest-filled-shadow={!pressed}
  lightest-link-shadow={pressed}
/>

function useAnimate() {
  const { state, props } = useReaction()
  return { ...animate(state).props, ...props }
}

function useReaction(props, value) {
  const [ state, setState ] = useState({})
  const { pressed, hovered, animating } = state;
  return {
    state,
    props: {
      pressIn: () => setState({ animating, pressed: true }),
      pressOut: () => setState({ animating: !animating, hovered }),
      hoverIn: () => setState({ animating: !animating, hovered: true }),
      hoverOut: () => setState({ animating: !animating }),
    },
  }
}

function useMouse({ hoverIn, hoverOut, pressIn, pressOut }) {
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
      if(pressed) setPressed(false)
      if(hoverOut) hoverOut()
    },
  }
}

useMouse.consumer = [ 'hoverIn', 'hoverOut', 'pressIn', 'pressOut' ]

const hook = hook => ({ hook })

const hooks = generator({
  types: { hook },
  values: {
    hooks: {
      mouse: hook(useMouse),
      animate: hook(useAnimate)
    }
  },
  rules: {
    hooks: { use: [ "action" ] }
  },
  variants: ({ rules, values }) => ({
    hooks: [ rules.hooks, values.hooks ]
  }),
  transformers: ({ }) => [
    {
      type: 'properties',
      parameters: [ "hook" ],
      transformation: ({ hook }) => ({ hook })
    }
  ]
})

console.log(hooks, variations)

const assembled = assemble(variations, hooks)

const Bare = ({ Tag = 'div', ...props }) => <Tag {...applyVariants(assembled, props)} />

const Square = props => <Bare three-width three-height {...props} />

const Button = $ => <Square use-animate use-mouse lightest-radius lightest-margin {...$} />

Button.Primary = $ => <Button double-grow one-link-border-bottom one-alert-border-left {...$} />

const Image = props => <Bare Tag="img" {...props} />

const Text = props => <Bare Tag="p" {...props} />

const Section = props => <Bare flex {...props} />

const background = { background: [ "backgroundColor" ] }

const constraints = [ values.dimension, values.pallete, background ]

const samples = generate({ constraints })

const pallete = Object.keys(values.pallete)

const track = index => pallete.length * index

const samplesTrack = index => Object.keys(samples).slice(track(index), track(index + 1))

export default () => {
  return <Section vertical>
    <Section light-spacing lightest-filled-shadow justify-start>
      <Section five-height>
        <Image src={logo} full-height/>
      </Section>
      <Section horizontal use-animate use-mouse pointer-cursor light-margin light-radius>
        <Text primary-foreground heavy-text> Bare Style </Text>
      </Section>
    </Section>
    <Section wrap horizontal justify-center flow-vertical>
      {
        pallete.map((_, index) => (
          <Section key={String.fromCharCode(65 + index)}>
            {samplesTrack(index).map(sample => (
              <Button.Primary key={sample} {...{ [sample]: true }} />
            ))}
          </Section>
        ))
      }
    </Section>
  </Section>
}