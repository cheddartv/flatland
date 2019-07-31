import Classnames from 'classnames'
import React from 'react'
import { DOWN, UP } from '../../util/keypress'
import withFocusHandling from './FocusHandling'
import { focusableChildrenOf } from '../../util/helpers'

class Column extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      focusY: 0,
      focusedItem: focusableChildrenOf(this)[0]
    }
  }

  get maxFocusY() { return focusableChildrenOf(this).length - 1 }

  hasFocus(item) {
    return this.props.hasFocus && this.state.focusY === focusableChildrenOf(this).indexOf(item)
  }

  handleDown() {
    if (this.state.focusY == this.maxFocusY) {
      this.props.handleBoundary(this, DOWN)
    } else {
      this.setState({ focusY: this.state.focusY + 1 })
    }
  }

  handleUp() {
    if (this.state.focusY == 0) {
      this.props.handleBoundary(this, UP)
    } else {
      this.setState({ focusY: this.state.focusY - 1 })
    }
  }

  render() {
    const children = React.Children.toArray(this.props.children)

    return (
      <div className={Classnames({ ...this.props.classNames, column: true })}>
        {children.map((item, index) => {
          if (typeof(item) !== 'object') {
            throw(`Child ${item} of Column is invalid!`)
          }
          let key = `column-item-${index}`
          let itemProps = { ...item.props, key }
          return this.hasFocus(item) ? React.cloneElement(item, {...itemProps, hasFocus: true}) : React.cloneElement(item, {...itemProps})
        })}
      </div>
    )
  }
}

export default withFocusHandling(Column)
