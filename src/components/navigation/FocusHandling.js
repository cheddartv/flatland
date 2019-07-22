import React from 'react'
import { DOWN, LEFT, RIGHT, UP, pressWas } from '../../util/keypress'

export default function withFocusHandling(WrappedComponent) {
   class Focusable extends React.Component {

    constructor(props) {
      super(props)

      this.handleBoundary = this.handleBoundary.bind(this)
    }

    componentDidMount() {
      for (var stealable of this.props.pushFocusTo) {
        this.props.registerFocusThief(this.props.id, stealable)
      }
    }

    defaultHandleBoundary(dir) {
      return dir => this.props.handleBoundary(this.wrappedRef, dir)
    }

    wrappedRef = {
      handleLeft: this.defaultHandleBoundary(LEFT),
      handleUp: this.defaultHandleBoundary(UP),
      handleRight: this.defaultHandleBoundary(RIGHT),
      handleDown: this.defaultHandleBoundary(DOWN),
    }

    componentDidUpdate(prevProps) {
      if (prevProps.globalX !== this.props.globalX || prevProps.globalY !== this.props.globalY) {
        const { hasFocus } = this.props

        if (hasFocus) {
          switch(pressWas(prevProps, this.props)) {
            case LEFT:
              console.log("LEFT")
              break
            case UP:
              console.log("UP")
              this.wrappedRef.handleUp()
              break
            case RIGHT:
              console.log("RIGHT")
              this.wrappedRef.handleRight()
              break
            case DOWN:
              console.log("DOWN")
              this.wrappedRef.handleDown()
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

    render() {
      const { globalX, globalY, handleBoundary: __, pushFocusTo, registerFocusThief, ...restProps } = this.props
      const { handleBoundary } = this
      const injectedProps = { handleBoundary }

      return <WrappedComponent ref={ref => this.wrappedRef = ref} { ...restProps } { ...injectedProps } />
    }
  }

  Focusable.displayName = `Focusable(${WrappedComponent.displayName || WrappedComponent.name})`
  return Focusable
}
