import React from 'react'
import { def } from 'bdd-lazy-var/global'
import { mount } from 'enzyme'
import SearchScreen from '../SearchScreen'
import mockVideos from '../../../util/mockVideos'

def('rendered', () => ( mount(<SearchScreen />) ))
def('mockVideos', () => mockVideos)
def('mockFn', () => ( jest.fn() ))

it('renders without crashing', () => {
  expect($rendered)
})

it('sets the initial query state correctly', () => {
  expect($rendered.state().query).toEqual("")
})

it('handles pushCharacter correctly', () => {
  $rendered.instance().handlePushCharacter("a")
  expect($rendered.state().query).toEqual("a")
})

it('attaches a ref to the underlying screen', () => {
  expect($rendered.instance().screenRef).not.toBeNull()
})

describe('removing characters', () => {
  beforeEach(() => {
    $rendered.setState({query: 'a query is born'})
  })

  it('handles popCharacter correctly', () => {
    $rendered.instance().handlePopCharacter()
    expect($rendered.state().query).toEqual("a query is bor")
  })

  it('handles clear correctly', () => {
    $rendered.instance().handleClear()
    expect($rendered.state().query).toEqual("")
  })
})

describe('search input rows', () => {
  it('should return the correct number of SearchInputRows', () => {
    expect($rendered.find('SearchInputRow').length).toEqual(7)
  })

  it('a SearchInputRow should append on select, if it is not the last row', () => {
    $rendered.find('SearchInputRow').at(0).props().onSelect('A')
    expect($rendered.state().query).toEqual('A')
  })

  describe('last row', () => {
    def('lastRowInputsProps', () => $rendered.find('SearchInputRow').at(6).props().inputs)

    it('should pass handleClear into the first child', () => {
      expect($lastRowInputsProps[0]["CLR"]).toEqual($rendered.instance().handleClear)
    })

    it('should pass a bound handlePushCharacter into the middle child', () => {
      $rendered.setState({query: 'put a space after me!'})
      $lastRowInputsProps[1]["SPC"]()
      expect($rendered.state().query).toEqual('put a space after me! ')
    })

    it('should pass handlePopCharacter into the last child', () => {
      expect($lastRowInputsProps[2]["DEL"]).toEqual($rendered.instance().handlePopCharacter)
    })
  })
})

describe('search input feedback column', () => {
  beforeEach(() => {
    $rendered.setState({query: 'another query is born'})
  })

  it('should pass down the query correctly', () => {
    expect($rendered.find('SearchInputFeedbackColumn').props().query).toEqual($rendered.state().query)
  })

  it('should pass down the videos correctly', () => {
    $rendered.setProps({videos: $mockVideos})
    expect($rendered.find('SearchInputFeedbackColumn').props().videos).toEqual($mockVideos)
  })
})

describe('video rows', () => {
  it('should pass down the videos correctly', () => {
    $rendered.setProps({videos: $mockVideos})
    expect($rendered.find('VideoRow').props().videos).toEqual($mockVideos.edges.slice(0,3))
  })

  describe('when no videos are present', () => {
    beforeEach(() => {
      $rendered.setProps({videos: {edges: []}})
      $rendered.setState({query: 'abc'})
    })

    it('should render the No Results Found text', () => {
      expect($rendered.find('VideoRow').length).toEqual(0)
    })

    it('should reset the results when query is cleared', () => {
      const spy = jest.spyOn(SearchScreen.prototype, 'resetResults')
      $rendered.setState({query: ''})
      expect(spy).toHaveBeenCalled()
    })
  })
})

describe('onSectionEntered', () => {
  it('should be passed to the Screen', () => {
    expect($rendered.find('Screen').props().onSectionEntered).toEqual($rendered.instance().onSectionEntered)
  })

  it('should reduce the index by .5 when navigating from the last letter row to the action row', () => {
    const previousSection = {sectionRef: (() => 'lastLetterRow')}
    const nextSection = {sectionRef: (() => 'actionRow')}
    const indexModifierFn = $rendered.instance().onSectionEntered(previousSection, nextSection)
    expect(indexModifierFn(5)).toEqual(2)
    expect(indexModifierFn(6)).toEqual(3)
  })

  it('should multiply the index by 2 when navigating from the last letter row to the action row', () => {
    const previousSection = {sectionRef: (() => 'actionRow')}
    const nextSection = {sectionRef: (() => 'lastLetterRow')}
    const indexModifierFn = $rendered.instance().onSectionEntered(previousSection, nextSection)
    expect(indexModifierFn(3)).toEqual(6)
  })

  it('should reset the focus when navigating to the video row', () => {
    const previousSection = {}
    const nextSection = {sectionRef: (() => 'videosRow')}
    const indexModifierFn = $rendered.instance().onSectionEntered(previousSection, nextSection)
    expect(indexModifierFn(3)).toEqual(0)
  })
})

describe('onNextSection', () => {
  it('should be passed to the Screen', () => {
    expect($rendered.find('Screen').props().onNextSection).toEqual($rendered.instance().onNextSection)
  })

  it('should pass the vectors through if there is a result set', () => {
    $rendered.setState({videos: $mockVideos})
    expect($rendered.instance().onNextSection(0,1, {sectionRef: jest.fn()})).toEqual([0,1])
  })

  describe('with no result set', () => {
    beforeEach(() => {
      $rendered.setState({query: 'abc', videos: []})
    })

    it('should pass the vectors through if the next section does not leave a SearchInputRow', () => {
      expect($rendered.instance().onNextSection(0,1, {sectionRef: jest.fn(() => 'notTheActionRow')})).toEqual([0,1])
    })

    it('should return no vector if the user leaves a SearchInputRow with an X vector', () => {
      expect($rendered.instance().onNextSection(1,0, {sectionRef: jest.fn(() => 'actionRow')})).toEqual([0,0])
    })

    it('should return no vector if the the user leaves the actionRow with a positive Y vector', () => {
      expect($rendered.instance().onNextSection(0,1, {sectionRef: jest.fn(() => 'actionRow')})).toEqual([0,0])
    })

    it('should pass the vector through if the user leaves the actionRow with a negative Y vector', () => {
      expect($rendered.instance().onNextSection(0,-1, {sectionRef: jest.fn(() => 'actionRow')})).toEqual([0,-1])
    })
  })
})

describe('updating the query', () => {
  beforeEach(() => $rendered.setProps({onSubmitQuery: $mockFn}))
  describe('using the Input Rows', () => {
    it('should not call props.updateQuery if the query is less than 3 characters', () => {
      $rendered.setState({query: 'ab'})
      expect($mockFn).not.toHaveBeenCalled()
    })

    it('should call props.updateQuery if the query is greater than 3 characters', () => {
      $rendered.setProps({updateQuery: $mockFn})
      $rendered.setState({query: 'abc'})
      expect($mockFn).toHaveBeenCalledWith('abc')
    })
  })

  describe('using the Feedback Columns', () => {
    $rendered.find('SearchInputFeedbackColumn').props().onSelectFeedback('autocompleted query!')
    expect($rendered.state().query).toEqual('autocompleted query!')
  })

  it('resetting the results', () => {
    $rendered.instance().resetResults()
    expect($mockFn).toHaveBeenCalledWith("")
  })
})

describe('handleBoundary', () => {
  def('rendered', () => ( mount(<SearchScreen handleBoundary={$mockFn}/>) ))

  beforeEach(() => {
    $rendered.instance().screenRef = { state: {sectionX: $currentSectionX, sectionY: $currentSectionY} }
  })

  describe('with no results', () => {
    beforeEach(() => {
      $rendered.setState({query: 'abc', videos: []})
    })

    it('should return nothing if vectorX is not negative', () => {
      expect($rendered.instance().handleBoundary(1,0)).toEqual([0,0])
    })

    it('should call props.handleBoundary otherwise the vector if vectorX is negative', () => {
      $rendered.instance().handleBoundary(-1,0)
      expect($mockFn).toHaveBeenCalled()
    })
  })

  describe('when navigating from the input section', () => {
    def('currentSectionX', () => 0)
    def('currentSectionY', () => 5)

    it('should set the section to [1,0] when navigating in the positive direction', () => {
      expect($rendered.instance().handleBoundary(1,0)).toEqual([1,-$currentSectionY])
      expect($mockFn).not.toHaveBeenCalled()
    })

    it('should call props.handleBoundary otherwise', () => {
      $rendered.instance().handleBoundary(0,1)
      expect($mockFn).toHaveBeenCalled()
    })
  })

  describe('when navigating from the feedback section', () => {
    def('currentSectionX', () => 1)
    def('currentSectionY', () => 0)

    it('should set the section to [0, 1] when navigating in the negative x direction', () => {
      expect($rendered.instance().handleBoundary(-1,0)).toEqual([-1,0])
      expect($mockFn).not.toHaveBeenCalled()
    })

    it('should set the section to [0, searchInputRows.length] when navigating in the positive y direction', () => {
      expect($rendered.instance().handleBoundary(0,1)).toEqual([-1,7])
      expect($mockFn).not.toHaveBeenCalled()
    })

    it('should props.handleBoundary otherwise', () => {
      $rendered.instance().handleBoundary(1,0)
      expect($mockFn).toHaveBeenCalled()
    })
  })
})

describe('unmount', () => {
  it('calls resetResults', () => {
    jest.restoreAllMocks()
    const spy = jest.spyOn(SearchScreen.prototype, 'resetResults')
    $rendered.unmount()
    expect(spy).toHaveBeenCalled()
  })
})

