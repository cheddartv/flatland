import React from 'react'
import { def } from 'bdd-lazy-var/global'
import { mount } from 'enzyme'
import Item from '../Item'
import Row from '../Row'
import '../shared/Sectional.js'

def('rendered', () => ( mount(<Row classNames={{test: true}} />) ))

it('renders without crashing', () => {
  expect($rendered)
})

it('should have the correct className', () => {
  expect($rendered.find('div').hasClass('test')).toBeTruthy()
})

describe('with children', () => {
  def('rendered', () => mount(
    <Row hasFocus={true}>
      <Item>Foo</Item>
      <Item>Bar</Item>
      <Item>Baz</Item>
    </Row>
  ) )
  def('section', () => ($rendered.find('Section').at(0)) )
  def('mockFn', () => ( jest.fn() ))

  def('variableFocus', () => ('focusX') )
  def('variableGlobal', () => ('globalX') )

  itBehavesLike('a sectional')

  it('should call handleBoundary with a positive vector that crosses the X axis boundary', () => {
    $rendered.setProps({handleBoundary: $mockFn, hasFocus: true, globalX: 1, focusX: 2})
    expect($mockFn).toHaveBeenCalledWith(1, 0)
  })

  it('should call handleBoundary with a negative vector that crosses the X axis boundary', () => {
    $rendered.setProps({handleBoundary: $mockFn, hasFocus: true, globalX: -1, focusX: 0})
    expect($mockFn).toHaveBeenCalledWith(-1, 0)
  })

  it('should call handleBoundary with a positive vector that crosses the Y axis boundary', () => {
    $rendered.setProps({handleBoundary: $mockFn, hasFocus: true, globalY: 1})
    expect($mockFn).toHaveBeenCalledWith(0, 1)
  })

  it('should call handleBoundary with a neagtive vector that crosses the Y axis boundary', () => {
    $rendered.setProps({handleBoundary: $mockFn, hasFocus: true, globalY: -1})
    expect($mockFn).toHaveBeenCalledWith(0, -1)
  })

  it('should call incrementLocals with the vector that does cross a boundary', () => {
    $rendered.setProps({incrementLocals: $mockFn, hasFocus: true, globalX: 1, focusX: 0})
    expect($mockFn).toHaveBeenCalledWith(1, 0)
  })
})
