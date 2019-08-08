import React from 'react'
import { def } from 'bdd-lazy-var/global'
import { shallow, mount } from 'enzyme'
import Screen from '../Screen'
import RootScreen from '../RootScreen'
import Item from '../Item'
import {UP, RIGHT, DOWN, LEFT, BACK, SELECT} from "../../../util/keypress.js"
import { livestreamURL } from "../../../util/livestreamURL"
import debounce from '../../../util/debounce'

let mockDebounce = jest.fn()
jest.mock('../../../util/debounce', () => {
  return { __esModule: true, default: ((...args) => mockDebounce(...args))}
})

def('mockFn', () => (jest.fn()))
def('rendered', () => mount(<RootScreen />))

it('renders without crashing', () => {
  expect($rendered)
})

it('returns isLivestream correctly', () => {
  expect($rendered.instance().isLivestream(livestreamURL)).toBeTruthy()
})

it('should pass the select action to the currentItem', () => {
  $rendered.instance().setState({currentItem: new Item({hasFocus: true, onSelect: $mockFn})})
  $rendered.instance().handleSelect()
  expect($mockFn).toHaveBeenCalled()
})

describe('init state', () => {
  it('renders with correct default state for minimizeVideoPlayer', () => {
    expect($rendered.state('minimizeVideoPlayer')).toEqual(false)
  })

  it('renders with the correct default state for mediaUrl', () => {
    expect($rendered.state('mediaUrl')).toEqual(livestreamURL)
  })

  it('renders with the correct default state for videoMetadata', () => {
    expect($rendered.state('videoMetadata')).toEqual(null)
  })
})

describe('componentWillMount', () => {
  it('should make a call to debounce with the correct params', () => {
    expect(mockDebounce).toHaveBeenCalledWith($rendered.instance().handleKeyDown, 50, true)
  })
})

describe('always renders the VideoPlayer component', () => {
  it('minimizeVideoPlayer state is false', () => {
    expect($rendered.find('VideoPlayer').length).toEqual(1)
  })

  it('minimizeVideoPlayer state is true', () => {
    $rendered.instance().disposePill = $mockFn;
    $rendered.instance().state.minimizeVideoPlayer = true
    expect($rendered.find('VideoPlayer').length).toEqual(1)
  })

  describe('and passes the correct props', () => {
    it('passes mediaUrl', () => {
      $rendered.setState({mediaUrl: 'abc'})
      expect($rendered.find('VideoPlayer').props().mediaUrl).toBe('abc')
    })

    it('passes videoMetadata', () => {
      const videoMetadataRef = {clip: true}
      $rendered.setState({videoMetadata: videoMetadataRef})
      expect($rendered.find('VideoPlayer').props().videoMetadata).toBe(videoMetadataRef)
    })
  })

  describe('startVideoPlayer', () => {
    def('mediaUrl', () => {})
    def('videoMetadata', () => {})
    beforeEach(() => {
      $rendered.setState({mediaUrl: 'abc'})
      $rendered.instance().startVideoPlayer($mediaUrl, $videoMetadata)
    })

    describe('without a mediaUrl', () => {
      it('does not change the state', () => {
        expect($rendered.state('mediaUrl')).toBe('abc')
      })
    })

    describe('with a mediaUrl', () => {
      def('mediaUrl', () => 'def')

      it('sets the minimizeVideoPlayer state', () => {
        expect($rendered.state('minimizeVideoPlayer')).toBe(false)
      })

      it('sets the mediaUrl state', () => {
        expect($rendered.state('mediaUrl')).toBe('def')
      })

      it('does not change the videoMetadata state', () => {
        expect($rendered.state('videoMetadata')).toBe(null)
      })

      describe('and a videoMetadata', () => {
        def('videoMetadata', () => ( {somethingElse: true} ))

        it('sets the videoMetadata state', () => {
          expect($rendered.state('videoMetadata')).toBe($videoMetadata)
        })
      })
    })
  })
})

describe('root keypress', () => {
  def('mockGlobals', () => ( jest.fn() ))
  def('mockSelect', () => ( jest.fn() ))

  describe('minimizeVideoPlayer is true', () => {
    beforeEach(() => {
      RootScreen.prototype.incrementGlobals = $mockGlobals
      RootScreen.prototype.handleSelect = $mockSelect
      $rendered.setState({ minimizeVideoPlayer: true })
      $rendered.update()
    })

    def('rendered', () => (shallow(<RootScreen/>)))

    it('should handle left correctly', () => {
      $rendered.instance().handleKeyDown({keyCode: LEFT})
      expect($mockGlobals).toHaveBeenCalledWith(-1, 0)
    })

    it('should handle left correctly', () => {
      $rendered.instance().handleKeyDown({keyCode: BACK})
      expect($mockGlobals).toHaveBeenCalledWith(-1, 0)
    })


    it('should handle right correctly', () => {
      $rendered.instance().handleKeyDown({keyCode: RIGHT})
      expect($mockGlobals).toHaveBeenCalledWith(1, 0)
    })

    it('should handle up correctly', () => {
      $rendered.instance().handleKeyDown({keyCode: UP})
      expect($mockGlobals).toHaveBeenCalledWith(0, -1)
    })

    it('should handle down correctly', () => {
      $rendered.instance().handleKeyDown({keyCode: DOWN})
      expect($mockGlobals).toHaveBeenCalledWith(0, 1)
    })

    it('should handle select correctly', () => {
      $rendered.instance().handleKeyDown({keyCode: SELECT})
      expect($mockSelect).toHaveBeenCalled()
    })
  })

  describe('minimizeVideoPlayer is false', () => {
    beforeEach(() => {
      RootScreen.prototype.incrementGlobals = $mockGlobals
      RootScreen.prototype.handleSelect = $mockSelect
      $rendered.setState({ minimizeVideoPlayer: false })
      $rendered.update()
    })

    it('should handle left correctly', () => {
      $rendered.instance().handleKeyDown({keyCode: LEFT})
      expect($mockGlobals).not.toHaveBeenCalled()
    })

    it('should handle left correctly', () => {
      $rendered.instance().handleKeyDown({keyCode: BACK})
      expect($mockGlobals).not.toHaveBeenCalled()
    })

    it('should handle right correctly', () => {
      $rendered.instance().handleKeyDown({keyCode: RIGHT})
      expect($mockGlobals).not.toHaveBeenCalled()
    })

    it('should handle up correctly', () => {
      $rendered.instance().handleKeyDown({keyCode: UP})
      expect($mockGlobals).not.toHaveBeenCalled()
    })

    it('should handle down correctly', () => {
      $rendered.instance().handleKeyDown({keyCode: DOWN})
      expect($mockGlobals).not.toHaveBeenCalled()
    })

    it('should handle select correctly', () => {
      $rendered.instance().handleKeyDown({keyCode: SELECT})
      expect($mockSelect).not.toHaveBeenCalled()
    })
  })
})
