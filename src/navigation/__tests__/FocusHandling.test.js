import React from 'react'
import Flatland from '../Flatland'
import Grid from '../Grid'
import { DOWN, LEFT, RIGHT, SELECT, UP } from '../../util/keypress'
import { mount } from 'enzyme'
import { def } from 'bdd-lazy-var/global'

def('pushFocusTo', () => ([{ flatId: 'thief' }]))
def('rendered', () => ( mount(<Flatland><Grid flatId={'grid'} pushFocusTo={$pushFocusTo}/></Flatland>).find('Focusable(Grid)') ))
def('mockFn', () => jest.fn())

describe('the wrapped component', () => {
  it('should be passed handleBoundary', () => {
    expect($rendered.find('Grid').props().handleBoundary).toBeDefined()
  })
})

describe('propagating up to Flatland', () => {
  it('should register the passed focus thieves on mount', () => {
    const spy = jest.spyOn($rendered.instance().context, 'registerFocusThief')
    $rendered.instance().componentDidMount()
    expect(spy).toHaveBeenCalledWith('grid', { flatId: 'thief' })
  })

  it('should deregister the passed focus thieves on unmount', () => {
    const spy = jest.spyOn($rendered.instance().context, 'deregisterFocusThief')
    $rendered.instance().componentWillUnmount()
    expect(spy).toHaveBeenCalledWith('grid')
  })
})

describe('default handlers', () => {
  it('defaultHandleDirection should return a function that wraps context.handleBoundary', () => {
    const spy = jest.spyOn($rendered.instance().context, 'handleBoundary')
    $rendered.instance().defaultHandleDirection(LEFT)()
    expect(spy).toHaveBeenCalledWith($rendered.instance().wrappedRef, LEFT)
  })

  it('defaultHandleSelect should call handleSelect on the currentItem', () => {
    $rendered.setState({ currentItem: { handleSelect: $mockFn } })
    $rendered.instance().defaultHandleSelect()
    expect($mockFn).toHaveBeenCalled()
  })
})

describe('propagating down to wrapped component', () => {
  it('should call the associated handler of the wrapped component on handleKeypress', () => {
    const spy = jest.spyOn($rendered.find('Grid').instance(), 'handleLeft')
    $rendered.instance().handleKeypress(LEFT)
    expect(spy).toHaveBeenCalled()
  })

  it('should return the defaultHandleDirection handler otherwise', () => {
    const spy = jest.spyOn($rendered.instance(), 'defaultHandleDirection')
    $rendered.find('Grid').instance().handleLeft = undefined
    $rendered.instance().handleKeypress(LEFT)
    expect(spy).toHaveBeenCalledWith(LEFT)
  })
})

describe('componentDidUpdate', () => {
  beforeEach(() => {
    Object.defineProperty($rendered.instance(), 'hasFocus', { get: (() => true) })
    $rendered.instance().handleKeypress = $mockFn
  })


  it('calls handleKeypress with LEFT when pressWas LEFT', () => {
    $rendered.setState({ prevContext: { globalX: 1, globalY: 0 } })
    expect($mockFn).toHaveBeenCalledWith(LEFT)
  })

  it('calls handleKeypress with UP when pressWas UP', () => {
    $rendered.setState({ prevContext: { globalX: 0, globalY: 1 } })
    expect($mockFn).toHaveBeenCalledWith(UP)
  })

  it('calls handleKeypress with RIGHT when pressWas RIGHT', () => {
    $rendered.setState({ prevContext: { globalX: -1, globalY: 0 } })
    expect($mockFn).toHaveBeenCalledWith(RIGHT)
  })

  it('calls handleKeypress with DOWN when pressWas DOWN', () => {
    $rendered.setState({ prevContext: { globalX: 0, globalY: -1 } })
    expect($mockFn).toHaveBeenCalledWith(DOWN)
  })

  it('calls handleKeypress with SELECT when pressWas SELECT', () => {
    $rendered.setState({ prevContext: { globalX: 0, globalY: 0, selects: -1 } })
    expect($mockFn).toHaveBeenCalledWith(SELECT)
  })
})
