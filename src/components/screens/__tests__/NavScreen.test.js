import React from 'react'
import { def } from 'bdd-lazy-var/global'
import { mount } from 'enzyme'
import NavScreen from '../NavScreen'

def('rendered', () => ( mount(<NavScreen />) ))

it('renders without crashing', () => {
  expect($rendered)
})

describe('onSectionEntered', () => {
  it('should return 1 if axisIndex is 0', () => {
    expect($rendered.instance().onSectionEntered()(0)).toEqual(1)
  })

  it('should return axisIndex otherwise', () => {
    expect($rendered.instance().onSectionEntered()(1)).toEqual(1)
  })

  it('should be passed down to the Screen as a prop', () => {
    expect($rendered.find('Screen').props().onSectionEntered).toEqual($rendered.instance().onSectionEntered)
  })
})
