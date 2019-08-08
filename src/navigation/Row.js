import Classnames from 'classnames'
import React from 'react'
import { focusableChildrenOf } from '../util/helpers'
import { LEFT, RIGHT } from '../util/keypress'
import withFocusHandling from './FocusHandling'

class Row extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      focusX: 0,
      focusedItem: focusableChildrenOf(this)[0]
    }
  }

  get maxFocusX() { return focusableChildrenOf(this).length - 1 }

  hasFocus(item) {
    return this.props.hasFocus && this.state.focusX === focusableChildrenOf(this).indexOf(item)
  }

  handleRight() {
    if (this.state.focusX == this.maxFocusX) {
      this.props.handleBoundary(this, RIGHT)
    } else {
      this.setState({ focusX: this.state.focusX + 1 })
    }
  }

  handleLeft() {
    if (this.state.focusX == 0) {
      this.props.handleBoundary(this, LEFT)
    } else {
      this.setState({ focusX: this.state.focusX - 1 })
    }
  }

  render() {
    const children = React.Children.toArray(this.props.children)

    return (
      <div className={Classnames({ ...this.props.classNames, row: true })}>
        {children.map((item, index) => {
          if (typeof(item) !== 'object') {
            throw(`Child ${item} of Row is invalid!`)
          }
          let key = `row-item-${index}`
          let itemProps = { ...item.props, key }
          return this.hasFocus(item) ? React.cloneElement(item, {...itemProps, hasFocus: true}) : React.cloneElement(item, {...itemProps})
        })}
      </div>
    )
  }
}

export default withFocusHandling(Row)
