import React from 'react'
import Item from '../Item'
import { def } from 'bdd-lazy-var/global'
import { shallow, mount } from 'enzyme'
import { FocusableContext } from '../context'

def('rendered', () => ( mount(<Item /> )))
def('mockFn', () => jest.fn())

it('renders without crashing', () => {
  expect($rendered)
})

it('should be focusable', () => {
  expect(Item.focusable).toBeTruthy()
})

it('should have displayName of Item', () => {
  expect(Item.displayName).toBe('Item')
})

describe('when props.onFocus becomes true', () => {
  it('calls props.onFocus', () => {
    $rendered.setProps({ onFocus: $mockFn, hasFocus: true })
    expect($mockFn).toHaveBeenCalled()
  })

  it('calls context.updateCurrentItem', () => {
    const spy = jest.spyOn($rendered.instance().context, 'updateCurrentItem')
    $rendered.setProps({hasFocus: true})
    expect(spy).toHaveBeenCalledWith($rendered.instance())
  })
})

it('calls props.onSelect when selected', () => {
  $rendered.setProps({ onSelect: $mockFn, hasFocus: true })
  $rendered.instance().handleSelect()
  expect($mockFn).toHaveBeenCalled()
})

describe('with children', () => {
  def('rendered', () => ( mount(<Item classNames={{ test: true }}>Hello World!</Item>) ))

  it('passes down child text', () => {
    expect($rendered.text()).toEqual("Hello World!")
  })

  it('passes down hasFocus as a className', () => {
    $rendered.setProps({hasFocus: true})
    expect($rendered.find('div').hasClass('hasFocus')).toBeTruthy()
  })

  it('passes down children with the correct className', () => {
    expect($rendered.find('div').hasClass('test')).toBeTruthy()
  })
})
