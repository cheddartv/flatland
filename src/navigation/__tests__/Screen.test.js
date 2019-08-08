import React from 'react'
import { def } from 'bdd-lazy-var/global'
import { mount } from 'enzyme'
import Screen from '../Screen'
import Item from '../Item'
import Row from '../Row'
import Column from '../Column'
import Boundary from '../util/Boundary'
import ScreenBoundary from '../util/ScreenBoundary'

def('rendered', () => ( mount(<Screen classNames={{test: true}} />) ))

it('renders without crashing', () => {
  expect($rendered)
})

it('should have the correct className', () => {
  expect($rendered.find('div').hasClass('test')).toBeTruthy()
})

function fillSection(SectionType, length) {
  return Array(length).fill().map((_, i) => {
    return (
      <SectionType key={i}>
        {Array(3).fill().map((_, j) => {
          return <Item key={j}>{j}</Item>
        })}
      </SectionType>
    )
  })
}

describe('with children', () => {
  def('mockHandleBoundary', () => jest.fn(() => [0,0]) )
  def('mockOnNextSection', () => jest.fn(() => [0,0]) )
  def('sections', () => [ [ Boundary(fillSection(Row, 3)) ], [ Boundary(fillSection(Column, 3)) ] ])

  def('rendered', () => mount(<Screen handleBoundary={$mockHandleBoundary} onNextSection={$mockOnNextSection} hasFocus={true} sections={ScreenBoundary($sections)} />) )

  def('focusedSection', () => {
    $rendered.setState({sectionX: 1, sectionY: 1})
    return $rendered.find('Column').at(1)
  })

  it('should pass down the children', () => {
    expect($rendered.find('Item').length).toBe(3 * 3 * 2)
  })

  it('should pass down a focus prop', () => {
    $rendered.setState({focusY: 1})
    expect($focusedSection.props().focusY).toEqual(1)
  })

  it('should pass down a global index prop', () => {
    $rendered.setProps({globalY: 1})
    expect($focusedSection.props().globalY).toEqual(1)
  })

  it('should pass down the hasFocus prop correctly', () => {
    expect($focusedSection.props().hasFocus).toBeTruthy()
  })

  it('should not call handleBoundary with a vector that does not cross the X boundary', () => {
    $rendered.setState({sectionX: 1, sectionY: 0})
    $rendered.instance().handleBoundary(-1, 0)
    expect($mockHandleBoundary).not.toHaveBeenCalled()
  })

  it('should not call handleBoundary with a vector that does not cross the Y boundary', () => {
    $rendered.setState({sectionX: 0, sectionY: 1})
    $rendered.instance().handleBoundary(0, -1)
    expect($mockHandleBoundary).not.toHaveBeenCalled()
  })

  it('should call props.handleBoundary with a positive vector that crosses the X axis boundary', () => {
    $rendered.setState({sectionX: 1, sectionY: 0})
    $rendered.instance().handleBoundary(1, 0)
    expect($mockHandleBoundary).toHaveBeenCalledWith(1, 0)
  })

  it('should call props.handleBoundary with a negative vector that crosses the X axis boundary', () => {
    $rendered.setState({sectionX: 0, sectionY: 0})
    $rendered.instance().handleBoundary(-1, 0)
    expect($mockHandleBoundary).toHaveBeenCalledWith(-1, 0)
  })

  it('should call props.handleBoundary with a positive vector that crosses the Y axis boundary', () => {
    $rendered.setState({sectionX: 0, sectionY: 2})
    $rendered.instance().handleBoundary(0, 1)
    expect($mockHandleBoundary).toHaveBeenCalledWith(0, 1)
  })

  it('should call props.handleBoundary with a negative vector that crosses the X axis boundary', () => {
    $rendered.setState({sectionX: 0, sectionY: 0})
    $rendered.instance().handleBoundary(0, -1)
    expect($mockHandleBoundary).toHaveBeenCalledWith(0, -1)
  })

  it('should increment focus X and Y with the vector passed to incrementLocals', () => {
    $rendered.setState({focusX: 1, focusY: 0})
    $rendered.instance().incrementLocals(0, 1)
    expect([$rendered.state().focusX, $rendered.state().focusY]).toEqual([1,1])
  })

  it('calls props.onFocus when hasFocus becomes true', () => {
    $rendered.setProps({onFocus: $mockHandleBoundary})
    $rendered.setState({focusX: 1, focusY: 1})
    expect($mockHandleBoundary).toHaveBeenCalledWith(expect.any(Item))
  })

  it('calls props.updateCurrentItem when hasFocus becomes true', () => {
    $rendered.setProps({updateCurrentItem: $mockHandleBoundary})
    $rendered.setState({focusX: 1, focusY: 1})
    expect($mockHandleBoundary).toHaveBeenCalledWith(expect.any(Item))
  })

  it('sets the currentSection when onSectionEntered is called', () => {
    const throwawaySection = <Row />
    $rendered.instance().onSectionEntered(throwawaySection)
    expect($rendered.state().currentSection).toEqual(throwawaySection)
  })

  it('should call props.onSectionEntered with the previous and next section', () => {
    const previousSection = <Row />
    const nextSection = <Column />
    $rendered.setProps({onSectionEntered: $mockHandleBoundary})
    $rendered.setState({currentSection: previousSection})
    $rendered.instance().onSectionEntered(nextSection)
    expect($mockHandleBoundary).toHaveBeenCalledWith(previousSection, nextSection)
  })

  it('should return the result of props.onSectionEntered when onSectionEntered is called', () => {
    $rendered.setProps({onSectionEntered: ((section) => 2)})
    expect($rendered.instance().onSectionEntered()).toEqual(2)
  })

  describe('handle boundary', () => {
    def('mockHandleBoundary', () => jest.fn(() => [0,2]))
    def('mockOnNextSection', () => jest.fn(() => [0,3]))

    it('updates the focus by the vector returned from props.handleBoundary', () => {
      $rendered.setState({sectionX: 0, sectionY: 0})
      $rendered.instance().handleBoundary(0, -1)
      expect($rendered.state().sectionY).toEqual(2)
    })

    describe('when props.handleBoundary returns a promise', () => {
      def('mockHandleBoundary', () => {
        return (() => new Promise(resolve => resolve([0, 2])))
      })

      it('updates the focus by the vector derived from the resolved promise', async () => {
        $rendered.setState({sectionX: 0, sectionY: 0})
        $rendered.instance().handleBoundary(0, -1)
        await $mockHandleBoundary
        expect($rendered.state().sectionY).toEqual(2)
      })
    })


    describe('when a boundary is not crossed', () => {
      const currentSection = <Row />
      beforeEach(() => {
        $rendered.setState({sectionX: 0, sectionY: 0, currentSection: currentSection})
        $rendered.instance().handleBoundary(0, 1)
      })

      it('should call props.onNextSection with the vectors and the current section if the boundary is not crossed', () => {
        expect($mockOnNextSection).toHaveBeenCalledWith(0,1,currentSection)
      })

      it('should update the focus by the vector returned from props.onNextSection', () => {
        expect($rendered.state().sectionY).toEqual(3)
      })
    })
  })

  describe('when providing a boundary with envelope', () => {
    def('envelope', () => <div key={'mock'} className={'mockClassname'} />)
    def('sections', () => {
      return [ [Boundary(fillSection(Row, 2))], [ Boundary(fillSection(Column, 1), $envelope) ] ]
    })

    it('should wrap the screens in a containing div with the correct className', () => {
      expect($rendered.find('Column').closest('div').hasClass('mockClassname')).toBeTruthy()
    })
  })
})
