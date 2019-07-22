import Classnames from 'classnames'
import React from 'react'
import { LEFT, RIGHT } from '../../util/keypress'
import withFocusHandling from './FocusHandling'

class Row extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      focusX: 0,
      focusedItem: props.children[0]
    }
  }

  get maxFocusX() {
    return this.props.children.length - 1
  }

  hasFocus(index) {
    return this.props.hasFocus && this.state.focusX === index
  }

  handleRight() {
    if (this.state.focusX == this.maxFocusX) {
      this.props.handleBoundary(RIGHT)
    } else {
      this.setState({ focusX: this.state.focusX + 1 })
    }
  }

  handleLeft() {
    if (this.state.focusX == 0) {
      this.props.handleBoundary(LEFT)
    } else {
      this.setState({ focusX: this.state.focusX - 1 })
    }
  }

  render() {
    let { children } = this.props

    children = React.Children.toArray(children)

    return (
      <div className={Classnames({ ...this.props.classNames, row: true })}>
        {children.map((item, index) => {
          if (typeof(item) !== 'object') {
            throw(`Child ${item} of Row is invalid!`)
          }
          let key = `row-item-${index}`
          let itemProps = {...item.props, key }
          return this.hasFocus(index) ? React.cloneElement(item, {...itemProps, hasFocus: true}) : React.cloneElement(item, {...itemProps})
        })}
      </div>
    )
  }
}

export default withFocusHandling(Row)
