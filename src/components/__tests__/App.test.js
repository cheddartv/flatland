import React from 'react'
import { def } from 'bdd-lazy-var/global'
import { mount } from 'enzyme'
import App from '../App'

jest.mock('../../util/Cookies', () => {
  let anonymousIdPresent = false

  return {
    getCookie: ((cookieName) => {
      if (cookieName === 'deviceToken') {
        return true
      } else if (cookieName === 'anonymousId') {
        return anonymousIdPresent
      }
    }),

    removeCookie: ((params) => {
      mockDelete(params)
    }),

    setMockAnonymousId: ((val) => {
      anonymousIdPresent = val
    })
  }
})

import { setMockAnonymousId } from '../../util/Cookies'

def('rendered', () => ( mount(<App />) ))

afterEach(() => {
  mockDelete.mockClear()
})

it('renders without crashing', () => {
  expect($rendered)
})

const mockDelete = jest.fn()

describe('componentWillMount', () => {

  it('does not delete the device token if they have an anonymousId', () => {
    setMockAnonymousId(true)
    $rendered
    expect(mockDelete).not.toHaveBeenCalledWith('deviceToken')
  })

  it('deletes the device token if they have a device token cookie without an anonymousId', () => {
    setMockAnonymousId(false)
    $rendered
    expect(mockDelete).toHaveBeenCalledWith('deviceToken')
  })
})
