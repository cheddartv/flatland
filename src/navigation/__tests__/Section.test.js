import React from 'react'
import { def } from 'bdd-lazy-var/global'
import { mount } from 'enzyme'
import Item from '../Item'
import Section from '../Section'

const mockFn = jest.fn()
def('rendered', () => ( mount(<Section onSectionEntered={mockFn}/>) ))

it('renders without crashing', () => {
  expect($rendered)
})

it('calls props.onSectionEntered after mounting', () => {
  $rendered
  expect(mockFn).toHaveBeenCalled()
})

describe('with one child', () => {
  def('rendered', () => ( mount(<Section><Item>Foo</Item></Section>) ))

  it('renders without crashing', () => {
    expect($rendered)
  })
})

describe('with children', () => {
  def('initialHasFocus', () => true)
  def('rendered', () => ( mount(
    <Section hasFocus={$initialHasFocus}>
      <Item>Foo</Item>
      <Item>Bar</Item>
      <Item>Baz</Item>
    </Section>
  ) ))

  def('mockFn', () => ( jest.fn() ))

  it('should pass down the children', () => {
    expect($rendered.find('Item').length).toBe(3)
  })

  it('should pass hasFocus down to the active child', () => {
    $rendered.setProps({axisIndex: 1})
    expect($rendered.find('Item').at(1).props().hasFocus).toBeTruthy()
  })

  it('should not call handleBoundary with a vector that does not cross a boundary', () => {
    $rendered.setProps({handleBoundary: $mockFn, hasFocus: true, axisIndex: 1, globalVector: 1})
    expect($mockFn).not.toHaveBeenCalled()
  })

  it('should call handleBoundary with a positive vector that crosses a boundary', () => {
    $rendered.setProps({handleBoundary: $mockFn, hasFocus: true, axisIndex: 2, globalVector: 1})
    expect($mockFn).toHaveBeenCalledWith(1)
  })

  it('should call handleBoundary with a negative vector that crosses a boundary', () => {
    $rendered.setProps({handleBoundary: $mockFn, hasFocus: true, axisIndex: 0, globalVector: -1})
    expect($mockFn).toHaveBeenCalledWith(-1)
  })

  it('should call incrementLocals with the vector that does not cross a boundary', () => {
    $rendered.setProps({incrementLocals: $mockFn, hasFocus: true, axisIndex: 1, globalVector: 1})
    expect($mockFn).toHaveBeenCalledWith(1)
  })

  it('should call props.onFocus when focus changes', () => {
    $rendered.setProps({onFocus: $mockFn, hasFocus: true, axisIndex: 1, globalVector: -1})
    expect($mockFn).toHaveBeenCalled()
  })

  it('should call props.onFocus when focus changes', () => {
    $rendered.setProps({onFocus: $mockFn, hasFocus: true, axisIndex: 1, globalVector: -1})
    expect($mockFn).toHaveBeenCalled()
  })

  it('should not all props.onSectionEntered if the section already had focus', () => {
    $rendered.setProps({onSectionEntered: $mockFn, hasFocus: true})
    expect($mockFn).not.toHaveBeenCalled()
  })

  it('should return the attached sectionRef', () => {
    $rendered.setProps({sectionRef: 'referToMe!'})
    expect($rendered.instance().sectionRef()).toEqual('referToMe!')
  })

  describe('on first receiving focus', () => {
    def('initialHasFocus', () => false)

    it('should call props.onSectionEntered on initial focus', () => {
      $rendered.setProps({onSectionEntered: $mockFn, hasFocus: true})
      expect($mockFn).toHaveBeenCalledWith($rendered.instance())
    })

    it('incrementLocalsBy should call props.incrementLocals by the result of the call to props.onSectionEntered', () => {
      $rendered.setProps({incrementLocals: $mockFn})
      $rendered.instance().incrementLocalsBy(4, ((index) => index + 1))
      expect($mockFn).toHaveBeenCalledWith(5 - 4)
    })

    it('should call incrementLocalsBy with the axisIndex and the result of default props.onSectionEntered', () => {
      const mockOnSectionEntered = jest.fn((section) => section)
      Section.prototype.incrementLocalsBy = $mockFn
      $rendered.setProps({axisIndex: 4, hasFocus: true, onSectionEntered: mockOnSectionEntered})
      expect($mockFn).toHaveBeenCalledWith(4, $rendered.instance())
    })
  })
})
