import './shared.test.js'
import React from 'react'
import Item from '../Item'
import Row from '../Row'
import { mount } from 'enzyme'
import { def, itBehavesLike } from 'bdd-lazy-var/global'
import { DOWN } from '../../util/keypress'

def('rendered', () => ( mount(<Row classNames={{ test: true }} />) ))
def('mockFn', () => jest.fn())

it('renders without crashing', () => {
  expect($rendered)
})

it('should have the correct className', () => {
  expect($rendered.find('div').hasClass('test')).toBeTruthy()
})

describe('with children', () => {
  def('rendered', () => mount(
    <Row handleBoundary={$mockFn} hasFocus={true}>
      <Item>Foo</Item>
      <Item>Bar</Item>
      <Item>Baz</Item>
    </Row>
  ).find('Row') )
  def('mockFn', () => ( jest.fn() ))

  it('has maxFocusX of 2', () => {
    expect($rendered.instance().maxFocusX).toBe(2)
  })

  itBehavesLike('it handles left and right correctly')
})
