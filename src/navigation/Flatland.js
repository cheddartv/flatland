import React from 'react'
import { FlatlandContext } from './Context'
import { DOWN, LEFT, RIGHT, SELECT, UP } from '../util/keypress'

export default class Flatland extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      coordinates: {
        globalX: 0,
        globalY: 0,
        selects: 0,
      },
      activeSection: props.initialActiveSection || this.tryFirstChild,
      focusThieves: {}
    }

    this.handleKeydown = this.handleKeydown.bind(this)
    this.composedHandleKeydown = this.composedHandleKeydown.bind(this)
    this.incrementGlobals = this.incrementGlobals.bind(this)
    this.registerFocusThief = this.registerFocusThief.bind(this)
    this.deregisterFocusThief = this.deregisterFocusThief.bind(this)
    this.handleBoundary = this.handleBoundary.bind(this)
    this.handleSelect = this.handleSelect.bind(this)
  }

  get tryFirstChild() {
    const children = React.Children.toArray(this.props.children)
    return children[0] && children[0].props.flatId
  }

  componentDidMount() {
    window.addEventListener('keydown', this.composedHandleKeydown(this.handleKeydown))
  }

  composedHandleKeydown(rootHandleKeydown) {
    if (this.props.handleKeydown) {
      return ((key) => this.props.handleKeydown(rootHandleKeydown, key))
    }
    return rootHandleKeydown
  }

  handleSelect() {
    const { selects } = this.state.coordinates
    this.setState({ coordinates: { ...this.state.coordinates, selects: selects + 1 } })
  }

  registerFocusThief(thiefId, stealable) {
    this.state.focusThieves = { ...this.state.focusThieves, [thiefId]: [ ...(this.state.focusThieves[thiefId] || []), stealable] }
  }

  deregisterFocusThief(thiefId) {
    delete this.state.focusThieves[thiefId]
  }

  incrementGlobals(x, y) {
    const { globalX, globalY } = this.state.coordinates
    this.setState({ coordinates: { ...this.state.coordinates, globalX: globalX + x, globalY: globalY + y } })
  }

  handleKeydown(key) {
    switch(key.keyCode) {
      case LEFT:
        this.incrementGlobals(-1, 0)
        break
      case UP:
        this.incrementGlobals(0, -1)
        break
      case RIGHT:
        this.incrementGlobals(1, 0)
        break
      case DOWN:
        this.incrementGlobals(0, 1)
        break
      case SELECT:
        this.handleSelect()
        break
      default:
        break;
    }
  }

  handleBoundary(ref, dir) {
    const focusThieves = this.state.focusThieves[ref.props.flatId] ||  []
    const nextFocus = focusThieves.find(ft => ft.onExitFrom === dir)
    if (nextFocus && (typeof nextFocus.unless !=='function' || !nextFocus.unless())) {
      this.setState({ activeSection: nextFocus.flatId })
    }
  }

  get flatlandContext() {
    let { activeSection, coordinates } = this.state
    let { registerFocusThief, deregisterFocusThief, handleBoundary } = this
    return { ...coordinates, activeSection, registerFocusThief, deregisterFocusThief, handleBoundary }
  }

  render() {
    let { children } = this.props

    children = React.Children.toArray(children)

    return (
      <FlatlandContext.Provider value={this.flatlandContext}>
        {children.map((section, index) => {
          if (typeof(section) !== 'object') {
            throw(`Child ${section} of Flatland is invalid!`)
          }
          let key = section.key || `flatland-section-${index}`
          return React.cloneElement(section, { key, ...section.props })
        })}
      </FlatlandContext.Provider>
    )
  }
}

Flatland.displayName = 'Flatland'
