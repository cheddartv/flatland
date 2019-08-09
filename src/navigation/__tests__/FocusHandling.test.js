import React from 'react'
import { mount } from 'enzyme'
import { def } from 'bdd-lazy-var/global'
import { DOWN, LEFT } from '../../util/keypress'
import Boundary from '../Boundary'
import Grid from '../Grid'

def('pushFocusTo', () => ([{ flatId: 'thief' }]))
def('rendered', () => ( mount(<Boundary><Grid flatId={'grid'} pushFocusTo={$pushFocusTo}/></Boundary>).find('Focusable(Grid)') ))
def('mockFn', () => jest.fn())

describe('the wrapped component', () => {
  it('should be passed handleBoundary', () => {
    expect($rendered.find('Grid').props().handleBoundary).toBeDefined()
  })
})

describe('propagating up to Boundary', () => {
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
