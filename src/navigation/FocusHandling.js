import React from 'react'
import { FlatlandContext, FocusableContext } from './Context'
import { DOWN, LEFT, RIGHT, SELECT, UP, pressWas } from '../util/keypress'

export default function withFocusHandling(WrappedComponent) {
   class Focusable extends React.Component {

    constructor(props) {
      super(props)

      this.state = {
        currentItem: { handleSelect: (() => {}) },
        prevContext: { globalX: 0, globalY: 0, selects: 0 },
      }
      this.updateCurrentItem = this.updateCurrentItem.bind(this)
      this.handleKeypress = this.handleKeypress.bind(this)
    }

    componentDidMount() {
      for (var stealable of this.props.pushFocusTo) {
        if (this.context.registerFocusThief) {
          this.context.registerFocusThief(this.props.flatId, stealable)
        }
      }
    }

    componentWillUnmount() {
      this.context.deregisterFocusThief(this.props.flatId)
    }

    defaultHandleDirection(dir) {
      return (() => this.context.handleBoundary(this.wrappedRef, dir)).bind(this)
    }

    defaultHandleSelect() {
      return this.state.currentItem.handleSelect()
    }

    handleKeypress(dir) {
      const dirToHandler = {
        [LEFT]: this.wrappedRef.handleLeft || this.defaultHandleDirection(LEFT),
        [UP]: this.wrappedRef.handleUp || this.defaultHandleDirection(UP),
        [RIGHT]: this.wrappedRef.handleRight || this.defaultHandleDirection(RIGHT),
        [DOWN]: this.wrappedRef.handleDown || this.defaultHandleDirection(DOWN),
        [SELECT]: this.wrappedRef.handleSelect || this.defaultHandleSelect
      }

      dirToHandler[dir].bind(dir == SELECT ? this : this.wrappedRef)()
    }

    componentDidUpdate() {
      const { prevContext } = this.state
      if (
        prevContext.globalX !== this.context.globalX ||
        prevContext.globalY !== this.context.globalY ||
        prevContext.selects !== this.context.selects
      ) {
        if (this.hasFocus) {
          switch(pressWas(prevContext, this.context)) {
            case LEFT:
              this.handleKeypress(LEFT)
              break
            case UP:
              this.handleKeypress(UP)
              break
            case RIGHT:
              this.handleKeypress(RIGHT)
              break
            case DOWN:
              this.handleKeypress(DOWN)
              break
            case SELECT:
              this.handleKeypress(SELECT)
              break
            default:
              console.log('Cannot handle keypress!')
          }
        }
      }
      this.state.prevContext = this.context
    }

    updateCurrentItem(item) { this.setState({ currentItem: item }) }

    get hasFocus() {
      return this.props.flatId == this.context.activeSection
    }

    composedHandleBoundary(rootBoundaryFn) {
      if (this.props.handleBoundary) {
        return ((ref, dir) => this.props.handleBoundary(rootBoundaryFn, ref, dir))
      }
      return rootBoundaryFn
    }

    render() {
      const { globalX, globalY, handleBoundary } = this.context
      const { pushFocusTo, handleBoundary: __, ...restProps } = this.props
      const { updateCurrentItem } = this

      const baseInjectedProps = { handleBoundary: this.composedHandleBoundary(handleBoundary) }
      const injectedProps = this.hasFocus ? { ...baseInjectedProps, hasFocus: true } : baseInjectedProps

      return (
        <FocusableContext.Provider value={{ updateCurrentItem }}>
          <WrappedComponent ref={ref => this.wrappedRef = ref} { ...injectedProps } { ...restProps } />
        </FocusableContext.Provider>
      )
    }
  }

  Focusable.displayName = `Focusable(${WrappedComponent.displayName || WrappedComponent.name})`
  Focusable.defaultProps = {
    flatId: '',
    pushFocusTo: []
  }
  Focusable.contextType = FlatlandContext
  return Focusable
}
