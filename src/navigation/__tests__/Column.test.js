import './shared.test.js'
import React from 'react'
import Item from '../Item'
import Column from '../Column'
import { mount } from 'enzyme'
import { def } from 'bdd-lazy-var/global'

def('rendered', () => ( mount(<Column classNames={{ test: true }} />) ))
def('mockFn', () => jest.fn())

it('renders without crashing', () => {
  expect($rendered)
})

it('should have the correct className', () => {
  expect($rendered.find('div').hasClass('test')).toBeTruthy()
})

describe('with children', () => {
  def('rendered', () => mount(
    <Column handleBoundary={$mockFn} hasFocus={true}>
      <Item>Foo</Item>
      <Item>Bar</Item>
      <Item>Baz</Item>
    </Column>
  ).find('Column') )
  def('mockFn', () => ( jest.fn() ))

  it('has maxFocusY of 2', () => {
    expect($rendered.instance().maxFocusY).toBe(2)
  })

  itBehavesLike('it handles up and down correctly')
})
