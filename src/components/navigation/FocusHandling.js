import React from 'react'
import { DOWN, LEFT, RIGHT, SELECT, UP, pressWas } from '../../util/keypress'

export default function withFocusHandling(WrappedComponent) {
   class Focusable extends React.Component {

    constructor(props) {
      super(props)

      this.state = {
        currentItem: { handleSelect: (() => {}) }
      }
      this.handleBoundary = this.handleBoundary.bind(this)
      this.updateCurrentItem = this.updateCurrentItem.bind(this)
      this.handleKeypress = this.handleKeypress.bind(this)
    }

    componentDidMount() {
      for (var stealable of this.props.pushFocusTo) {
        this.props.registerFocusThief(this.props.id, stealable)
      }
    }

    defaultHandleBoundary(dir) {
      return () => this.props.handleBoundary(this.wrappedRef, dir)
    }

    defaultHandleSelect() {
      return this.state.currentItem.handleSelect()
    }

    handleKeypress(dir) {
      const dirToHandler = {
        [LEFT]: this.wrappedRef.handleLeft || this.defaultHandleBoundary(LEFT),
        [UP]: this.wrappedRef.handleUp || this.defaultHandleBoundary(UP),
        [RIGHT]: this.wrappedRef.handleRight || this.defaultHandleBoundary(RIGHT),
        [DOWN]: this.wrappedRef.handleDown || this.defaultHandleBoundary(DOWN),
        [SELECT]: this.wrappedRef.handleSelect || this.defaultHandleSelect
      }

      dirToHandler[dir].bind(dir == SELECT ? this : this.wrappedRef)()
    }

    componentDidUpdate(prevProps) {
      if (
        prevProps.globalX !== this.props.globalX ||
        prevProps.globalY !== this.props.globalY ||
        prevProps.selects !== this.props.selects
      ) {
        const { hasFocus } = this.props

        if (hasFocus) {
          switch(pressWas(prevProps, this.props)) {
            case LEFT:
              console.log("LEFT")
              this.handleKeypress(LEFT)
              break
            case UP:
              console.log("UP")
              this.handleKeypress(UP)
              break
            case RIGHT:
              console.log("RIGHT")
              this.handleKeypress(RIGHT)
              break
            case DOWN:
              console.log("DOWN")
              this.handleKeypress(DOWN)
              break
            case SELECT:
              console.log("SELECT")
              this.handleKeypress(SELECT)
              break
            default:
              console.log('Cannot handle keypress!')
          }
        }
      }
    }

    handleBoundary(dir) {
      this.props.handleBoundary(this.wrappedRef, dir)
    }

   updateCurrentItem(item) {
     this.setState({ currentItem: item })
   }

    render() {
      const { globalX, globalY, handleBoundary: __, pushFocusTo, registerFocusThief, ...restProps } = this.props
      const { handleBoundary, updateCurrentItem } = this
      const injectedProps = { handleBoundary, updateCurrentItem }

      return <WrappedComponent ref={ref => this.wrappedRef = ref} { ...restProps } { ...injectedProps } />
    }
  }

  Focusable.displayName = `Focusable(${WrappedComponent.displayName || WrappedComponent.name})`
  return Focusable
}
