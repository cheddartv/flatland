import React from 'react'
import { mount } from 'enzyme'
import { def } from 'bdd-lazy-var/global'
import { BOTTOM, LEFT } from '../../util/keypress'
import Boundary from '../Boundary'

def('rendered', () => ( mount(<Boundary></Boundary>)))

it('incrementGlobals adjusts the globalX and globalY coordinates', () => {
  $rendered.setState({ coordinates: { globalX: 0, globalY: 0, selects: 10 } })
  $rendered.instance().incrementGlobals(1,0)
  expect($rendered.state().coordinates.globalX).toBe(1)
  expect($rendered.state().coordinates.globalY).toBe(0)
  expect($rendered.state().coordinates.selects).toBe(10)
})

it('incrementGlobals adjusts the globalX and globalY coordinates', () => {
  $rendered.setState({ coordinates: { globalX: 0, globalY: 0, selects: 10 } })
  $rendered.instance().handleSelect()
  expect($rendered.state().coordinates.globalX).toBe(0)
  expect($rendered.state().coordinates.globalY).toBe(0)
  expect($rendered.state().coordinates.selects).toBe(11)
})

describe('registering and deregistering focus thieves', () => {
  beforeEach(() => $rendered.setState({ focusThieves: { first: [{ flatId: 'second', onExitFrom: LEFT }] } }))

  it('registerFocusThief should add the thief to the state', () => {
    $rendered.instance().registerFocusThief('first', { flatId: 'third', onExitFrom: BOTTOM })
    expect($rendered.state().focusThieves.first).toEqual([{ flatId: 'second', onExitFrom: LEFT }, { flatId: 'third', onExitFrom: BOTTOM }])
  })

  it('deregisterFocusThief should remove the thieves from the state', () => {
    $rendered.instance().deregisterFocusThief('first')
    expect($rendered.state().focusThieves).toEqual({})
  })
})

describe('handleBoundary', () => {
  beforeEach(() => $rendered.setState({ focusedSection: 'first' }))

  it('should select the next registered section', () => {
    $rendered.setState({ focusThieves: { first: [{ flatId: 'second', onExitFrom: LEFT }] } })
    $rendered.instance().handleBoundary({ props: { flatId: 'first' } }, LEFT)
    expect($rendered.state().focusedSection).toBe('second')
  })

  it('should do nothing if a thief is not registered', () => {
    $rendered.instance().handleBoundary({ props: { flatId: 'first' } }, LEFT)
    expect($rendered.state().focusedSection).toBe('first')
  })

  it('should do nothing if unless is provided, and returns true', () => {
    $rendered.setState({ focusThieves: { first: [{ flatId: 'second', onExitFrom: LEFT, unless: (() => true) }] } })
    $rendered.instance().handleBoundary({ props: { flatId: 'first' } }, LEFT)
    expect($rendered.state().focusedSection).toBe('first')
  })
})
