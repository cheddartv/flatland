import './shared.test.js'
import React from 'react'
import { mount } from 'enzyme'
import { def } from 'bdd-lazy-var/global'
import Item from '../Item'
import Grid from '../Grid'

def('rendered', () => ( mount(<Grid classNames={{test: true}} />) ))
def('mockFn', () => jest.fn())

it('renders without crashing', () => {
  expect($rendered)
})

it('should have the correct className', () => {
  expect($rendered.find('div').hasClass('test')).toBeTruthy()
})

describe('with children', () => {
  def('baseProps', () => ({ handleBoundary: $mockFn, hasFocus: true }))
  def('gridProps', () => ({}))
  def('rendered', () => mount(
    <Grid {...$baseProps} {...$gridProps}>
      <Item>Foo</Item>
      <Item>Bar</Item>
      <Item>Baz</Item>
      <Item>Boo</Item>
      <Item>Bop</Item>
      <Item>Bat</Item>
      <Item>Cat</Item>
      <Item>Hat</Item>
      <Item>Mat</Item>
    </Grid>
  ).find('Grid') )

  def('mockFn', () => ( jest.fn() ))

  it('has maxFocusX of 2', () => {
    expect($rendered.instance().maxFocusX).toBe(2)
  })

  it('has maxFocusY of 2', () => {
    expect($rendered.instance().maxFocusY).toBe(2)
  })

  itBehavesLike('it handles left and right correctly')
  itBehavesLike('it handles up and down correctly')


  describe('with specified num per row', () => {
    def('gridProps', () => ({ numPerRow: 2 }))
    it('has maxFocusX of 1', () => {
      expect($rendered.instance().maxFocusX).toBe(1)
    })

    it('has maxFocusY of 4', () => {
      expect($rendered.instance().maxFocusY).toBe(4)
    })

    describe('with uneven rows', () => {
      def('rendered', () => mount(
        <Grid {...$baseProps} {...$gridProps}>
          <Item>Foo</Item>
          <Item>Bar</Item>
          <Item>Baz</Item>
        </Grid>
      ).find('Grid') )

      describe('handleDown', () => {
        it('should select the first item in the next row', () => {
          $rendered.setState({ focusX: 1 })
          $rendered.instance().handleDown()
          expect($rendered.state().focusX).toBe(0)
        })
      })

      describe('handleUp', () => {
        it('should select the first item in the previous row', () => {
          $rendered.setState({ focusX: 0, focusY: 1 })
          $rendered.instance().handleUp()
          expect($rendered.state().focusX).toBe(0)
        })
      })
    })
  })
})
