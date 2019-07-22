import React from 'react'
import withFocusHandling from './FocusHandling'
import { DOWN, LEFT, RIGHT, SELECT, UP } from '../../util/keypress'

class Column extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      focusY: 0,
      focusedItem: props.children[0]
    }
  }

  get maxFocusY() {
    return this.props.children.length - 1
  }

  hasFocus(index) {
    return this.props.hasFocus && this.state.focusY === index
  }

  handleDown() {
    if (this.state.focusY == this.maxFocusY) {
      this.props.handleBoundary(DOWN)
    } else {
      this.setState({ focusY: this.state.focusY + 1 })
    }
  }

  handleUp() {
    if (this.state.focusY == 0) {
      this.props.handleBoundary(UP)
    } else {
      this.setState({ focusY: this.state.focusY - 1 })
    }
  }

  render() {
    let { children } = this.props

    children = React.Children.toArray(children)

    return (
      <React.Fragment>
        {children.map((item, index) => {
          if (typeof(item) !== 'object') {
            throw(`Child ${item} of Boundary is invalid!`)
          }
          let key = `column-item-${index}`
          let itemProps = {...item.props, key}
          return this.hasFocus(index) ? React.cloneElement(item, {...itemProps, hasFocus: true}) : React.cloneElement(item, {...itemProps})
        })}
      </React.Fragment>
    )
  }
}

export default withFocusHandling(Column)
