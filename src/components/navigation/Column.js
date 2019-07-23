import Classnames from 'classnames'
import React from 'react'
import { DOWN, UP } from '../../util/keypress'
import withFocusHandling from './FocusHandling'

class Column extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      focusY: 0,
      focusedItem: props.children[0]
    }
  }

  get maxFocusY() { return this.props.children.length - 1 }

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
    let { children, updateCurrentItem } = this.props

    children = React.Children.toArray(children)

    return (
      <div className={Classnames({ ...this.props.classNames, column: true })}>
        {children.map((item, index) => {
          if (typeof(item) !== 'object') {
            throw(`Child ${item} of Column is invalid!`)
          }
          let key = `column-item-${index}`
          let itemProps = {...item.props, key, updateCurrentItem }
          return this.hasFocus(index) ? React.cloneElement(item, {...itemProps, hasFocus: true}) : React.cloneElement(item, {...itemProps})
        })}
      </div>
    )
  }
}

export default withFocusHandling(Column)
