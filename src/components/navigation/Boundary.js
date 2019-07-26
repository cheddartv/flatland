import React from 'react'
import { BoundaryContext } from './BoundaryContext'
import { DOWN, LEFT, RIGHT, SELECT, UP } from '../../util/keypress'

export default class Boundary extends React.Component {
  constructor(props) {
    super(props)
    const childrenToArray = React.Children.toArray(props.children)

    this.state = {
      coordinates: {
        globalX: 0,
        globalY: 0,
        selects: 0,
      },
      focusedSection: childrenToArray[0].props.id,
      focusThieves: {}
    }

    this.handleKeydown = this.handleKeydown.bind(this)
    this.incrementGlobals = this.incrementGlobals.bind(this)
    this.registerFocusThief = this.registerFocusThief.bind(this)
    this.handleBoundary = this.handleBoundary.bind(this)
    this.handleSelect = this.handleSelect.bind(this)
  }

  componentWillMount() {
    window.addEventListener("keydown", this.handleKeydown)
  }

  handleSelect() {
    const { selects } = this.state.coordinates
    this.setState({ coordinates: { ...this.state.coordinates, selects: selects + 1 } })
  }

  registerFocusThief(thief, stealable) {
    this.setState({ focusThieves: { ...this.state.focusThieves, [thief]: [ ...(this.state.focusThieves[thief] || []), stealable] } })
  }

  incrementGlobals(x, y) {
    const { globalX, globalY } = this.state.coordinates
    this.setState({ coordinates: { ...this.state.coordinates, globalX: globalX + x, globalY: globalY + y } })
  }

  handleKeydown(key) {
    switch(key.keyCode) {
      case LEFT:
        this.incrementGlobals(-1, 0)
        break;
      case UP:
        this.incrementGlobals(0, -1)
        break;
      case RIGHT:
        this.incrementGlobals(1, 0)
        break;
      case DOWN:
        this.incrementGlobals(0, 1)
        break;
      case SELECT:
        this.handleSelect()
        break;
      default:
      break;
    }
  }

  hasFocus(section) {
    return this.state.focusedSection === section.props.id
  }

  handleBoundary(ref, dir) {
    const focusThieves = this.state.focusThieves[ref.props.id] ||  []
    const nextFocus = focusThieves.find(ft => ft.onExitFrom === dir)
    if (nextFocus) {
      this.setState({ focusedSection: nextFocus.id })
    }
  }

  render() {
    let { children } = this.props
    let { registerFocusThief, handleBoundary } = this

    children = React.Children.toArray(children)

    return (
      <BoundaryContext.Provider value={this.state.coordinates}>
        {children.map((section, index) => {
          if (typeof(section) !== 'object') {
            throw(`Child ${section} of Boundary is invalid!`)
          }
          let key = `boundary-section-${index}`
          let sectionProps = {...section.props, key, registerFocusThief, handleBoundary}
          return this.hasFocus(section) ? React.cloneElement(section, {...sectionProps, hasFocus: true}) : React.cloneElement(section, {...sectionProps})
        })}
      </BoundaryContext.Provider>
    )
  }
}
