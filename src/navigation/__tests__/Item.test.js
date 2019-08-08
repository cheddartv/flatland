import React from 'react'
import { def } from 'bdd-lazy-var/global'
import { mount } from 'enzyme'
import Item from '../Item'

def('rendered', () => ( mount(<Item />) ))

it('renders without crashing', () => {
  expect($rendered)
})

it('calls props.onFocus when hasFocus becomes true', () => {
  let mockFn = jest.fn()
  $rendered.setProps({onFocus: mockFn, hasFocus: true})
  expect(mockFn).toHaveBeenCalled()
})

it('calls props.onSelect when selected', () => {
  let mockFn = jest.fn()
  $rendered.setProps({onSelect: mockFn, hasFocus: true})
  $rendered.instance().onSelect()
  expect(mockFn).toHaveBeenCalled()
})

describe('with children', () => {
  def('rendered', () => ( mount(<Item classNames={{test: true}}>Hello World!</Item>) ))

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
