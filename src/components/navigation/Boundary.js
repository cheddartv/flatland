import React from 'react'
import { DOWN, LEFT, RIGHT, SELECT, UP } from '../../util/keypress'

export default class Boundary extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      globalX: 0,
      globalY: 0,
      focusedSection: props.children[0].props.id,
      focusTheives: {}
    }

    this.handleKeydown = this.handleKeydown.bind(this)
    this.incrementGlobals = this.incrementGlobals.bind(this)
    this.registerFocusThief = this.registerFocusThief.bind(this)
    this.handleBoundary = this.handleBoundary.bind(this)
  }

  componentWillMount() {
    window.addEventListener("keydown", this.handleKeydown)
  }

  incrementGlobals(vectorX, vectorY) {
    const { globalX, globalY } = this.state
    this.setState({ globalX: globalX + vectorX, globalY: globalY + vectorY })
  }

  registerFocusThief(thief, stealable) {
    this.setState({ focusTheives: { ...this.state.focusTheives, [thief]: [ ...this.state.focusTheives, stealable] } })
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
    const nextFocus = this.state.focusTheives[ref.props.id].find(ft => ft.onExitFrom === dir)
    if (nextFocus) {
      this.setState({ focusedSection: nextFocus.id })
    }
  }

  render() {
    let { children } = this.props
    let { globalX, globalY } = this.state
    let { registerFocusThief, handleBoundary } = this

    children = React.Children.toArray(children)

    return (
      <React.Fragment>
        {children.map((section, index) => {
          if (typeof(section) !== 'object') {
            throw(`Child ${section} of Boundary is invalid!`)
          }
          let key = `boundary-section-${index}`
          let sectionProps = {...section.props, globalX, globalY, key, registerFocusThief, handleBoundary}
          return this.hasFocus(section) ? React.cloneElement(section, {...sectionProps, hasFocus: true}) : React.cloneElement(section, {...sectionProps})
        })}
      </React.Fragment>
    )
  }
}
